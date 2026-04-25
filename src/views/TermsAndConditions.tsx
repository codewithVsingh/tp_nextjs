"use client";

import { Helmet } from "react-helmet-async";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Tutors Parliament</title>
        <meta name="description" content="Read the terms and conditions for using Tutors Parliament's home tuition and online tutoring services across Delhi NCR." />
      </Helmet>
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground mb-6">
            Last updated: April 14, 2026
          </p>

          <div className="space-y-8 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using the Tutors Parliament website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Services Overview</h2>
              <p>Tutors Parliament is a tutor marketplace platform that connects students and parents with qualified home tutors and online tutors across Delhi NCR. We facilitate the discovery, booking, and management of tuition services but do not directly provide teaching services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Eligibility</h2>
              <p>You must be at least 18 years of age to register as a tutor or book services independently. Parents or legal guardians may register and book services on behalf of minors. By using our services, you represent that the information you provide is accurate and complete.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Account Registration</h2>
              <p>To access certain features, you may be required to provide personal information including your name, contact details, and educational requirements. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Tutor & Student Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Students/Parents:</strong> Must provide accurate information about academic requirements, schedule preferences, and location. Cancellations should be communicated at least 24 hours in advance.</li>
                <li><strong>Tutors:</strong> Must provide accurate qualifications, maintain professionalism, adhere to scheduled sessions, and comply with all applicable laws regarding teaching and child safety.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Fees & Payments</h2>
              <p>Tuition fees are determined based on the subject, class level, location, and tutor experience. All fees are communicated transparently before booking. Tutors Parliament may charge a service fee for facilitating the connection. Payment terms and refund policies will be communicated at the time of booking.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Demo Classes</h2>
              <p>We offer free demo classes to help students and parents evaluate tutors before committing. Demo classes are subject to tutor availability and are limited to one per subject per student.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cancellation & Refund Policy</h2>
              <p>Cancellations made at least 24 hours before a scheduled session are eligible for rescheduling at no additional cost. Refund requests are evaluated on a case-by-case basis. Tutors Parliament reserves the right to determine refund eligibility based on the circumstances.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Intellectual Property</h2>
              <p>All content on the Tutors Parliament website—including text, graphics, logos, and software—is the property of Tutors Parliament and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Privacy & Data Protection</h2>
              <p>Your use of our services is also governed by our Privacy Policy. We collect and process personal data solely for the purpose of delivering our services. We do not sell or share your personal information with third parties except as required to provide our services or comply with legal obligations.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Prohibited Conduct</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Using the platform for any unlawful purpose</li>
                <li>Providing false or misleading information</li>
                <li>Harassing, abusing, or threatening other users</li>
                <li>Attempting to bypass the platform to avoid service fees</li>
                <li>Scraping, copying, or redistributing platform content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Limitation of Liability</h2>
              <p>Tutors Parliament acts as a facilitator and is not liable for the quality of teaching, academic outcomes, or any disputes between tutors and students/parents. We make no guarantees regarding specific academic results. Our liability is limited to the fees paid to Tutors Parliament for the specific service in question.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Termination</h2>
              <p>We reserve the right to suspend or terminate any user's access to the platform for violations of these terms, inappropriate behavior, or any activity that compromises the safety or integrity of our community.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Changes to Terms</h2>
              <p>Tutors Parliament reserves the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated revision date. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Governing Law</h2>
              <p>These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">16. Contact Us</h2>
              <p>If you have any questions about these Terms & Conditions, please contact us:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Email: support@tutorsparliament.com</li>
                <li>Phone: +91-XXXXXXXXXX</li>
                <li>Address: Delhi NCR, India</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
    </>
  );
};

export default TermsAndConditions;

