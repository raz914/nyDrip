import Link from "next/link";

import { LOCATION_OPTIONS, formatCurrency } from "@/components/booking/data";
import {
  BookingButton,
  StepPanel,
  UnderlineInput,
  UnderlineSelect,
} from "@/components/booking/BookingControls";

export default function DetailsStep({
  details,
  isSignedIn = false,
  locationType,
  travelFeeState,
  onDetailsChange,
  onLocationChange,
  onCalculateTravelFee,
  onBack,
  onContinue,
}) {
  const needsTravelFee = locationType === "mobile";
  const hasReadyTravelFee = travelFeeState?.status === "ready" && travelFeeState.result?.ok;
  const canContinue =
    details.fullName.trim() &&
    details.phone.trim() &&
    details.email.trim() &&
    details.dateOfBirth.trim() &&
    details.agreeToTerms &&
    (!needsTravelFee || (details.address.trim() && hasReadyTravelFee));

  return (
    <StepPanel
      title="Enter your details to finalize your appointment"
      className="min-h-[565px]"
      actions={
        <>
          <BookingButton variant="secondary" onClick={onBack}>
            Back
          </BookingButton>
          <BookingButton onClick={onContinue} disabled={!canContinue}>
            Continue
          </BookingButton>
        </>
      }
    >
      <div className="space-y-9">
        <div className="grid gap-5 md:grid-cols-4">
          {!isSignedIn ? (
            <UnderlineInput
              label="Full Name"
              name="fullName"
              value={details.fullName}
              onChange={(value) => onDetailsChange("fullName", value)}
              required
            />
          ) : null}
          <UnderlineInput
            label="Phone"
            name="phone"
            type="tel"
            value={details.phone}
            onChange={(value) => onDetailsChange("phone", value)}
            required
          />
          {!isSignedIn ? (
            <UnderlineInput
              label="E-mail Address"
              name="email"
              type="email"
              value={details.email}
              onChange={(value) => onDetailsChange("email", value)}
              required
            />
          ) : null}
          <UnderlineInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={details.dateOfBirth}
            onChange={(value) => onDetailsChange("dateOfBirth", value)}
            required
          />
        </div>

        <UnderlineSelect
          label="Where would you like to receive treatment?"
          value={locationType}
          onChange={onLocationChange}
          options={LOCATION_OPTIONS.map((option) => ({
            label: option.label,
            value: option.type,
          }))}
        />

        {needsTravelFee ? (
          <div className="space-y-4">
            <UnderlineInput
              label="Treatment Address"
              name="address"
              value={details.address}
              onChange={(value) => onDetailsChange("address", value)}
              placeholder="Write your address here"
              required
            />
            <div className="flex flex-wrap items-center gap-3">
              <BookingButton
                variant="muted"
                onClick={onCalculateTravelFee}
                disabled={!details.address.trim() || travelFeeState?.status === "loading"}
              >
                {travelFeeState?.status === "loading" ? "Calculating" : "Calculate Travel Fee"}
              </BookingButton>
              {hasReadyTravelFee ? (
                <p className="text-sm text-[var(--color-primary)] md:text-base">
                  Travel fee: {formatCurrency(travelFeeState.result.fee)}
                </p>
              ) : null}
            </div>
            {travelFeeState?.message ? (
              <p className="text-sm text-[#d83f3f] md:text-base">
                {travelFeeState.message}
              </p>
            ) : null}
          </div>
        ) : null}

        <UnderlineInput
          label="Notes"
          name="notes"
          value={details.notes}
          onChange={(value) => onDetailsChange("notes", value)}
          placeholder="Write Here"
          textarea
        />

        <label className="flex items-start gap-2 text-sm text-[#111111] md:text-base">
          <input
            type="checkbox"
            checked={details.agreeToTerms}
            onChange={(event) => onDetailsChange("agreeToTerms", event.target.checked)}
            className="mt-1 h-4 w-4 border-[#111111]"
          />
          <span>
            I agree to{" "}
            <Link
              href="/terms-and-conditions"
              className="font-medium text-[var(--color-primary)] underline decoration-current decoration-2 underline-offset-4 transition-colors hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              the Terms of Service
            </Link>
          </span>
        </label>
      </div>
    </StepPanel>
  );
}
