class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        // variables and settings
        this.ACCELERATION = 2;
        this.MAX_X_VEL = 500;   // pixels/seconds
        this.MAX_Y_VEL = 500;
        this.DRAG = 6000;
        this.JUMP_VELOCITY = -650;
        this.SWORD_TURN_SPEED = .05;
        this.SWORD_SCALE_SPEED = 0.05;
        this.MIN_SWORD_SCALE = 0.25
        this.MAX_SWORD_SCALE = 3;
        var touchingGround = false;

    }

    // load assets here: Bus, Infinite Scrolling road on Y axis
    preload() {
        this.load.spritesheet("kenney_sheet", "./assets/colored_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('sword', './assets/sword.png');
        this.load.audio('jump', './assets/jump.mp3');
    }

    create() {
        // create sword
        this.sword = this.matter.add.sprite(game.config.width/2, game.config.height/2 - 40, 'sword',
         null, {ignoreGravity: true}).setOrigin(.5);
        // this.sword.body.setCollideWorldBounds(true);
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        this.p1 = this.matter.add.sprite(game.config.width/2, game.config.height/2, "kenney_sheet", 402);
        // set player physics properties
        // this.p1.body.setSize(this.p1.width/2);
        // this.p1.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        // this.p1.body.setCollideWorldBounds(true);
        this.matter.add.mouseSpring();
        this.matter.add.joint(this.p1, this.sword, 50, 1.1, {ignoreGravity: true});

        this.matter.world.on("collisionactive", (p1, ground) => {
            this.touchingGround = true;
         });

        // add all necessary keys
        cursors = this.input.keyboard.createCursorKeys();
        this.scaleDown = this.input.keyboard.addKey('Q');
        this.scaleUp = this.input.keyboard.addKey('E');
        this.rotateClockwise = this.input.keyboard.addKey('D');
        this.rotateCounterClockwise = this.input.keyboard.addKey('A');
        this.moveTowardsSword = this.input.keyboard.addKey('S');

    }

    update() {
        console.log(this.touchingGround);
        // this.sword.x = this.p1.x;
        // this.sword.y = this.p1.y;
        this.sword.rotation = Phaser.Math.Angle.Between(this.p1.x, this.p1.y, this.sword.x, this.sword.y) + Math.PI/2;
        
        //directional controls 
        // will remove later
        if (cursors.left.isDown) {
            // this.p1.body.setAccelerationX(-this.ACCELERATION);
            // Phaser.Physics.Matter.Matter.Body.applyForce(this.p1.body, this.p1.body.position, {
            //     x: -.001, 
            //     y: 0
            // });
            this.p1.setVelocityX(-this.ACCELERATION);
        }
        else if (cursors.right.isDown) {
            // this.p1.body.setAccelerationX(this.ACCELERATION);
            // Phaser.Physics.Matter.Matter.Body.applyForce(this.p1.body, this.p1.body.position, {
            //     x: .001, 
            //     y: 0
            // });
            this.p1.setVelocityX(this.ACCELERATION);
        }
        // else {
        //     this.p1.body.setAccelerationX(0);
        //     this.p1.body.setDragX(this.DRAG);
        // }
        if (cursors.up.isDown && this.touchingGround) {
            // this.p1.body.setAccelerationY(-this.ACCELERATION);
            // Phaser.Physics.Matter.Matter.Body.applyForce(this.p1.body, this.p1.body.position, {
            //     x: 0, 
            //     y: -.005
            // });
            this.p1.setVelocityY(-this.ACCELERATION*5);
            this.sound.play('jump');
            this.touchingGround = false;
        }
        else if (cursors.down.isDown) {
            // this.p1.body.setAccelerationY(this.ACCELERATION);
        }
        // else {
        //     this.p1.body.setAccelerationY(0);
        //     this.p1.body.setDragY(this.DRAG);
        // }

        // sword spin controls
        if (this.rotateClockwise.isDown) {
            // Phaser.Physics.Matter.Matter.Body.setAngularVelocity
            // (this.sword.body, this.SWORD_TURN_SPEED);
            Phaser.Physics.Matter.Matter.Body.rotate(this.sword.body, Math.PI * 0.015, {
                x: this.p1.x,
                y: this.p1.y
            });
            // this.sword.setAngularVelocity(this.SWORD_SCALE_SPEED);
        }
        if (this.rotateCounterClockwise.isDown) {
            // Phaser.Physics.Matter.Matter.Body.setAngularVelocity
            // (this.sword.body, -this.SWORD_TURN_SPEED);
            Phaser.Physics.Matter.Matter.Body.rotate(this.sword.body, -Math.PI * 0.015, {
                x: this.p1.x,
                y: this.p1.y
            });
            // this.sword.setAngularVelocity(-this.SWORD_SCALE_SPEED);
        }
        // sword scale controls
        if (this.scaleDown.isDown && this.sword.scaleY >= this.MIN_SWORD_SCALE) {
            // console.log(this.sword.scaleY);
            // this.sword.scaleY -= this.SWORD_SCALE_SPEED;
            // Phaser.Physics.Matter.Matter.Body.scale(this.sword.body, 1.001, 1);
            Phaser.Physics.Matter.Matter.Body.scale(this.sword.body, 1.01, 1);
        }
        if (this.scaleUp.isDown && this.sword.scaleY <= this.MAX_SWORD_SCALE) {
            // this.sword.scaleY += this.SWORD_SCALE_SPEED;
            Phaser.Physics.Matter.Matter.Body.scale(this.sword.body, .99, 1);
        }

        if (this.moveTowardsSword.isDown) {
            // this.physics.accelerateToObject(this.p1, this.sword, 1000, 500, 500);
            // this.matter.velocityFromRotation(this.sword.rotation + Math.PI/2, 500, this.p1.body.velocity);
        }
        
    }


}