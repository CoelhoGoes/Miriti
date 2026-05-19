import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSpring, useTrail, animated, config } from '@react-spring/web'
import { useGame } from './context/GameContext'
import PhaserGame from './components/PhaserGame'

const NAV_ITEMS = [
  { icon: '🏠', label: 'Início' },
  { icon: '✅', label: 'Missões' },
  { icon: '🛍️', label: 'Loja' },
  { icon: '👤', label: 'Perfil' },
  { icon: '🏆', label: 'Conquistas' },
  { icon: '❓', label: 'Ajuda' },
]

function XPBar({ current, max }) {
  const safeMax = max > 0 ? max : 1
  const safeCurrent = Math.min(Math.max(current, 0), safeMax)
  const pct = (safeCurrent / safeMax) * 100

  const barSpring = useSpring({
    from: { width: '0%' },
    to: { width: `${pct}%` },
    delay: 600,
    config: { tension: 80, friction: 20 },
  })

  return (
    <div style={{ margin: '8px 0 4px' }}>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
        <animated.div
          style={{
            ...barSpring,
            height: '100%',
            background: 'linear-gradient(90deg, #f9ca24, #f0932b)',
            borderRadius: 99,
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
        {safeCurrent} / {safeMax} XP
      </div>
    </div>
  )
}

XPBar.propTypes = {
  current: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
}

function ResourceChip({ emoji, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
        padding: '5px 12px',
        border: `1.5px solid ${color}`,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{value}</span>
      <span
        style={{
          width: 18,
          height: 18,
          background: color,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 900,
          color: '#fff',
        }}
      >
        +
      </span>
    </div>
  )
}

ResourceChip.propTypes = {
  emoji: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
}

export default function HomeMenu({ onNavigate }) {
  const [activeNav, setActiveNav] = useState(0)
  const { gameState } = useGame()

  const nome = gameState.perfil.nome
  const nivel = gameState.perfil.nivel
  const xp = gameState.perfil.xp
  const moedas = gameState.economia.moedas
  const energia = gameState.economia.energia
  const diaAtual = gameState.economia.diaAtual
  const xpCurrent = xp % 500

  const sidebarSpring = useSpring({
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0%)', opacity: 1 },
    config: { tension: 180, friction: 22 },
  })

  const mainSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
    config: config.gentle,
  })

  const topbarSpring = useSpring({
    from: { transform: 'translateY(-24px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    delay: 260,
    config: { tension: 220, friction: 18 },
  })

  const bannerSpring = useSpring({
    from: { transform: 'translateY(60px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    delay: 700,
    config: { tension: 200, friction: 20 },
  })

  const navTrail = useTrail(NAV_ITEMS.length, {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    delay: 150,
    config: config.gentle,
  })

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        fontFamily: "'Nunito', 'Fredoka One', sans-serif",
        overflow: 'hidden',
        background: '#1a1a2e',
        pointerEvents: 'auto',
      }}
    >
      <animated.aside
        style={{
          ...sidebarSpring,
          width: 190,
          minWidth: 190,
          background: 'linear-gradient(180deg, #1b5e20 0%, #2e7d32 60%, #1b5e20 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0 16px',
          boxShadow: '4px 0 20px rgba(0,0,0,0.4)',
          zIndex: 20,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ background: '#145214', padding: '14px 16px 12px', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <div>
              <div style={{ color: '#f9ca24', fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>Miriti</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}>Matemática Financeira</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#a8d5e2',
                border: '3px solid #f9ca24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              🧒
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{nome}</div>
              <div style={{ color: '#a5d6a7', fontSize: 11, fontWeight: 600 }}>Nível {nivel} – Aprendiz</div>
            </div>
          </div>
          <XPBar current={xpCurrent} max={500} />
        </div>

        <nav style={{ flex: 1, padding: '8px 0' }}>
          {navTrail.map((trail, i) => {
            const item = NAV_ITEMS[i]
            const isActive = activeNav === i
            return (
              <animated.div key={item.label} style={trail}>
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 16px',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(249,202,36,0.25), rgba(249,202,36,0.08))'
                      : 'transparent',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    borderLeft: isActive ? '4px solid #f9ca24' : '4px solid transparent',
                    cursor: 'pointer',
                    color: isActive ? '#f9ca24' : 'rgba(255,255,255,0.75)',
                    fontWeight: isActive ? 800 : 500,
                    fontSize: 14,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onClick={() => {
                    setActiveNav(i)
                    if (onNavigate) onNavigate(item.label)
                  }}
                >
                  <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </button>
              </animated.div>
            )
          })}
        </nav>

        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span> Sair
        </button>
      </animated.aside>

      <animated.div
        style={{
          ...mainSpring,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
          pointerEvents: 'auto',
        }}
      >
        <animated.header
          style={{
            ...topbarSpring,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            zIndex: 10,
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <ResourceChip emoji="🪙" value={moedas.toLocaleString('pt-BR')} color="#f9ca24" />
            <ResourceChip emoji="⚡" value={`${energia}%`} color="#e74c3c" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['📅', '🔔'].map((icon) => (
              <button
                key={icon}
                type="button"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </animated.header>

        <div style={{ flex: 1, display: 'flex', minHeight: 0, height: '100%' }}>
          <PhaserGame />
        </div>

        <animated.footer
          style={{
            ...bannerSpring,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #f39c12, #e67e22)',
            borderTop: '3px solid #f9ca24',
            boxShadow: '0 -4px 20px rgba(243,156,18,0.4)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: 28 }}>⭐</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Continue sua jornada!</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Dia {diaAtual} - explore decisões, missões e recompensas do Projeto Miriti.
            </div>
          </div>
          <span style={{ fontSize: 26 }}>🗺️</span>
        </animated.footer>
      </animated.div>
    </div>
  )
}

HomeMenu.propTypes = {
  onNavigate: PropTypes.func,
}