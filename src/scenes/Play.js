class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        // variables and settings
        this.ACCELERATION = 2;
        this.SWORD_TURN_SPEED = Math.PI / 30;
        this.SWORD_SCALE_SPEED = 0.05;
        this.MIN_SWORD_SCALE = 0.25
        this.MAX_SWORD_SCALE = 3;
        var touchingGround = false;
        this.bridgeMode = false;
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
         null, {ignoreGravity: true}).setOrigin(.5, 1.5);
        this.sword.body.position.y += 64;
        // this.sword.body.setCollideWorldBounds(true);
        // this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        this.p1 = this.matter.add.sprite(game.config.width/2, game.config.height/2, "kenney_sheet", 402);
        Phaser.Physics.Matter.Matter.Body.setInertia(this.p1.body, Infinity);

        this.matter.add.rectangle(game.config.width/2, game.config.height-8, game.config.width, 10, {isStatic: true});
        this.matter.add.rectangle(game.config.width-8, game.config.height/2, 10, game.config.height, {isStatic: true});
        this.matter.add.rectangle(8, game.config.height/2, 10, game.config.height, {isStatic: true});
        this.matter.add.rectangle(game.config.width/2, game.config.height-150, 100, 10, {isStatic: true});
        this.matter.add.mouseSpring();
        // this.matter.add.joint(this.p1, this.sword, 50, 1, {ignoreGravity: true, density: 1});

        this.matter.world.on("collisionactive", (p1, ground) => {
            this.touchingGround = true;
         });

        // add all necessary keys
        cursors = this.input.keyboard.createCursorKeys();
        this.scaleDown = this.input.keyboard.addKey('Q');
        this.scaleUp = this.input.keyboard.addKey('E');
        this.moveRight = this.input.keyboard.addKey('D');
        this.moveLeft = this.input.keyboard.addKey('A');
        this.jump = this.input.keyboard.addKey('SPACE');
        this.moveTowardsSword = this.input.keyboard.addKey('S');
        this.toggleBridgeMode = this.input.keyboard.addKey('N');

    }

    update() {
        // attach sword to player
        this.sword.x = this.p1.x;
        this.sword.y = this.p1.y;
        
        //directional controls 
        if (this.moveLeft.isDown) {
            this.p1.setVelocityX(-this.ACCELERATION);
        }
        else if (this.moveRight.isDown) {
            this.p1.setVelocityX(this.ACCELERATION);
        }
        //jump control
        if (Phaser.Input.Keyboard.JustDown(this.jump) && this.touchingGround) {
            this.p1.setVelocityY(-this.ACCELERATION*6);
            this.sound.play('jump');
            this.touchingGround = false;
        }

        // sword scale controls
        // WIP
        if (this.scaleDown.isDown && this.sword.scaleY >= this.MIN_SWORD_SCALE) {
            // Phaser.Physics.Matter.Matter.Body.scale(this.sword.body, 1.01, 1);
        }
        if (this.scaleUp.isDown && this.sword.scaleY <= this.MAX_SWORD_SCALE) {
            // Phaser.Physics.Matter.Matter.Body.scale(this.sword.body, .99, 1);
        }

        //bridge mode
        if (Phaser.Input.Keyboard.JustDown(this.toggleBridgeMode)) { this.bridgeMode = !this.bridgeMode; }
        if (this.bridgeMode) {
            
        }

        // make sword angle follow cursor
        this.angleToPointer = Phaser.Math.Angle.Between(this.sword.x, this.sword.y, 
        this.input.activePointer.worldX, this.input.activePointer.worldY);
        this.sword.rotation = Phaser.Math.Angle.RotateTo(
            this.sword.rotation,
            this.angleToPointer + Math.PI/2,
            this.SWORD_TURN_SPEED
          );
    }


}