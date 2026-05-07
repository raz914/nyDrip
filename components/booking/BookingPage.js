"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import BookingCartSummary from "@/components/booking/BookingCartSummary";
import BookingShell from "@/components/booking/BookingShell";
import ConfirmationStep from "@/components/booking/ConfirmationStep";
import DetailsStep from "@/components/booking/DetailsStep";
import PaymentStep from "@/components/booking/PaymentStep";
import ServiceStep from "@/components/booking/ServiceStep";
import TimeStep from "@/components/booking/TimeStep";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BOOKING_DATES,
  DEFAULT_LOCATION,
  LOCATION_OPTIONS,
  TIME_SLOTS,
  bookableServices,
  calculateBookingTotal,
  calculateSubtotal,
  getDefaultCategory,
  getDefaultService,
  getServiceById,
  getServicesByCategory,
  getTravelFeeAmount,
  makeCartItem,
} from "@/components/booking/data";
import {
  getBookableTimeSlots,
  getCartDurationMinutes,
  getRollingWeekdayDates,
} from "@/lib/bookingRules";
import {
  EMPTY_REWARDS,
  calculateDripCredit,
  getMaxRedeemableDrips,
  getRewardsSummary,
  getUserRewards,
} from "@/lib/rewards";
import {
  getMembershipPricing,
  getMembershipSummary,
  getUserMembership,
} from "@/lib/memberships";
import { getUserProfile } from "@/lib/profile";

function getLocation(locationType, details) {
  const option =
    LOCATION_OPTIONS.find((location) => location.type === locationType) ??
    DEFAULT_LOCATION;

  if (locationType === "mobile" && details.address.trim()) {
    return {
      ...option,
      address: details.address.trim(),
    };
  }

  return option;
}

export default function BookingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [serviceCatalog, setServiceCatalog] = useState(bookableServices);

  const initialService = useMemo(() => {
    const serviceParam = searchParams.get("service");

    return getServiceById(serviceParam, serviceCatalog) ?? null;
  }, [searchParams, serviceCatalog]);

  const fallbackService = useMemo(() => getDefaultService(serviceCatalog), [serviceCatalog]);
  const [currentStep, setCurrentStep] = useState(0);
  const [category, setCategory] = useState(
    initialService?.category ?? getDefaultCategory(serviceCatalog),
  );
  const [serviceId, setServiceId] = useState(
    initialService?.id ?? fallbackService.id,
  );
  const [cartItems, setCartItems] = useState(() =>
    initialService ? [makeCartItem(initialService)] : [],
  );
  const [selectedDate, setSelectedDate] = useState(BOOKING_DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[8]);
  const [locationType, setLocationType] = useState(DEFAULT_LOCATION.type);
  const [details, setDetails] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    address: "",
    notes: "",
    agreeToTerms: false,
  });
  const [payment, setPayment] = useState({
    couponCode: "",
  });
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [dripsToRedeem, setDripsToRedeem] = useState(0);
  const [rewards, setRewards] = useState(EMPTY_REWARDS);
  const [membership, setMembership] = useState(getMembershipSummary());
  const [savedBooking, setSavedBooking] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState(TIME_SLOTS);
  const [availabilityStatus, setAvailabilityStatus] = useState("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [travelFeeState, setTravelFeeState] = useState({
    status: "idle",
    result: null,
    message: "",
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.ok && Array.isArray(data.services)) {
          setServiceCatalog(data.services);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCartItems((items) =>
      items.map((item) => {
        const fresh = getServiceById(item.id, serviceCatalog);
        if (!fresh) {
          return item;
        }
        return { ...item, ...fresh };
      }),
    );
  }, [serviceCatalog]);

  useEffect(() => {
    if (getServiceById(serviceId, serviceCatalog)) {
      return;
    }
    const next = getDefaultService(serviceCatalog);
    setServiceId(next.id);
    setCategory(next.category);
  }, [serviceCatalog, serviceId]);

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") {
      setCheckoutError("Checkout was cancelled before payment completed.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadAccountBookingData() {
      try {
        const [nextMembership, nextRewards, profile] = await Promise.all([
          getUserMembership(user.uid),
          getUserRewards(user.uid),
          getUserProfile(user.uid),
        ]);

        if (isActive) {
          const profileName = profile?.displayName?.trim() || user.displayName || "";
          const profileEmail = user.email || profile?.email || "";

          setMembership(nextMembership);
          setRewards(getRewardsSummary(nextRewards, nextMembership));
          setDetails((currentDetails) => ({
            ...currentDetails,
            fullName: currentDetails.fullName || profileName,
            email: currentDetails.email || profileEmail,
          }));
        }
      } catch (error) {
        if (isActive) {
          setCheckoutError(error.message);
        }
      }
    }

    loadAccountBookingData();

    return () => {
      isActive = false;
    };
  }, [user]);

  const location = getLocation(locationType, details);
  const subtotal = calculateSubtotal(cartItems);
  const travelFee = getTravelFeeAmount(locationType, travelFeeState.result);
  const couponDiscount = appliedCouponDiscount;
  const baseOrderTotal = calculateBookingTotal({
    items: cartItems,
    locationType,
    travelFeeResult: travelFeeState.result,
  });
  const membershipPricing = getMembershipPricing({
    items: cartItems,
    membership,
    benefits: membership.benefits,
    locationType,
    travelFee,
  });
  const membershipCreditApplied = membershipPricing.membershipCreditApplied;
  const membershipDiscount = membershipPricing.membershipDiscount;
  const travelFeeWaived = membershipPricing.travelFeeWaived;
  const orderTotal = Math.max(
    baseOrderTotal -
      membershipCreditApplied -
      membershipDiscount -
      travelFeeWaived -
      couponDiscount,
    0,
  );
  const bookingDates = useMemo(() => getRollingWeekdayDates(), []);
  const bookingDurationMinutes = getCartDurationMinutes(cartItems);
  const selectedSlotAvailability = slotAvailability[selectedTime] ?? {
    available: false,
    reason: availabilityMessage || "Live availability is still loading.",
  };
  const maxRedeemableDrips = getMaxRedeemableDrips(
    rewards.availableDrips,
    orderTotal,
  );
  const selectedDripsToRedeem = Math.min(dripsToRedeem, maxRedeemableDrips);
  const dripCredit = calculateDripCredit(selectedDripsToRedeem);
  const total = Math.max(orderTotal - dripCredit, 0);
  const showCart = cartItems.length > 0 || currentStep > 0;
  const cartSignature = cartItems
    .map((item) => `${item.cartId}:${item.id}:${item.price}`)
    .join("|");
  const couponContextSignature = [
    cartSignature,
    locationType,
    membershipCreditApplied,
    membershipDiscount,
    travelFee,
    travelFeeWaived,
  ].join("|");
  const previousCouponContextSignature = useRef(couponContextSignature);

  useEffect(() => {
    if (!bookingDates.includes(selectedDate)) {
      setSelectedDate(bookingDates[0] || "");
    }
  }, [bookingDates, selectedDate]);

  useEffect(() => {
    if (!availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(availableTimeSlots[0] || "");
    }
  }, [availableTimeSlots, selectedTime]);

  useEffect(() => {
    if (!selectedDate || !bookingDurationMinutes) {
      setSlotAvailability({});
      setAvailabilityStatus("idle");
      setAvailabilityMessage("");
      return undefined;
    }

    let isActive = true;

    async function loadAvailability() {
      setAvailabilityStatus("loading");
      setAvailabilityMessage("");

      try {
        const params = new URLSearchParams({
          date: selectedDate,
          durationMinutes: String(bookingDurationMinutes),
          locationType,
          serviceId,
        });
        const headers = {};

        if (user) {
          headers.Authorization = `Bearer ${await user.getIdToken()}`;
        }

        const response = await fetch(`/api/booking-availability?${params.toString()}`, {
          headers,
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Live availability is unavailable.");
        }

        if (isActive) {
          setAvailableTimeSlots(result.timeSlots || getBookableTimeSlots(bookingDurationMinutes));
          setSlotAvailability(result.availabilityByTime || {});
          setAvailabilityStatus("ready");
          setAvailabilityMessage("");
        }
      } catch (error) {
        if (isActive) {
          setAvailableTimeSlots(getBookableTimeSlots(bookingDurationMinutes));
          setSlotAvailability({});
          setAvailabilityStatus("error");
          setAvailabilityMessage(
            error.message ||
              "We could not load live availability. We will recheck this slot before checkout.",
          );
        }
      }
    }

    loadAvailability();

    return () => {
      isActive = false;
    };
  }, [bookingDurationMinutes, locationType, selectedDate, serviceId, user]);

  useEffect(() => {
    if (previousCouponContextSignature.current === couponContextSignature) {
      return;
    }

    previousCouponContextSignature.current = couponContextSignature;

    if (appliedCouponCode) {
      setAppliedCouponCode("");
      setAppliedCouponDiscount(0);
      setCouponMessage("Coupon removed because booking details changed.");
    }
  }, [appliedCouponCode, couponContextSignature]);

  function addSelectedService() {
    const service = getServiceById(serviceId, serviceCatalog);

    if (!service) {
      return;
    }

    setCartItems((currentItems) => [...currentItems, makeCartItem(service)]);
  }

  function changeCategory(nextCategory) {
    const services = getServicesByCategory(nextCategory, serviceCatalog);

    setCategory(nextCategory);
    setServiceId(services[0]?.id ?? fallbackService.id);
  }

  function removeCartItem(cartId) {
    setCartItems((currentItems) => currentItems.filter((item) => item.cartId !== cartId));
  }

  function goToStep(step) {
    setCurrentStep(Math.min(Math.max(step, 0), 4));
  }

  function goBack() {
    if (currentStep === 0) {
      window.location.href = "/";
      return;
    }

    goToStep(currentStep - 1);
  }

  function continueFromService() {
    if (!cartItems.length) {
      const service = getServiceById(serviceId, serviceCatalog);

      if (!service) {
        return;
      }

      setCartItems([makeCartItem(service)]);
    }

    goToStep(1);
  }

  function updateDetails(field, value) {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));

    if (field === "address") {
      setTravelFeeState({
        status: "idle",
        result: null,
        message: "",
      });
    }
  }

  function changeLocation(nextLocationType) {
    setLocationType(nextLocationType);
    setTravelFeeState({
      status: "idle",
      result: null,
      message: "",
    });
  }

  function updatePayment(field, value) {
    setPayment((currentPayment) => ({
      ...currentPayment,
      [field]: value,
    }));

    if (field === "couponCode") {
      setCouponMessage("");
      setAppliedCouponCode("");
      setAppliedCouponDiscount(0);
    }
  }

  function updateDripsToRedeem(value) {
    setDripsToRedeem(Math.min(value, maxRedeemableDrips));
  }

  async function applyCoupon() {
    const code = payment.couponCode.trim().toUpperCase();

    if (!code) {
      setAppliedCouponCode("");
      setAppliedCouponDiscount(0);
      setCouponMessage("Enter a coupon code.");
      return;
    }

    if (!user) {
      setCouponMessage("Sign in is required to apply coupons.");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMessage("");

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode: code,
          items: cartItems,
          locationType,
          subtotal,
          travelFee,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Coupon could not be applied.");
      }

      setAppliedCouponCode(result.couponCode);
      setAppliedCouponDiscount(result.couponDiscount);
      setPayment((currentPayment) => ({
        ...currentPayment,
        couponCode: result.couponCode,
      }));
      setCouponMessage(result.message || `${result.couponCode} applied successfully.`);
    } catch (error) {
      setAppliedCouponCode("");
      setAppliedCouponDiscount(0);
      setCouponMessage(error.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  async function calculateMobileTravelFee() {
    if (!details.address.trim()) {
      setTravelFeeState({
        status: "error",
        result: null,
        message: "Enter a full address so we can calculate your travel fee.",
      });
      return;
    }

    setTravelFeeState({
      status: "loading",
      result: null,
      message: "",
    });

    try {
      const response = await fetch("/api/travel-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: details.address.trim() }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setTravelFeeState({
          status: "error",
          result,
          message: result.message || "Travel fee is unavailable for this address.",
        });
        return;
      }

      setTravelFeeState({
        status: "ready",
        result,
        message: "",
      });
    } catch (error) {
      setTravelFeeState({
        status: "error",
        result: null,
        message: error.message || "Travel fee is unavailable for this address.",
      });
    }
  }

  function continueFromDetails() {
    if (!selectedSlotAvailability.available) {
      setCheckoutError(selectedSlotAvailability.reason);
      return;
    }

    setCheckoutError("");
    goToStep(3);
  }

  async function submitStripeCheckout() {
    setIsSubmitting(true);
    setCheckoutError("");

    try {
      const requestHeaders = {
        "Content-Type": "application/json",
      };

      if (user) {
        requestHeaders.Authorization = `Bearer ${await user.getIdToken()}`;
      }

      const availabilityResponse = await fetch("/api/booking-availability", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          durationMinutes: bookingDurationMinutes,
          locationType,
        }),
      });
      const availabilityResult = await availabilityResponse.json();

      if (!availabilityResponse.ok || !availabilityResult.ok) {
        throw new Error(
          availabilityResult.message || "This time slot is no longer available.",
        );
      }

      if (locationType === "mobile" && !travelFeeState.result?.ok) {
        throw new Error("Please calculate the travel fee before checkout.");
      }

      const bookingResponse = await fetch("/api/stripe/booking-checkout", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          items: cartItems,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          location,
          customer: {
            fullName: details.fullName,
            phone: details.phone,
            email: details.email,
            dateOfBirth: details.dateOfBirth,
          },
          notes: details.notes,
          subtotal,
          travelFee,
          travelMiles: travelFeeState.result?.miles ?? null,
          travelBase: travelFeeState.result?.base ?? null,
          travelFeeSource: travelFeeState.result?.source ?? "none",
          couponCode: appliedCouponCode,
          couponDiscount,
          membershipCreditApplied,
          membershipDiscount,
          travelFeeWaived,
          orderTotal,
          dripsToRedeem: selectedDripsToRedeem,
        }),
      });
      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok || !bookingResult.ok) {
        throw new Error(bookingResult.message || "Could not start checkout.");
      }

      if (bookingResult.mode === "confirmed" && bookingResult.booking) {
        const booking = bookingResult.booking;

        setSavedBooking(booking);
        setCartItems(booking.items ?? []);
        setSelectedDate(booking.appointmentDate);
        setSelectedTime(booking.appointmentTime);
        setRewards(getRewardsSummary(booking.rewards, membership));
        setIsSubmitting(false);
        goToStep(4);
        return;
      }

      if (bookingResult.url) {
        window.location.assign(bookingResult.url);
        return;
      }

      throw new Error("Stripe checkout could not be started.");
    } catch (error) {
      setCheckoutError(error.message);
      setIsSubmitting(false);
    }
  }

  function renderStep() {
    if (currentStep === 0) {
      return (
        <ServiceStep
          catalog={serviceCatalog}
          category={category}
          serviceId={serviceId}
          cartItems={cartItems}
          onCategoryChange={changeCategory}
          onServiceChange={setServiceId}
          onAddSelectedService={addSelectedService}
          onBack={goBack}
          onContinue={continueFromService}
        />
      );
    }

    if (currentStep === 1) {
      return (
        <TimeStep
          bookingDates={bookingDates}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          timeSlots={availableTimeSlots}
          durationMinutes={bookingDurationMinutes}
          slotAvailability={slotAvailability}
          availabilityMessage={availabilityMessage}
          availabilityStatus={availabilityStatus}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          onBack={goBack}
          onContinue={() => goToStep(2)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <DetailsStep
          details={details}
          isSignedIn={Boolean(user)}
          locationType={locationType}
          travelFeeState={travelFeeState}
          onDetailsChange={updateDetails}
          onLocationChange={changeLocation}
          onCalculateTravelFee={calculateMobileTravelFee}
          onBack={goBack}
          onContinue={continueFromDetails}
        />
      );
    }

    return (
      <PaymentStep
        payment={payment}
        couponMessage={couponMessage}
        rewards={rewards}
        dripsToRedeem={selectedDripsToRedeem}
        maxRedeemableDrips={maxRedeemableDrips}
        dripCredit={dripCredit}
        membership={membership}
        membershipPricing={membershipPricing}
        isSubmitting={isSubmitting}
        isApplyingCoupon={isApplyingCoupon}
        isGuest={!user}
        onPaymentChange={updatePayment}
        onApplyCoupon={applyCoupon}
        onDripsToRedeemChange={updateDripsToRedeem}
        onBack={goBack}
        onSubmit={submitStripeCheckout}
      />
    );
  }

  if (currentStep === 4) {
    return (
      <BookingShell currentStep={currentStep} footer={false}>
        <ConfirmationStep
          cartItems={cartItems}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          location={location}
          couponCode={appliedCouponCode}
          couponDiscount={savedBooking?.couponDiscount ?? couponDiscount}
          membershipCreditApplied={
            savedBooking?.membershipCreditApplied ?? membershipCreditApplied
          }
          membershipDiscount={savedBooking?.membershipDiscount ?? membershipDiscount}
          membershipAppliedBenefits={
            savedBooking?.membershipAppliedBenefits ?? membershipPricing.appliedBenefits
          }
          dripCredit={savedBooking?.dripCredit ?? dripCredit}
          travelFeeResult={travelFeeState.result}
          travelFeeWaived={savedBooking?.travelFeeWaived ?? travelFeeWaived}
          dripsEarned={savedBooking?.dripsEarned ?? 0}
          total={savedBooking?.totalPaid ?? total}
        />
      </BookingShell>
    );
  }

  return (
    <BookingShell currentStep={currentStep}>
      <div
        className={[
          "grid gap-5",
          showCart ? "lg:grid-cols-[minmax(0,948px)_464px] lg:items-start" : "",
        ].join(" ")}
      >
        <div>{renderStep()}</div>
        {showCart ? (
          <BookingCartSummary
            items={cartItems}
            selectedDate={currentStep > 1 ? selectedDate : null}
            selectedTime={currentStep > 1 ? selectedTime : null}
            location={location}
            showLocation={currentStep >= 3}
            couponCode={appliedCouponCode}
            couponDiscount={couponDiscount}
            membershipCreditApplied={membershipCreditApplied}
            membershipDiscount={membershipDiscount}
            membershipAppliedBenefits={membershipPricing.appliedBenefits}
            dripCredit={dripCredit}
            travelFeeResult={travelFeeState.result}
            travelFeeWaived={travelFeeWaived}
            total={total}
            onRemove={removeCartItem}
            onAddMore={() => goToStep(0)}
            onEditLocation={currentStep >= 3 ? () => goToStep(2) : undefined}
          />
        ) : null}
      </div>
      {checkoutError ? (
        <p className="mt-5 text-sm text-[#d83f3f] md:text-base">{checkoutError}</p>
      ) : null}
    </BookingShell>
  );
}
