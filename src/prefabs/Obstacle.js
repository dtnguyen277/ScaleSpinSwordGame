class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.update();
    }

    update() {
        if (this.y >= 690) {
            this.destroy();
            
        }
        this.y += game.settings.busSpeed;
    }
}