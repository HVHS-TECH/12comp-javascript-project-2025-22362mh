/*******************************************************/
// P5.play: Mio's game project
// Javascript game project
// Written by Mio Hoffman
/*******************************************************/

/*******************************************************/
// To Do List:
// 1. Figure out how to spawn the birds in
// 2. Spread out the spawning in of the birds
/*******************************************************/

const GAMEHEIGHT = 500;
const GAMEWIDTH = 500;

const MOVEMENTSPEED = 10;

var playerSize = 30;
var birdSize = 20;

var gameState = "start";

/*******************************************************/
//setup()
/*******************************************************/
function setup(){
    console.log("setup");
    cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT);

    player = new Sprite(GAMEWIDTH/2, GAMEHEIGHT/2, playerSize, 'd');
    player.color = "pink";

    birdGroup = new Group();
}

/*******************************************************/
//draw()
/*******************************************************/
function draw(){
    if (gameState == "start"){
        startScreen();
    }
    else if (gameState == "play"){
        gameLoop();
    }
    else if (gameState == "end"){
        endGame();
    }
}

/*******************************************************/
//startScreen()
/*******************************************************/
function startScreen(){
    player.remove();
    birdGroup.remove();
}

/*******************************************************/
//runGame()
/*******************************************************/
function runGame(){
    //Starts the game and reloads the sprites so that they appear again
    gameState = "play";
    setup();
}

/*******************************************************/
//gameLoop()
/*******************************************************/
function gameLoop(){
    movePlayer();
    background('blue');

    if (birdGroup.length < 5){
        birdGroup.add(createBirds());
    }
}

/*******************************************************/
//endGame()
/*******************************************************/
function endGame(){

}

function movePlayer(){
    if (kb.pressing('left')){
		player.vel.x = -MOVEMENTSPEED;
	}
	else if (kb.pressing('right')) {
		player.vel.x = MOVEMENTSPEED;
	}
	else if (kb.pressing('up')) {
		player.vel.y = -MOVEMENTSPEED;
	}
	else if (kb.pressing('down')) {
		player.vel.y = MOVEMENTSPEED;
	}

	if (kb.released('left')) {
		player.vel.x = 0;
	}
	else if (kb.released('right')) {
		player.vel.x = 0;
	}
	else if (kb.released('up')) {
		player.vel.y = 0;
	}
	else if (kb.released('down')){
		player.vel.y = 0;
	}
}

function createBirds(){
        var bird = new Sprite(random(0, GAMEHEIGHT), random(0, GAMEHEIGHT), birdSize);
    bird.color = "cyan";
    return bird;
}