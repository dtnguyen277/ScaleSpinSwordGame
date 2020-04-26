// Daniel Nguyen
// Dnguy182@ucsc.edu

let config = {
     type: Phaser.CANVAS,
     width: 480,
     height: 640,
     scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    busSpeed: 1,
};

// keys that we will use
let keyLEFT, keyRIGHT;

// global highscore value
let hiScore = 0;

var rand;
