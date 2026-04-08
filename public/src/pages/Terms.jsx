import { useEffect } from "react";
import Footer from "../Components/Footer";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4ff]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-blue-100">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Agreement to Terms</h2>
              <p className="text-[#334155] leading-relaxed">
                By accessing and using the DDS Online website and services, you accept and agree to be bound by and abide by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Use License</h2>
              <p className="text-[#334155] leading-relaxed mb-4">Permission is granted to temporarily download one copy of the materials (information or software) on DDS Online's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                <li>Use automated systems (bots, scrapers) to access the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Disclaimer</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                The materials on DDS Online's website are provided on an 'as is' basis. DDS Online makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Service Terms</h2>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Booking & Payment</h3>
              <ul className="list-disc list-inside text-[#334155] space-y-2 mb-4">
                <li>All bookings must be confirmed through our website or app</li>
                <li>Payment must be completed before service commencement (except for "Pay After Service" option)</li>
                <li>We accept multiple payment methods including cards, UPI, and net banking</li>
                <li>All prices are in Indian Rupees (₹)</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Cancellation & Rescheduling</h3>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Cancellations made 24 hours before service: Full refund</li>
                <li>Cancellations made 12-24 hours before service: 50% refund</li>
                <li>Cancellations made within 12 hours: No refund</li>
                <li>Rescheduling is allowed up to 24 hours before the scheduled service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">5. User Responsibilities</h2>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Ensure property accessibility for service providers</li>
                <li>Not engage in abusive or harassing behavior</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Notify us immediately of any unauthorized account access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">6. Professional Quality</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                DDS Online commits to providing high-quality services through certified and vetted professionals. If you are unsatisfied with the service quality, please:
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Contact us within 24 hours of service completion</li>
                <li>Provide detailed feedback and photos if applicable</li>
                <li>Cooperate in resolution discussions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">7. Limitation of Liability</h2>
              <p className="text-[#334155] leading-relaxed">
                In no event shall DDS Online or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DDS Online's website, even if DDS Online or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">8. Accuracy of Materials</h2>
              <p className="text-[#334155] leading-relaxed">
                The materials appearing on DDS Online's website could include technical, typographical, or photographic errors. DDS Online does not warrant that any of the materials on its website are accurate, complete, or current. DDS Online may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">9. Links</h2>
              <p className="text-[#334155] leading-relaxed">
                DDS Online has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DDS Online of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">10. Modifications</h2>
              <p className="text-[#334155] leading-relaxed">
                DDS Online may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service. We will notify you of significant changes via email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">11. Contact Information</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
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
