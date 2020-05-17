class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        // variables and settings
        this.ACCELERATION = 10000;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 500;
        this.DRAG = 6000;
        this.JUMP_VELOCITY = -650;
    }

    // load assets here: Bus, Infinite Scrolling road on Y axis
    preload() {
        this.load.spritesheet("kenney_sheet", "./assets/colored_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        // this.load.
    }

    create() {
        this.p1 = this.physics.add.sprite(0, 0, "kenney_sheet", 402);
        // set player physics properties
        this.p1.body.setSize(this.p1.width/2);
        this.p1.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.p1.body.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();
        this.scaleDown = this.input.keyboard.addKey('Q');
        this.scaleUp = this.input.keyboard.addKey('E');
    }

    update() {
        //directional controls
        if (cursors.left.isDown) {
            this.p1.body.setAccelerationX(-this.ACCELERATION);
        }
        else if (cursors.right.isDown) {
            this.p1.body.setAccelerationX(this.ACCELERATION);
        }
        else {
            this.p1.body.setAccelerationX(0);
            this.p1.body.setDragX(this.DRAG);
        }
        if (cursors.up.isDown) {
            this.p1.body.setAccelerationY(-this.ACCELERATION);
        }
        else if (cursors.down.isDown) {
            this.p1.body.setAccelerationY(this.ACCELERATION);
        }
        else {
            this.p1.body.setAccelerationY(0);
            this.p1.body.setDragY(this.DRAG);
        }
        
    }


}