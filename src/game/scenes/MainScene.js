import Phaser from 'phaser'
import Player from '../entities/Player'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // Define cor de fundo azul claro
    this.cameras.main.setBackgroundColor('#87CEEB')

    // Obtém dimensões do canvas
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Desenha elipse verde centralizada (representando a ilha)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0x2e7d32, 1) // Verde escuro (#2e7d32)
    graphics.fillEllipse(width / 2, height / 2, width * 0.7, height * 0.65)
    graphics.generateTexture('island-texture', width, height)
    graphics.destroy()

    // Cria sprite da ilha
    this.add.image(width / 2, height / 2, 'island-texture')

    // Textura temporária do jogador enquanto não há sprites finais
    const playerGraphics = this.add.graphics()
    playerGraphics.fillStyle(0x2d3436, 1)
    playerGraphics.fillRoundedRect(0, 0, 32, 32, 6)
    playerGraphics.lineStyle(2, 0xffffff, 0.65)
    playerGraphics.strokeRoundedRect(0, 0, 32, 32, 6)
    playerGraphics.generateTexture('playerTexture', 32, 32)
    playerGraphics.destroy()

    this.player = new Player(this, width / 2, height / 2, 'playerTexture')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')

    // Texto de validação centralizado
    this.add.text(width / 2, height / 2, 'Phaser Engine Ativo!', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5)

    // Círculo amarelo interativo (moeda/recurso)
    const coinCircle = this.add.circle(width / 2, height * 0.7, 30, 0xf9ca24)
    coinCircle.setInteractive({ useHandCursor: true })

    // Evento de clique no círculo
    coinCircle.on('pointerdown', () => {
      // Tween de piscar (alpha flashing)
      this.tweens.add({
        targets: coinCircle,
        alpha: { from: 1, to: 0.3 },
        duration: 100,
        yoyo: true,
        repeat: 2,
      })

      // Dispara evento global para o React
      globalThis.dispatchEvent(
        new CustomEvent('PHASER_ACTION_COLLECT', {
          detail: { amount: 10 },
        })
      )

      console.log('💰 Moeda coletada! Evento enviado para React')
    })

    // Log de validação no console
    console.log('✅ MainScene criada com sucesso')
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors, this.wasd)
    }
  }
}
