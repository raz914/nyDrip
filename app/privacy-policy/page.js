import { ServicesFooter, ServicesHeader } from "@/components/services/sections";

export const metadata = {
  title: "Privacy Policy | DripLounge",
  description:
    "Read how DripLounge collects, uses, stores, and protects your personal information.",
};

export default function Page() {
  return (
    <>
      <ServicesHeader />
      <main className="bg-white text-[#111111]">
        <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-24">
          <article className="mx-auto max-w-[948px] space-y-10">
            <h1 className="text-[2.25rem] font-medium leading-tight md:text-[3.25rem]">
              Privacy Policy
            </h1>
            <div className="space-y-4 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
              <p className="font-medium text-[#111111]">
                Privacy Policy &amp; HIPAA Notice of Privacy Practices
              </p>
              <p>Effective Date: October 2025</p>
              <p>
                At The Drip Lounge Holdings LLC, your privacy is our priority. We are
                committed to protecting your Protected Health Information (PHI) under
                the Health Insurance Portability and Accountability Act (HIPAA) and
                complying with LegitScript Healthcare Certification Standards.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">
                1. How We Treat Your Protected Health Information (PHI)
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We collect and use PHI - such as your name, contact details, health
                conditions, and treatment information - only for legitimate healthcare
                purposes, including:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>Providing IV therapy and wellness services</li>
                <li>Managing appointments and follow-ups</li>
                <li>Processing payments and insurance (if applicable)</li>
                <li>Operating our wellness programs and improving services</li>
                <li>Complying with legal and regulatory requirements</li>
              </ul>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We do not sell or share your PHI with unaffiliated third parties for
                marketing purposes. All electronic PHI (ePHI) is protected using
                administrative, physical, and technical safeguards including encryption,
                password protection, and secure servers.
              </p>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                If a data breach occurs, we will promptly notify affected individuals
                and the U.S. Department of Health and Human Services (HHS) in
                compliance with the HIPAA Breach Notification Rule.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">2. Your HIPAA Rights</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                As a patient, you have the right to:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>Access and obtain a copy of your PHI.</li>
                <li>Request corrections to any inaccurate information.</li>
                <li>Request restrictions on certain uses or disclosures.</li>
                <li>
                  Request confidential communications via alternative contact methods.
                </li>
                <li>
                  Receive a list (accounting) of PHI disclosures made by NY Drip
                  Lounge.
                </li>
                <li>Withdraw consent for future communications or sharing.</li>
              </ul>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                To exercise these rights, please submit a written request to our
                Privacy Official (see contact details below).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">3. Disclosure of PHI</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We may share your PHI only when:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>Required for your treatment or healthcare operations.</li>
                <li>Required by law, regulation, or court order.</li>
                <li>Authorized by you in writing.</li>
                <li>
                  Necessary to prevent or lessen a serious threat to health or safety.
                </li>
              </ul>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                All third-party vendors or partners handling PHI (such as scheduling,
                billing, or data hosting services) are bound by HIPAA-compliant
                Business Associate Agreements (BAAs).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">4. LegitScript Compliance</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                The Drip Lounge Holdings LLC adheres to LegitScript&apos;s Healthcare
                Certification Standards, ensuring all services are legitimate, lawful,
                and transparent. Our Privacy Policy aligns with LegitScript Standard 7
                (Privacy) and Section VI(f) of the LegitScript Terms and Conditions,
                confirming that PHI is managed securely, ethically, and in compliance
                with HIPAA.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">
                5. Privacy Official Contact Information
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Our appointed Privacy Official oversees compliance with this Privacy
                Policy and HIPAA regulations.
              </p>
              <div className="space-y-1 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <p className="font-medium text-[#111111]">Privacy Official:</p>
                <p>Name: Megan Nickerson</p>
                <p>Email: info@nydriplounge.com</p>
                <p>Phone: +1 (845) 391-0338</p>
                <p>Mailing Address: 5177 Route 9W, Newburgh NY 12550</p>
              </div>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Patients may contact our Privacy Official for any questions, requests,
                or complaints regarding privacy practices.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">6. Updates to This Policy</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We may update this Privacy Policy periodically to reflect new
                regulations or internal practices. Any changes will be published on this
                page with a revised effective date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">
                7. How to File a Complaint
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                If you believe your privacy rights have been violated, you may file a
                complaint with:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>The Drip Lounge Holdings LLC Privacy Official (contact above), or</li>
                <li>
                  U.S. Department of Health and Human Services (HHS) Office for Civil
                  Rights:{" "}
                  <a
                    href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    https://www.hhs.gov/ocr/privacy/hipaa/complaints/
                  </a>
                </li>
              </ul>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                You will not face retaliation for filing a complaint.
              </p>
            </section>

            <section className="space-y-3 border-b border-black/10 pb-10">
              <h2 className="text-xl font-medium text-[#111111]">8. Contact Us</h2>
              <div className="space-y-1 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <p>For any questions about this Privacy Policy or your rights:</p>
                <p>The Drip Lounge Holdings LLC</p>
                <p>Email: info@nydriplounge.com</p>
                <p>
                  Website:{" "}
                  <a
                    href="https://nydriplounge.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    https://nydriplounge.com
                  </a>
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-[1.6rem] font-medium leading-tight md:text-[2rem]">
                The Drip Lounge Holdings LLC SMS/MMS Privacy Policy
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Effective Date: August 27, 2025
              </p>
              <p className="rounded border border-black/10 bg-black/[0.03] p-4 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                SMS/MMS Privacy Statement (Required Disclosure): We do not sell or
                share your mobile phone number or personal information with third
                parties for marketing purposes. You can opt out of SMS/MMS at any time
                by replying STOP; reply HELP for help. Message and data rates may
                apply. Message frequency may vary.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">1. Who We Are</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                The Drip Lounge Holdings LLC (&quot;we,&quot; &quot;us,&quot;
                &quot;our&quot;) respects your privacy. This Privacy Policy explains
                what information we collect, how we use it, and the choices you
                have-including your choices for SMS/MMS communications.
              </p>
              <p className="font-medium text-[#111111]">Information We Collect</p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>Contact information: name, email address, mobile phone number.</li>
                <li>
                  Account &amp; booking details: services selected, appointment
                  date/time, and preferences.
                </li>
                <li>
                  Communications &amp; consent data: your consents, SMS/MMS
                  opt-in/opt-out status, and message delivery logs limited to what&apos;s
                  needed to operate the service.
                </li>
                <li>
                  Device/usage data: IP address, browser type, pages visited, cookies
                  and similar technologies used to operate and improve our website.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">2. How We Use Information</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>
                  To provide and manage services, appointments, and customer support.
                </li>
                <li>
                  To send transactional and, if you opt in, marketing SMS/MMS messages.
                </li>
                <li>
                  To verify identity, maintain security, prevent fraud, and comply with
                  laws.
                </li>
                <li>
                  To analyze and improve our website, services, and communications.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">
                3. SMS/MMS Program &amp; Your Consent
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                By providing your mobile number and consenting (online, in person, or
                by phone), you agree to receive SMS/MMS from The Drip Lounge regarding
                appointments, updates, and (if you opt in) promotions.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>Opt out: Reply STOP to cancel at any time.</li>
                <li>Help: Reply HELP for assistance.</li>
                <li>
                  Rates &amp; frequency: Message and data rates may apply. Message
                  frequency may vary.
                </li>
                <li>
                  Privacy assurance: We do not sell or share your mobile phone number or
                  personal information with third parties for marketing purposes.
                </li>
              </ul>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We may use trusted service providers (e.g., messaging platforms,
                carriers, scheduling systems) to deliver texts and manage consent
                records. These providers act on our behalf under contracts that limit
                how they use your data.
              </p>
              <p className="font-medium text-[#111111]">How We Share Information</p>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We share information only as needed to operate our services:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>
                  Service providers: messaging platforms, scheduling, payment, hosting,
                  analytics-under confidentiality and limited-use agreements.
                </li>
                <li>
                  Legal compliance &amp; safety: when required by law, or to protect the
                  rights, property, or safety of you, us, or others.
                </li>
              </ul>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                No mobile information will be shared with third
                parties/affiliates for marketing/promotional purposes. Information
                sharing to subcontractors in support services, such as customer service,
                is permitted. All other use case categories exclude text messaging
                originator opt-in data and consent; this information will not be shared
                with any third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">
                4. Cookies &amp; Tracking Technologies
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We use cookies and similar technologies to personalize your experience
                and understand how our website is used. You can control cookies through
                your browser settings. Some features may not work correctly if cookies
                are disabled.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">5. Security</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We implement reasonable administrative, technical, and physical
                safeguards to protect your information. No method of transmission or
                storage is 100% secure.
              </p>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                All the above categories exclude text messaging originator opt-in data
                and consent; this information will not be shared with any third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">6. Children&apos;s Privacy</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Our services are not directed to children under 13. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">
                7. Changes to This Policy
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We may update this policy from time to time. The Effective Date above
                reflects the latest version.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#111111]">8. Contact Us</h2>
              <div className="space-y-1 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <p>The Drip Lounge Holdings LLC</p>
                <p>5177 Route 9W, Newburgh NY 12550</p>
                <p>Email: info@nydriplounge.com</p>
                <p>Phone: 845-391-0338</p>
              </div>
            </section>
          </article>
        </section>

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <ServicesFooter />
          </div>
        </section>
      </main>
    </>
  );
}
