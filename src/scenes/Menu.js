class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // load music assets here
    preload() {
        // this.load.audio('start', './assets/start.wav');
        // this.load.audio('siren', './assets/siren.wav');
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

        this.add.text(centerX, centerY - textSpacer, 'Spin Sword Game', 
        menuConfig).setOrigin(.5);
        menuConfig.color = '#FFF';
        menuConfig.backgroundColor = '#0000FA';
        this.add.text(centerX, centerY, 'Use arrow keys to move and jump', 
        menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = '#AA00FE';
        this.add.text(centerX, centerY + textSpacer, 'Use A and D to control your sword', 
        menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = "#00AA00"
        this.add.text(centerX, centerY + textSpacer*2, 'Press < > to continue', 
        menuConfig).setOrigin(.5);
        this.add.text(centerX, centerY + textSpacer*3, 'filler', 
        menuConfig).setOrigin(.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start("playScene");
        }

    }
}