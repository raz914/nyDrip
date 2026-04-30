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
import { createUserBooking } from "@/lib/bookings";
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
  calculateMembershipDiscount,
  getMembershipSummary,
  getUserMembership,
} from "@/lib/memberships";

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

function getBookingReturnUrl(pathname, searchParams, serviceId) {
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  if (serviceId && !nextSearchParams.has("service")) {
    nextSearchParams.set("service", serviceId);
  }

  const queryString = nextSearchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
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
    if (loading || user) {
      return;
    }

    const currentUrl = getBookingReturnUrl(pathname, searchParams, serviceId);

    router.replace(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
  }, [loading, pathname, router, searchParams, serviceId, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadRewards() {
      try {
        const [nextMembership, nextRewards] = await Promise.all([
          getUserMembership(user.uid),
          getUserRewards(user.uid),
        ]);

        if (isActive) {
          setMembership(nextMembership);
          setRewards(getRewardsSummary(nextRewards, nextMembership));
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

  const location = getLocation(locationType, details);
  const subtotal = calculateSubtotal(cartItems);
  const travelFee = getTravelFeeAmount(locationType, travelFeeState.result);
  const couponDiscount = MOCK_COUPONS[appliedCouponCode] ?? 0;
  const baseOrderTotal = calculateBookingTotal({
    items: cartItems,
    locationType,
    couponCode: appliedCouponCode,
    travelFeeResult: travelFeeState.result,
  });
  const membershipDiscount = calculateMembershipDiscount(cartItems, membership);
  const orderTotal = Math.max(baseOrderTotal - membershipDiscount, 0);
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
    if (loading) {
      return undefined;
    }

    if (!user || !selectedDate || !bookingDurationMinutes) {
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
        const token = await user.getIdToken();
        const params = new URLSearchParams({
          date: selectedDate,
          durationMinutes: String(bookingDurationMinutes),
          locationType,
        });
        const response = await fetch(`/api/booking-availability?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  }, [bookingDurationMinutes, loading, locationType, selectedDate, user]);

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
    if (loading) {
      return;
    }

    if (!user) {
      const currentUrl = getBookingReturnUrl(pathname, searchParams, serviceId);

      router.push(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
      return;
    }

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
      const currentUrl = getBookingReturnUrl(pathname, searchParams, serviceId);
      router.push(`/login?returnTo=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setIsSubmitting(true);
    setCheckoutError("");

    try {
      const token = await user.getIdToken();
      const availabilityResponse = await fetch("/api/booking-availability", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
        membershipDiscount,
        orderTotal,
        dripsToRedeem: selectedDripsToRedeem,
      });

      setSavedBooking(booking);
      setRewards(getRewardsSummary(booking.rewards, membership));
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
        isSubmitting={isSubmitting}
        onPaymentChange={updatePayment}
        onApplyCoupon={applyCoupon}
        onDripsToRedeemChange={updateDripsToRedeem}
        onBack={goBack}
        onSubmit={submitMockPayment}
      />
    );
  }

  if (loading || !user) {
    return (
      <BookingShell currentStep={0}>
        <div className="border border-[#111111] bg-white px-5 py-12 text-center text-[#111111]">
          <h1 className="text-[1.75rem] font-medium leading-none md:text-[2.25rem]">
            Sign in to book your appointment
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-base text-[#858585] md:text-lg">
            We are taking you to login so we can protect your booking details and
            confirm live availability.
          </p>
        </div>
      </BookingShell>
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
          membershipDiscount={savedBooking?.membershipDiscount ?? membershipDiscount}
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
            membershipDiscount={membershipDiscount}
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
