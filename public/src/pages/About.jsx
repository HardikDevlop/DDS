import React, { useEffect, useRef } from "react";

const services = [
  { name: "AC Repair", description: "Expert AC servicing, gas filling, and installation by certified technicians.", icon: "❄️", color: "#0ea5e9" },
  { name: "Plumbing", description: "24/7 plumbing solutions for leaks, blockages, and installations.", icon: "🚰", color: "#06b6d4" },
  { name: "Electrical", description: "Safe wiring, fixture installation, and electrical repairs by licensed electricians.", icon: "💡", color: "#f59e0b" },
  { name: "TV Repair", description: "Professional diagnosis and repair for all TV brands and models.", icon: "📺", color: "#8b5cf6" },
  { name: "Painting", description: "Interior and exterior painting with premium quality materials.", icon: "🎨", color: "#ec4899" },
  { name: "Appliance Repair", description: "Fixing washing machines, refrigerators, and other home appliances.", icon: "🛠️", color: "#10b981" },
];

const steps = [
  { number: "01", title: "Book a Service", desc: "Select your service and preferred time slot through our app or website." },
  { number: "02", title: "Get Matched", desc: "We instantly connect you with the best available professional in your area." },
  { number: "03", title: "Professional Service", desc: "Our expert arrives on time with all necessary tools and parts." },
  { number: "04", title: "Job Done", desc: "Pay securely only after you're completely satisfied with the service." },
];

const differentiators = [
  { icon: "🏆", title: "Verified Professionals", desc: "Every provider is carefully vetted with background checks and at least 1 year of verified experience." },
  { icon: "⚡", title: "Quick Response", desc: "Average response under 30 minutes — most services completed the same day you book." },
  { icon: "💎", title: "Transparent Pricing", desc: "No hidden charges. Upfront pricing before any work begins, with a 100% satisfaction guarantee." },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM Sans:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .about-root {
    --bg: #f0f4ff;
    --bg-2: #ffffff;
    --blue: #2563eb;
    --blue-light: #3b82f6;
    --blue-pale: #eff4ff;
    --cyan: #06b6d4;
    --text: #0f172a;
    --muted: #64748b;
    --border: #dde5f4;
    --card-bg: #ffffff;
    --shadow: rgba(37, 99, 235, 0.10);
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 68vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1.5rem 5rem;
    overflow: hidden;
    background: linear-gradient(160deg, #e8f0fe 0%, #f0f4ff 50%, #e0f2fe 100%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.22;
    pointer-events: none;
  }
  .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #3b82f6, transparent); top: -180px; left: -160px; }
  .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #06b6d4, transparent); bottom: -120px; right: -120px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(37,99,235,0.08);
    border: 1px solid rgba(37,99,235,0.25);
    color: #2563eb;
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 6px 16px; border-radius: 999px;
    margin-bottom: 2rem;
    animation: fadeUp 0.6s ease both;
  }
  .hero-badge span { width: 6px; height: 6px; background: #2563eb; border-radius: 50%; animation: pulse 1.8s ease-in-out infinite; }
  .hero-title {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(2.8rem, 7vw, 6rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: #0f172a;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .hero-title .accent {
    background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hero-desc {
    max-width: 640px;
    font-size: 1.1rem; line-height: 1.75; font-weight: 400;
    color: #475569;
    margin-bottom: 1.2rem;
    animation: fadeUp 0.7s 0.2s ease both;
  }
  .hero-tagline {
    font-size: 0.95rem; color: #94a3b8; font-style: italic;
    animation: fadeUp 0.7s 0.3s ease both;
  }
  .hero-tagline strong { color: #64748b; }
  .hero-scroll {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: #94a3b8; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    animation: fadeUp 1s 0.6s ease both;
  }
  .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, #2563eb, transparent); animation: scrollPulse 2s ease-in-out infinite; }

  /* ── SECTION WRAPPER ── */
  .section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 5rem 1.5rem;
  }
  .section-label {
    font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: #2563eb; font-weight: 700; margin-bottom: 0.75rem;
  }
  .section-title {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700; letter-spacing: -0.02em;
    color: #0f172a;
    margin-bottom: 0.75rem;
  }
  .section-sub {
    color: var(--muted); font-size: 1rem; font-weight: 400; max-width: 520px;
    line-height: 1.7; margin-bottom: 3.5rem;
  }

  /* ── DIFFERENTIATORS ── */
  .diff-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1px;
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    background: var(--border);
    box-shadow: 0 4px 24px var(--shadow);
  }
  .diff-card {
    background: var(--bg-2);
    padding: 2.5rem 2rem;
    transition: background 0.3s ease;
  }
  .diff-card:hover { background: var(--blue-pale); }
  .diff-icon {
    font-size: 2rem; margin-bottom: 1.25rem;
    display: inline-flex; align-items: center; justify-content: center;
    width: 56px; height: 56px;
    background: #eff4ff; border: 1px solid #c7d7fc;
    border-radius: 14px;
  }
  .diff-card h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem; font-weight: 700; margin-bottom: 0.6rem; color: #0f172a;
  }
  .diff-card p { color: var(--muted); font-size: 0.9rem; line-height: 1.65; }

  /* ── SERVICES ── */
  .services-bg {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }
  .service-card {
    position: relative;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem 1.75rem;
    cursor: default;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s, background 0.3s;
  }
  .service-card::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--card-accent, transparent);
    opacity: 0;
    transition: opacity 0.35s ease;
    border-radius: inherit;
  }
  .service-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(37,99,235,0.12); background: var(--bg-2); }
  .service-card:hover::before { opacity: 0.04; }
  .service-card:hover { border-color: var(--card-color, #3b82f6); }
  .service-icon {
    font-size: 1.8rem;
    width: 52px; height: 52px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--bg-2);
    margin-bottom: 1.25rem;
  }
  .service-card h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; color: #0f172a;
  }
  .service-card p { color: var(--muted); font-size: 0.88rem; line-height: 1.6; }
  .service-card .tag {
    position: absolute; top: 1.25rem; right: 1.25rem;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--card-color, #3b82f6);
    box-shadow: 0 0 6px var(--card-color, #3b82f6);
  }

  /* ── HOW IT WORKS ── */
  .steps-track {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0;
    position: relative;
  }
  .steps-track::before {
    content: '';
    position: absolute;
    top: 28px; left: 10%; width: 80%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(37,99,235,0.35), transparent);
  }
  .step {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: 0 1.5rem;
    position: relative;
  }
  .step-num {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em;
    color: #2563eb;
    width: 56px; height: 56px;
    border: 1.5px solid #bcd0fa;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #eff4ff;
    margin-bottom: 1.5rem;
    position: relative; z-index: 1;
    transition: background 0.3s, box-shadow 0.3s;
  }
  .step:hover .step-num { background: #dbeafe; box-shadow: 0 0 20px rgba(37,99,235,0.2); }
  .step h3 { font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: #0f172a; }
  .step p { color: var(--muted); font-size: 0.85rem; line-height: 1.6; }

  /* ── FOOTER CTA ── */
  .cta-strip {
    margin: 0 1.5rem 5rem;
    border-radius: 24px;
    background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
    padding: 4rem 3rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(37,99,235,0.3);
  }
  .cta-strip::before {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 300px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  }
  .cta-strip h2 {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 800; letter-spacing: -0.02em;
    color: #fff;
    margin-bottom: 0.75rem;
  }
  .cta-strip p { color: rgba(255,255,255,0.8); margin-bottom: 2rem; font-size: 1rem; }
  .cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #fff;
    color: #2563eb;
    padding: 0.85rem 2.25rem;
    border-radius: 999px;
    border: none;
    font-size: 0.95rem; font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  }
  .cta-btn:hover { opacity: 0.95; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }

  /* ── DIVIDER ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 0 1.5rem;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(0.8); }
    50%       { opacity: 1; transform: scaleY(1); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .steps-track::before { display: none; }
    .step { padding: 1.25rem 0.5rem; }
    .cta-strip { padding: 2.5rem 1.5rem; margin: 0 0.75rem 3rem; }
    .diff-grid { border-radius: 14px; }
  }
`;

const About = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "fadeUp 0.65s ease both";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const els = rootRef.current?.querySelectorAll(".observe") || [];
    els.forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-root" ref={rootRef}>
      <style>{styles}</style>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />

        <div className="hero-badge">
          <span /> Trusted IT & Home Services
        </div>
        <h1 className="hero-title">
          Empower Your<br /><span className="accent">Digital Future</span>
        </h1>
        <p className="hero-desc">
          DDS Online delivers reliable IT & network solutions — IP camera installation,
          networking, manpower, operations & maintenance — backed by years of field expertise.
        </p>
        <p className="hero-tagline">
          Your trusted partner for all <strong>IT, network, and home service</strong> needs.
        </p>

        <div className="hero-scroll">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <div className="section">
        <div className="observe">
          <p className="section-label">Our Edge</p>
          <h2 className="section-title">What Makes Us Different</h2>
          <p className="section-sub">We set a higher bar — not just for quality, but for speed, trust, and value.</p>
        </div>
        <div className="diff-grid observe">
          {differentiators.map((d, i) => (
            <div className="diff-card" key={i}>
              <div className="diff-icon">{d.icon}</div>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* ── SERVICES ── */}
      <div className="services-bg">
        <div className="section">
          <div className="observe">
            <p className="section-label">What We Do</p>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">From tech infrastructure to home repairs — one platform, every solution.</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div
                className="service-card observe"
                key={i}
                style={{
                  "--card-color": s.color,
                  "--card-accent": s.color,
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                <div className="tag" />
                <div className="service-icon">{s.icon}</div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── HOW IT WORKS ── */}
      <div className="section">
        <div className="observe" style={{ textAlign: "center" }}>
          <p className="section-label">The Process</p>
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub" style={{ margin: "0 auto 3.5rem" }}>
            Booking expert help has never been simpler. Four steps, zero hassle.
          </p>
        </div>
        <div className="steps-track">
          {steps.map((s, i) => (
            <div className="step observe" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="step-num">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA STRIP ── */}
      <div className="cta-strip observe">
        <h2>Ready to get started?</h2>
        <p>Book your first service today and experience the DDS Online difference.</p>
        <a className="cta-btn" href="#">
          Book a Service →
        </a>
      </div>
    </div>
  );
};

export default About;