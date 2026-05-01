import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface InventoryItem {
  id: number;
  name: string;
  variant: string;
  quantity: number;
  emoji: string;
}

interface FormState {
  name: string;
  variant: string;
  quantity: string;
  emoji: string;
}

interface FormErrors {
  name?: string;
  variant?: string;
  quantity?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const EMOJIS = ["👕","🧥","🧢","🍶","👜","📓","🖊️","🎒","🧦","🏆"];
const LOW_STOCK_THRESHOLD = 5;
const STORAGE_KEY = "swag_inventory_items";

const SEED_ITEMS: InventoryItem[] = [
  { id: 1, name: "T-Shirt",      variant: "Small",    quantity: 12, emoji: "👕" },
  { id: 2, name: "T-Shirt",      variant: "Medium",   quantity: 3,  emoji: "👕" },
  { id: 3, name: "Hoodie",       variant: "Large",    quantity: 0,  emoji: "🧥" },
  { id: 4, name: "Snapback Cap", variant: "One Size", quantity: 8,  emoji: "🧢" },
  { id: 5, name: "Water Bottle", variant: "32 oz",    quantity: 2,  emoji: "🍶" },
  { id: 6, name: "Tote Bag",     variant: "One Size", quantity: 15, emoji: "👜" },
  { id: 7, name: "Notebook",     variant: "A5",       quantity: 4,  emoji: "📓" },
  { id: 8, name: "Backpack",     variant: "One Size", quantity: 1,  emoji: "🎒" },
];

const EMPTY_FORM: FormState = { name: "", variant: "", quantity: "", emoji: "👕" };

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadItems(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return SEED_ITEMS;
}

function stockMeta(qty: number): { color: string; bg: string; label: string } {
  if (qty === 0) return { color: "#ef4444", bg: "#fef2f2", label: "Out of stock" };
  if (qty <= LOW_STOCK_THRESHOLD) return { color: "#f97316", bg: "#fff7ed", label: "Low stock" };
  return { color: "#22c55e", bg: "#f0fdf4", label: "In stock" };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SwagInventory() {
  const [items, setItems] = useState<InventoryItem[]>(loadItems);
  const [view, setView] = useState<"inventory" | "add" | "ingest">("inventory");
  const [search, setSearch] = useState("");
  const [filterAlert, setFilterAlert] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [ingestTab, setIngestTab] = useState<"csv" | "paste" | "photo">("csv");
  const [pasteText, setPasteText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const nextIdRef = useRef(Math.max(0, ...loadItems().map(i => i.id)) + 1);
  const csvRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const showFlash = useCallback((msg: string) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlash(msg);
    flashTimerRef.current = setTimeout(() => setFlash(null), 2500);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────

  const lowStock = items.filter(i => i.quantity <= LOW_STOCK_THRESHOLD);
  const filtered = items.filter(i => {
    const matchSearch = `${i.name} ${i.variant}`.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterAlert ? i.quantity <= LOW_STOCK_THRESHOLD : true);
  });

  // ── CRUD ───────────────────────────────────────────────────────────────────

  const saveItem = () => {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = "Item name is required.";
    if (!form.variant.trim()) errors.variant = "Variant is required.";
    if (form.quantity === "") errors.quantity = "Quantity is required.";
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});

    const body = {
      name: form.name.trim(),
      variant: form.variant.trim(),
      quantity: parseInt(form.quantity),
      emoji: form.emoji,
    };

    if (editId !== null) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...body } : i));
      showFlash("✅ Item updated!");
    } else {
      setItems(prev => [...prev, { id: nextIdRef.current++, ...body }]);
      showFlash("✅ Item added!");
    }

    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setSearch("");
    setView("inventory");
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    showFlash("✅ Item removed!");
  };

  const adjustQty = (id: number, delta: number) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ));
  };

  const startEdit = (item: InventoryItem) => {
    setForm({ name: item.name, variant: item.variant, quantity: String(item.quantity), emoji: item.emoji });
    setEditId(item.id);
    setView("add");
  };

  // ── Import ─────────────────────────────────────────────────────────────────

  const bulkInsert = (rows: Omit<InventoryItem, "id">[]) => {
    const newItems = rows.map(r => ({ id: nextIdRef.current++, ...r }));
    setItems(prev => [...prev, ...newItems]);
    showFlash(`✅ Imported ${rows.length} items!`);
    setView("inventory");
  };

  const handleCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const lines = (e.target?.result as string).trim().split("\n").filter(Boolean);
      if (lines.length < 2) return;
      const headers = lines[0].toLowerCase().split(",").map(h => h.trim().replace(/"/g, ""));
      const ni = headers.findIndex(h => h.includes("name") || h.includes("item"));
      const vi = headers.findIndex(h => h.includes("variant") || h.includes("size"));
      const qi = headers.findIndex(h => h.includes("qty") || h.includes("quantity") || h.includes("count"));
      if (ni === -1 || qi === -1) { showFlash("❌ Couldn't find required columns"); return; }
      const rows = lines.slice(1).map(line => {
        const c = line.split(",").map(x => x.trim().replace(/"/g, ""));
        return {
          name: c[ni] || "Unknown",
          variant: vi >= 0 ? c[vi] || "One Size" : "One Size",
          quantity: parseInt(c[qi]) || 0,
          emoji: "👕" as string,
        };
      }).filter(r => r.name && r.name !== "Unknown");
      bulkInsert(rows);
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    const lines = pasteText.trim().split("\n").filter(Boolean);
    const rows = lines.map(line => {
      const c = line.split(/\t|,/).map(x => x.trim());
      const qi = [...c].reverse().findIndex(x => !isNaN(parseInt(x)));
      return {
        name: c[0] || "Unknown",
        variant: c[1] && isNaN(parseInt(c[1])) ? c[1] : "One Size",
        quantity: qi >= 0 ? parseInt(c[c.length - 1 - qi]) : 0,
        emoji: "👕" as string,
      };
    }).filter(r => r.name && r.name !== "Unknown");
    bulkInsert(rows);
    setPasteText("");
  };

  const handlePhotoFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = e => setPhotoBase64((e.target?.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    if (!photoBase64) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: photoBase64 } },
              { type: "text", text: `Identify company swag items in this image. Respond ONLY with valid JSON (no markdown):\n{"items":[{"name":"Item","variant":"Size or One Size","quantity":5,"emoji":"👕"}]}\nUse fitting emoji from: 👕🧥🧢🍶👜📓🖊️🎒🧦🏆. If none found return {"items":[]}.` },
            ],
          }],
        }),
      });
      const data = await res.json();
      const text = data.content.map((b: { text?: string }) => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      if (!parsed.items?.length) { setAiError("No swag items detected. Try a clearer image!"); return; }
      bulkInsert(parsed.items.map((i: InventoryItem) => ({ ...i, quantity: parseInt(String(i.quantity)) || 0 })));
      setPhotoPreview(null);
      setPhotoBase64(null);
    } catch {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Variant", "Quantity", "Status"],
      ...items.map(i => [i.name, i.variant, i.quantity, stockMeta(i.quantity).label]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "swag-inventory.csv"; a.click();
    URL.revokeObjectURL(url);
    showFlash("✅ CSV exported!");
  };

  // ── Styles ─────────────────────────────────────────────────────────────────

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: "7px 10px", borderRadius: 8,
    border: `1.5px solid ${active ? "#6366f1" : "#e5e7eb"}`,
    background: active ? "#eef2ff" : "white",
    color: active ? "#4f46e5" : "#666",
    fontWeight: 500, fontSize: 13, cursor: "pointer", textAlign: "center",
  });

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%", marginTop: 4, padding: "8px 10px",
    border: `1.5px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
    borderRadius: 8, fontSize: 14, outline: "none",
    fontFamily: "inherit", background: "white", color: "#1a1a1a",
    boxSizing: "border-box",
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 700, margin: "0 auto", padding: "24px 16px", color: "#1a1a1a" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>🎒</div>
        <h1 style={{ margin: "6px 0 2px", fontSize: 24, fontWeight: 700 }}>Swag Inventory</h1>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{items.length} items tracked</p>
      </div>

      {/* Flash */}
      {flash && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 8, padding: "8px 14px", textAlign: "center", marginBottom: 14, fontSize: 14, fontWeight: 500 }}>
          {flash}
        </div>
      )}

      {/* Low stock banner */}
      {lowStock.length > 0 && (
        <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "#c2410c", fontWeight: 500 }}>
            ⚠️ {lowStock.length} item{lowStock.length > 1 ? "s" : ""} low or out of stock
          </span>
          <button
            onClick={() => setFilterAlert(f => !f)}
            style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, border: "1px solid #f97316", background: filterAlert ? "#f97316" : "white", color: filterAlert ? "white" : "#f97316", cursor: "pointer", fontWeight: 500 }}
          >
            {filterAlert ? "Show all" : "View only"}
          </button>
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search items..."
          style={{ flex: 1, minWidth: 120, padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
        />
        <button
          onClick={() => { setView(view === "add" ? "inventory" : "add"); setEditId(null); setForm({ ...EMPTY_FORM, name: view === "add" ? "" : search }); setFormErrors({}); }}
          style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: view === "add" ? "#f1f5f9" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: view === "add" ? "#666" : "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          {view === "add" ? "✕" : "+ Add"}
        </button>
        <button
          onClick={() => setView(view === "ingest" ? "inventory" : "ingest")}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: view === "ingest" ? "#f1f5f9" : "white", color: view === "ingest" ? "#666" : "#4f46e5", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          {view === "ingest" ? "✕" : "⬆️ Import"}
        </button>
        <button
          onClick={exportCSV}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", color: "#16a34a", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          ⬇️ Export
        </button>
      </div>

      {/* Add / Edit form */}
      {view === "add" && (
        <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20, background: "#fafafa" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>
            {editId ? "✏️ Edit Item" : "➕ Add New Item"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {(["name", "variant"] as const).map(field => (
              <div key={field}>
                <label style={{ fontSize: 12, color: formErrors[field] ? "#ef4444" : "#555", fontWeight: 500 }}>
                  {field === "name" ? "Item Name" : "Size / Variant"}
                </label>
                <input
                  value={form[field]}
                  onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setFormErrors(fe => ({ ...fe, [field]: undefined })); }}
                  placeholder={field === "name" ? "e.g. T-Shirt" : "e.g. Medium"}
                  style={inputStyle(!!formErrors[field])}
                />
                {formErrors[field] && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{formErrors[field]}</p>}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: formErrors.quantity ? "#ef4444" : "#555", fontWeight: 500 }}>Quantity</label>
              <input
                type="number" min="0" value={form.quantity} placeholder="0"
                onChange={e => { setForm(f => ({ ...f, quantity: e.target.value })); setFormErrors(fe => ({ ...fe, quantity: undefined })); }}
                style={inputStyle(!!formErrors.quantity)}
              />
              {formErrors.quantity && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{formErrors.quantity}</p>}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>Icon</label>
              <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    style={{ fontSize: 17, padding: "3px 5px", borderRadius: 6, border: "1.5px solid", borderColor: form.emoji === e ? "#6366f1" : "#e5e7eb", background: form.emoji === e ? "#eef2ff" : "white", cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={saveItem} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            {editId ? "💾 Save Changes" : "➕ Add Item"}
          </button>
        </div>
      )}

      {/* Import panel */}
      {view === "ingest" && (
        <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20, background: "#fafafa" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>⬆️ Import Inventory</h3>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {(["csv", "paste", "photo"] as const).map((t, i) => (
              <button key={t} onClick={() => setIngestTab(t)} style={tabStyle(ingestTab === t)}>
                {["📁 CSV", "📋 Paste", "📷 Photo"][i]}
              </button>
            ))}
          </div>

          {ingestTab === "csv" && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666" }}>
                Upload a CSV with columns: <strong>name, variant, quantity</strong>
              </p>
              <div
                onClick={() => csvRef.current?.click()}
                onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleCSV(e.dataTransfer.files[0]); }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                style={{ border: `2px dashed ${dragOver ? "#6366f1" : "#d1d5db"}`, borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", background: dragOver ? "#eef2ff" : "white" }}
              >
                <input ref={csvRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleCSV(e.target.files[0])} />
                <div style={{ fontSize: 28 }}>📁</div>
                <p style={{ margin: "6px 0 2px", fontWeight: 500 }}>Drop CSV file here</p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>or click to browse</p>
              </div>
            </div>
          )}

          {ingestTab === "paste" && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666" }}>
                Paste rows from Excel or Google Sheets. Columns: <strong>name, variant, quantity</strong>
              </p>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder={"T-Shirt\tMedium\t10\nHoodie\tLarge\t5"}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, minHeight: 100, resize: "vertical", fontFamily: "monospace", outline: "none" }}
              />
              <button
                onClick={handlePaste}
                disabled={!pasteText.trim()}
                style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 8, border: "none", background: pasteText.trim() ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#e5e7eb", color: pasteText.trim() ? "white" : "#aaa", fontWeight: 600, fontSize: 14, cursor: pasteText.trim() ? "pointer" : "not-allowed" }}
              >
                📋 Import Pasted Data
              </button>
            </div>
          )}

          {ingestTab === "photo" && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666" }}>
                Upload a photo of your swag — AI will identify items and quantities automatically.
              </p>
              <div
                onClick={() => !photoPreview && photoRef.current?.click()}
                onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handlePhotoFile(e.dataTransfer.files[0]); }}
                onDragOver={e => e.preventDefault()}
                style={{ border: "2px dashed #d1d5db", borderRadius: 10, padding: photoPreview ? 10 : 24, textAlign: "center", cursor: photoPreview ? "default" : "pointer", background: "white", marginBottom: 10 }}
              >
                <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handlePhotoFile(e.target.files[0])} />
                {photoPreview
                  ? <div>
                      <img src={photoPreview} alt="swag preview" style={{ maxHeight: 180, borderRadius: 8, objectFit: "cover" }} />
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }} style={{ fontSize: 12, color: "#888", background: "none", border: "none", cursor: "pointer" }}>✕ Remove</button>
                      </div>
                    </div>
                  : <div>
                      <div style={{ fontSize: 28 }}>📷</div>
                      <p style={{ margin: "6px 0 2px", fontWeight: 500 }}>Drop a photo here</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#888" }}>or click to upload</p>
                    </div>
                }
              </div>
              {aiError && <p style={{ color: "#ef4444", fontSize: 13, margin: "6px 0" }}>{aiError}</p>}
              <button
                onClick={analyzePhoto}
                disabled={!photoBase64 || aiLoading}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: photoBase64 && !aiLoading ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#e5e7eb", color: photoBase64 && !aiLoading ? "white" : "#aaa", fontWeight: 600, fontSize: 14, cursor: photoBase64 && !aiLoading ? "pointer" : "not-allowed" }}
              >
                {aiLoading ? "🔄 Analyzing photo..." : "✨ Analyze with AI"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Item list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
            <div style={{ fontSize: 36 }}>📭</div>
            <p>No items found.</p>
          </div>
        )}
        {filtered.map(item => {
          const { color, bg, label } = stockMeta(item.quantity);
          return (
            <div key={item.id} style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 28 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{item.variant}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => adjustQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#555" }}>−</button>
                <span style={{ minWidth: 32, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{item.quantity}</span>
                <button onClick={() => adjustQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#555" }}>+</button>
              </div>
              <div style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, minWidth: 90, textAlign: "center" }}>
                {label}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => startEdit(item)} style={{ padding: "5px 10px", borderRadius: 7, border: "1.5px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 13 }}>✏️</button>
                <button onClick={() => deleteItem(item.id)} style={{ padding: "5px 10px", borderRadius: 7, border: "1.5px solid #fee2e2", background: "#fff5f5", cursor: "pointer", fontSize: 13 }}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
        {[
          { label: "Total Items",        value: items.length,                                    color: "#6366f1", bg: "#eef2ff" },
          { label: "Low / Out of Stock", value: lowStock.length,                                 color: "#f97316", bg: "#fff7ed" },
          { label: "Total Units",        value: items.reduce((s, i) => s + i.quantity, 0),       color: "#22c55e", bg: "#f0fdf4" },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 10, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
