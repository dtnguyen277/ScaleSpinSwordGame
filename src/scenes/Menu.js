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
        this.load.image('scroll1', 'Scroll1.png');
        this.load.image('scroll2', 'Scroll2.png');
        this.load.image('scroll3', 'Scroll3.png');


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

        //On Screen Buttons
        this.add.image(640,200,'logo'); 
        this.htp = this.add.image(640,400,'htp'); 
       this.play = this.add.image(640,500,'play'); 
        this.credits = this.add.image(640,600,'credits');
        
        
        this.htp.name = "htp"; 
        this.play.name = "play"; 
        this.credits.name = "credits"; 
       

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

        
    }

    onObjectClicked(pointer, gameObject){
 
        var Name = gameObject.name; 
        console.log(Name);

        switch(Name){
            case "htp":
                this.scroll = this.add.image(640,350,'scroll1');
                this.scroll.setVisible(true);
                this.scroll.name = "scroll1";  
                this.scroll.setInteractive(); 
                break; 

            case "play":
                this.scene.start("playScene", {level: 0});
                break;
                
            case "scroll1":
                this.scroll.setVisible(false);
                this.scroll = this.add.image(640,350,'scroll2');
                this.scroll.setVisible(true);
                this.scroll.name = "closeScroll";  
                this.scroll.setInteractive(); 
                break;
            
            case "closeScroll":
                this.scroll.setVisible(false);
                break;

            case "credits":
                this.scroll = this.add.image(640,350,'scroll3');
                this.scroll.setVisible(true);
                this.scroll.name = "closeScroll";  
                this.scroll.setInteractive(); 
                break; 
        }
        //console.log("clicked"); 
        
    }


  
}