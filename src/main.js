// Daniel Nguyen
// Dnguy182@ucsc.edu
// Rakhi Narain
// rmnarain@ucsc.edu
// Game Title: Highway Escape
// Date of Completion: 05/03/2020
// Creative Tilt
/*
While programming this game I used new methods that I learned a lot and used new things that 
I had never done before. An example of this is the procedural obstacle generation I created.
Instead of respawning and recylcing obstacles. I used a stack where I pushed on new obstacles
spliced off old ones when they weren't needed. I also created a difficulty curve where the 
spawn frequency and speed of the road increased as you dodged more obstacles and slowed down
when you ran into obstacles.
*/


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
