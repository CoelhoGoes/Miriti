import Phaser from 'phaser'
import Player from '../entities/Player'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.load.image('mapa-vila', '/assets/mapa-vila.jpg')
  }

  create() {
    const map = this.add.image(0, 0, 'mapa-vila').setOrigin(0, 0)
    const viewWidth = this.scale.width
    const viewHeight = this.scale.height

    map.setDisplaySize(viewWidth, viewHeight)

    this.physics.world.setBounds(0, 0, viewWidth, viewHeight)
    this.cameras.main.setBounds(0, 0, viewWidth, viewHeight)

    map.setDepth(0)

    const playerGraphics = this.add.graphics()
    playerGraphics.fillStyle(0x2d3436, 1)
    playerGraphics.fillRoundedRect(0, 0, 40, 40, 8)
    playerGraphics.generateTexture('player-sprite', 40, 40)
    playerGraphics.destroy()

    this.player = new Player(this, viewWidth / 2, viewHeight / 2, 'player-sprite')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')

    this.cameras.main.setZoom(1)
    this.cameras.main.setScroll(0, 0)
    this.cameras.main.centerOn(viewWidth / 2, viewHeight / 2)

    this.player.setDepth(10)
    // mantenha a entidade do jogador, mas esconda o sprite visível para protótipo
    this.player.setVisible(false)
    this.player.setImmovable(true)
    this.player.body.moves = false

    const createBuilding = ({ x, y, emoji, label, modalName }) => {
      const container = this.add.container(x, y)

      const bg = this.add.circle(0, -10, 50, 0xffffff, 0.2)
      bg.setInteractive({ useHandCursor: true })

      const emojiText = this.add.text(0, -10, emoji, {
        fontSize: '64px',
      }).setOrigin(0.5)

      const tag = this.add.text(0, 45, label, {
        fontFamily: 'Arial',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5)

      container.add([bg, emojiText, tag])
      container.setDepth(5)

      bg.on('pointerdown', () => {
        globalThis.dispatchEvent(
          new CustomEvent('PHASER_ACTION_OPEN_MODAL', {
            detail: { modalName },
          })
        )
      })

      return container
    }

    createBuilding({
      x: viewWidth * 0.34,
      y: viewHeight * 0.35,
      emoji: '🏪',
      label: 'Mercado',
      modalName: 'mercado',
    })

    createBuilding({
      x: viewWidth * 0.66,
      y: viewHeight * 0.35,
      emoji: '🌾',
      label: 'Fazenda',
      modalName: 'fazenda',
    })

    createBuilding({
      x: viewWidth * 0.5,
      y: viewHeight * 0.62,
      emoji: '🏦',
      label: 'Banco',
      modalName: 'banco',
    })

    // Debug text removed

    // Log de validação no console
    console.log('✅ MainScene criada com sucesso')
  }

  update() {
    if (!this.player) {
      return
    }

    this.player.setVelocity(0)
  }
}
