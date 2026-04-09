import recipeLogo from "../../assets/images/recipe remix.jpg";

const STYLES = [
  "⚡ Quick & Easy", "🥗 Healthy", "🍲 Comfort Food", "🌍 International",
  "💪 High Protein", "🥦 Low Carb", "🌱 Vegetarian", "🌿 Vegan",
  "📦 Meal Prep", "💰 Budget-Friendly"
];

const FEATURES = [
  { icon: "📷", title: "Photo Recognition", desc: "Snap a photo of your fridge or pantry and AI will identify your ingredients automatically." },
  { icon: "⌨️", title: "Type It In", desc: "Prefer to type? Just list your ingredients and get recipe suggestions instantly." },
  { icon: "🎛️", title: "Style Filters", desc: "Filter by quick & easy, healthy, comfort food, high protein, vegan, and more." },
  { icon: "⏱️", title: "Time & Calories", desc: "Every recipe comes with an estimated cook time and calorie count upfront." },
  { icon: "🍽️", title: "3 Recipes at Once", desc: "Get three distinct recipe ideas every time so you always have options to choose from." },
  { icon: "📋", title: "Step-by-Step", desc: "Clear ingredient lists and easy-to-follow cooking steps for every recipe." },
];

const STEPS = [
  { title: "Add your ingredients", desc: "Upload a photo of your fridge or pantry, type in what you have, or do both for the best results." },
  { title: "Choose your style", desc: "Select one or more recipe styles — quick & easy, healthy, comfort food, international, and more." },
  { title: "Get your recipes", desc: "Hit Remix and instantly receive three tailored recipes complete with ingredients, steps, time, and calories." },
];

export default function Aboutme() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f9fafb", color: "#1a1a1a", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #08406f, #0a5491, #0d6aad)", padding: "64px 24px", textAlign: "center", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><img src={recipeLogo} alt="Recipe Remix" style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 20 }} /></div>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Recipe Remix</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
          Turn whatever's in your fridge into something delicious — powered by AI.
        </p>
        <span style={{ display: "inline-block", marginTop: 20, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
          ✨ Powered by Claude AI
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px" }}>

        {/* About */}
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#00a2e9", marginBottom: 10 }}>About</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 14, color: "#111" }}>Cook smarter, not harder.</div>
        <p style={{ fontSize: 16, color: "#555", lineHeight: 1.8, maxWidth: 640 }}>
          Recipe Remix is an AI-powered cooking assistant that looks at what ingredients you already have and suggests creative, practical recipes tailored to your preferences. No more staring blankly at a full fridge wondering what to make — just snap a photo or type in what you've got, and let the magic happen.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "48px 0" }} />

        {/* Features */}
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#00a2e9", marginBottom: 10 }}>Features</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 14, color: "#111" }}>Everything you need to get cooking.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 28 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "24px 20px" }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: "#111" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "48px 0" }} />

        {/* How it works */}
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#00a2e9", marginBottom: 10 }}>How It Works</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 14, color: "#111" }}>Three steps to your next meal.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: "50%", background: "linear-gradient(135deg, #08406f, #0e6cb5, #1a90e0)", color: "white", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#111" }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "48px 0" }} />

        {/* Recipe Styles */}
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#00a2e9", marginBottom: 10 }}>Recipe Styles</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 14, color: "#111" }}>Cook your way.</div>
        <p style={{ fontSize: 16, color: "#555", lineHeight: 1.8, maxWidth: 640 }}>Mix and match styles to find recipes that fit your mood, diet, and schedule.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
          {STYLES.map(s => (
            <span key={s} style={{ padding: "6px 14px", borderRadius: 20, background: "#dcf4ff", border: "1.5px solid #00a2e9", color: "#00a2e9", fontSize: 13, fontWeight: 500 }}>{s}</span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #08406f, #0a5491, #0d6aad)", borderRadius: 16, padding: "40px 32px", textAlign: "center", color: "white", marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Ready to remix your ingredients?</h2>
          <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 22 }}>Stop wondering what's for dinner. Let AI do the thinking.</p>
          <a href="/recipe" style={{ display: "inline-flex", alignItems: "center", background: "white", color: "#08406f", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            <img src={recipeLogo} alt="" style={{ width: 20, height: 20, objectFit: "contain", marginRight: 6, verticalAlign: "middle" }} /> Try Recipe Remix
          </a>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: 24, fontSize: 13, color: "#aaa" }}>
        Built with ❤️ and Claude AI
      </footer>
    </div>
  );
}