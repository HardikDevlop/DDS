// Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#dde5f4] bg-white w-full font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-8 py-12 md:py-14 lg:py-16">
        {/* Responsive Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl md:text-[22px] font-extrabold tracking-tight text-[#0f172a]">
                DDS
              </span>
              <span className="text-2xl md:text-[22px] font-extrabold tracking-tight text-[#2563eb]">
                Online
              </span>
            </div>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-xs md:max-w-sm">
              Premium services, delivered with trust.
              <br />
              Quality professionals, when you need them.
              <br />
              Reliable services, simplified.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1CR5TXcwDn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#dde5f4] bg-[#f0f4ff] text-[#64748b] hover:bg-[#eff4ff] hover:text-[#2563eb] hover:border-blue-200 transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@ddscoachingclasses8582"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#dde5f4] bg-[#f0f4ff] text-[#64748b] hover:bg-[#eff4ff] hover:text-[#2563eb] hover:border-blue-200 transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2s-.2-1.5-.9-2.2c-.9-.9-1.9-.9-2.4-1-3.2-.2-8.2-.2-8.2-.2s-5 0-8.2.2c-.5.1-1.5.1-2.4 1-.7.7-.9 2.2-.9 2.2S0 8 0 9.8v1.6c0 1.8.2 3.6.2 3.6s.2 1.5.9 2.2c.9.9 2.1.9 2.6 1 1.9.2 8.2.2 8.2.2s5 0 8.2-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.2.9-2.2s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.5 14.8V8.5l6 3.2-6 3.1z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ddsonline.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#dde5f4] bg-[#f0f4ff] text-[#64748b] hover:bg-[#eff4ff] hover:text-[#2563eb] hover:border-blue-200 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .4 1.4.8.4.4.6.8.8 1.4.1.4.2 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.4 1-.8 1.4-.4.4-.8.6-1.4.8-.4.1-1 .2-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.4-1.4-.8-.4-.4-.6-.8-.8-1.4-.1-.4-.2-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.4-1 .8-1.4.4-.4.8-.6 1.4-.8.4-.1 1-.2 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0-2c-3.3 0-3.7 0-5 .1-1.3.1-2.2.3-3 .6-.8.3-1.5.8-2.1 1.4-.6.6-1.1 1.3-1.4 2.1-.3.8-.5 1.7-.6 3-.1 1.3-.1 1.7-.1 5s0 3.7.1 5c.1 1.3.3 2.2.6 3 .3.8.8 1.5 1.4 2.1.6.6 1.3 1.1 2.1 1.4.8.3 1.7.5 3 .6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.8 2.1-1.4.6-.6 1.1-1.3 1.4-2.1.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.2-.6-3-.3-.8-.8-1.5-1.4-2.1-.6-.6-1.3-1.1-2.1-1.4-.8-.3-1.7-.5-3-.6-1.3-.1-1.7-.1-5-.1z" />
                  <circle cx="12" cy="12" r="3.5" />
                  <path d="M18 6.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-3 h-3 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#0f172a] m-0">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 block py-0.5"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 block py-0.5"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 block py-0.5"
                >
                  Blog
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-3 h-3 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h4 className="text-[11px] font-bold tracking-wider uppercase text-[#0f172a] m-0">
                Support
              </h4>
            </div>
            <ul className="space-y-1.5 mb-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 block py-0.5"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 block py-0.5"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 block py-0.5"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="flex flex-col gap-2 mt-3 pt-1">
              <a
                href="tel:+919098268872"
                className="flex items-center gap-2.5 text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 group"
              >
                <svg className="w-3.5 h-3.5 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="break-all">+91-9098268872</span>
              </a>
              <a
                href="mailto:admin@ddsonline.in"
                className="flex items-center gap-2.5 text-sm text-[#64748b] hover:text-[#2563eb] transition-colors duration-200 group"
              >
                <svg className="w-3.5 h-3.5 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">admin@ddsonline.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#dde5f4] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <span>{new Date().getFullYear()} DDS Online</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}