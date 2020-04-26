class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // load assets here: Bus, Infinite Scrolling road on Y axis
    preload() {
        this.load.image('road', './assets/Road.png');
        this.load.image('bus', './assets/Bus.png');
        this.load.image('block', './assets/ObstacleFiller.png');
    }

    create() {
        // road tile sprite
        this.roadScroll = this.add.tileSprite(0, 0, 480, 640, 'road').setOrigin(0, 0);
        this.p1Bus = new Bus(this, game.config.width/2, 400, 'bus').setOrigin(.5, -.25);
        // this.block = new Obstacle(this, 130, 400, 'block').setOrigin(.5, 0);

        // spawn points for obstacle
        this.spawnPoints = [130, 242, 354];
        rand = Phaser.Math.Between(0,2);
        this.obstacleCount = 0;
        this.obstacleList = [];
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
        for (var i = 0; i < this.obstacleList.length; i++) {
            this.obstacleList[i].update();
        }
        console.log(this.obstacleList.length);
    }

    spawnObstacle() {
        rand = Phaser.Math.Between(0,2);
        this.obs = new Obstacle(this, this.spawnPoints[rand], 0, 'block').setOrigin(.5, 1);
        this.obstacleList.push(this.obs);
        this.time.delayedCall(1500, () => {
            this.spawnObstacle();
        }, null, this);
    }

}