import React, { useState } from 'react';
import { Upload, Zap, Search, Check, X, FileText } from 'lucide-react';

const ResumeScreening = ({ theme }) => {
  const t = THEMES[theme];
  const [stage, setStage] = useState("idle");
  const [fileName, setFileName] = useState(null);

  const runAnalysis = () => {
    setFileName(fileName || "Ananya_Rao_Resume.pdf");
    setStage("analyzing");
    setTimeout(() => setStage("done"), 3000);
  };

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
        <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 4 }}>
          Upload &amp; Match
        </div>
        <p style={{ color: t.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>
          Drop a resume — it gets chunked, embedded, and matched against the active job description via Pinecone.
        </p>
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          border: `1.5px dashed ${t.border}`, borderRadius: 12, padding: "34px 16px",
          cursor: "pointer", color: t.muted,
        }}>
          <Upload size={22} color={t.accent} />
          <span style={{ fontSize: 13.5 }}>{fileName || "Click to select a PDF resume"}</span>
          <input type="file" accept=".pdf" style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && setFileName(e.target.files[0].name)} />
        </label>

        <textarea placeholder="Paste the job description here…" rows={4}
          style={{
            width: "100%", marginTop: 14, background: t.surface2, color: t.text,
            border: `1px solid ${t.border}`, borderRadius: 10, padding: 10, fontSize: 13,
            fontFamily: "Inter", resize: "vertical", boxSizing: "border-box",
          }} />

        <button onClick={runAnalysis} disabled={stage === "analyzing"} style={{
          marginTop: 14, width: "100%", padding: "11px 0", borderRadius: 10, border: "none",
          background: t.accent, color: "#1A1200", fontWeight: 700, fontSize: 14,
          cursor: stage === "analyzing" ? "default" : "pointer", opacity: stage === "analyzing" ? 0.7 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <Zap size={15} /> {stage === "analyzing" ? "Analyzing…" : "Run RAG Match"}
        </button>
      </Card>

      <Card theme={theme} style={{ flex: 1, minWidth: 320 }}>
        <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 14 }}>
          Match Result
        </div>

        {stage === "idle" && (
          <div style={{ color: t.muted, fontSize: 13.5, display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 0", gap: 10 }}>
            <Search size={26} />
            Run a match to see the score breakdown.
          </div>
        )}

        {stage === "analyzing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <TypingCycle theme={theme}
              phrases={["Analyzing resume...", "Matching skills...", "Generating questions..."]} />
            <Shimmer theme={theme} lines={4} />
          </div>
        )}

        {stage === "done" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <MatchRadar score={91} theme={theme} size={170} label="Overall Fit" />
            <div style={{ width: "100%", background: t.surface2, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12.5, color: t.muted, marginBottom: 10, fontWeight: 600 }}>
                Why this score — AI explanation
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {["React", "TypeScript", "Node.js", "System Design"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.text }}>
                    <Check size={14} color={t.accent2} /> {s} experience found in resume
                  </div>
                ))}
                {["GraphQL", "Kubernetes"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.muted }}>
                    <X size={14} color={t.danger} /> {s} not mentioned — required by JD
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResumeScreening;