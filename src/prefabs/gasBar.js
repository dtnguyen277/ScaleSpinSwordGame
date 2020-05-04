class gasBar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.gas = 100;
        this.changeAmt(0);
    }

    update() {
        if (this.gas > 100) {
            this.gas = 100;
        }
        console.log(" " + this.gas);
    }

    changeAmt(amt) {
        this.gas += amt;
        this.update();
        this.scaleX = this.gas / 100;
    }
    
}