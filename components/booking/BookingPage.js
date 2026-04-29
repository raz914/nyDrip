"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  MOCK_COUPONS,
  TIME_SLOTS,
  calculateBookingTotal,
  calculateSubtotal,
  getDefaultCategory,
  getDefaultService,
  getServiceById,
  getServicesByCategory,
  getTravelFeeAmount,
  makeCartItem,
} from "@/components/booking/data";
import { createUserBooking, getBookingsForDate } from "@/lib/bookings";
import { getAvailabilityByTime, getSlotAvailability } from "@/lib/bookingRules";
import {
  EMPTY_REWARDS,
  calculateDripCredit,
  getMaxRedeemableDrips,
  getUserRewards,
} from "@/lib/rewards";

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
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialService = useMemo(() => {
    const serviceParam = searchParams.get("service");

    return getServiceById(serviceParam) ?? null;
  }, [searchParams]);

  const fallbackService = getDefaultService();
  const [currentStep, setCurrentStep] = useState(0);
  const [category, setCategory] = useState(
    initialService?.category ?? getDefaultCategory(),
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
    address: "",
    notes: "",
    agreeToTerms: false,
  });
  const [payment, setPayment] = useState({
    couponCode: "",
    cardNumber: "4242 4242 4242 4242",
    expiration: "12 / 30",
    cvc: "123",
  });
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [dripsToRedeem, setDripsToRedeem] = useState(0);
  const [rewards, setRewards] = useState(EMPTY_REWARDS);
  const [savedBooking, setSavedBooking] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [travelFeeState, setTravelFeeState] = useState({
    status: "idle",
    result: null,
    message: "",
  });

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadRewards() {
      try {
        const nextRewards = await getUserRewards(user.uid);

        if (isActive) {
          setRewards(nextRewards);
        }
      } catch (error) {
        if (isActive) {
          setCheckoutError(error.message);
        }
      }
    }

    loadRewards();

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    let isActive = true;

    async function loadExistingBookings() {
      try {
        const bookings = await getBookingsForDate(selectedDate);

        if (isActive) {
          setExistingBookings(bookings);
          setAvailabilityMessage("");
        }
      } catch {
        if (isActive) {
          setExistingBookings([]);
          setAvailabilityMessage(
            "We could not load live availability. We will recheck this slot before checkout.",
          );
        }
      }
    }

    loadExistingBookings();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  const location = getLocation(locationType, details);
  const subtotal = calculateSubtotal(cartItems);
  const travelFee = getTravelFeeAmount(locationType, travelFeeState.result);
  const couponDiscount = MOCK_COUPONS[appliedCouponCode] ?? 0;
  const orderTotal = calculateBookingTotal({
    items: cartItems,
    locationType,
    couponCode: appliedCouponCode,
    travelFeeResult: travelFeeState.result,
  });
  const availabilityByTime = useMemo(
    () =>
      getAvailabilityByTime({
        bookings: existingBookings,
        date: selectedDate,
        timeSlots: TIME_SLOTS,
        locationType,
      }),
    [existingBookings, locationType, selectedDate],
  );
  const selectedSlotAvailability = getSlotAvailability({
    bookings: existingBookings,
    date: selectedDate,
    time: selectedTime,
    locationType,
  });
  const maxRedeemableDrips = getMaxRedeemableDrips(
    rewards.availableDrips,
    orderTotal,
  );
  const selectedDripsToRedeem = Math.min(dripsToRedeem, maxRedeemableDrips);
  const dripCredit = calculateDripCredit(selectedDripsToRedeem);
  const total = Math.max(orderTotal - dripCredit, 0);
  const showCart = cartItems.length > 0 || currentStep > 0;

  function addSelectedService() {
    const service = getServiceById(serviceId);

    if (!service) {
      return;
    }

    setCartItems((currentItems) => [...currentItems, makeCartItem(service)]);
  }

  function changeCategory(nextCategory) {
    const services = getServicesByCategory(nextCategory);

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
      const service = getServiceById(serviceId);

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
    }
  }

  function updateDripsToRedeem(value) {
    setDripsToRedeem(Math.min(value, maxRedeemableDrips));
  }

  function applyCoupon() {
    const code = payment.couponCode.trim().toUpperCase();

    if (code === "DRIP10" || code === "LOUNGE25") {
      setAppliedCouponCode(code);
      setCouponMessage(`${code} applied successfully.`);
      return;
    }

    setAppliedCouponCode("");
    setCouponMessage("Try DRIP10 or LOUNGE25 for this mock checkout.");
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

  async function submitMockPayment() {
    if (loading) {
      return;
    }

    if (!user) {
      const queryString = searchParams.toString();
      const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setIsSubmitting(true);
    setCheckoutError("");

    try {
      const latestBookings = await getBookingsForDate(selectedDate);
      const latestSlotAvailability = getSlotAvailability({
        bookings: latestBookings,
        date: selectedDate,
        time: selectedTime,
        locationType,
      });

      if (!latestSlotAvailability.available) {
        throw new Error(latestSlotAvailability.reason);
      }

      if (locationType === "mobile" && !travelFeeState.result?.ok) {
        throw new Error("Please calculate the travel fee before checkout.");
      }

      const booking = await createUserBooking(user, {
        items: cartItems,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        location,
        customer: {
          fullName: details.fullName,
          phone: details.phone,
          email: details.email,
        },
        notes: details.notes,
        subtotal,
        travelFee,
        travelMiles: travelFeeState.result?.miles ?? null,
        travelBase: travelFeeState.result?.base ?? null,
        travelFeeSource: travelFeeState.result?.source ?? "none",
        couponCode: appliedCouponCode,
        couponDiscount,
        orderTotal,
        dripsToRedeem: selectedDripsToRedeem,
      });

      setSavedBooking(booking);
      setRewards(booking.rewards);
      setIsSubmitting(false);
      goToStep(4);
    } catch (error) {
      setCheckoutError(error.message);
      setIsSubmitting(false);
    }
  }

  function renderStep() {
    if (currentStep === 0) {
      return (
        <ServiceStep
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
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          timeSlots={TIME_SLOTS}
          slotAvailability={availabilityByTime}
          availabilityMessage={availabilityMessage}
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
        isSubmitting={isSubmitting}
        onPaymentChange={updatePayment}
        onApplyCoupon={applyCoupon}
        onDripsToRedeemChange={updateDripsToRedeem}
        onBack={goBack}
        onSubmit={submitMockPayment}
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
          dripCredit={savedBooking?.dripCredit ?? dripCredit}
          travelFeeResult={travelFeeState.result}
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
            dripCredit={dripCredit}
            travelFeeResult={travelFeeState.result}
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
