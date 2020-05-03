class gasBar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.gas = 50;
        this.gasScale = 50;
        this.changeAmt(0);
    }

    update() {
        this.gasScale = Phaser.Math.Clamp(this.gas, 0, 100);
    }

    changeAmt(amt) {
        this.gas += amt;
        this.update();
        this.scaleX = this.gasScale / 100;
    }
    
}