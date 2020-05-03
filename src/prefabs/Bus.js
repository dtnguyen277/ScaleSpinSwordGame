class Bus extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.rightBound = game.config.width - this.width/2;
        this.leftBound = this.width/2;
    }

    update() {
        // l/r movement
        if (keyLEFT.isDown && this.x >= this.leftBound) {
            this.x -= 3;
        }
        else if (keyRIGHT.isDown && this.x <= this.rightBound) {
            this.x += 3;
        }
    }
}