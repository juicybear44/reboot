import { useState, useRef } from "react";

const STYLES = ["Quick & easy", "Healthy", "Comfort food", "International", "High protein", "Low carb", "Vegetarian", "Vegan", "Meal prep", "Budget-friendly"];

interface Recipe {
  name: string;
  time: string;
  calories: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
}

export default function RecipeRemix() {
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState(["Quick & easy", "Healthy"]);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleStyle = (s: string) => setSelectedStyles(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = e => setImageBase64((e.target?.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const buildPrompt = () => {
    const styleStr = selectedStyles.join(" and ");
    const ingStr = ingredients.trim() ? `\n\nIngredients mentioned: ${ingredients}` : "";
    return `You are a creative chef AI. Based on the ingredients provided (via image and/or text), suggest exactly 3 ${styleStr} recipes.

For each recipe respond with ONLY valid JSON (no markdown, no backticks) in this format:
{
  "recipes": [
    {
      "name": "Recipe name",
      "time": "X mins",
      "calories": "~XXX kcal",
      "tags": ["tag1", "tag2"],
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}${ingStr}

Keep recipes genuinely quick & easy (under 30 min) and/or healthy as appropriate. Be creative but practical.`;
  };

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delayMs = 1000): Promise<Response> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch(url, options);
        if (res.ok) return res;
        if (attempt < retries - 1) await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
      } catch (e) {
        if (attempt === retries - 1) throw e;
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
      }
    }
    throw new Error("Failed after retries");
  };

  const generate = async () => {
    if (!ingredients.trim() && !imageBase64) {
      setError("Please add some ingredients or upload a photo.");
      return;
    }
    setLoading(true);
    setError(null);
    setRecipes(null);

    try {
      const content: object[] = [];
      if (imageBase64) {
        content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } });
      }
      content.push({ type: "text", text: buildPrompt() });

      const res = await fetchWithRetry("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content }]
        })
      });

      const data = await res.json();
      const text = data.content.map((b: { text?: string }) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setRecipes(parsed.recipes);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tagColor = (tag: string) => {
    const map: Record<string, string> = {
      "Quick & easy": "#f0fdf4",
      "Healthy": "#f0f9ff",
      "vegetarian": "#fefce8",
      "vegan": "#f0fdf4",
      "protein": "#fff7ed"
    };
    return map[tag] || "#f5f5f5";
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "24px 16px", color: "#1a1a1a" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 40 }}>🍳</div>
        <h1 style={{ margin: "8px 0 4px", fontSize: 26, fontWeight: 700 }}>Recipe Remix</h1>
        <p style={{ color: "#666", margin: 0 }}>Tell us what you have — we'll make it delicious</p>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `2px dashed ${dragOver ? "#22c55e" : "#d1d5db"}`,
          borderRadius: 12, padding: 20, textAlign: "center", cursor: "pointer",
          background: dragOver ? "#f0fdf4" : image ? "#fafafa" : "white",
          marginBottom: 16, transition: "all 0.2s"
        }}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {image ? (
          <div>
            <img src={image} alt="ingredients" style={{ maxHeight: 180, borderRadius: 8, objectFit: "cover" }} />
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>Click to change photo</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32 }}>📷</div>
            <p style={{ margin: "6px 0 2px", fontWeight: 500 }}>Drop a fridge/pantry photo</p>
            <p style={{ margin: 0, fontSize: 13, color: "#888" }}>or click to upload</p>
          </div>
        )}
      </div>

      <textarea
        value={ingredients}
        onChange={e => setIngredients(e.target.value)}
        placeholder="Or type your ingredients... e.g. chicken, broccoli, garlic, olive oil"
        style={{
          width: "100%", boxSizing: "border-box", padding: "12px 14px",
          border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14,
          resize: "vertical", minHeight: 80, outline: "none", fontFamily: "inherit",
          lineHeight: 1.5
        }}
      />

      <div style={{ display: "flex", gap: 8, margin: "12px 0 20px", flexWrap: "wrap" }}>
        {STYLES.map(s => (
          <button key={s} onClick={() => toggleStyle(s)} style={{
            padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: selectedStyles.includes(s) ? "#00a2e9" : "#e5e7eb",
            background: selectedStyles.includes(s) ? "#dcf4ff" : "white",
            color: selectedStyles.includes(s) ? "#00a2e9" : "#666",
            cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.15s"
          }}>{s}</button>
        ))}
      </div>

      <button onClick={generate} disabled={loading} style={{
        width: "100%", padding: "13px", borderRadius: 10, border: "none",
        background: loading ? "#d1d5db" :  "linear-gradient(135deg, #08406f, #0a5491, #0d6aad)",
        color: "white", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
  {loading ? (
    <>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        style={{ animation: "spin 0.8s linear infinite" }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Finding recipes...
    </>
  ) : "✨ Remix My Ingredients"}
</button>

      {error && <p style={{ color: "#ef4444", textAlign: "center", marginTop: 12 }}>{error}</p>}

      {recipes && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>🎉 Here's what you can make:</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {recipes.map((r, i) => (
              <div key={i} style={{
                border: "1.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
              }}>
                <div style={{ background: "#dcf4ff", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{r.name}</h3>
                    <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#555", whiteSpace: "nowrap" }}>
                      <span>⏱ {r.time}</span>
                      <span>🔥 {r.calories}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {r.tags?.map(t => (
                      <span key={t} style={{
                        padding: "2px 10px", borderRadius: 20, fontSize: 12,
                        background: tagColor(t), border: "1px solid #e5e7eb"
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 13, color: "#555" }}>INGREDIENTS</p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8 }}>
                      {r.ingredients.map((ing, j) => <li key={j}>{ing}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 13, color: "#555" }}>STEPS</p>
                    <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8 }}>
                      {r.steps.map((step, j) => <li key={j}>{step}</li>)}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}