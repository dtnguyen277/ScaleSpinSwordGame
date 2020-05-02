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
    }

    create() {
        // road tile sprite
        this.roadScroll = this.add.tileSprite(0, 0, 480, 640, 'road').setOrigin(0, 0);
        this.p1Bus = new Bus(this, game.config.width/2, 400, 'bus').setOrigin(.5, .25);
        // this.block = new Obstacle(this, 130, 400, 'block').setOrigin(.5, 0);

        // spawn points for obstacle
        // [130, 242, 354]
        // this.spawnPoints = [110, 242, 374];
        this.obstacleCount = 0;
        this.obstacleList = [];
        this.obstacleSelect = [ 'block', 'car1', 'car2' ];
        this.spawnObstacle();
        

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard
        .KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard
        .KeyCodes.RIGHT);

    }

    update() {
        //scroll Road on Y axis
        this.roadScroll.tilePositionY -= game.settings.busSpeed;
        this.p1Bus.update();
        // iterate array and update all obstacles on array
        for (var i = 0; i < this.obstacleList.length; i++) {
            this.obstacleList[i].update();
            // if you collide destroy obstacle and slow down game
            if (this.checkCollision(this.p1Bus, this.obstacleList[i])) {
                this.obstacleList[i].destroy();
                this.redDifficulty();
            }
        }
        // when obstacle hits the bottom delete it from scene and shift it off of array
        // increase difficulty as you dodge more obstacles
        if (this.obstacleList.length > 0) {
            if (this.obstacleList[0].y >= 690) {
                this.obstacleList[0].destroy();
                this.obstacleList.shift();
                this.incDifficulty();
            }
        }
    }

    spawnObstacle() {
        randSpawn = Phaser.Math.Between(110, 374);
        rand2 = Phaser.Math.Between(0,2);
        this.obs = new Obstacle(this, randSpawn, 0, this.obstacleSelect[rand2]).setOrigin(.5, 1);
        this.obstacleList.push(this.obs);
        this.time.delayedCall(game.settings.obstacleFreq + game.settings.obstacleFreqScale, () => {
            this.spawnObstacle();
        }, null, this);
    }

    incDifficulty() {
        // game.settings.busSpeed *= 1.1;
        if (game.settings.busSpeed < 3) {
            game.settings.busSpeed += .5;
        }
        game.settings.obstacleFreqScale *= .95;
        console.log(game.settings.obstacleFreq + game.settings.obstacleFreqScale);
    }

    redDifficulty() {
        if (game.settings.busSpeed > 0) {
            game.settings.busSpeed -= .5;
        }
        if (game.settings.busSpeed <= 0) {
            game.settings.busSpeed = .5;
        }
        game.settings.obstacleFreqScale *= 1.05;
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

}