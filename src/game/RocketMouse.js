import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import AnimationKeys from "../consts/AnimationKeys";

const MouseState = {
  Alive: 0,
  Killed: 1,
  Dead: 2,
};

export default class RocketMouse extends Phaser.GameObjects.Container {
  mouseState = MouseState.Alive;
  constructor(scene, x, y) {
    super(scene, x, y);
    this.mouse = scene.add.sprite(0, 0, TextureKeys.RocketMouse).setOrigin(0.5, 1).play(AnimationKeys.RocketMouseRun);
    this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse).play(AnimationKeys.RocketFlameOn);
    this.add(this.flames);
    this.add(this.mouse);
    scene.physics.add.existing(this);
    console.log("ff", this.body);

    this.body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7);
    this.body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15);
    this.body.setCollideWorldBounds(true);
    this.body.setVelocityX(200);
    this.enableJetpack(false);
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  preUpdate() {
    this.handleState();
  }

  handleState() {
    switch (this.mouseState) {
      case MouseState.Alive:
        this.handleAliveState();
        break;
      case MouseState.Killed:
        this.handleKilledState();
        break;
      case MouseState.Dead:
        this.handleDeadState();
        break;
    }
  }

  handleDeadState() {
    this.body.setVelocity(0, 0);
    this.scene.scene.run("game-over");
  }

  handleKilledState() {
    this.body.velocity.x *= 0.99;
    // once less than 5 we can say stop
    if (this.body.velocity.x <= 5) {
      this.mouseState = MouseState.Dead;
    }
  }

  handleAliveState() {
    if (this.cursors.space.isDown) {
      this.body.setAccelerationY(-600);
      this.mouse.play(AnimationKeys.RocketMouseFly, true);
      this.enableJetpack(true);
    } else {
      this.body.setAcceleration(0);
      this.enableJetpack(false);
    }
    if (this.body.blocked.down) {
      this.mouse.play(AnimationKeys.RocketMouseRun, true);
    } else if (this.body.velocity.y > 0) {
      this.mouse.play(AnimationKeys.RocketMouseFall, true);
    }
  }

  enableJetpack(enabled) {
    this.flames.setVisible(enabled);
  }

  kill() {
    if (this.mouseState !== MouseState.Alive) return;
    this.mouseState = MouseState.Killed;
    this.mouse.play(AnimationKeys.RocketMouseDead);
    const body = this.body;
    body.setAccelerationY(0);
    body.setVelocity(1000, 0);
    this.enableJetpack(false);
  }
}
