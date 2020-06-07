class Boss extends Phaser.Physics.Matter.Sprite {
    constructor (scene, x, y, texture, frame, options) {
        super(scene.matter.world, x, y, texture, frame, options);
        scene.add.existing(this);
        this.scene.events.on("update", this.update, this);
        this.JUMP_ACCELERATION = 12;
        this.destroyed = false;

        this.health = 3;
        this.bottomShoe = this.scene.matter.add.rectangle(x-44, y+84, 255, 8, 
        { isSensor: true, ignoreGravity: true, label: 'botShoe' });
        this.xBox = this.scene.matter.add.rectangle(x+13, y-40, 16, 40, 
        { isSensor: true, ignoreGravity: true, label: 'xBox' });
        this.setPosition(x, y);
        this.ranJumpTimer();
        this.setFixedRotation();
    }

    update() {
        if (!this.destroyed) {
            this.bottomShoe.position.x = this.x-44;
            this.bottomShoe.position.y = this.y+84;
            this.xBox.position.x = this.x+13;
            this.xBox.position.y = this.y-80;
            this.x = 2060;
        }
        if (this.health <= 0) {
            this.destroyObj();
        }
        if (this.destroyed) {
            this.destroy();
            this.bottomShoe.position.y = -100;
            this.xBox.position.y = -100;
        }
    }
    
    ranJumpTimer() {
        this.scene.time.delayedCall(Phaser.Math.Between(1000, 1500), () => {
            if (!this.destroyed) {
                this.setVelocityY(-this.JUMP_ACCELERATION);
                this.ranJumpTimer();
            }
        }, null, this);
    }

    takeDamage() {
        this.health--;
    }
    destroyObj() {
        this.setActive(false);
        this.destroyed = true;
    }
    getHealth() {
        return this.health;
    }
}