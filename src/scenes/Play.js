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
    }

    create() {
        // rate of change variables
        this.obstROC = (game.settings.minSpeed - game.settings.maxSpeed) / game.settings.layers;
        this.busROC = (game.settings.maxBus - game.settings.minBus) / game.settings.layers;
        // road tile sprite
        this.roadScroll = this.add.tileSprite(0, 0, 480, 640, 'road').setOrigin(0, 0);
        this.p1Bus = new Bus(this, game.config.width/2, 500, 'bus').setOrigin(.5, .5);
        this.gasStatusBack = new gasBar(this, game.config.width/2- 180, 600, 'gray').setOrigin(0, .5);
        this.gasStatus = new gasBar(this, game.config.width/2- 180, 600, 'red').setOrigin(0, .5);
        // this.block = new Obstacle(this, 130, 400, 'block').setOrigin(.5, 0);

        // spawn points for obstacle
        // [130, 242, 354]
        // this.spawnPoints = [110, 242, 374];
        this.obstacleCount = 0;
        this.obstacleList = [];
        this.obstacleSelect = [ 'block', 'car1', 'car2', 'police', 'gas' ];
        this.speed = game.settings.obstacleFreq;
        currBusSpeed = game.settings.busSpeed;
        this.spawnObstacle();
        

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard
        .KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard
        .KeyCodes.RIGHT);
        // this.gasStatus.changeAmt(100);
    }

    update() {
        this.speed = Phaser.Math.Clamp(game.settings.obstacleFreq, game.settings.maxSpeed,
        game.settings.minSpeed);
        currBusSpeed = Phaser.Math.Clamp(game.settings.busSpeed, game.settings.minBus, 
        game.settings.maxBus);
        //scroll Road on Y axis
        this.roadScroll.tilePositionY -= currBusSpeed;
        this.p1Bus.update();
        this.gasStatus.update();
        // iterate array and update all obstacles on array
        for (var i = 0; i < this.obstacleList.length; i++) {
            this.obstacleList[i].update();
            // if you collide destroy obstacle and slow down game
            if (this.checkCollision(this.p1Bus, this.obstacleList[i])) {
                if (this.obstacleList[i].texture.key == 'gas') {
                    this.gasStatus.changeAmt(50);
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
    }

    spawnObstacle() {
        randSpawn = Phaser.Math.Between(110, 374);
        rand2 = Phaser.Math.Between(0, this.obstacleSelect.length);
        this.obs = new Obstacle(this, randSpawn, 0, this.obstacleSelect[4]).setOrigin(.5, 1);
        this.obstacleList.push(this.obs);
        this.time.delayedCall(this.speed, () => {
            this.spawnObstacle();
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

}