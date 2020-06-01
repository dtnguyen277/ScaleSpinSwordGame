class Mob extends Phaser.Physics.Matter.Sprite {
    constructor (scene, x, y, texture, frame, options) {
        super(scene.matter.world, x, y, texture, frame, options);
        scene.add.existing(this);
        this.ACCELERATION = .75;
        this.DIRECTION = true;
        Phaser.Physics.Matter.Matter.Body.setInertia(this.body, Infinity);
    }

    update() {
        if (this.body.velocity.x == 0) {
            this.DIRECTION = !this.DIRECTION;
        }
        if (this.DIRECTION) {
            this.setFlip(true, false);
            this.setVelocityX(this.ACCELERATION);
        }
        else {
            this.setFlip(false, false);
            this.setVelocityX(-this.ACCELERATION);
        }
    }
}