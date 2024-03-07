import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import AnimationKeys from "../consts/AnimationKeys";
export default class LaserObstacle extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.top = scene.add.image(0, 0, TextureKeys.LaserEnd).setOrigin(0.5, 0);
    this.middle = scene.add.image(0, this.top.y + this.top.displayHeight, TextureKeys.LaserMiddle).setOrigin(0.5, 0);

    this.middle.setDisplaySize(this.middle.width, 200);
    this.bottom = scene.add
      .image(0, this.middle.y + this.middle.displayHeight, TextureKeys.LaserEnd)
      .setOrigin(0.5, 0)
      .setFlipY(true);

    this.add(this.top);
    this.add(this.middle);
    this.add(this.bottom);
    scene.physics.add.existing(this, true);
    const body = this.body;
    const width = this.top.displayWidth;
    const height = this.top.displayHeight + this.middle.displayHeight + this.bottom.displayHeight;
    body.setSize(width, height);
    body.setOffset(-width * 0.5, 0);
    body.position.x = this.x + body.offset.x;
    body.position.y = this.y;
  }
}
