/*******************************************************/
// P5.play: Mio's game project
// Javascript game project
// Written by Mio Hoffman
/*******************************************************/

/*******************************************************/
// To Do List:
// 1. Make the title screen look better.
// 2. Fix chick movement
// 3. Fix spawn timing of chicks and apples
/*******************************************************/

const GAMEHEIGHT = 500;
const GAMEWIDTH = 500;

const MOVEMENTSPEED = 10;

const APPLESIZE = 15;
const CHICKSIZE = 30;

var playerSize = 30;

var gameState = "start";

var score = 0;
var appleCount = 0;

/*******************************************************/
//preload()
/*******************************************************/
let chickImg;
let appleImg;
function preload(){
    chickImg = loadImage("/assets/images/chick.png");
    appleImg = loadImage("/assets/images/apple.png");
}

/*******************************************************/
//setup()
/*******************************************************/
function setup(){
    cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT);

    player = new Sprite(GAMEWIDTH/2, GAMEHEIGHT/2, playerSize, 'k');
    player.color = "pink";

    chickGroup = new Group();

    appleGroup = new Group();

    player.collides(appleGroup, getApple);
    player.collides(chickGroup, chickDeath);
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
    chickGroup.remove();
}

/*******************************************************/
//runGame()
/*******************************************************/
function runGame(){
    //Starts the game and reloads the sprites so that they appear again
    gameState = "play";
    setup();
    walls();

}

/*******************************************************/
//gameLoop()
/*******************************************************/
function gameLoop(){
    movePlayer();
    chickMovement();
    background("green");

    //if the number of chicks is less than 5, create another chick
    if (chickGroup.length < 5){
        chickGroup.add(createChicks());
    }

    //if the amount of apples is less than 5, create another apple
    if (appleGroup.length < 5){
        appleGroup.add(createApples());
    }

    textSize(20);
    text("Score: " + score, 10, 30);

    textSize(20);
    text("Apples: " + appleCount, 10, 50);
}

/*******************************************************/
//endGame()
/*******************************************************/
function endGame(){
    player.remove();
    chickGroup.remove();
    appleGroup.remove();

    background("red");
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

function createChicks(){
    var chick = new Sprite(random(0, GAMEHEIGHT), random(0, GAMEHEIGHT), CHICKSIZE);
    chick.image = (chickImg);
    chick.scale = 1.3;
    return chick;
}

function chickMovement(){
    for (i = 0; i < chickGroup.length; i++){
        chickGroup[i].moveTo(player, 0.7);
    }
}

function chickDeath(player, _chick){
    if (appleCount >= 2){
        _chick.remove();
        score++
        appleCount = appleCount - 2;
    }
    else {
        gameState = "end";
    }
}

function createApples(){
    var apple = new Sprite(random(0, GAMEHEIGHT), random(0, GAMEHEIGHT), APPLESIZE);
    apple.image = (appleImg);
    return apple;
}

function getApple(player, _apple){
    _apple.remove();
    appleCount++;
}

function walls(){
    wallLH  = new Sprite(0, height/2, 8, height, 's');
	wallRH  = new Sprite(500, height/2, 8, height, 's');
	wallTop = new Sprite(250, 0, width, 8, 's');
	wallBot = new Sprite(250, 500, width, 8, 's');
	wallLH.color = 'purple';
	wallRH.color = 'purple';
	wallTop.color = 'purple';
	wallBot.color = 'purple';
}