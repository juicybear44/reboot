import { useState, useEffect, useCallback, useRef } from "react";

/* ── Google Fonts injected once into the document head ── */
if (typeof document !== "undefined" && !document.getElementById("mt-fonts")) {
  const link = document.createElement("link");
  link.id = "mt-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap";
  document.head.appendChild(link);
}

/* ── Number input spinner removal (one tiny global rule) ── */
if (typeof document !== "undefined" && !document.getElementById("mt-base")) {
  const style = document.createElement("style");
  style.id = "mt-base";
  style.textContent = `
    .mt-num-input::-webkit-outer-spin-button,
    .mt-num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .mt-num-input[type=number] { -moz-appearance: textfield; }
  `;
  document.head.appendChild(style);
}

/* ── Palette ── */
const COLORS = [
  "#7F77DD", "#1D9E75", "#D85A30", "#D4537E", "#378ADD",
  "#639922", "#BA7517", "#E24B4A", "#534AB7", "#0F6E56",
  "#993C1D", "#993556",
];
const BG_COLORS = [
  "#EEEDFE", "#E1F5EE", "#FAECE7", "#FBEAF0", "#E6F1FB",
  "#EAF3DE", "#FAEEDA", "#FCEBEB", "#EEEDFE", "#E1F5EE",
  "#FAECE7", "#FBEAF0",
];
const CORRECT_MSGS = ["🎉 Correct!", "⭐ Awesome!", "🌟 Yes!", "💪 Nice work!", "🎯 Nailed it!"];

/* ── Font tokens ── */
const FONT_BODY = "'Nunito', sans-serif";
const FONT_DISPLAY = "'Fredoka One', cursive";

/* ── Helpers ── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Sub-components ── */

function TableButton({ n, active, color, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={active}
      aria-label={`${n} times table`}
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: 17,
        width: 46, height: 46,
        borderRadius: "50%",
        border: `2.5px solid ${active ? "#111" : "transparent"}`,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white",
        background: color,
        padding: 0,
        boxShadow: hover || active ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
        transform: hover || active ? "scale(1.12)" : "scale(1)",
        transition: "transform 0.12s, box-shadow 0.12s, border-color 0.12s",
      }}
    >
      {n}
    </button>
  );
}

function ModeTab({ active, onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "7px 20px",
        borderRadius: 99,
        border: `1.5px solid ${active ? "#1a1a1a" : hover ? "#9ca3af" : "#d1d5db"}`,
        background: active ? "#1a1a1a" : "transparent",
        fontFamily: FONT_BODY,
        fontSize: 14, fontWeight: 700,
        cursor: "pointer",
        color: active ? "white" : hover ? "#374151" : "#6b7280",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function QuizButton({ color, onClick, children, extraStyle }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block",
        fontFamily: FONT_DISPLAY,
        fontSize: 18,
        padding: "10px 34px",
        borderRadius: 99,
        border: 0,
        cursor: "pointer",
        color: "white",
        background: color,
        boxShadow: hover ? "0 5px 16px rgba(0,0,0,0.2)" : "0 3px 10px rgba(0,0,0,0.15)",
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.12s, box-shadow 0.12s",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}

function FactTile({ table, multiplier }) {
  const [flipped, setFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const color = COLORS[table - 1];
  const bg = BG_COLORS[table - 1];

  return (
    <button
      onClick={() => { setFlipped(true); setTimeout(() => setFlipped(false), 600); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`${table} times ${multiplier} equals ${table * multiplier}`}
      style={{
        fontFamily: FONT_DISPLAY,
        borderRadius: 12,
        padding: "10px 8px",
        border: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        lineHeight: 1.3,
        background: flipped ? bg : color,
        color: flipped ? color : "white",
        transform: hover ? "scale(1.06)" : "scale(1)",
        transition: "background 0.25s, color 0.25s, transform 0.1s",
      }}
    >
      <span style={{ fontSize: 13, opacity: 0.88 }}>{table} × {multiplier}</span>
      <span style={{ fontSize: 22 }}>= {table * multiplier}</span>
    </button>
  );
}

function LearnPanel({ table }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
      gap: 10,
    }}>
      {Array.from({ length: 19 }, (_, i) => i + 1).map((m) => (
        <FactTile key={m} table={table} multiplier={m} />
      ))}
    </div>
  );
}

function QuizPanel({ table }) {
  const [queue, setQueue]                   = useState([]);
  const [currentMultiplier, setCurrentMult] = useState(null);
  const [inputVal, setInputVal]             = useState("");
  const [feedback, setFeedback]             = useState({ text: "", correct: null });
  const [score, setScore]                   = useState(0);
  const [total, setTotal]                   = useState(0);
  const [streak, setStreak]                 = useState(0);
  const [progress, setProgress]             = useState([]);
  const [done, setDone]                     = useState(false);
  const inputRef = useRef(null);
  const color = COLORS[table - 1];

  const startQuiz = useCallback(() => {
    const q = shuffle(Array.from({ length: 19 }, (_, i) => i + 1));
    setQueue(q.slice(1));
    setCurrentMult(q[0]);
    setInputVal("");
    setFeedback({ text: "", correct: null });
    setScore(0); setTotal(0); setStreak(0); setProgress([]);
    setDone(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => { startQuiz(); }, [table, startQuiz]);

  const advance = useCallback((newQueue) => {
    if (newQueue.length === 0) {
      setDone(true);
      setCurrentMult(null);
    } else {
      setCurrentMult(newQueue[0]);
      setQueue(newQueue.slice(1));
      setInputVal("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, []);

  const checkAnswer = useCallback(() => {
    if (currentMultiplier === null) return;
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    const correct = table * currentMultiplier;
    const isCorrect = val === correct;
    setTotal((t) => t + 1);
    setProgress((p) => [...p, isCorrect ? "correct" : "wrong"]);
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setFeedback({
          text: ns >= 3
            ? `🔥 ${ns} in a row!`
            : CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)],
          correct: true,
        });
        return ns;
      });
    } else {
      setStreak(0);
      setFeedback({ text: `😅 It was ${correct}`, correct: false });
    }
    setTimeout(() => {
      setFeedback({ text: "", correct: null });
      advance(queue);
    }, 900);
  }, [currentMultiplier, inputVal, table, queue, advance]);

  const pct = total > 0 ? Math.round((score / total) * 100) : 100;
  const pillBg = pct >= 80 ? "#1D9E75" : pct >= 50 ? "#BA7517" : "#E24B4A";

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      {/* Score bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, color: "#6b7280", marginBottom: 16 }}>
        <span>Score:</span>
        <span style={{
          padding: "3px 14px", borderRadius: 99,
          fontFamily: FONT_DISPLAY, fontSize: 16,
          color: "white", background: pillBg,
          transition: "background 0.3s",
        }}>
          {score}
        </span>
        <span style={{ color: "#9ca3af", fontWeight: 600 }}>correct of {total}</span>
        {streak >= 3 && (
          <span style={{ marginLeft: "auto", color: "#D85A30", fontWeight: 800 }}>
            🔥 {streak} streak!
          </span>
        )}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 20 }} aria-label="Progress">
        {Array.from({ length: 19 }, (_, i) => (
          <div key={i} style={{
            width: 13, height: 13, borderRadius: "50%",
            background:
              progress[i] === "correct" ? "#1D9E75"
              : progress[i] === "wrong"   ? "#E24B4A"
              : "#e5e7eb",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {done ? (
        /* ── Done screen ── */
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🎉</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: "#1a1a1a", marginBottom: 6 }}>All done!</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#6b7280", marginBottom: 20 }}>
            {score} / 19 correct
          </div>
          <QuizButton color={color} onClick={startQuiz}>Play again 🔄</QuizButton>
        </div>
      ) : (
        /* ── Active quiz ── */
        <div style={{ textAlign: "center" }}>
          <div
            aria-live="polite"
            style={{ fontFamily: FONT_DISPLAY, fontSize: 52, color: "#1a1a1a", margin: "0 0 1rem", minHeight: 64 }}
          >
            {currentMultiplier !== null ? `${table} × ${currentMultiplier} = ?` : ""}
          </div>

          <input
            ref={inputRef}
            className="mt-num-input"
            type="number"
            min="0"
            placeholder="?"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            aria-label="Your answer"
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 34,
              width: 130,
              textAlign: "center",
              border: "2.5px solid #d1d5db",
              borderRadius: 12,
              padding: "8px 10px",
              background: "#f9fafb",
              color: "#1a1a1a",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <br />
          <QuizButton color={color} onClick={checkAnswer} extraStyle={{ marginTop: 14 }}>
            Check ✓
          </QuizButton>

          <div
            aria-live="polite"
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              minHeight: 34,
              marginTop: 12,
              color:
                feedback.correct === true  ? "#1D9E75"
                : feedback.correct === false ? "#E24B4A"
                : "inherit",
            }}
          >
            {feedback.text}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Root ── */
export default function MultiplicationTables() {
  const [currentTable, setCurrentTable] = useState(1);
  const [mode, setMode] = useState("learn");

  return (
    <div style={{
      fontFamily: FONT_BODY,
      maxWidth: 680,
      margin: "0 auto",
      padding: "1.5rem 1rem",
      boxSizing: "border-box",
    }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px" }}>
        Times Tables! 🌟
      </h1>
      <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 1.5rem" }}>
        Pick a table, then choose learn or quiz mode
      </p>

      {/* Table selector */}
      <nav aria-label="Choose times table" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
          <TableButton
            key={n}
            n={n}
            active={n === currentTable}
            color={COLORS[n - 1]}
            onClick={() => setCurrentTable(n)}
          />
        ))}
      </nav>

      {/* Mode tabs */}
      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
        {[["learn", "📖 Learn"], ["quiz", "🎯 Quiz"]].map(([m, label]) => (
          <ModeTab key={m} active={mode === m} onClick={() => setMode(m)}>{label}</ModeTab>
        ))}
      </div>

      {/* Content card */}
      <div style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "white",
        padding: "1.25rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {mode === "learn"
          ? <LearnPanel table={currentTable} />
          : <QuizPanel key={`${currentTable}-quiz`} table={currentTable} />
        }
      </div>
    </div>
  );
}
