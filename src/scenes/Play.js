class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        // variables and settings
        this.ACCELERATION = 1.5;
        this.JUMP_ACCELERATION = 10;
        this.SWORD_TURN_SPEED = Math.PI / 30;
        this.SWORD_SCALE_SPEED = 0.05;
        this.MIN_SWORD_SCALE = 0.25
        this.MAX_SWORD_SCALE = 3;
        var touchingGround = false;
        this.gameMode = 0;
        this.oneToggle = true;
        this.swordSize = [ 'sword', 'sword2', 'sword3' ];
        this.swordCurrent = 0;
        this.maxSwordLvl = 3;
        this.swordCurrentMod = this.swordCurrent % this.maxSwordLvl;
    }

    // load assets here: Bus, Infinite Scrolling road on Y axis
    preload() {
        this.load.path = "./assets/"
        this.load.image('player', 'Player.png');
        this.load.spritesheet('knight', 'LeafKnightSmall.png', 
        {frameWidth: 25, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('beetle', 'ScooterBeetle-Sheet.png', 
        {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 2});
        this.load.spritesheet("kenney_sheet", "colored_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('sword', 'Sword.png');
        this.load.image('sword2', 'Sword2.png');
        this.load.image('sword3', 'Sword3.png');
        this.load.image('beetle1', 'TacoBeetle.png');
        this.load.audio('jump', 'jump.mp3');
        this.load.image("tiles", "DirtTileset.png");
        this.load.tilemapTiledJSON("map", "Level1.json");
    }

    create() {
        // load map
        const map = this.add.tilemap("map");
        const tileset = map.addTilesetImage("DirtTileset", "tiles");

        const backgroundLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const groundLayer = map.createStaticLayer("Ground", tileset, 0, 0);

        groundLayer.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(groundLayer);
        //debug colors
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null,    // color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        // });
        
        //animation config
        this.anims.create({
            repeat: -1,
            key: 'walk',
            frames: this.anims.generateFrameNumbers('knight', 
            { start: 0, end: 3, first: 0 }),
            frameRate: 4
        });
        this.anims.create({
            repeat: -1,
            key: 'jump1',
            frames: this.anims.generateFrameNumbers('knight', 
            { start: 6, end: 11, first: 6}),
            frameRate: 10
        });
        this.anims.create({
            repeat: -1,
            key: 'bugWalk',
            frames: this.anims.generateFrameNumbers('beetle', 
            { start: 0, end: 2, first: 0}),
            frameRate: 10
        });

        // create sword
        this.sword = this.matter.add.sprite(game.config.width/2, game.config.height/2 - 40, 'sword',
         null, {ignoreGravity: true}).setOrigin(.5, 1.5);
        this.sword.body.position.y += 32;
        this.sword.setSensor(true);

        // test bug
        this.bug = new Mob(this, game.config.width/2, 500, "beetle1");
        this.bug.anims.play('bugWalk');
        
        // player
        const p1Spawn = map.findObject("Player Spawn", obj => obj.name === "Player");
        this.p1 = this.matter.add.sprite(p1Spawn.x, p1Spawn.y, "player");
        Phaser.Physics.Matter.Matter.Body.setInertia(this.p1.body, Infinity);
        this.matter.add.mouseSpring();

        this.swordBridge = this.matter.add.sprite(-200, 0 - 100, this.swordSize[this.swordCurrentMod], null, {isStatic: true, ignoreGravity: true});
        this.swordBridge.angle = 90;

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
        this.gameModeToggle = this.input.keyboard.addKey('F');
        this.rotateBridge = this.input.keyboard.addKey('R');
        this.p1Pos = new Phaser.Math.Vector2();
        this.swordBridgeSpawn = new Phaser.Math.Vector2();

         // setup camera
         //camera zoom 
        this.cameras.main.setBounds(0, 0, 1280*2, 720*2);
        this.cameras.main.startFollow(this.p1, true, .9, .9); 
        // this.cameras.main.startFollow(this.p1, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setZoom(2);

    }

    update() {
        // console.log(this.touchingGround);
        this.bug.update();
        // use this for mob collision
        // console.log(this.matter.overlap(this.sword, this.testing));

        // update new spawn point for bridge mode
        this.swordBridgeSpawn.set(this.p1.x, this.p1.y -60);

        // attach sword to player
        this.sword.x = this.p1Pos.x;
        this.sword.y = this.p1Pos.y;
        // console.log(this.gameMode%3);
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
                //this.p1.anims.pause();
                this.p1.anims.play('jump1'); // > + jump animation needs to pause at the middle frame
                this.p1.setVelocityY(-this.JUMP_ACCELERATION);
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
        //walk anim
        if (Phaser.Input.Keyboard.JustDown(this.moveLeft)) {
            this.p1.setFlip(true, false);
            this.p1.anims.play('walk');
            
        }
        else if (Phaser.Input.Keyboard.JustDown(this.moveRight)) {
            this.p1.setFlip(false, false);
            this.p1.anims.play('walk');
            
        }
        else if (this.p1.body.velocity.x == 0) {
            this.p1.anims.stop();
        }
        if (this.gameMode % 3 == 1) {
            //rotate bridge sword controls
            if (this.rotateBridge.isDown) {
                this.swordBridge.angle += 1;
            }
            // sword scale controls
            if (Phaser.Input.Keyboard.JustDown(this.scaleDown)) {
                console.log('test');
                // this.swordBridge.scaleX += .1;
                this.swordCurrent--;
                if (this.swordCurrent == -1) {
                    this.swordCurrent = this.maxSwordLvl-1;
                }
                this.swordCurrentMod = this.swordCurrent % this.maxSwordLvl;
                this.swordBridge.destroy(true);
                this.swordBridge = this.matter.add.sprite(this.swordBridgeSpawn.x, this.swordBridgeSpawn.y, this.swordSize[this.swordCurrentMod], null, {ignoreGravity: true});
                this.swordBridge.angle = 90;
            }
            if (Phaser.Input.Keyboard.JustDown(this.scaleUp)) {
                // this.swordBridge.scaleX -= .1;
                this.swordCurrent++;
                this.swordCurrentMod = this.swordCurrent % this.maxSwordLvl;
                this.swordBridge.destroy(true);
                this.swordBridge = this.matter.add.sprite(this.swordBridgeSpawn.x, this.swordBridgeSpawn.y, this.swordSize[this.swordCurrentMod], null, {ignoreGravity: true});
                this.swordBridge.angle = 90;
            }
        }

        //change game mode mode
        if (Phaser.Input.Keyboard.JustDown(this.gameModeToggle)) { this.gameMode++; }
        // gamemode 0 is default
        // gamemode 1 is bridge mode scale and change position of sword
        // gamemode 2 is walk around with no swinging sword
        if (this.gameMode % 3 == 1 && this.oneToggle) {
            this.swordBridge = this.matter.add.sprite(this.swordBridgeSpawn.x, this.swordBridgeSpawn.y, this.swordSize[this.swordCurrentMod], null, {isStatic: true, ignoreGravity: true});
            this.swordBridge.angle = 90;
            this.swordBridge.x = this.p1.x;
            this.swordBridge.y = this.p1.y -60;
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