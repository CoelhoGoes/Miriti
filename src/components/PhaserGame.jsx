import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { useGame } from '../context/GameContext'
import MainScene from '../game/scenes/MainScene'

export default function PhaserGame() {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const { addCoins } = useGame()

  useEffect(() => {
    // Evita múltiplas instâncias durante HMR e React Strict Mode
    if (gameRef.current) {
      gameRef.current.destroy(true)
    }

    // Configuração do Phaser
    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: '100%',
      height: '100%',
      responsive: true,
      render: {
        transparent: true,
        antialias: true,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 },
        },
      },
      scene: [MainScene],
    }

    // Instancia o jogo
    gameRef.current = new Phaser.Game(config)

    console.log('🎮 Phaser Game inicializado')

    // Cleanup function para destruir o jogo ao desmontar o componente
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
        console.log('🧹 Phaser Game destruído')
      }
    }
  }, [])

  // Event Bridge: Escuta eventos do Phaser e atualiza o GameContext
  useEffect(() => {
    const handleCollectCoin = (event) => {
      const { amount } = event.detail
      console.log(`🪙 React recebeu: +${amount} moedas`)
      addCoins(amount)
    }

    // Registra listener para evento de coleta de moeda
    globalThis.addEventListener('PHASER_ACTION_COLLECT', handleCollectCoin)

    // Cleanup: remove listener ao desmontar
    return () => {
      globalThis.removeEventListener('PHASER_ACTION_COLLECT', handleCollectCoin)
    }
  }, [addCoins])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    />
  )
}
