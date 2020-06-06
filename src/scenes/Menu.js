class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // load music assets here
    preload() {
        // this.load.audio('start', './assets/start.wav');
        // this.load.audio('siren', './assets/siren.wav');
        this.load.path = "./assets/"
        this.load.image('logo', 'Title.png');
        this.load.image('htp', 'HTP.png');
        this.load.image('play', 'Play.png');
        this.load.image('credits', 'Credits.png');

    }

    create() {
        // menu display
        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '28px',
            backgroundColor: '#249fde',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.image(640,200,'logo'); 
        this.htp = this.add.image(640,400,'htp'); 
       this.play = this.add.image(640,500,'play'); 
        this.credits = this.add.image(640,600,'credits');
        
        this.htp.name = "htp"; 
        this.play.name = "play"; 

        this.htp.setInteractive(); 
        this.play.setInteractive();
        this.credits.setInteractive(); 

        
        this.input.on('gameobjectdown', this.onObjectClicked, this); 


        //menu positioning variables
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

  
        /* menuConfig.color = '#FFF';
        menuConfig.backgroundColor = '#249fde';
        this.add.text(centerX, centerY, 'Press A or D to Start', 
        menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = '#249fde';
        this.add.text(centerX, centerY + textSpacer, 'Press R for Controls', 
        menuConfig).setOrigin(.5);
        menuConfig.backgroundColor = "#00AA00"
        this.add.text(centerX, centerY + textSpacer*2, 'Press F for Credits', 
        menuConfig).setOrigin(.5); */

        // define keys
        keyLEFT = this.input.keyboard.addKey('A');
        keyRIGHT = this.input.keyboard.addKey('D');

    }

    update() {
        // if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
        //     this.scene.start("playScene", {level: 0});
        // }

        
    }

    onObjectClicked(pointer, gameObject){
 
        var Name = gameObject.name;
        console.log(Name);

        switch(Name){
            case "htp":
                console.log("clicked"); 
                break; 
            case "play":
                this.scene.start("playScene", {level: 0});
                break;  
                 
                
        }
        //console.log("clicked"); 
        
    }


  
}