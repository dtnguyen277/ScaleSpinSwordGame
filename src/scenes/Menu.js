class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // load music assets here
    preload() {
        this.load.audio('bang', './assets/bang.wav');
        this.load.audio('gasPower', './assets/gasPower.mp3');
        this.load.audio('start', './assets/start.wav');
        this.load.audio('siren', './assets/siren.wav');
    }

    create() {
        // menu display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // menu positioning variables
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - textSpacer, 'Highway Escape', 
        menuConfig).setOrigin(.5);
        menuConfig.color = '#FFF';
        menuConfig.backgroundColor = '#0000FA';
        this.add.text(centerX, centerY, 'Use <-> to move the Bus', 
        menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = '#AA00FE';
        this.add.text(centerX, centerY + textSpacer, 'Press <- or -> to Play', 
        menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = "#00AA00"
        this.add.text(centerX, centerY + textSpacer*2, 'Avoid Obstacles', 
        menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY + textSpacer*3, 'and collect Gas', 
        menuConfig).setOrigin(.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.play('start');
            this.scene.start("playScene");
        }

    }
}