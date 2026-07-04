import React, { useState, useEffect } from 'react';
import {
  Users, Clock, TrendingUp, CheckCircle2, Sparkles, ArrowRight,
  BarChart3, Search, Zap, Layers, Server, Link2, Database, Brain,
  Trophy, Building2, ShieldCheck, SlidersHorizontal, Play
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, Cell, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

// Mock data
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

const DAILY = [
  { day: "Mon", candidates: 18 }, { day: "Tue", candidates: 24 }, { day: "Wed", candidates: 21 },
  { day: "Thu", candidates: 30 }, { day: "Fri", candidates: 27 }, { day: "Sat", candidates: 12 },
  { day: "Sun", candidates: 9 },
];

const RADAR_DATA = [
  { trait: "Communication", score: 88 }, { trait: "Technical Depth", score: 79 },
  { trait: "Problem Solving", score: 84 }, { trait: "Confidence", score: 91 },
  { trait: "Clarity", score: 86 },
];

const Dashboard = ({ theme, isMobile, goToInterview, role, org }) => {
  const t = THEMES[theme];
  const [minScore, setMinScore] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Hero Card */}
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

      {/* Stats */}
      <div className="stats-grid">
        <StatCard theme={theme} icon={<Users size={15} />} label="Candidates Screened" value={1284} />
        <StatCard theme={theme} icon={<TrendingUp size={15} />} label="Avg. Match Score" value={87.4} decimals={1} suffix="%" />
        <StatCard theme={theme} icon={<Clock size={15} />} label="Recruiter Hours Saved" value={312} suffix="h" />
        <StatCard theme={theme} icon={<CheckCircle2 size={15} />} label="Interviews Automated" value={396} />
      </div>

      {/* Leaderboard and Funnel */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
          <Leaderboard theme={theme} minScore={minScore} />
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
};

export default Dashboard;