import { useMemo } from 'react'
import { useGame } from '../../context/GameContext'
import './HUD.css'

const XP_PER_LEVEL = 500

export default function HUD() {
    const { gameState } = useGame()

    const { nome, nivel, xp } = gameState.perfil
    const moedas = gameState.economia.moedas

    const progress = useMemo(() => {
        const xpDoNivel = xp % XP_PER_LEVEL

        return {
            current: xpDoNivel,
            max: XP_PER_LEVEL,
            percentage: Math.min(100, Math.max(0, (xpDoNivel / XP_PER_LEVEL) * 100)),
        }
    }, [xp])

    return (
        <header className="hud-shell" aria-label="Painel do jogador">
            <div className="hud-card hud-card--player">
                <span className="hud-card__eyebrow">Jogador</span>
                <strong className="hud-card__title">{nome}</strong>
            </div>

            <div className="hud-card hud-card--coins">
                <span className="hud-card__eyebrow">Saldo</span>
                <div className="hud-card__value-row">
                    <span className="hud-card__icon" aria-hidden="true">
                        T
                    </span>
                    <strong className="hud-card__title">{moedas} Tindins</strong>
                </div>
            </div>

            <div className="hud-card hud-card--level">
                <span className="hud-card__eyebrow">Nível atual</span>
                <strong className="hud-card__title">Nível {nivel}</strong>
            </div>

            <div className="hud-card hud-card--xp">
                <div className="hud-card__xp-header">
                    <span className="hud-card__eyebrow">XP</span>
                    <strong className="hud-card__xp-label">
                        {progress.current}/{progress.max}
                    </strong>
                </div>

                <div className="hud-xp-bar" aria-hidden="true">
                    <div className="hud-xp-bar__fill" style={{ width: `${progress.percentage}%` }} />
                </div>
            </div>
        </header>
    )
}