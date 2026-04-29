import { LOCATION_OPTIONS } from "@/components/booking/data";
import {
  BookingButton,
  StepPanel,
  UnderlineInput,
  UnderlineSelect,
} from "@/components/booking/BookingControls";

export default function DetailsStep({
  details,
  locationType,
  onDetailsChange,
  onLocationChange,
  onBack,
  onContinue,
}) {
  const canContinue =
    details.fullName.trim() &&
    details.phone.trim() &&
    details.email.trim() &&
    details.agreeToTerms &&
    (locationType !== "mobile" || details.address.trim());

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
        <div className="grid gap-5 md:grid-cols-3">
          <UnderlineInput
            label="Full Name"
            name="fullName"
            value={details.fullName}
            onChange={(value) => onDetailsChange("fullName", value)}
            required
          />
          <UnderlineInput
            label="Phone"
            name="phone"
            type="tel"
            value={details.phone}
            onChange={(value) => onDetailsChange("phone", value)}
            required
          />
          <UnderlineInput
            label="E-mail Address"
            name="email"
            type="email"
            value={details.email}
            onChange={(value) => onDetailsChange("email", value)}
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

        {locationType === "mobile" ? (
          <UnderlineInput
            label="Treatment Address"
            name="address"
            value={details.address}
            onChange={(value) => onDetailsChange("address", value)}
            placeholder="Write your address here"
            required
          />
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
            <a
              href="/terms-and-conditions"
              className="text-[var(--color-primary)] underline"
            >
              the Terms of Service
            </a>
          </span>
        </label>
      </div>
    </StepPanel>
  );
}
