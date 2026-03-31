import React, { useEffect, useState } from "react";

const T = {
  bg: "#f0f4ff", bgWhite: "#ffffff", bgSoft: "#f8faff",
  blue: "#2563eb", blueDark: "#1d4ed8", bluePale: "#eff4ff",
  text: "#0f172a", textMid: "#334155", muted: "#64748b",
  border: "#dde5f4", shadowSm: "rgba(0,0,0,0.05)", shadow: "rgba(37,99,235,0.08)",
  amber: "#f59e0b",
};

const CSS = `
  .blog-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh; color: ${T.text};
  }

  .blog-hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #0ea5e9 100%);
    padding: 56px 20px 44px; text-align: center; position: relative; overflow: hidden;
  }
  .blog-hero::before {
    content:''; position:absolute; inset:0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px; pointer-events: none;
  }
  .blog-search {
    width: 100%; max-width: 420px;
    border: none; border-radius: 10px; padding: 11px 16px;
    font-size: 14px; font-family: inherit; color: ${T.text};
    background: rgba(255,255,255,0.95); outline: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transition: box-shadow 0.2s;
  }
  .blog-search:focus { box-shadow: 0 4px 24px rgba(0,0,0,0.2); }

  .cat-pill {
    padding: 6px 16px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer;
    border: 1px solid ${T.border}; background: ${T.bgWhite}; color: ${T.textMid};
    transition: background 0.15s, color 0.15s, border-color 0.15s; white-space: nowrap;
  }
  .cat-pill.active { background: ${T.blue}; color: #fff; border-color: ${T.blue}; }
  .cat-pill:hover:not(.active) { border-color: ${T.blue}; color: ${T.blue}; }

  .blog-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border}; border-radius: 14px;
    overflow: hidden; box-shadow: 0 2px 10px ${T.shadowSm};
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .blog-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px ${T.shadow}; }
  .blog-card img { transition: transform 0.4s; }
  .blog-card:hover img { transform: scale(1.05); }

  .blog-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  @media(max-width:900px){ .blog-grid{ grid-template-columns: repeat(2,1fr); } }
  @media(max-width:540px){ .blog-grid{ grid-template-columns: 1fr; } }
`;

const dummyBlogs = [
  { _id: "1", name: "How to Clean Your Bathroom Efficiently", description: "Learn quick and effective bathroom cleaning techniques.", category: "Cleaning", rating: 4.5, images: ["/img/plumbing3.avif"] },
  { _id: "2", name: "Top 5 Plumbing Tips for Beginners", description: "Simple fixes for common plumbing problems.", category: "Plumbing", rating: 4.2, images: ["/img/leakagefix.jpg"] },
  { _id: "3", name: "DIY Electrical Repairs at Home", description: "Safety first! Basic electrical fixes you can do yourself.", category: "Electrical", rating: 4.7, images: ["/img/electrician org.jpg"] },
  { _id: "4", name: "Home Cleaning Checklist", description: "Your ultimate guide to a spotless home.", category: "Cleaning", rating: 4.6, images: ["/img/cleaninggg.jpg"] },
  { _id: "5", name: "Essential Repair Tools You Need", description: "Tools that every homeowner should have.", category: "Repairs", rating: 4.3, images: ["/img/slide1.jpg"] },
  { _id: "6", name: "Tips for AC", description: "Keep your pipes in top shape with these tips.", category: "Tips", rating: 4.4, images: ["/img/slide2.jpg"] },
];

const CATS = ["All", "Cleaning", "Repairs", "Tips", "Plumbing", "Electrical"];

export default function Blog() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    const filtered = cat === "All" ? dummyBlogs : dummyBlogs.filter(b => b.category === cat);
    setFilteredProducts(filtered);
  };

  useEffect(() => { setFilteredProducts(dummyBlogs); setLoading(false); }, []);

  const displayed = filteredProducts.filter(b =>
    !search.trim() || b.name.toLowerCase().includes(search.trim().toLowerCase()) || b.description.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="blog-root">
      <style>{CSS}</style>

      {/* Hero */}
      <section className="blog-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: 14 }}>
            Resources & Insights
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>
            Our Latest Blogs
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", marginBottom: 22, fontWeight: 300 }}>
            Explore insights, tips, and trends in home services
          </p>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search blogs…" className="blog-search"
          />
        </div>
      </section>

      {/* Category filters */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATS.map(cat => (
            <span key={cat} className={`cat-pill${selectedCategory === cat ? " active" : ""}`} onClick={() => handleCategoryClick(cat)}>{cat}</span>
          ))}
        </div>
      </div>

      {/* Blog cards */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 56px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Popular Blogs</h2>
          <p style={{ fontSize: 13, color: T.muted }}>{displayed.length} article{displayed.length !== 1 ? "s" : ""}</p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: T.muted, fontSize: 14 }}>Loading blogs…</p>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", background: T.bgWhite, border: `1px solid ${T.border}`, borderRadius: 14 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>No blogs found</p>
            <p style={{ fontSize: 13, color: T.muted }}>Try a different search or category.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {displayed.map(post => (
              <div className="blog-card" key={post._id}>
                <div style={{ overflow: "hidden", height: 170 }}>
                  <img src={post.images?.[0] || "/default.jpg"} alt={post.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "16px 18px 18px" }}>
                  <div style={{ display: "inline-block", background: T.bluePale, color: T.blue, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 8px", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{post.category}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.4, marginBottom: 6 }}>{post.name}</h3>
                  <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, marginBottom: 10 }}>{post.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.amber, fontWeight: 700 }}>
                    {"★".repeat(Math.round(post.rating))}
                    <span style={{ color: T.muted, fontWeight: 400, marginLeft: 2 }}>{post.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}