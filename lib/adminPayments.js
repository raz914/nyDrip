function toMillis(value) {
  if (!value) {
    return null;
  }
  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }
  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }
  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.getTime() : null;
}

function getBookingDescription(data = {}) {
  const firstItem = Array.isArray(data.items) ? data.items[0] : null;
  const extraCount = Math.max((data.items?.length ?? 0) - 1, 0);
  const serviceName = firstItem?.displayName || firstItem?.name || "Appointment";

  return extraCount ? `${serviceName} + ${extraCount} more` : serviceName;
}

function getMembershipDescription(data = {}) {
  const tier = data.tier ? String(data.tier) : "membership";
  const type = String(data.type || "").replace(/_/g, " ");

  if (data.priceLabel) {
    return `${tier} ${type || "payment"} (${data.priceLabel})`;
  }

  return `${tier} ${type || "payment"}`;
}

function getMembershipAmount(data = {}) {
  const directAmount =
    data.amountPaid ?? data.amount ?? data.price ?? data.amountDue ?? data.invoiceAmount;

  if (Number.isFinite(Number(directAmount))) {
    return Number(directAmount);
  }

  return null;
}

export function mapBookingPaymentDoc(doc) {
  const data = doc.data() || {};
  const payment = data.payment || {};
  const amount =
    Number.isFinite(Number(payment.amountPaid))
      ? Number(payment.amountPaid)
      : Number.isFinite(Number(data.totalPaid))
        ? Number(data.totalPaid)
        : null;
  const customer = data.customer || {};
  const date =
    toMillis(payment.paidAt) ||
    toMillis(data.updatedAt) ||
    toMillis(data.createdAt);

  return {
    id: `booking-${doc.id}`,
    sourceId: doc.id,
    uid: data.uid || "",
    date,
    type: "Booking",
    description: getBookingDescription(data),
    status: payment.status || data.status || "pending",
    amount,
    currency: payment.currency || "usd",
    provider: payment.provider || "internal",
    reference:
      payment.checkoutSessionId ||
      payment.paymentIntentId ||
      payment.customerId ||
      doc.id,
    customerName: customer.fullName || "",
    customerEmail: customer.email || "",
  };
}

export function mapMembershipPaymentDoc(doc, user = {}) {
  const data = doc.data() || {};
  const uid = doc.ref.parent.parent?.id || data.uid || "";
  const amount = getMembershipAmount(data);

  return {
    id: `membership-${uid}-${doc.id}`,
    sourceId: doc.id,
    uid,
    date: toMillis(data.paidAt) || toMillis(data.createdAt),
    type: "Membership",
    description: getMembershipDescription(data),
    status: data.status || (String(data.type || "").includes("failed") ? "failed" : "paid"),
    amount,
    currency: data.currency || "usd",
    provider: data.paymentProvider || data.provider || "stripe",
    reference:
      data.stripeInvoiceId ||
      data.stripeCheckoutSessionId ||
      data.stripeSubscriptionId ||
      doc.id,
    customerName: user.displayName || "",
    customerEmail: user.email || "",
  };
}

export async function getAdminPaymentHistory(db, { limit = 100 } = {}) {
  const rowLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);
  const [bookingsSnapshot, membershipSnapshot] = await Promise.all([
    db.collection("bookings").orderBy("createdAt", "desc").limit(rowLimit).get(),
    db.collectionGroup("membershipLedger").orderBy("createdAt", "desc").limit(rowLimit).get(),
  ]);
  const bookingRefs = bookingsSnapshot.docs
    .map((doc) => {
      const data = doc.data() || {};
      const uid = data.uid || "";

      return uid
        ? db.collection("users").doc(uid).collection("bookings").doc(doc.id)
        : null;
    })
    .filter(Boolean);
  const bookingSnapshots = bookingRefs.length ? await db.getAll(...bookingRefs) : [];
  const fullBookingById = new Map(
    bookingSnapshots
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => [snapshot.id, snapshot]),
  );
  const membershipDocs = membershipSnapshot.docs.filter((doc) => {
    const data = doc.data() || {};
    const amount = getMembershipAmount(data);

    return (
      data.type === "signup" ||
      String(data.type || "").startsWith("invoice_") ||
      amount !== null ||
      data.stripeCheckoutSessionId ||
      data.stripeInvoiceId
    );
  });
  const userRefs = membershipDocs
    .map((doc) => doc.ref.parent.parent)
    .filter(Boolean);
  const userSnapshots = userRefs.length ? await db.getAll(...userRefs) : [];
  const usersByUid = new Map(
    userSnapshots
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => [snapshot.id, snapshot.data() || {}]),
  );
  const payments = [
    ...bookingsSnapshot.docs.map((doc) => mapBookingPaymentDoc(fullBookingById.get(doc.id) || doc)),
    ...membershipDocs.map((doc) =>
      mapMembershipPaymentDoc(doc, usersByUid.get(doc.ref.parent.parent?.id) || {}),
    ),
  ]
    .filter((payment) => payment.date)
    .sort((a, b) => b.date - a.date)
    .slice(0, rowLimit);

  return payments;
}
