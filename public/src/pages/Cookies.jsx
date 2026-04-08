import { useEffect } from "react";
import Footer from "../Components/Footer";

export default function Cookies() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4ff]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-blue-100">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. What Are Cookies?</h2>
              <p className="text-[#334155] leading-relaxed">
                Cookies are small files that are stored on your device (computer, smartphone, tablet) when you visit our website. They contain data about your browsing behavior and preferences. Cookies help us provide a better user experience and improve our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Essential Cookies</h3>
              <p className="text-[#334155] leading-relaxed mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2 mb-6">
                <li>Session management cookies</li>
                <li>Authentication tokens</li>
                <li>CSRF protection tokens</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Performance Cookies</h3>
              <p className="text-[#334155] leading-relaxed mb-4">
                These cookies collect information about how you use our website, such as which pages you visit most often and any error messages you receive.
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2 mb-6">
                <li>Google Analytics cookies</li>
                <li>Page load time tracking</li>
                <li>User interaction metrics</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Functional Cookies</h3>
              <p className="text-[#334155] leading-relaxed mb-4">
                These cookies allow the website to remember choices you make to provide enhanced, more personalized features.
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2 mb-6">
                <li>Language preference cookies</li>
                <li>Theme preference cookies</li>
                <li>Location preference cookies</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Targeting/Advertising Cookies</h3>
              <p className="text-[#334155] leading-relaxed mb-4">
                These cookies track your activity across our website and partner websites to display relevant advertisements.
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Retargeting cookies</li>
                <li>Interest-based advertising cookies</li>
                <li>Third-party advertising network cookies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Detailed Cookie Information</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8faff] border border-[#dde5f4]">
                      <th className="p-3 text-left text-sm font-semibold text-[#0f172a]">Cookie Name</th>
                      <th className="p-3 text-left text-sm font-semibold text-[#0f172a]">Type</th>
                      <th className="p-3 text-left text-sm font-semibold text-[#0f172a]">Purpose</th>
                      <th className="p-3 text-left text-sm font-semibold text-[#0f172a]">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-[#dde5f4]">
                      <td className="p-3 text-sm text-[#334155]">session_id</td>
                      <td className="p-3 text-sm text-[#334155]">Essential</td>
                      <td className="p-3 text-sm text-[#334155]">User session management</td>
                      <td className="p-3 text-sm text-[#334155]">Session</td>
                    </tr>
                    <tr className="border border-[#dde5f4] bg-[#f8faff]">
                      <td className="p-3 text-sm text-[#334155]">_ga</td>
                      <td className="p-3 text-sm text-[#334155]">Performance</td>
                      <td className="p-3 text-sm text-[#334155]">Google Analytics tracking</td>
                      <td className="p-3 text-sm text-[#334155]">2 years</td>
                    </tr>
                    <tr className="border border-[#dde5f4]">
                      <td className="p-3 text-sm text-[#334155]">theme_preference</td>
                      <td className="p-3 text-sm text-[#334155]">Functional</td>
                      <td className="p-3 text-sm text-[#334155]">Remembers theme choice</td>
                      <td className="p-3 text-sm text-[#334155]">1 year</td>
                    </tr>
                    <tr className="border border-[#dde5f4] bg-[#f8faff]">
                      <td className="p-3 text-sm text-[#334155]">user_preferences</td>
                      <td className="p-3 text-sm text-[#334155]">Functional</td>
                      <td className="p-3 text-sm text-[#334155]">Stores user preferences</td>
                      <td className="p-3 text-sm text-[#334155]">6 months</td>
                    </tr>
                    <tr className="border border-[#dde5f4]">
                      <td className="p-3 text-sm text-[#334155]">gid</td>
                      <td className="p-3 text-sm text-[#334155]">Performance</td>
                      <td className="p-3 text-sm text-[#334155]">Google Analytics ID</td>
                      <td className="p-3 text-sm text-[#334155]">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Third-Party Cookies</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                We work with third-party partners who may also set cookies on your device:
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking</li>
                <li><strong>Razorpay:</strong> For secure payment processing</li>
                <li><strong>Facebook Pixel:</strong> For conversion tracking and advertising</li>
                <li><strong>Service providers:</strong> For booking and customer support functionalities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">5. How to Control Cookies</h2>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Browser Settings</h3>
              <p className="text-[#334155] leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most modern browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2 mb-6">
                <li>Block all cookies</li>
                <li>Allow only certain cookies</li>
                <li>Delete cookies automatically when closing the browser</li>
                <li>Clear cookie history</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Browser Instructions</h3>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
                <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                <li>Safari: Preferences → Privacy → Cookies and website data</li>
                <li>Edge: Settings → Privacy → Cookies and other site permissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                Disabling cookies may affect your experience on our website:
              </p>
              <ul className="list-disc list-inside text-[#334155] space-y-2">
                <li>You may not be able to log in to your account</li>
                <li>Your preferences will not be saved</li>
                <li>Some features may not work properly</li>
                <li>Website performance may be affected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">7. Do Not Track (DNT)</h2>
              <p className="text-[#334155] leading-relaxed">
                Some browsers include Do Not Track (DNT) functionality. While we respect your privacy choices, we currently do not respond to DNT signals. However, you can control cookies through your browser settings as described above.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">8. Updates to Cookie Policy</h2>
              <p className="text-[#334155] leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or technology. We will notify you of material changes by updating the "Last updated" date and posting the revised policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">9. Contact Us</h2>
              <p className="text-[#334155] leading-relaxed mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-[#f8faff] p-4 rounded-lg border border-[#dde5f4]">
                <p className="text-[#0f172a] font-semibold">Email:</p>
                <a href="mailto:admin@ddsonline.in" className="text-[#2563eb] hover:underline">admin@ddsonline.in</a>
                <p className="text-[#0f172a] font-semibold mt-3">Phone:</p>
                <a href="tel:+919098268872" className="text-[#2563eb] hover:underline">+91-9098268872</a>
                <p className="text-[#0f172a] font-semibold mt-3">Address:</p>
                <p className="text-[#334155]">DDS Online Service Platform</p>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
