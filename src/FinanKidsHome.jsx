import { useState, useEffect } from "react";
import { useSpring, useTrail, animated, config } from "@react-spring/web";

const BUILDINGS = [
  {
    id: "mercado",
    label: "MERCADO",
    emoji: "🏪",
    bg: "#e8633a",
    roof: "#c0392b",
    top: "12%",
    left: "35%",
    route: "/mercado",
  },
  {
    id: "fazenda",
    label: "FAZENDA",
    emoji: "🌾",
    bg: "#8B6914",
    roof: "#5D4037",
    top: "8%",
    left: "65%",
    route: "/fazenda",
  },
  {
    id: "banco",
    label: "BANCO",
    emoji: "🏛️",
    bg: "#ecf0f1",
    roof: "#bdc3c7",
    top: "52%",
    left: "20%",
    route: "/banco",
  },
  {
    id: "minha-casa",
    label: "Minha Casa",
    emoji: "🏠",
    bg: "#3498db",
    roof: "#2471a3",
    top: "58%",
    left: "68%",
    route: "/minha-casa",
  },
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Início", active: true },
  { icon: "✅", label: "Missões" },
  { icon: "🛍️", label: "Loja" },
  { icon: "👤", label: "Meu Perfil" },
  { icon: "🏆", label: "Conquistas" },
  { icon: "❓", label: "Ajuda" },
];

function BuildingCard({ building, index }) {
  const [hovered, setHovered] = useState(false);

  const spring = useSpring({
    transform: hovered ? "scale(1.12) translateY(-6px)" : "scale(1) translateY(0px)",
    filter: hovered ? "brightness(1.1)" : "brightness(1)",
    config: { tension: 300, friction: 18 },
  });

  const labelSpring = useSpring({
    opacity: hovered ? 1 : 0.85,
    transform: hovered ? "translateY(0px)" : "translateY(2px)",
    config: config.gentle,
  });

  const entrySpring = useSpring({
    from: { opacity: 0, transform: "scale(0.6) translateY(20px)" },
    to: { opacity: 1, transform: "scale(1) translateY(0px)" },
    delay: 300 + index * 120,
    config: { tension: 220, friction: 14 },
  });

  return (
    <animated.div
      style={{
        ...entrySpring,
        position: "absolute",
        top: building.top,
        left: building.left,
        transform: spring.transform,
        filter: spring.filter,
        cursor: "pointer",
        zIndex: hovered ? 10 : 1,
        textAlign: "center",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 80,
          height: 70,
          background: building.bg,
          borderRadius: "10px 10px 6px 6px",
          border: "2.5px solid rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          position: "relative",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -18,
            left: -4,
            right: -4,
            height: 24,
            background: building.roof,
            clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
            borderRadius: "2px",
          }}
        />
        {building.emoji}
      </div>
      <animated.div
        style={{
          ...labelSpring,
          marginTop: 6,
          background: "rgba(0,0,0,0.65)",
          color: "#fff",
          borderRadius: 8,
          padding: "3px 8px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          whiteSpace: "nowrap",
          backdropFilter: "blur(4px)",
        }}
      >
        {building.label}
      </animated.div>
    </animated.div>
  );
}

function XPBar({ current, max }) {
  const pct = (current / max) * 100;
  const barSpring = useSpring({
    from: { width: "0%" },
    to: { width: `${pct}%` },
    delay: 600,
    config: { tension: 80, friction: 20 },
  });
  return (
    <div style={{ margin: "8px 0 4px" }}>
      <div
        style={{
          height: 8,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <animated.div
          style={{
            ...barSpring,
            height: "100%",
            background: "linear-gradient(90deg, #f9ca24, #f0932b)",
            borderRadius: 99,
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
        {current} / {max} XP
      </div>
    </div>
  );
}

function ResourceChip({ emoji, value, color }) {
  const chipSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });
  return (
    <animated.div
      style={{
        ...chipSpring,
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "rgba(0,0,0,0.35)",
        borderRadius: 20,
        padding: "5px 12px",
        border: `1.5px solid ${color}`,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{value}</span>
      <span
        style={{
          width: 18,
          height: 18,
          background: color,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        +
      </span>
    </animated.div>
  );
}

export default function FinanKidsHome({ onNavigate }) {
  const [activeNav, setActiveNav] = useState(0);
  const [countdown, setCountdown] = useState(4 * 60 + 35);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const sidebarSpring = useSpring({
    from: { transform: "translateX(-100%)", opacity: 0 },
    to: { transform: "translateX(0%)", opacity: 1 },
    config: { tension: 180, friction: 22 },
  });

  const mainSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
    config: config.gentle,
  });

  const bannerSpring = useSpring({
    from: { transform: "translateY(60px)", opacity: 0 },
    to: { transform: "translateY(0px)", opacity: 1 },
    delay: 700,
    config: { tension: 200, friction: 20 },
  });

  const navTrail = useTrail(NAV_ITEMS.length, {
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    delay: 150,
    config: config.gentle,
  });

  const fountainSpring = useSpring({
    from: { transform: "scale(0)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: 500,
    config: { tension: 250, friction: 12 },
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        fontFamily: "'Nunito', 'Fredoka One', sans-serif",
        overflow: "hidden",
        background: "#1a1a2e",
      }}
    >
      {/* ── Sidebar ── */}
      <animated.div
        style={{
          ...sidebarSpring,
          width: 190,
          minWidth: 190,
          background: "linear-gradient(180deg, #1b5e20 0%, #2e7d32 60%, #1b5e20 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "0 0 16px",
          boxShadow: "4px 0 20px rgba(0,0,0,0.4)",
          zIndex: 20,
        }}
      >
        {/* Logo */}
        <div
          style={{
            background: "#145214",
            padding: "14px 16px 12px",
            borderBottom: "2px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <div>
              <div style={{ color: "#f9ca24", fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
                FinanKids
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>
                Matemática Financeira
              </div>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#a8d5e2",
                border: "3px solid #f9ca24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              🧒
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Lucas</div>
              <div style={{ color: "#a5d6a7", fontSize: 11, fontWeight: 600 }}>
                Nível 4 – Aprendiz
              </div>
            </div>
          </div>
          <XPBar current={370} max={650} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {navTrail.map((trail, i) => {
            const item = NAV_ITEMS[i];
            const isActive = activeNav === i;
            return (
              <animated.button
                key={item.label}
                style={{
                  ...trail,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 16px",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(249,202,36,0.25), rgba(249,202,36,0.08))"
                    : "transparent",
                  borderLeft: isActive ? "4px solid #f9ca24" : "4px solid transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? "#f9ca24" : "rgba(255,255,255,0.75)",
                  fontWeight: isActive ? 800 : 500,
                  fontSize: 14,
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onClick={() => {
                  setActiveNav(i);
                  onNavigate && onNavigate(item.label);
                }}
              >
                <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </animated.button>
            );
          })}
        </nav>

        {/* Sair */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.45)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span> Sair
        </button>
      </animated.div>

      {/* ── Main ── */}
      <animated.div
        style={{
          ...mainSpring,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            zIndex: 10,
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <ResourceChip emoji="🪙" value="1.250" color="#f9ca24" />
            <ResourceChip emoji="💎" value="45" color="#9b59b6" />
          </div>

          {/* Energy */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.35)",
              borderRadius: 20,
              padding: "5px 14px",
              border: "1.5px solid #e74c3c",
            }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>18/20</span>
            <span style={{ color: "#e74c3c", fontSize: 11 }}>+1 em {fmt(countdown)}</span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {["📅", "🔔"].map((icon) => (
              <button
                key={icon}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Island Map */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "radial-gradient(ellipse at 50% 40%, #4fc3f7 0%, #0277bd 100%)",
          }}
        >
          {/* Sky clouds (decorative) */}
          {[
            { top: "6%", left: "15%", size: 60 },
            { top: "4%", left: "55%", size: 80 },
            { top: "8%", right: "10%", size: 50 },
          ].map((cloud, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: cloud.top,
                left: cloud.left,
                right: cloud.right,
                width: cloud.size,
                height: cloud.size * 0.55,
                background: "rgba(255,255,255,0.85)",
                borderRadius: 99,
                filter: "blur(1px)",
                animation: `cloudFloat${i} ${6 + i * 2}s ease-in-out infinite`,
              }}
            />
          ))}

          {/* Island */}
          <div
            style={{
              position: "absolute",
              top: "14%",
              left: "8%",
              right: "8%",
              bottom: "16%",
              background:
                "radial-gradient(ellipse at 50% 45%, #66bb6a 0%, #43a047 55%, #2e7d32 100%)",
              borderRadius: "50%",
              boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 -8px 20px rgba(0,0,0,0.15)",
              border: "4px solid rgba(255,255,255,0.1)",
            }}
          />

          {/* River path (decorative) */}
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "30%",
              width: "38%",
              height: "24%",
              background: "rgba(41, 182, 246, 0.55)",
              borderRadius: "50%",
              filter: "blur(8px)",
            }}
          />

          {/* Fountain */}
          <animated.div
            style={{
              ...fountainSpring,
              position: "absolute",
              top: "41%",
              left: "47%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 5,
            }}
          >
            <div style={{ fontSize: 32 }}>⛲</div>
          </animated.div>

          {/* Buildings */}
          {BUILDINGS.map((b, i) => (
            <BuildingCard key={b.id} building={b} index={i} />
          ))}

          {/* Trees decoration */}
          {[
            { top: "20%", left: "12%" },
            { top: "70%", left: "10%" },
            { top: "65%", left: "50%" },
            { top: "25%", right: "12%" },
            { top: "72%", right: "14%" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{ position: "absolute", ...pos, fontSize: 24, zIndex: 2 }}
            >
              🌳
            </div>
          ))}

          {/* Sun */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "20%",
              fontSize: 36,
              animation: "sunPulse 3s ease-in-out infinite",
            }}
          >
            ☀️
          </div>

          {/* Boat */}
          <div
            style={{
              position: "absolute",
              bottom: "14%",
              left: "12%",
              fontSize: 22,
              animation: "boatFloat 4s ease-in-out infinite",
            }}
          >
            ⛵
          </div>
        </div>

        {/* Banner */}
        <animated.div
          style={{
            ...bannerSpring,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "12px 24px",
            background: "linear-gradient(135deg, #f39c12, #e67e22)",
            borderTop: "3px solid #f9ca24",
            boxShadow: "0 -4px 20px rgba(243,156,18,0.4)",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 28 }}>⭐</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
              Continue sua jornada!
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
              Complete missões, aprenda e conquiste recompensas!
            </div>
          </div>
          <span style={{ fontSize: 26 }}>🗺️</span>
        </animated.div>
      </animated.div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes boatFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.15); }
        }
        @keyframes cloudFloat0 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        @keyframes cloudFloat1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-12px); }
        }
        @keyframes cloudFloat2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}