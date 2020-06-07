class Play extends Phaser.Scene {
    CURRENT_LEVEL;
    constructor() {
        super("playScene");

        // variables and settings
        this.ACCELERATION = 2;
        this.JUMP_ACCELERATION = 6;
        this.SWORD_TURN_SPEED = Math.PI / 30;
        this.SWORD_SCALE_SPEED = 0.05;
        this.MIN_SWORD_SCALE = 0.25
        this.MAX_SWORD_SCALE = 3;
        this.LEVELS = [ "map", "map1" ];
        this.CURRENT_LEVEL;
        this.maxHealth = 3;
        this.p1Health = this.maxHealth;
        this.gameMode = 0;
        this.touchingGround = true;
        this.oneToggle = true;
        this.swordSize = [ 'sword', 'swordMed', 'swordLarge' ];
        this.swordCurrent = 0;
        this.maxSwordLvl = 3;
        this.swordCurrentMod = this.swordCurrent % this.maxSwordLvl;
        this.bugList = [];
        this.changingLevel = false;
        this.gameOver = false;
        this.endend = false;
    }

    init(data) {
        this.level = data.level;
        this.CURRENT_LEVEL = this.level;
        this.changingLevel = false;
    }

    // load assets here: Bus, Infinite Scrolling road on Y axis
    preload() {
        this.load.path = "./assets/"
        this.load.image('player', 'Player.png');
        this.load.spritesheet('knight', 'LeafKnightSmall.png', 
        {frameWidth: 25, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('beetle', 'ScooterBeetle-Sheet.png', 
        {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 2});
        this.load.image('sword', 'sword.png');
        this.load.image('swordMed', 'swordMed.png');
        this.load.image('swordLarge', 'swordLarge.png');
        this.load.image('beetle1', 'TacoBeetle.png');
        this.load.image('endSign', 'sign.png');
        this.load.image('shoeBoss', 'Shoe.png');
        this.load.audio('jump', 'jump.mp3');
        this.load.audio('playerDamage', 'playerDMG.mp3');
        this.load.audio('music', 'swordgame.mp3');
        this.load.audio('slash', 'slash.wav');
        this.load.image("tiles", "DirtTileset.png");
        this.load.image('tilesGrass', 'Grass.png');
        this.load.tilemapTiledJSON("map", "Level1.json");
        this.load.tilemapTiledJSON("map1", "Level2.json");
        this.load.json('shoebox', 'shoe.json');
    }

    create() {
        // music
        this.menuAudio = this.sound.add('music');
        var musicConfig = {
            mute: false,
            volume: .05,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.menuAudio.play(musicConfig);
        var shoeHitBox = this.cache.json.get('shoebox');

        // load map
        const map = this.add.tilemap(this.LEVELS[this.CURRENT_LEVEL]);
        const tileset = map.addTilesetImage("DirtTileset", "tiles");
        const grassBkg = map.addTilesetImage('Grass', 'tilesGrass');
        

        const backgroundLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const grassLayer = map.createStaticLayer("Grass", grassBkg, 0, 0);
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
        
        // health info
        this.healthConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#FF0000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.healthText = this.add.text(330, 190, "HP: " + this.p1Health , this.healthConfig);
        this.healthText.setScrollFactor(0);

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
        
        // create draggable group
        this.canDrag = this.matter.world.nextGroup(false);

        //spawn shoe
        if (this.CURRENT_LEVEL == 1) {
            this.shoe = map.findObject('Boss Spawn', obj => obj.name === "BossSpawn");
            this.shoeBoss = new Boss(this, this.shoe.x, this.shoe.y, 'shoeBoss', null, 
            {shape: shoeHitBox.Shoe});
        }
        // create sword
        this.sword = this.matter.add.image(game.config.width/2, game.config.height/2 - 40, 'sword',
         null, {ignoreGravity: true, label: 'sword'}).setOrigin(.5, 1.5);
        this.sword.body.position.y += 32;
        this.sword.setSensor(true);


        // spawn bugs
        let bugObjects = map.filterObjects("Enemy Spawn", obj => obj.name === "Enemy");
        bugObjects.map((element) => {
            let newBug = new Mob(this, element.x, element.y, "beetle1", null, {label: 'bug'});
            this.bugList.push(newBug);
        });

        // end level sign
        this.end = map.findObject('End Point', obj => obj.name === "Endpoint");
        this.endLvl = this.matter.add.sprite(this.end.x, this.end.y, 'endSign', null, {label: 'sign', ignoreGravity: true});
        this.endLvl.setSensor(true);

        // player ----------
        this.p1Spawn = map.findObject("Player Spawn", obj => obj.name === "Player");
        this.p1 = this.matter.add.sprite(this.p1Spawn.x, this.p1Spawn.y, "player");
        this.p1.isTouching = { left: false, right: false, ground: false };
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        const { width: w, height: h } = this.p1;
        const mainBody = Bodies.rectangle(w/2, h/2, w, h, {label: 'player1'});
        this.p1.sensors = {
            bottom: Bodies.rectangle(w/2, h, w * 0.75, 2, { isSensor: true, label: 'p1Bottom' }),
            left: Bodies.rectangle(0, h * 0.5, 2, w * 0.25, { isSensor: true, label: 'p1Left'  }),
            right: Bodies.rectangle(w, h * 0.5, 2, w * 0.25, { isSensor: true, label: 'p1Right'  }),
        }
        const compoundBody = Body.create({
            parts: [mainBody, this.p1.sensors.bottom, this.p1.sensors.left, this.p1.sensors.right],
        });
        this.p1.setExistingBody(compoundBody);
        this.p1.setFixedRotation(); // Sets inertia to infinity so the player can't rotate
        this.p1.setPosition(this.p1Spawn.x, this.p1Spawn.y);

        this.swordBridge = this.matter.add.image(-200, -100, this.swordSize[this.swordCurrentMod], 
        null, {isStatic: true, ignoreGravity: true}).setCollisionGroup(this.canDrag);
        this.swordBridge.angle = 90;

        // add all necessary keys
        cursors = this.input.keyboard.createCursorKeys();
        this.scaleDown = this.input.keyboard.addKey('Q');
        this.scaleUp = this.input.keyboard.addKey('E');
        this.moveRight = this.input.keyboard.addKey('D');
        this.moveLeft = this.input.keyboard.addKey('A');
        this.jump = this.input.keyboard.addKey('SPACE');
        this.gameModeToggle = this.input.keyboard.addKey('F');
        this.rotateBridge = this.input.keyboard.addKey('R');
        this.restartGame = this.input.keyboard.addKey('W');
        this.p1Pos = new Phaser.Math.Vector2();
        this.swordBridgeSpawn = new Phaser.Math.Vector2();

         // setup camera
         //camera zoom 
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.p1, true, .9, .9); 
        this.cameras.main.setZoom(2);

        this.matter.world.on('collisionstart', function (event) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                if (bodyA.label === 'player1' && bodyB.label === 'bug') {
                    // console.log(this.scene.p1Health);
                    this.scene.takeDamage(1);
                }
                else if (bodyA.label === 'bug' && bodyB.label === 'player1') {
                    // console.log(this.scene.p1Health);
                    this.scene.takeDamage(1);
                }
                if (bodyA.label === 'player1' && bodyB.label === 'sign') {
                    console.log('b4');
                    this.scene.changingLevel = true;
                    this.scene.restartScene();
                }
                else if (bodyA.label === 'sign' && bodyB.label === 'player1') {
                    console.log('b4');
                    this.scene.changingLevel = true;
                    this.scene.restartScene();
                }
                if (bodyA.label === 'player1' && bodyB.label === 'botShoe') {
                    this.scene.takeDamage(1);
                }
                else if (bodyA.label === 'botShoe' && bodyB.label === 'player1') {
                    this.scene.takeDamage(1);
                }
                if (bodyA.label === 'sword' && bodyB.label === 'xBox') {
                    this.scene.sound.play('slash');
                    this.scene.shoeBoss.takeDamage();
                }
                else if (bodyA.label === 'xBox' && bodyB.label === 'sword') {
                    this.scene.sound.play('slash');
                    this.scene.shoeBoss.takeDamage();
                }
                if (bodyA.label === 'sword' && bodyB.label === 'bug') {
                    bodyB.gameObject.destroyObj();
                }
                else if (bodyA.label === 'bug' && bodyB.label === 'sword') {
                    bodyA.gameObject.destroyObj();
                }
            }
        });
        this.matter.world.on('collisionactive', function (event) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = event.pairs[i].bodyA;
                var bodyB = event.pairs[i].bodyB;
                // console.log(bodyA.label + " " + bodyB.label);
                if (bodyA.label === 'p1Bottom' || bodyB.label === 'p1Bottom') {
                    this.scene.touchingGround = true;
                }
                if (bodyA.label === 'p1Right' || bodyB.label === 'p1Right') {
                    this.scene.p1.x -= .08;
                }
                if (bodyA.label === 'p1Left' || bodyB.label === 'p1Left') {
                    this.scene.p1.x += .08;
                }
            }
        });
        this.matter.add.mouseSpring();//{collisionFilter: { group: this.canDrag } });
    }

    update() {
        // console.log(this.p1.x + " " + this.p1.y);
        //if next level is about to start
        if (!this.changingLevel) {
            //update bugs
            for (var i = 0; i < this.bugList.length; i++) {
                this.bugList[i].update();
            }
            if (this.CURRENT_LEVEL == 1) {
                if (Phaser.Input.Keyboard.JustDown(this.restartGame)) {
                    this.menuAudio.stop();
                    this.bugList = [];
                    this.scene.start("playScene", {level: 0});
                }
                if (this.shoeBoss.health <= 0) {
                    this.gameOver = true;
                    if (this.gameOver) {
                        this.gameOver = false;
                        this.endend = true;
                        this.endgame();
                    }
                }
                this.shoeBoss.update();
            }
        }

        // use this for mob collision and sword
        // console.log(this.matter.overlap(this.sword, this.testing));

        // update new spawn point for bridge mode
        this.swordBridgeSpawn.set(this.p1.x, this.p1.y -60);

        // attach sword to player
        this.sword.x = this.p1Pos.x;
        this.sword.y = this.p1Pos.y;

        if (this.gameMode%3 != 1) {
            //directional controls 
            if (this.moveLeft.isDown) {
                this.p1.setVelocityX(-this.ACCELERATION);
                // this.p1.applyForce({ x:-.005, y: 0 });
            }
            else if (this.moveRight.isDown) {
                this.p1.setVelocityX(this.ACCELERATION);
                // this.p1.applyForce({ x:.005, y: 0 });
            }
            //jump control
            if (Phaser.Input.Keyboard.JustDown(this.jump) && this.touchingGround) {
                //this.p1.anims.pause();
                this.p1.anims.play('jump1'); // > + jump animation needs to pause at the middle frame
                this.p1.setVelocityY(-this.JUMP_ACCELERATION);
                this.sound.play('jump');
                this.touchingGround = false;
            }
            // if (this.p1.body.velocity.x > 7) this.p1.setVelocityX(.25);
            // else if (this.p1.body.velocity.x < -7) this.p1.setVelocityX(-.25);

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

        // death from y value
        if (this.p1.y >= 520) {
            this.takeDamage(3);
        }


        if (this.gameMode % 3 == 1) {
            //rotate bridge sword controls
            if (this.rotateBridge.isDown) {
                this.swordBridge.angle -= 1;
            }
            // sword scale controls
            if (Phaser.Input.Keyboard.JustDown(this.scaleDown)) {
                // this.swordBridge.scaleX += .1;
                this.swordCurrent--;
                if (this.swordCurrent == -1) {
                    this.swordCurrent = this.maxSwordLvl-1;
                }
                this.swordCurrentMod = this.swordCurrent % this.maxSwordLvl;
                this.swordBridge.destroy(true);
                this.swordBridge = this.matter.add.image(this.swordBridgeSpawn.x, this.swordBridgeSpawn.y, 
                    this.swordSize[this.swordCurrentMod], null, {ignoreGravity: true}).setCollisionGroup(this.canDrag);
                this.swordBridge.angle = 90;
            }
            if (Phaser.Input.Keyboard.JustDown(this.scaleUp)) {
                // this.swordBridge.scaleX -= .1;
                this.swordCurrent++;
                this.swordCurrentMod = this.swordCurrent % this.maxSwordLvl;
                this.swordBridge.destroy(true);
                this.swordBridge = this.matter.add.image(this.swordBridgeSpawn.x, this.swordBridgeSpawn.y, 
                    this.swordSize[this.swordCurrentMod], null, {ignoreGravity: true}).setCollisionGroup(this.canDrag);
                this.swordBridge.angle = 90;
            }
        }

        //change game mode mode
        if (Phaser.Input.Keyboard.JustDown(this.gameModeToggle)) { this.gameMode++; }
        // gamemode 0 is default
        // gamemode 1 is bridge mode scale and change position of sword
        // gamemode 2 is walk around with no swinging sword
        if (this.gameMode % 3 == 1 && this.oneToggle) {
            this.swordBridge = this.matter.add.sprite(this.swordBridgeSpawn.x, this.swordBridgeSpawn.y,
            this.swordSize[this.swordCurrentMod], null, {isStatic: true, ignoreGravity: true}).setCollisionGroup(this.canDrag);
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

        //death condition
        if (this.p1Health <= 0) {
            // console.log('you lose!');
            this.respawn();
        }
    }

    updateHP() {
        this.healthText.text = "HP: " + this.p1Health;
    }
    respawn() {
        this.p1.x = this.p1Spawn.x;
        this.p1.y = this.p1Spawn.y;
        this.p1Health = this.maxHealth;
        this.updateHP();
    }
    restartScene() {
        this.menuAudio.stop();
        this.bugList = [];
        this.scene.restart({level: 1});
    }
    takeDamage(amt) {
        this.p1Health -= amt;
        this.sound.play('playerDamage');
        this.p1.setVelocityY(-3);
        this.updateHP();
    }
    endgame() {
        this.endConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#00FF00',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.endTxt = this.add.text(1280/2, 720/2, "YOU WON! PRESS 'W' TO RESTART", this.endConfig).setOrigin(.5);
        this.endTxt.setScrollFactor(0);
    }

}