class Bus extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

    }

    update() {
        console.log(this.x);
        // l/r movement
        if (keyLEFT.isDown && this.x >= 122) {
            this.x -= 2;
        }
        else if (keyRIGHT.isDown && this.x <= 358) {
            this.x += 2;
        }
    }
}