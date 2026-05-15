import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.setDepth(10)
    this.setScale(1)
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
  }
}