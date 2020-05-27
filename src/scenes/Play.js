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
        this.gameMode = 0;
        this.oneToggle = true;
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
        this.matter.add.mouseSpring();

        this.matter.add.rectangle(game.config.width/2, game.config.height-8, game.config.width, 10, {isStatic: true});
        this.matter.add.rectangle(game.config.width-8, game.config.height/2, 10, game.config.height, {isStatic: true});
        this.matter.add.rectangle(8, game.config.height/2, 10, game.config.height, {isStatic: true});
        this.matter.add.rectangle(game.config.width/2, game.config.height-150, 100, 10, {isStatic: true});
        this.swordBridge = this.matter.add.sprite(-200, 0 - 100, 'sword', null, {isStatic: true, ignoreGravity: true});
        this.swordBridge.angle = 90;
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
        this.gameModeToggle = this.input.keyboard.addKey('N');
        this.p1Pos = new Phaser.Math.Vector2();

    }

    update() {
        // attach sword to player
        this.sword.x = this.p1Pos.x;
        this.sword.y = this.p1Pos.y;
        console.log(this.gameMode%3);
        if (this.gameMode%3 != 1) {
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
            if (this.gameMode%3 == 0) {
                this.p1Pos.set(this.p1.x, this.p1.y);
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

        // sword scale controls
        // WIP
        if (this.scaleDown.isDown) {
            // Phaser.Physics.Matter.Matter.Body.scale(this.swordBridge.body, 1.01, 1);
            this.swordBridge.scaleX += .1;
        }
        if (this.scaleUp.isDown) {
            // Phaser.Physics.Matter.Matter.Body.scale(this.swordBridge.body, .99, 1);
            this.swordBridge.scaleX -= .1;
        }

        //change game mode mode
        if (Phaser.Input.Keyboard.JustDown(this.gameModeToggle)) { this.gameMode++; }
        // gamemode 0 is default
        // gamemode 1 is bridge mode scale and change position of sword
        // gamemode 2 is walk around with no swinging sword
        if (this.gameMode % 3 == 1 && this.oneToggle) {
            this.swordBridge.x = this.p1.x;
            this.swordBridge.y = this.p1.y -100;
            this.p1Pos.set(-100, -100);
            this.swordBridge.setStatic(0);
            this.oneToggle = false;
        }
        else if (this.gameMode % 3 == 2 && this.oneToggle == false) {
            this.swordBridge.setStatic(1);
            this.oneToggle = true;
        }
        else if (this.gameMode%3 == 0) {
            this.swordBridge.x = -200;
            this.swordBridge.y = 0;
            this.swordBridge.scaleX = 1;
        }

    }


}