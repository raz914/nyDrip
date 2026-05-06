import { ServicesFooter, ServicesHeader } from "@/components/services/sections";

export const metadata = {
  title: "Terms and Conditions | DripLounge",
  description:
    "Review DripLounge terms and conditions governing services, bookings, and website usage.",
};

export default function Page() {
  return (
    <>
      <ServicesHeader />
      <main className="bg-white text-[#111111]">
        <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-24">
          <article className="mx-auto max-w-[948px] space-y-8">
            <h1 className="text-[2.25rem] font-medium leading-tight md:text-[3.25rem]">
              Terms and Conditions
            </h1>
            <div className="space-y-3 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
              <p>Last updated: 3/4/2026</p>
              <p>
                These Terms and Conditions (&quot;Terms&quot;) govern your use of
                services provided by The Drip Lounge Holdings LLC
                (&quot;NY Drip Lounge,&quot; &quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;), including our website located at
                www.nydriplounge.com (&quot;Site&quot;), our wellness services, and our
                SMS and email communications programs. By accessing our Site, booking
                appointments, receiving services, or opting into communications, you
                agree to these Terms and our{" "}
                <a
                  href="http://www.nydriplounge.com/privacy-policy/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">1. Services Provided — No Medical Advice</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                The Drip Lounge Holdings LLC provides IV therapy, vitamin injections,
                and wellness services administered by licensed healthcare professionals.
                Information provided through our Site, communications, or services is
                for educational and wellness purposes only and does not constitute
                medical advice, diagnosis, or treatment. Our services are not a
                substitute for primary medical care. Always consult your physician
                regarding medical conditions, medications, or concerns. If you are
                experiencing a medical emergency, call 911 immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">2. Eligibility for Services</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                You must be at least 18 years old to receive services. By booking or
                receiving treatment, you agree to provide accurate and complete medical
                history information, including medications, allergies, and health
                conditions. The Drip Lounge Holdings LLC reserves the right to refuse or
                discontinue services if treatment is deemed unsafe or medically
                inappropriate.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">3. Risks of Services</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                By receiving IV therapy or injections, you acknowledge and accept
                potential risks, including but not limited to discomfort, bruising,
                infection at the injection site, allergic reactions, dizziness,
                fainting, or other side effects. Results vary between individuals, and
                no guarantees are made regarding effectiveness or outcomes. Participation
                in services is voluntary and at your own risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">
                4. Payments, Cancellations, and Refunds
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Payment is required at the time of booking or treatment. All sales are
                final once services are rendered. Appointments canceled at least 24
                hours in advance may receive a credit toward future services, subject to
                clinic policy. Services are not billed to or reimbursed by insurance
                providers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">5. Privacy Practices</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Your personal information, including health information where
                applicable, is handled in accordance with our Privacy Policy. By using
                our services, you consent to the collection and use of your information
                as described therein.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">6. Program Description</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                The Drip Lounge Holdings LLC may send SMS and email messages to users
                who opt in. Messages may include appointment confirmations and reminders,
                service updates, follow-up communications, wellness information, and
                promotional offers. Message frequency may vary.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">7. Consent to Receive Messages</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                By providing your phone number and opting in through our website,
                booking forms, intake forms, or other enrollment methods, you authorize
                The Drip Lounge Holdings LLC to send text messages to your mobile
                number. Consent to receive messages is not a condition of purchase or
                receiving services. By opting in, you acknowledge that messages may be
                sent using automated technology and that consent applies specifically to
                communications related to our services, appointments, and promotions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">8. Opt Out</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                You may cancel SMS communications at any time by replying STOP to any
                message received from us. After sending STOP, you will receive a
                confirmation message and will no longer receive SMS communications unless
                you opt in again.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">9. Opt In Again</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                If you wish to rejoin after opting out, you may opt in again using the
                original enrollment method or by contacting us directly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">10. Help and Support</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                For assistance, reply HELP to any message or contact us directly at:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <li>Email: nydriplounge@gmail.com</li>
                <li>Phone: (845) 391-0338</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">11. Message Frequency and Rates</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Message frequency varies. Message and data rates may apply for messages
                sent to or received from The Drip Lounge Holdings LLC. Please contact
                your wireless carrier for details regarding your messaging or data plan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">12. Carrier Disclaimer</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Wireless carriers are not liable for delayed or undelivered messages.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">13. Site Access and Restrictions</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                You agree not to use the Site for unlawful purposes, attempt
                unauthorized access to systems or data, or copy, modify, or distribute
                Site content without written permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">14. Intellectual Property</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                All content on this Site, including logos, graphics, text, and images,
                is owned by The Drip Lounge Holdings LLC or its licensors and may not be
                reproduced or used without prior written consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">15. Disclaimer of Warranties</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Our Site and Services are provided &quot;as is&quot; without warranties
                of any kind. We make no guarantees regarding results, outcomes, or
                accuracy of information provided.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">16. Limitation of Liability</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                To the fullest extent permitted by law, The Drip Lounge Holdings LLC
                shall not be liable for any direct, indirect, incidental, consequential,
                or punitive damages arising from your use of our Site or Services. Your
                sole remedy is discontinuation of use.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">17. Indemnification</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                You agree to indemnify and hold harmless The Drip Lounge Holdings LLC,
                its employees, contractors, and affiliates from any claims, damages, or
                expenses arising from your use of our Services or violation of these
                Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">
                18. Dispute Resolution; Arbitration Agreement
              </h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                Any dispute arising out of or relating to these Terms or your use of our
                Services shall be resolved by binding arbitration in New York County,
                New York, in accordance with the rules of the American Arbitration
                Association. You waive the right to a jury trial or class action.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">19. Force Majeure</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                The Drip Lounge Holdings LLC is not liable for delays or failures caused
                by events beyond our reasonable control, including natural disasters,
                pandemics, power outages, or government actions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">20. Changes to Terms</h2>
              <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                We may update these Terms periodically. Updates will be posted with a
                revised Last Updated date. Continued use of our Site or Services
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium">21. Contact Information</h2>
              <div className="space-y-1 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                <p>The Drip Lounge Holdings LLC</p>
                <p>New York, NY</p>
                <p>Email: nydriplounge@gmail.com</p>
                <p>Phone: 845-381-0338</p>
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
