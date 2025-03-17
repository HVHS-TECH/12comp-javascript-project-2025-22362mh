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

const MOVEMENTSPEED = 5;

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
let wormRightImg;
let wormLeftImg;

function preload(){
    chickImg = loadImage("/assets/images/chick.png");
    appleImg = loadImage("/assets/images/apple.png");
    wormRightImg = loadImage("/assets/images/wormRight.png");
    wormLeftImg = loadImage("/assets/images/wormLeft.png");
}

/*******************************************************/
//setup()
/*******************************************************/
function setup(){
    cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT);

    player = new Sprite(GAMEWIDTH/2, GAMEHEIGHT/2, playerSize, 'k');
    player.image = wormRightImg;
    player.scale = 1.5;

    chickGroup = new Group();
    appleGroup = new Group();

    //Checking collisions of sprites with the player
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
    chickAppleCollision(chickGroup, appleGroup);
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
        player.image = wormLeftImg;
	}
	else if (kb.pressing('right')) {
		player.vel.x = MOVEMENTSPEED;
        player.image = wormRightImg;
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
    //The following code was generated from chatGPT:
    let side = floor(random(4)); // 0 = top, 1 = right, 2 = bottom, 3 = left
    let x, y;

    if (side === 0) { // Top edge
        x = random(0, GAMEWIDTH);
        y = 30;
    } 
    else if (side === 1) { // Right edge
        x = GAMEWIDTH - 30;
        y = random(0, GAMEHEIGHT);
    } 
    else if (side === 2) { // Bottom edge
        x = random(0, GAMEWIDTH);
        y = GAMEHEIGHT - 30;
    } 
    else { // Left edge
        x = 30;
        y = random(0, GAMEHEIGHT);
    }
    //That is the end of the code generated from ChatGPT

    var chick = new Sprite(x, y, CHICKSIZE);
    chick.image = chickImg;
    chick.image.offset.y = -10;
    chick.scale = 1.4;
    chick.debug = true;
    return chick;
}

function chickMovement(){
    for (i = 0; i < chickGroup.length; i++){
        chickGroup[i].moveTo(player, 0.7);
    }
}

function chickDeath(player, _chick){
    if (appleCount >= 2){ //If player has two apples, they can defeat a chick
        _chick.remove();
        score++
        appleCount = appleCount - 2;
    }
    else { //If they don't have two apples, they die
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

function chickAppleCollision(_chick, _apple){
    if (_chick.overlapping(_apple)){ // Checking if a chick is touching an apple
        _apple.collider = "none"; // Turns apple collider into none so that the chick doesn't move the apple
    }
    else {
        _apple.collider = "d"; //Turns the apple's collider back to dynamic
    }
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