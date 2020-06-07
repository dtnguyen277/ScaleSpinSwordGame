class Mob extends Phaser.Physics.Matter.Sprite {
    constructor (scene, x, y, texture, frame, options) {
        super(scene.matter.world, x, y, texture, frame, options);
        scene.add.existing(this);
        this.ACCELERATION = .75;
        this.DIRECTION = true;
        this.destroyed = false;
        this.anims.play('bugWalk');
        // this.scene.events.on("update", this.update, this);

        // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        // const { width: w, height: h } = this;
        // const mainBody = Bodies.rectangle(w/2, h/2, w, h);
        // this.sensors = {
        //     left: Bodies.rectangle(0, h * 0.5, 2, w * 0.25, { isSensor: true }),
        //     right: Bodies.rectangle(w, h * 0.5, 2, w * 0.25, { isSensor: true }),
        // }
        // const compoundBody = Body.create({
        //     parts: [mainBody, this.sensors.right, this.sensors.left],
        // });
        // this.setExistingBody(compoundBody);
        // this.setPosition(x, y);

        this.setFixedRotation(); // Sets inertia to infinity so the player can't rotate
        this.changeDirTimer();
    }

    update() {
        if (!this.destroyed) {
            if (this.body.velocity.x > .002) this.setVelocityX(.002);
            else if (this.body.velocity.x < -.002) this.setVelocityX(-.002);

            // if (this.body.velocity.x == 0) {
            //     this.DIRECTION = !this.DIRECTION;
            // }
            if (this.DIRECTION) {
                this.setFlip(true, false);
                // this.setVelocityX(this.ACCELERATION);
                this.applyForce({ x:.002, y: 0 });
            }
            else {
                this.setFlip(false, false);
                // this.setVelocityX(-this.ACCELERATION);
                this.applyForce({ x:-.002, y: 0 });
            }
        }
        if (this.destroyed) {
            this.destroy();
        }
    }
    changeDirTimer() {
        this.scene.time.delayedCall(Phaser.Math.Between(1000, 1500), () => {
            this.DIRECTION = !this.DIRECTION;
            if (!this.destroyed) {
                this.changeDirTimer();
            }
        }, null, this);
    }
    destroyObj() {
        this.setActive(false);
        this.anims.stop();
        this.destroyed = true;
    }
}