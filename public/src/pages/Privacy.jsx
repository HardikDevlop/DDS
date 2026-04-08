import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4ff]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Introduction</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                DDS Online ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-[#334155] space-y-2 mb-4">
                <li>Name, email address, and phone number</li>
                <li>Residential address and service location details</li>
                <li>Payment information (credit/debit card details processed securely)</li>
                <li>Date of birth and identification details (when applicable)</li>
                <li>Service preferences and booking history</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on site</li>
                <li>Cookies and tracking technologies</li>
                <li>Location data (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Process and fulfill your service bookings and payments</li>
                <li>Send booking confirmations and service updates</li>
                <li>Provide customer support and resolve issues</li>
                <li>Personalize your experience and improve our services</li>
                <li>Send promotional emails and notifications (with opt-out option)</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Detect and prevent fraud</li>
                <li>Analyze user behavior to improve our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Data Security</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>PCI DSS compliant payment processing</li>
                <li>Secure password storage with hashing</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication protocols</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">5. Information Sharing</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Service professionals assigned to fulfill your bookings</li>
                <li>Payment processors and financial institutions</li>
                <li>Legal authorities when required by law</li>
                <li>Third-party service providers (hosting, analytics, customer support)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">6. Your Rights</h2>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to request deletion of your data</li>
                <li>Right to opt-out of marketing communications</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">7. Cookies</h2>
              <p className="text-[#334155] leading-relaxed">
                We use cookies to enhance your browsing experience, remember your preferences, and analyze site usage. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">8. Contact Us</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                For privacy-related inquiries, please contact us:
              </p>
              <div className="bg-[#f8faff] p-4 rounded-lg border border-[#dde5f4]">
                <p className="text-[#0f172a] font-semibold">Email:</p>
                <a href="mailto:admin@ddsonline.in" className="text-[#2563eb] hover:underline">admin@ddsonline.in</a>
                <p className="text-[#0f172a] font-semibold mt-3">Phone:</p>
                <a href="tel:+919098268872" className="text-[#2563eb] hover:underline">+91-9098268872</a>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
