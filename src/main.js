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
    obstacleFreq: 1800,
    minSpeed: 1800,
    maxSpeed: 800,
    busSpeed: 3,
    minBus: 3,
    maxBus: 4.5,
    layers: 8,
};

// keys that we will use
let keyLEFT, keyRIGHT;

// global highscore value
let hiScore = 0;

var randSpawn, rand2, currBusSpeed;
