class Police extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.isExploded = false;
    }

    update() {
        if (this.y >= 500 && !this.isExploded) {
            this.y -= 2;
        }

        
    }
    
}