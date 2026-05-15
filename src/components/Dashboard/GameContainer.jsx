import './dashboard.css'

export default function GameContainer() {
  return (
    <section className="dashboard-game-stage" aria-label="Área do jogo">
      <div className="dashboard-game-stage__inner">
        <div id="phaser-game" className="dashboard-game-stage__phaser" />
      </div>
    </section>
  )
}