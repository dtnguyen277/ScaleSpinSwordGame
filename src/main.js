// Daniel Nguyen
// Dnguy182@ucsc.edu
// Rakhi Narain
// rmnarain@ucsc.edu
// Game Title: 
// Date of Completion: 
// Creative Tilt
/*

*/

let config = {
    type: Phaser.CANVAS,
    pixelArt: true,
    width: 1280,
    height: 720,
    physics: {
       default: "matter",
       matter: {
        //    debug: true,
    }
   },
    scene: [ Menu, Play ],
    backgroundColor: "#249fde"
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
   
};

// keys that we will use
let keyLEFT, keyRIGHT;
let cursors = null;

// global highscore value
let hiScore = 0;

