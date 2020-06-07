class Mob extends Phaser.Physics.Matter.Sprite {
    constructor (scene, x, y, texture, frame, options) {
        super(scene.matter.world, x, y, texture, frame, options);
        scene.add.existing(this);
        this.ACCELERATION = .75;
        this.DIRECTION = true;
        this.destroyed = false;
        this.soundPlayed = false;
        this.sfxDeath = scene.sound.add('bugD');
        this.anims.play('bugWalk');
        this.setFixedRotation(); // Sets inertia to infinity so the player can't rotate
        this.changeDirTimer();
        // this.sfxDeath.play();
    }

    update() {
        if (!this.destroyed) {
            if (this.body.velocity.x > .002) this.setVelocityX(.002);
            else if (this.body.velocity.x < -.002) this.setVelocityX(-.002);

            if (this.DIRECTION) {
                this.setFlip(true, false);
                this.applyForce({ x:.002, y: 0 });
            }
            else {
                this.setFlip(false, false);
                this.applyForce({ x:-.002, y: 0 });
            }
        }
        if (this.destroyed) {
            if (!this.soundPlayed) {
                this.playSound();
            }
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
    playSound() {
        this.sfxDeath.play();
        this.soundPlayed = true;
    }
}