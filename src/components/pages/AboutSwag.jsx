import logo from "../../assets/images/ttlogosmall.jpeg"
export default function SwagInventoryAbout() {
  const features = [
    {
      icon: "➕",
      title: "Add Items Instantly",
      desc: "Quickly add swag items with a name, size or variant, quantity, and a custom icon.",
    },
    {
      icon: "✏️",
      title: "Edit & Delete",
      desc: "Update any item's details or remove it from your inventory with a single click.",
    },
    {
      icon: "⚡",
      title: "Quick Quantity Adjust",
      desc: "Use the + and − buttons to update stock levels on the fly without opening an edit form.",
    },
    {
      icon: "⚠️",
      title: "Low Stock Alerts",
      desc: "Items at 5 units or below are automatically flagged so you never run out unexpectedly.",
    },
    {
      icon: "🔍",
      title: "Search & Filter",
      desc: "Instantly find any item by name or variant, and filter down to only low stock items.",
    },
    {
      icon: "💾",
      title: "Persistent Storage",
      desc: "All inventory data is saved to Supabase so nothing is lost between sessions.",
    },
  ];
  const ingestMethods = [
    {
      icon: "📁",
      title: "CSV Upload",
      desc: "Drag and drop or browse for a .csv file with name, variant, and quantity columns.",
    },
    {
      icon: "📋",
      title: "Paste from Excel",
      desc: "Copy rows directly from Excel or Google Sheets and paste them straight into the app.",
    },
    {
      icon: "📷",
      title: "AI Photo Analysis",
      desc: "Upload a photo of your swag and Claude AI will automatically detect items and quantities.",
    },
  ];
  const steps = [
    {
      title: "Add your swag",
      desc: "Manually add items one by one, import from a CSV, paste from a spreadsheet, or snap a photo.",
    },
    {
      title: "Track your stock",
      desc: "Use the + and − buttons to keep quantities up to date as items are handed out or restocked.",
    },
    {
      title: "Stay on top of inventory",
      desc: "Get instant low stock alerts and export your full inventory to CSV whenever you need it.",
    },
  ];
  const s = {
    hero: {
      background: "linear-gradient(135deg, #005f8e, #00a2e9, #5dd0ff)",
      padding: "64px 24px",
      textAlign: "center",
      color: "white",
    },
    badge: {
      display: "inline-block",
      marginTop: 20,
      background: "rgba(255,255,255,0.2)",
      border: "1px solid rgba(255,255,255,0.4)",
      color: "white",
      padding: "6px 16px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 500,
    },
    container: { maxWidth: 860, margin: "0 auto", padding: "56px 24px" },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: "#00a2e9",
      marginBottom: 10,
    },
    sectionHeading: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 14,
      color: "#111",
    },
    sectionBody: {
      fontSize: 16,
      color: "#555",
      lineHeight: 1.8,
      maxWidth: 640,
    },
    divider: {
      border: "none",
      borderTop: "1px solid #e5e7eb",
      margin: "48px 0",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 20,
      marginTop: 28,
    },
    ingestGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 20,
      marginTop: 24,
    },
    featureCard: {
      background: "white",
      border: "1.5px solid #e5e7eb",
      borderRadius: 14,
      padding: "24px 20px",
    },
    ingestCard: {
      background: "#e8f7fd",
      border: "1.5px solid #b3e4f7",
      borderRadius: 14,
      padding: "24px 20px",
    },
    stepNumber: {
      width: 36,
      height: 36,
      minWidth: 36,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #005f8e, #00a2e9)",
      color: "white",
      fontWeight: 700,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cta: {
      background: "linear-gradient(135deg, #005f8e, #00a2e9)",
      borderRadius: 16,
      padding: "40px 32px",
      textAlign: "center",
      color: "white",
      marginTop: 48,
    },
    ctaBtn: {
      display: "inline-flex",
      alignItems: "center",
      background: "white",
      color: "#005f8e",
      padding: "12px 28px",
      borderRadius: 10,
      fontWeight: 700,
      fontSize: 15,
      textDecoration: "none",
    },
  };
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#f9fafb",
        color: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      {" "}
      {/* Hero */}{" "}
      <div style={s.hero}>
        {" "}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><img src={logo} alt="TT Logo" style={{ width: 72, height: 72, objectFit: "contain" }} /></div>{" "}
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 12,
          }}
        >
          Swag Tracker
        </h1>{" "}
        <p
          style={{
            fontSize: 18,
            opacity: 0.9,
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {" "}
          The simplest way to track, manage, and export your company swag — with
          AI-powered importing.{" "}
        </p>{" "}
        <span style={s.badge}>✨ Powered by Claude AI + Supabase</span>{" "}
      </div>{" "}
      <div style={s.container}>
        {" "}
        {/* About */} <p style={s.sectionTitle}>About</p>{" "}
        <h2 style={s.sectionHeading}>Your swag, always accounted for.</h2>{" "}
        <p style={s.sectionBody}>
          {" "}
          Swag Inventory is a lightweight, AI-enhanced stock management tool
          built for teams. Whether you're handing out branded t-shirts at events
          or restocking the office supply of hoodies, Swag Inventory keeps
          everything organised, visible, and up to date — with no spreadsheets
          required.{" "}
        </p>{" "}
        <hr style={s.divider} /> {/* Features */}{" "}
        <p style={s.sectionTitle}>Features</p>{" "}
        <h2 style={s.sectionHeading}>Everything you need to manage swag.</h2>{" "}
        <div style={s.grid}>
          {" "}
          {features.map((f, i) => (
            <div key={i} style={s.featureCard}>
              {" "}
              <div style={{ fontSize: 30, marginBottom: 12 }}>
                {f.icon}
              </div>{" "}
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                {f.title}
              </h3>{" "}
              <p
                style={{
                  fontSize: 13,
                  color: "#666",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <hr style={s.divider} /> {/* Import Methods */}{" "}
        <p style={s.sectionTitle}>Import Methods</p>{" "}
        <h2 style={s.sectionHeading}>Get your data in, your way.</h2>{" "}
        <p style={s.sectionBody}>
          Already have your inventory in a spreadsheet? No problem. Swag
          Inventory supports three flexible ways to import your existing data.
        </p>{" "}
        <div style={s.ingestGrid}>
          {" "}
          {ingestMethods.map((m, i) => (
            <div key={i} style={s.ingestCard}>
              {" "}
              <div style={{ fontSize: 30, marginBottom: 12 }}>
                {m.icon}
              </div>{" "}
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#005f8e",
                }}
              >
                {m.title}
              </h3>{" "}
              <p
                style={{
                  fontSize: 13,
                  color: "#0077aa",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {m.desc}
              </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <hr style={s.divider} /> {/* How It Works */}{" "}
        <p style={s.sectionTitle}>How It Works</p>{" "}
        <h2 style={s.sectionHeading}>Three steps to a tidy inventory.</h2>{" "}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 28,
          }}
        >
          {" "}
          {steps.map((step, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
            >
              {" "}
              <div style={s.stepNumber}>{i + 1}</div>{" "}
              <div>
                {" "}
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                  {step.title}
                </h4>{" "}
                <p
                  style={{
                    fontSize: 14,
                    color: "#666",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <hr style={s.divider} /> {/* Export */}{" "}
        <p style={s.sectionTitle}>Export</p>{" "}
        <h2 style={s.sectionHeading}>Take your data anywhere.</h2>{" "}
        <p style={s.sectionBody}>
          {" "}
          Export your full inventory to a CSV file at any time with a single
          click. Perfect for sharing with your team, importing into other tools,
          or keeping an offline backup.{" "}
        </p>{" "}
        {/* CTA */}{" "}
        <div style={s.cta}>
          {" "}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
            Ready to take control of your swag?
          </h2>{" "}
          <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 22 }}>
            Track stock, get alerts, and never run out of the good stuff.
          </p>{" "}
          <a href="/swag" style={s.ctaBtn}>
            <img src={logo} alt="" style={{ width: 20, height: 20, objectFit: "contain", marginRight: 6 }} />Open Swag Inventory
          </a>{" "}
        </div>{" "}
      </div>{" "}
      <footer
        style={{
          textAlign: "center",
          padding: 24,
          fontSize: 13,
          color: "#aaa",
        }}
      >
        {" "}
        Built with ❤️ and Claude AI{" "}
      </footer>{" "}
    </div>
  );
}
