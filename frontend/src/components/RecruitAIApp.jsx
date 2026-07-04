import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell,
} from "recharts";
import {
  Upload, FileText, Mic, BarChart3, Moon, Sun, Users, Clock, TrendingUp,
  CheckCircle2, Sparkles, Play, Square, Search, Zap, Layers, Server, Link2,
  Database, Brain, Trophy, ArrowRight, GitBranch, Activity, ScrollText,
  Building2, ShieldCheck, SlidersHorizontal, Download, LogIn, Check, X,
  ChevronDown, Rocket, Star, DollarSign,
} from "lucide-react";

// ============ THEMES ============
const THEMES = {
  dark: {
    bg: "#0E1326", surface: "#161D33", surface2: "#1E273F", border: "#2A3350",
    text: "#E7E9F2", muted: "#8D96AF", accent: "#F5A623", accent2: "#5EEAD4",
    danger: "#F16063", shadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
    glassBg: "rgba(255,255,255,0.045)", glassBorder: "rgba(255,255,255,0.09)",
  },
  light: {
    bg: "#F6F6F4", surface: "#FFFFFF", surface2: "#F0F1EE", border: "#E2E4E0",
    text: "#14172B", muted: "#5B6178", accent: "#E0932A", accent2: "#0FA98E",
    danger: "#D1483F", shadow: "0 20px 50px -25px rgba(20,23,43,0.18)",
    glassBg: "rgba(255,255,255,0.55)", glassBorder: "rgba(20,23,43,0.08)",
  },
};

// ============ COMPONENT FUNCTIONS ============
function useCountUp(target, duration = 1200, trigger = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, trigger, duration]);
  return value;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function TypingCycle({ phrases, theme, size = 13 }) {
  const t = THEMES[theme];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("typing");

  useEffect(() => {
    const current = phrases[idx % phrases.length];
    let timeout;
    if (mode === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 40);
      } else {
        timeout = setTimeout(() => setMode("pausing"), 700);
      }
    } else if (mode === "pausing") {
      timeout = setTimeout(() => setMode("deleting"), 500);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 22);
      } else {
        setMode("typing");
        setIdx((i) => (i + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, mode, idx, phrases]);

  return (
    <span style={{ fontFamily: "JetBrains Mono", color: t.accent, fontSize: size }}>
      {text}<span className="type-cursor">|</span>
    </span>
  );
}

function ParticleField({ theme, count = 22 }) {
  const t = THEMES[theme];
  const particles = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      left: (i * 37) % 100, top: (i * 53) % 100,
      size: 2 + (i % 4), duration: 6 + (i % 6), delay: (i % 5) * 0.6,
    })),
    [count]
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <span key={i} className="particle" style={{
          position: "absolute", left: `${p.left}%`, top: `${p.top}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: i % 2 === 0 ? t.accent : t.accent2,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

function MatchRadar({ score, theme, size = 220, label = "Match Confidence" }) {
  const t = THEMES[theme];
  const animated = useCountUp(score, 1400, true);
  const r = size / 2 - 30;
  const cx = size / 2, cy = size / 2;
  const startAngle = -210, endAngle = 30;
  const angle = startAngle + (endAngle - startAngle) * (animated / 100);
  const color = animated >= 85 ? t.accent2 : animated >= 60 ? t.accent : t.danger;
  const circR = r + 15;
  const circumference = 2 * Math.PI * circR;
  const offset = circumference - (circumference * animated) / 100;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={circR} fill="none" stroke={t.border} strokeWidth="4" opacity="0.4" />
      <circle cx={cx} cy={cy} r={circR} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke 0.3s" }} />
      <circle cx={cx} cy={cy} r={4} fill={color} />
      <text x={cx} y={cy + 42} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="30" fontWeight="600" fill={t.text}>
        {Math.round(animated)}
      </text>
      <text x={cx} y={cy + 64} textAnchor="middle" fontFamily="Inter" fontSize="11" fill={t.muted} letterSpacing="0.5">
        {label}
      </text>
    </svg>
  );
}

function Shimmer({ theme, lines = 3 }) {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: 14, borderRadius: 6, background: t.surface2, overflow: "hidden",
          position: "relative", width: i === lines - 1 ? "55%" : "100%",
        }}>
          <div className="shimmer-sweep" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(90deg, transparent, ${t.accent}44, transparent)`,
          }} />
        </div>
      ))}
    </div>
  );
}

function Card({ theme, children, style, glass = true }) {
  const t = THEMES[theme];
  return (
    <div style={{
      background: glass ? t.glassBg : t.surface,
      backdropFilter: glass ? "blur(18px)" : undefined,
      WebkitBackdropFilter: glass ? "blur(18px)" : undefined,
      border: `1px solid ${glass ? t.glassBorder : t.border}`,
      borderRadius: 16, padding: 22, boxShadow: t.shadow, position: "relative",
      overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

function StatCard({ theme, icon, label, value, suffix = "", decimals = 0 }) {
  const t = THEMES[theme];
  const n = useCountUp(value, 1400, true);
  return (
    <Card theme={theme}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: t.muted, fontSize: 13, marginBottom: 10 }}>
        {icon}<span>{label}</span>
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 600, color: t.text }}>
        {n.toFixed(decimals)}{suffix}
      </div>
    </Card>
  );
}

function Pill({ theme, children, tone = "muted" }) {
  const t = THEMES[theme];
  const colors = {
    muted: { bg: t.surface2, fg: t.muted },
    accent: { bg: `${t.accent}22`, fg: t.accent },
    accent2: { bg: `${t.accent2}22`, fg: t.accent2 },
    danger: { bg: `${t.danger}22`, fg: t.danger },
  }[tone];
  return (
    <span style={{
      background: colors.bg, color: colors.fg, padding: "4px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function OrgRoleBar({ theme, org, setOrg, role, setRole }) {
  const t = THEMES[theme];
  const selectStyle = {
    background: t.surface2, color: t.text, border: `1px solid ${t.border}`,
    borderRadius: 8, padding: "6px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
  };
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: t.muted, fontSize: 12 }}>
        <Building2 size={13} />
      </div>
      <select value={org} onChange={(e) => setOrg(e.target.value)} style={selectStyle}>
        <option>Company A</option>
        <option>Company B</option>
      </select>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
        <option>Recruiter</option>
        <option>Admin</option>
      </select>
      {role === "Admin" && <Pill theme={theme} tone="accent"><ShieldCheck size={11} style={{ marginRight: 4, verticalAlign: "-2px" }} />Admin access</Pill>}
    </div>
  );
}

function Dashboard({ theme, isMobile, goToInterview, role, org }) {
  const t = THEMES[theme];
  const [minScore, setMinScore] = useState(0);
  
  const CANDIDATES = [
    { name: "Ananya Rao", role: "Senior Frontend Engineer", score: 94, status: "Shortlisted" },
    { name: "Vikram Sethi", role: "Backend Engineer (Python)", score: 88, status: "Shortlisted" },
    { name: "Priya Nair", role: "ML Engineer", score: 81, status: "In Review" },
    { name: "Rohan Mehta", role: "DevOps Engineer", score: 76, status: "In Review" },
    { name: "Sara Khan", role: "Product Designer", score: 68, status: "Rejected" },
  ];

  const PIPELINE = [
    { name: "Applied", value: 420 }, { name: "Screened", value: 260 },
    { name: "Interviewed", value: 96 }, { name: "Offered", value: 22 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <Card theme={theme} style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
        <ParticleField theme={theme} />
        <MatchRadar score={91} theme={theme} />
        <div style={{ flex: 1, minWidth: 240, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Sparkles size={16} color={t.accent} />
            <span className="pulse-glow" style={{ color: t.accent, fontSize: 13, fontWeight: 600 }}>
              ✨ RAG Engine Live
            </span>
          </div>
          <h1 style={{ fontFamily: "Space Grotesk", fontSize: 30, fontWeight: 700, color: t.text, margin: "0 0 8px" }}>
            Screen smarter. Interview sharper. Hire faster.
          </h1>
          <p style={{ color: t.muted, fontSize: 14.5, lineHeight: 1.6, margin: "0 0 16px", maxWidth: 520 }}>
            Every resume gets matched against the job description with retrieval-augmented
            scoring, then routed to a live AI mock interview before it reaches a human recruiter.
          </p>
          <button onClick={goToInterview} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px",
            borderRadius: 10, border: "none", background: t.accent2, color: "#04231D",
            fontWeight: 700, fontSize: 13.5, cursor: "pointer",
          }}>
            <Play size={14} /> Try Live Interview
          </button>
        </div>
      </Card>

      <div className="stats-grid">
        <StatCard theme={theme} icon={<Users size={15} />} label="Candidates Screened" value={1284} />
        <StatCard theme={theme} icon={<TrendingUp size={15} />} label="Avg. Match Score" value={87.4} decimals={1} suffix="%" />
        <StatCard theme={theme} icon={<Clock size={15} />} label="Recruiter Hours Saved" value={312} suffix="h" />
        <StatCard theme={theme} icon={<CheckCircle2 size={15} />} label="Interviews Automated" value={396} />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card theme={theme}>
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 16 }}>Candidate Leaderboard</div>
            {CANDIDATES.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: i === 0 ? t.accent : t.surface2,
                  color: i === 0 ? "#1A1200" : t.muted,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: t.text, fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: t.text, fontFamily: "JetBrains Mono" }}>{c.score}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: t.surface2, overflow: "hidden" }}>
                    <div style={{
                      height: 6, borderRadius: 99, background: i === 0 ? t.accent : t.accent2,
                      width: `${c.score}%`, transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <Card theme={theme} style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 14 }}>
            Hiring Funnel
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart data={PIPELINE} innerRadius="25%" outerRadius="95%" startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: t.surface2 }}>
                {PIPELINE.map((_, i) => (
                  <Cell key={i} fill={[t.accent, t.accent2, t.border, t.muted][i % 4]} />
                ))}
              </RadialBar>
              <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function ResumeScreening({ theme }) {
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
            <Search size={26} /> Run a match to see the score breakdown.
          </div>
        )}
        {stage === "analyzing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <TypingCycle theme={theme} phrases={["Analyzing resume...", "Matching skills...", "Generating questions..."]} />
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
}

function MockInterview({ theme }) {
  const t = THEMES[theme];
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const RADAR_DATA = [
    { trait: "Communication", score: 88 }, { trait: "Technical Depth", score: 79 },
    { trait: "Problem Solving", score: 84 }, { trait: "Confidence", score: 91 },
    { trait: "Clarity", score: 86 },
  ];

  const start = () => {
    setRunning(true); setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 2800);
  };

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
        <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 4 }}>
          Live Mock Interview
        </div>
        <p style={{ color: t.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>
          Whisper transcribes the candidate's spoken answers in real time; GPT-4o scores depth and delivery.
        </p>
        <div style={{
          background: t.surface2, borderRadius: 12, padding: 16, marginBottom: 14,
          display: "flex", flexDirection: "column", gap: 10, minHeight: 120,
        }}>
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: t.text }}>
            <b style={{ color: t.accent }}>AI:</b> Walk me through a time you optimized an API for latency.
          </div>
          {(running || done) && (
            <div style={{ display: "flex", gap: 8, fontSize: 13, color: t.text }}>
              <b style={{ color: t.accent2 }}>Candidate:</b>
              <span style={{ color: t.muted }}>
                {running ? "…transcribing audio via Whisper…" : "\"I profiled the endpoint, found N+1 queries, added Redis caching and cut p95 latency by 40%.\""}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 26 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className={running ? "wave-bar" : ""} style={{
              width: 3, borderRadius: 2, background: running ? t.accent : t.border,
              height: running ? undefined : 6, animationDelay: `${i * 0.06}s`,
            }} />
          ))}
        </div>
        <button onClick={start} disabled={running} style={{
          marginTop: 16, width: "100%", padding: "11px 0", borderRadius: 10, border: "none",
          background: running ? t.surface2 : t.accent2, color: running ? t.muted : "#04231D",
          fontWeight: 700, fontSize: 14, cursor: running ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {running ? <><Square size={14} /> Listening…</> : <><Play size={14} /> Start Mock Interview</>}
        </button>
      </Card>
      <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text }}>Feedback Breakdown</div>
        </div>
        {!done && !running && (
          <div style={{ color: t.muted, fontSize: 13.5, display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 0", gap: 10 }}>
            <Mic size={26} /> Start an interview to generate feedback.
          </div>
        )}
        {running && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TypingCycle theme={theme} phrases={["Transcribing response...", "Scoring technical depth...", "Evaluating confidence..."]} />
            <Shimmer theme={theme} lines={3} />
          </div>
        )}
        {done && (
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke={t.border} />
              <PolarAngleAxis dataKey="trait" tick={{ fill: t.muted, fontSize: 11 }} />
              <Radar dataKey="score" stroke={t.accent2} fill={t.accent2} fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}

function Analytics({ theme }) {
  const t = THEMES[theme];
  const DAILY = [
    { day: "Mon", candidates: 18 }, { day: "Tue", candidates: 24 }, { day: "Wed", candidates: 21 },
    { day: "Thu", candidates: 30 }, { day: "Fri", candidates: 27 }, { day: "Sat", candidates: 12 },
    { day: "Sun", candidates: 9 },
  ];
  const WEEKLY = [
    { week: "W1", screened: 42 }, { week: "W2", screened: 58 }, { week: "W3", screened: 51 },
    { week: "W4", screened: 73 }, { week: "W5", screened: 89 }, { week: "W6", screened: 96 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 14 }}>
            Candidates Per Day
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DAILY}>
              <defs>
                <linearGradient id="candGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.accent} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={t.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke={t.muted} fontSize={12} />
              <YAxis stroke={t.muted} fontSize={12} />
              <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
              <Area type="monotone" dataKey="candidates" stroke={t.accent} fill="url(#candGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 14 }}>
            Candidates Screened / Week
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={WEEKLY}>
              <CartesianGrid stroke={t.border} strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke={t.muted} fontSize={12} />
              <YAxis stroke={t.muted} fontSize={12} />
              <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
              <Line type="monotone" dataKey="screened" stroke={t.accent} strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function SystemDesign({ theme, isMobile }) {
  const t = THEMES[theme];
  const SYSTEM_LAYERS = [
    { icon: Layers, label: "Frontend", desc: "Next.js + Recharts dashboard" },
    { icon: Server, label: "FastAPI", desc: "REST + WebSocket gateway" },
    { icon: Link2, label: "LangChain", desc: "Chunking & orchestration" },
    { icon: Database, label: "Pinecone", desc: "Vector similarity search" },
    { icon: Brain, label: "GPT-4o", desc: "Scoring & interview reasoning" },
  ];
  return (
    <Card theme={theme}>
      <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 4 }}>
        Architecture Overview
      </div>
      <p style={{ color: t.muted, fontSize: 13, marginTop: 0, marginBottom: 18 }}>
        A single request flows through six layers before a recruiter ever sees a score.
      </p>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: 4 }}>
        {SYSTEM_LAYERS.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "16px 10px", borderRadius: 12, background: t.surface2, width: "100%",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: `${t.accent2}22`,
                display: "flex", alignItems: "center", justifyContent: "center", color: t.accent2,
              }}>
                <s.icon size={18} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.label}</div>
              <div style={{ fontSize: 11, color: t.muted, textAlign: "center" }}>{s.desc}</div>
            </div>
            {i < SYSTEM_LAYERS.length - 1 && (
              <ArrowRight size={16} color={t.muted} style={{ flexShrink: 0, transform: isMobile ? "rotate(90deg)" : "none" }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

function Observability({ theme }) {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="stats-grid">
        <StatCard theme={theme} icon={<Activity size={15} />} label="API Latency (avg)" value={124} suffix="ms" />
        <StatCard theme={theme} icon={<Search size={15} />} label="Vector Search Time" value={81} suffix="ms" />
        <StatCard theme={theme} icon={<Brain size={15} />} label="LLM Response Time" value={630} suffix="ms" />
        <StatCard theme={theme} icon={<DollarSign size={15} />} label="Today's OpenAI Cost" value={1.32} decimals={2} suffix="$" />
      </div>
    </div>
  );
}

function AuditLogs({ theme }) {
  const t = THEMES[theme];
  const AUDIT_LOGS = [
    { time: "09:12", actor: "Admin · Meera", action: "created a recruiter account for Company A" },
    { time: "09:20", actor: "Recruiter · Rahul", action: "uploaded a new job description — Backend Engineer" },
    { time: "09:41", actor: "Candidate · Ananya Rao", action: "completed the AI mock interview" },
  ];
  return (
    <Card theme={theme}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <ScrollText size={15} color={t.accent} />
        <span style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text }}>Audit Trail</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {AUDIT_LOGS.map((log, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, padding: "12px 4px",
            borderBottom: i < AUDIT_LOGS.length - 1 ? `1px solid ${t.border}` : "none",
          }}>
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: t.muted, width: 46, flexShrink: 0 }}>{log.time}</span>
            <div style={{ fontSize: 13, color: t.text }}>
              <b style={{ color: t.accent }}>{log.actor}</b> {log.action}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LandingPage({ theme, onLaunch }) {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <Card theme={theme} style={{ textAlign: "center", padding: "56px 24px" }}>
        <ParticleField theme={theme} count={30} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Pill theme={theme} tone="accent">AI-native hiring, end to end</Pill>
          <h1 style={{ fontFamily: "Space Grotesk", fontSize: 40, fontWeight: 700, color: t.text, margin: "16px 0 12px" }}>
            Hire on evidence, not gut feel.
          </h1>
          <p style={{ color: t.muted, fontSize: 15, maxWidth: 520, margin: "0 auto 22px" }}>
            Recruit.AI screens resumes with RAG, runs live AI mock interviews, and hands
            your team an explainable, ranked shortlist.
          </p>
          <button onClick={onLaunch} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px",
            borderRadius: 10, border: "none", background: t.accent, color: "#1A1200",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>
            <Rocket size={15} /> Launch the demo
          </button>
        </div>
      </Card>
    </div>
  );
}

// ============ MAIN APP ============
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "screening", label: "Screening", icon: FileText },
  { id: "interview", label: "Interview", icon: Mic },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "system", label: "System Design", icon: GitBranch },
  { id: "observability", label: "Observability", icon: Activity },
  { id: "audit", label: "Audit Logs", icon: ScrollText },
];

export default function RecruitAIApp() {
  const [theme, setTheme] = useState("dark");
  const [view, setView] = useState("app");
  const [tab, setTab] = useState("dashboard");
  const [org, setOrg] = useState("Company A");
  const [role, setRole] = useState("Recruiter");
  const isMobile = useIsMobile();
  const t = THEMES[theme];

  return (
    <div style={{
      fontFamily: "Inter, sans-serif", background: t.bg, minHeight: "100vh",
      color: t.text, padding: "22px 18px", position: "relative", overflow: "hidden",
      transition: "background 0.25s ease",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .shimmer-sweep { animation: sweep 1.4s infinite; }
        @keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
        @keyframes pulseGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
        .type-cursor { animation: blink 0.9s steps(1) infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .particle { position: absolute; animation: floatUp linear infinite; opacity: 0; }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.55; }
          50% { transform: translateY(-26px) translateX(8px); }
          100% { transform: translateY(-60px) translateX(-8px); opacity: 0; }
        }
        .wave-bar { animation: wave 0.9s ease-in-out infinite; }
        @keyframes wave { 0%,100% { height: 6px; } 50% { height: 26px; } }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 760px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .tab-label { display: none; } }
      `}</style>

      <div style={{ position: "fixed", top: -160, left: -120, width: 420, height: 420, borderRadius: "50%", background: "#8B5CF6", opacity: 0.16, filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -160, right: -120, width: 420, height: 420, borderRadius: "50%", background: t.accent2, opacity: 0.16, filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: t.accent,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1200",
            }}>
              <Sparkles size={18} />
            </div>
            <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 18 }}>Recruit.AI</span>
          </div>

          {view === "app" && (
            <div style={{ display: "flex", gap: 4, background: t.surface, padding: 4, borderRadius: 12, border: `1px solid ${t.border}`, flexWrap: "wrap" }}>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 9,
                  border: "none", background: tab === id ? t.accent : "transparent",
                  color: tab === id ? "#1A1200" : t.muted, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                }}>
                  <Icon size={13} /> <span className="tab-label">{label}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {view === "app" && <OrgRoleBar theme={theme} org={org} setOrg={setOrg} role={role} setRole={setRole} />}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
              width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`,
              background: t.surface, color: t.text, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {view === "app" && (
          <>
            {tab === "dashboard" && <Dashboard theme={theme} isMobile={isMobile} goToInterview={() => setTab("interview")} role={role} org={org} />}
            {tab === "screening" && <ResumeScreening theme={theme} />}
            {tab === "interview" && <MockInterview theme={theme} />}
            {tab === "analytics" && <Analytics theme={theme} />}
            {tab === "system" && <SystemDesign theme={theme} isMobile={isMobile} />}
            {tab === "observability" && <Observability theme={theme} />}
            {tab === "audit" && <AuditLogs theme={theme} />}
          </>
        )}

        <div style={{ textAlign: "center", color: t.muted, fontSize: 12, marginTop: 30 }}>
          Demo data shown above is illustrative — wire up FastAPI + Pinecone + Whisper + PostgreSQL to go live.
        </div>
      </div>
    </div>
  );
}