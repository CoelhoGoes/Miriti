import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.setDepth(10)
    this.setScale(1)

    this.body.setSize(this.width * 0.45, this.height * 0.28)
    this.body.setOffset((this.width - this.width * 0.45) / 2, this.height - this.height * 0.28 - 2)

    this.baseScale = 1
    this.isMoving = false

    this.walkTween = scene.tweens.add({
      targets: this,
      scaleY: { from: this.baseScale, to: this.baseScale * 1.06 },
      duration: 140,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true,
    })
  }

  update(cursors, wasdKeys) {
    const moveSpeed = 160

    this.setVelocity(0)

    const leftPressed = cursors.left.isDown || wasdKeys.A.isDown
    const rightPressed = cursors.right.isDown || wasdKeys.D.isDown
    const upPressed = cursors.up.isDown || wasdKeys.W.isDown
    const downPressed = cursors.down.isDown || wasdKeys.S.isDown

    if (leftPressed) {
      this.setVelocityX(-moveSpeed)
    } else if (rightPressed) {
      this.setVelocityX(moveSpeed)
    }

    if (upPressed) {
      this.setVelocityY(-moveSpeed)
    } else if (downPressed) {
      this.setVelocityY(moveSpeed)
    }

    this.body.velocity.normalize().scale(moveSpeed)

    if (this.body.velocity.x < 0) {
      this.setFlipX(true)
    } else if (this.body.velocity.x > 0) {
      this.setFlipX(false)
    }

    const currentSpeed = this.body.velocity.length()

    if (currentSpeed > 0 && !this.isMoving) {
      this.isMoving = true
      this.walkTween.resume()
    } else if (currentSpeed === 0 && this.isMoving) {
      this.isMoving = false
      this.walkTween.pause()
      this.setScale(this.baseScale)
    }
  }
}