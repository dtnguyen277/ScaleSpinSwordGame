class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // load assets here: Bus, Infinite Scrolling road on Y axis
    preload() {
        this.load.image('road', './assets/Road.png');
        this.load.image('bus', './assets/Bus.png');
        this.load.image('block', './assets/RoadBlock.png');
        this.load.image('car1', './assets/Car1.png');
        this.load.image('car2', './assets/Car2.png');
        this.load.image('police', './assets/PoliceCar.png');
        this.load.image('gas', './assets/Gas.png');
        this.load.image('red', './assets/red.png');
        this.load.image('gray', './assets/gray.png');
        this.load.spritesheet('explosion', './assets/PoliceExplosion.png', 
        {frameWidth: 36, frameHeight: 55, startFrame: 0, endFrame: 5});
        this.load.audio('music', './assets/HighwayMusic.mp3');
    }

    create() {
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
        // rate of change variables
        this.obstROC = (game.settings.minSpeed - game.settings.maxSpeed) / game.settings.layers;
        this.busROC = (game.settings.maxBus - game.settings.minBus) / game.settings.layers;
        // road tile sprite
        this.roadScroll = this.add.tileSprite(0, 0, 480, 640, 'road').setOrigin(0, 0);
        this.p1Bus = new Bus(this, game.config.width/2, 500, 'bus').setOrigin(.5, .5);
        this.gasStatusBack = new gasBar(this, game.config.width - 300, 625, 'gray').setOrigin(0, .5);
        this.gasStatus = new gasBar(this, game.config.width - 300, 625, 'red').setOrigin(0, .5);
        // this.block = new Obstacle(this, 130, 400, 'block').setOrigin(.5, 0);

        // spawn points for obstacle
        // [130, 242, 354]
        // this.spawnPoints = [110, 242, 374];
        this.obstacleCount = 0;
        this.obstacleList = [];
        this.obstacleSelect = [ 'block', 'car1', 'car2', 'gas' ];
        this.speed = game.settings.obstacleFreq;
        currBusSpeed = game.settings.busSpeed;
        this.spawnObstacle();
        

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard
        .KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard
        .KeyCodes.RIGHT);

        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        this.score = 0;
        this.timeScore = this.add.text(5, 600, "Score: " + this.score , this.scoreConfig);
        this.incTime();

        this.gasDecay();

        this.gameOver = false;
        this.playGameOver = true;

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', 
            { start: 0, end: 5, first: 0 }),
            frameRate: 30
        });
    }

    update() {
        this.speed = Phaser.Math.Clamp(game.settings.obstacleFreq, game.settings.maxSpeed,
        game.settings.minSpeed);
        currBusSpeed = Phaser.Math.Clamp(game.settings.busSpeed, game.settings.minBus, 
        game.settings.maxBus);
        if (!this.gameOver) {
            //scroll Road on Y axis
            this.roadScroll.tilePositionY -= currBusSpeed;
            this.p1Bus.update();
            this.gasStatus.update();
        }
        // iterate array and update all obstacles on array
        for (var i = 0; i < this.obstacleList.length; i++) {
            this.obstacleList[i].update();
            // if you collide destroy obstacle and slow down game
            if (this.checkCollision(this.p1Bus, this.obstacleList[i])) {
                if (this.obstacleList[i].texture.key == 'gas') {
                    this.gasStatus.changeAmt(50);
                    this.sound.play('gasPower');
                }
                else {
                    this.sound.play('bang');
                    this.score -= 5;
                }
                this.obstacleList[i].destroy();
                this.obstacleList.splice(i, 1);
                this.redDifficulty();
                console.log(this.speed + " " + currBusSpeed + " " + this.obstacleList.length);
            }
        }
        // when obstacle hits the bottom delete it from scene and shift it off of array
        // increase difficulty as you dodge more obstacles
        if (this.obstacleList.length > 0) {
            if (this.obstacleList[0].y >= 640) {
                this.obstacleList[0].destroy();
                this.obstacleList.shift();
                this.incDifficulty();
                console.log(this.speed + " " + currBusSpeed + " " + this.obstacleList.length);
            }
        }

        if (this.gameOver) {
            this.menuAudio.stop();
            this.gameOverScene();
            if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        }

        if (this.gasStatus.gas <= 25) {
            this.policeSpawn();
        }
    }

    spawnObstacle() {
        randSpawn = Phaser.Math.Between(110, 374);
        rand2 = Phaser.Math.Between(0, this.obstacleSelect.length);
        this.obs = new Obstacle(this, randSpawn, 0, this.obstacleSelect[rand2]).setOrigin(.5, 1);
        this.obstacleList.push(this.obs);
        this.time.delayedCall(this.speed, () => {
            if (!this.gameOver) {
                this.spawnObstacle();
            }
        }, null, this);
    }

    incDifficulty() {
        game.settings.busSpeed += this.busROC;
        game.settings.obstacleFreq -= this.obstROC;
    }

    redDifficulty() {
        game.settings.busSpeed -= this.busROC;
        game.settings.obstacleFreq += this.obstROC;
    }

    checkCollision(bus, obstacle) {
        // simple AABB checking
        if (bus.x < obstacle.x + obstacle.width && 
            bus.x + bus.width > obstacle.x && 
            bus.y < obstacle.y + obstacle.height && 
            bus.height + bus.y > obstacle.y) {
                return true;
        }
        else {
            return false;
        }
    }

    incTime() {
        this.time.delayedCall(1000, () => {
            this.score++;
            this.timeScore.text = "Score: " + this.score;
            if (!this.gameOver) {
                this.incTime();
            }
        }, null, this);
    }

    gasDecay() {
        this.time.delayedCall(250, () => {
            this.gasStatus.changeAmt(-1.5);
            if (this.gasStatus.gas <= 0) {
                this.gameOver = true;
            }
            this.gasDecay();
        }, null, this);
    }

    gameOverScene() {
        this.time.delayedCall(250, () => {
            this.add.text(game.config.width/2, game.config.height/2, 
            'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 
            'Press <- to go to Menu', this.scoreConfig).setOrigin(0.5);
        }, null, this);
    }
    policeSpawn() {
        if (this.playGameOver) {
            this.police1 = new Police(this, this.p1Bus.x + 75, 650, 'police').setOrigin(.5, .5);
            this.police2 = new Police(this, this.p1Bus.x + 150, 600, 'police').setOrigin(.5, .5);
            this.police3 = new Police(this, this.p1Bus.x - 75, 650, 'police').setOrigin(.5, .5);
            this.police4 = new Police(this, this.p1Bus.x - 150, 600, 'police').setOrigin(.5, .5);
            var sirenSound = this.sound.add('siren');
            sirenSound.play();
            this.time.delayedCall(3000, () => {
                sirenSound.stop();
            }, null, this);
            this.playGameOver = false;
        }
        this.police1.update();
        this.police2.update();
        this.police3.update();
        this.police4.update();
        if (this.checkCollision(this.p1Bus, this.police1)) {
            this.police1.isExploded = true;
            this.carExplode(this.police1);
        }
        if (this.checkCollision(this.p1Bus, this.police2)) {
            this.police2.isExploded = true;
            this.carExplode(this.police2);
        }
        if (this.checkCollision(this.p1Bus, this.police3)) {
            this.police3.isExploded = true;
            this.carExplode(this.police3);
        }
        if (this.checkCollision(this.p1Bus, this.police4)) {
            this.police4.isExploded = true;
            this.carExplode(this.police4);
        }
    }

    carExplode(ship) {
        ship.alpha = 0;
        ship.isExploded = false;
        ship.destroy();
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(.5, .5);
        boom.anims.play('explode');
        ship.x = -100;
        ship.y = -100;
        this.sound.play('bang');
        boom.on('animationcomplete', () => {
            boom.destroy();
        });
    }

}