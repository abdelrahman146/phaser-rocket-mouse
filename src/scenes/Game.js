import Phaser from "phaser";
import AnimationKeys from "../consts/AnimationKeys";
import TextureKeys from "../consts/TextureKeys";
import RocketMouse from "../game/RocketMouse";
import LaserObstacle from "../game/LaserObstacle";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  init() {
    this.score = 0;
  }
  preload() {
    this.sceneWidth = this.scale.width;
    this.sceneHeight = this.scale.height;
  }

  create() {
    this.background = this.add
      .tileSprite(0, 0, this.sceneWidth, this.sceneHeight, "background")
      .setOrigin(0)
      .setScrollFactor(0, 0);
    this.mouseHole = this.add.image(Phaser.Math.Between(900, 1500), 501, TextureKeys.MouseHole);
    this.window1 = this.add.image(Phaser.Math.Between(900, 1300), 200, TextureKeys.Window1);
    this.window2 = this.add.image(Phaser.Math.Between(1600, 2000), 200, TextureKeys.Window2);
    this.bookcase1 = this.add.image(Phaser.Math.Between(2200, 2700), 580, TextureKeys.Bookcase1).setOrigin(0.5, 1);
    this.bookcase2 = this.add.image(Phaser.Math.Between(2900, 3400), 580, TextureKeys.Bookcase2).setOrigin(0.5, 1);

    this.laserObstacle = new LaserObstacle(this, 900, 100);
    this.add.existing(this.laserObstacle);

    this.coins = this.physics.add.staticGroup();
    this.spawnCoins();

    const mouse = new RocketMouse(this, this.sceneWidth * 0.5, this.sceneHeight - 30);
    this.add.existing(mouse);
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.sceneHeight - 55);
    this.cameras.main.startFollow(mouse);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.sceneHeight);

    this.physics.add.overlap(this.laserObstacle, mouse, this.handleOverlapLaser, undefined, this);
    this.physics.add.overlap(this.coins, mouse, this.handleCollectCoin, undefined, this);

    this.scoreLabel = this.add
      .text(10, 10, `Score: ${this.score}`, {
        fontSize: "24px",
        color: "#080808",
        backgroundColor: "#F8E71C",
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setScrollFactor(0);
  }

  update() {
    this.wrapMouseHole();
    this.wrapWindows();
    this.wrapBookcases();
    this.wrapLaserObtacle();
    this.background.setTilePosition(this.cameras.main.scrollX);
  }

  handleOverlapLaser(laser, mouse) {
    mouse.kill();
  }
  handleCollectCoin(mouse, coin) {
    console.log("overlap", coin, mouse);
    this.coins.killAndHide(coin);
    coin.body.enable = false;
    this.score += 1;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  spawnCoins() {
    this.coins.children.each((coin) => {
      this.coins.killAndHide(coin);
      coin.body.enable = false;
      coin.body.enable = false;
    });
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;
    let x = rightEdge + 100;
    const numCoins = Phaser.Math.Between(1, 20);
    for (let i = 0; i < numCoins; ++i) {
      const coin = this.coins.get(x, Phaser.Math.Between(100, this.scale.height - 100), TextureKeys.Coin);
      coin.setVisible(true);
      coin.setActive(true);
      const body = coin.body;
      body.setCircle(body.width * 0.5);
      body.enable = true;
      body.updateFromGameObject();
      x += coin.width * 1.5;
    }
  }

  wrapMouseHole() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    if (this.mouseHole.x + this.mouseHole.width < scrollX) {
      this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000);
    }
  }

  wrapWindows() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;
    let width = this.window1.width * 2;
    if (this.window1.x + width < scrollX) {
      this.window1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);
    }
    width = this.window2.width;
    if (this.window2.x + width < scrollX) {
      this.window2.x = Phaser.Math.Between(this.window1.x + width, this.window1.x + width + 800);
    }
  }

  wrapBookcases() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    let width = this.bookcase1.width * 2;
    if (this.bookcase1.x + width < scrollX) {
      this.bookcase1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);
    }
    width = this.bookcase2.width;
    if (this.bookcase2.x + width < scrollX) {
      this.bookcase2.x = Phaser.Math.Between(this.bookcase1.x + width, this.bookcase1.x + width + 800);
      this.spawnCoins();
    }
  }
  wrapLaserObtacle() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;
    const width = this.laserObstacle.width;
    const body = this.laserObstacle.body;
    if (this.laserObstacle.x + width < scrollX) {
      this.laserObstacle.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 1000);
      this.laserObstacle.y = Phaser.Math.Between(0, 300);
      body.position.x = this.laserObstacle.x + body.offset.x;
      body.position.y = this.laserObstacle.y;
    }
  }
}
