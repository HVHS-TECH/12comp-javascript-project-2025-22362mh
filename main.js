/*******************************************************/
// P5.play: Mio's game project
// Javascript game project
// Written by Mio Hoffman
/*******************************************************/

/*******************************************************/
// To Do List:
// 1. Make the title screen look better.
//2. Get the background in
/*******************************************************/

//CONSTANT VARIABLES
const GAMEHEIGHT = 500;
const GAMEWIDTH = 500;

const MOVEMENTSPEED = 5;

const APPLESIZE = 20;
const CHICKSIZE = 30;
const DUCKSIZE = 30;
const CHICKENSIZE = 30;

//NORMAL VARIABLES
var playerSize = 30;

var gameState = "start";

var score = 0;
var appleCount = 0;

/*******************************************************/
//preload()
/*******************************************************/
let chickImg;
let duckImg;
let chickenImg;
let appleImg;
let wormRightImg;
let wormLeftImg;
let grassBackgroundImg

function preload(){
    chickImg = loadImage("/assets/images/chick.png");
    duckImg = loadImage("/assets/images/duck.png");
    chickenImg = loadImage("/assets/images/chicken.png");
    appleImg = loadImage("/assets/images/apple.png");
    wormRightImg = loadImage("/assets/images/wormRight.png");
    wormLeftImg = loadImage("/assets/images/wormLeft.png");
    grassBackgroundImg = loadImage("/assets/images/grass.png");
}

/*******************************************************/
//setup()
/*******************************************************/
function setup(){
    cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT);
    displayMode('centered', 'pixelated', 2);

    allSprites.pixelPerfect = true;

    createPlayer();

    chickGroup = new Group();
    duckGroup = new Group();
    appleGroup = new Group();
    chickenGroup = new Group();

    cleanupExtraSprites();

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
    //removing the sprites from the start screen
    allSprites.remove();
}

/*******************************************************/
//runGame()
/*******************************************************/
function runGame(){
    //Starts the game and reloads the sprites so that they appear again
    gameState = "play";
    createPlayer();
    walls();

    deleteTitlePage();
}

/*******************************************************/
//deleteTitlePage()
/*******************************************************/
function deleteTitlePage(){
    //Removing html elements of the title page
    //This is so the canvas can be at the top of the page instead of coming after html elements
    var title = document.getElementById("title");
    var start = document.getElementById("start");
    var instructions = document.getElementById("instructions");

    title.remove();
    start.remove();
    instructions.remove();
}

/*******************************************************/
//gameLoop()
/*******************************************************/
function gameLoop(){
    movePlayer();

    //movement of the birds
    chickMovement();
    duckMovement();
    chickenMovement();

    playerCollisions();

    //checking if a duck or chick is overlapping an apple
    chickAppleCollision(chickGroup, appleGroup);
    duckAppleCollision(duckGroup, appleGroup);

    background(grassBackgroundImg);

    //if the number of chicks is less than 3, create another chick
    if (chickGroup.length < 3){
        chickGroup.add(createChicks());
    }

    //if the number of ducks is less than 2, create another duck
    if (duckGroup.length < 2){
        duckGroup.add(createDucks());
    }

    if (chickenGroup.length < 1){
        chickenGroup.add(createChickens());
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
    allSprites.remove();
    background("crimson");

    textSize(40);
    textAlign(CENTER, CENTER);
    text("YOU DIED!", GAMEWIDTH/2, GAMEHEIGHT/2 - 40);
    text("Score: " + score, GAMEWIDTH/2, GAMEHEIGHT/2 + 10);
}

function movePlayer(){
    if (kb.pressing('left')){
		player.vel.x = -MOVEMENTSPEED;
        player.image = wormLeftImg; //If the player goes left, the sprite image changes to face the left
	}
	else if (kb.pressing('right')) {
		player.vel.x = MOVEMENTSPEED;
        player.image = wormRightImg; //If the player goes right, the sprite image changes to face the right
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

function createPlayer(){
    console.log("create player");
    player = new Sprite(GAMEWIDTH/2, GAMEHEIGHT/2, playerSize, 'd');
    player.image = wormRightImg;
    player.scale = 1.5;
    player.rotationLock = true;
}

function playerCollisions(){
        //Checking collisions of sprites with the player
        player.collides(appleGroup, getApple);
        player.collides(chickGroup, chickDeath);
        player.collides(duckGroup, duckDeath);
        player.collides(chickenGroup, chickenDeath);
}

function createChicks(){
    //THE FOLLOWING CODE WAS GENERATED FROM CHATGPT
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
    //END OF CODE GENERATED BY CHATGPT

    var chick = new Sprite(x, y, CHICKSIZE);
    chick.image = chickImg;
    chick.image.offset.y = -10; //This is to align the image with the hitbox
    chick.scale = 1.4;
    chick.rotationLock = true;
    return chick;
}

function chickMovement(){
    //Every chick moves towards the player separately
    for (i = 0; i < chickGroup.length; i++){
        chickGroup[i].moveTo(player, 0.7);
    }
}

function chickDeath(player, _chick){
    if (appleCount >= 2){ //If player has two apples, they can defeat a chick
        _chick.remove();
        score++
        appleCount = appleCount - 2; //Minus the amount of apples it took to defeat the chick
    }
    else { //If they don't have two apples, they die
        gameState = "end";
    }
}

function createDucks(){
    //THE FOLLOWING CODE WAS GENERATED FROM CHATGPT
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
    //END OF CODE GENERATED BY CHATGPT

    var duck = new Sprite(x, y, DUCKSIZE);
    duck.image = duckImg;
    duck.image.offset.y = -4;
    duck.scale = 1.5;
    duck.rotationLock = true;
    return duck;
}

function duckMovement(){
    //Every duck in the group moves to the player separately
    for (i = 0; i < duckGroup.length; i++){
        duckGroup[i].moveTo(player, 0.5);
    }
}

function duckDeath(player, _duck){
    if (appleCount >= 3){ //If player has 3 apples, they can defeat a duck
        _duck.remove();
        score = score + 2; //Adds 2 points to the score instead of 1
        appleCount = appleCount - 3; //Minus the amount of apples it took to defeat the duck
    }
    else{ //If they don't have three apples, they die
        gameState = "end";
    }
}

function createChickens(){
    //THE FOLLOWING CODE WAS GENERATED FROM CHATGPT
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
    //END OF CODE GENERATED BY CHATGPT

    var chicken = new Sprite(x, y, CHICKENSIZE);
    chicken.image = chickenImg;
    chicken.image.offset.y = -4;
    chicken.scale = 1.5;
    chicken.rotationLock = true;
    return chicken;
}

function chickenMovement(){
    //Every duck in the group moves to the player separately
    for (i = 0; i < chickenGroup.length; i++){
        chickenGroup[i].moveTo(player, 0.5);
    }
}

function chickenDeath(player, _chicken){
    if (appleCount >= 4){ //If player has 3 apples, they can defeat a duck
        _chicken.remove();
        score = score + 3; //Adds 2 points to the score instead of 1
        appleCount = appleCount - 4; //Minus the amount of apples it took to defeat the duck
    }
    else{ //If they don't have three apples, they die
        gameState = "end";
    }
}

function createApples(){
    var apple = new Sprite(random(0, GAMEHEIGHT), random(0, GAMEHEIGHT), APPLESIZE);
    apple.image = (appleImg);
    apple.scale = 1.2;
    apple.rotationLock = true;
    return apple;
}

function getApple(player, _apple){
    //When a player collides with an apple, the apple count goes up
    _apple.remove();
    appleCount++;
}

// FOLLOWING FUNCTION OF chickAppleCollision WAS GENERATED BY CHATGPT
//This function was created to prevent the chicks from moving apples
function chickAppleCollision() {
    for (let i = 0; i < chickGroup.length; i++) {
        let chick = chickGroup[i];
        let chickOverlapping = false; // Track if any chick is overlapping an apple

        for (let j = 0; j < appleGroup.length; j++) {
            let apple = appleGroup[j];

            if (chick.overlapping(apple)) {
                apple.collider = "none"; // Disable apple collider
                chickOverlapping = true; // Mark this apple as being overlapped
            }
        }

        // Restore collider if no chicks are overlapping the apple
        for (let j = 0; j < appleGroup.length; j++) {
            let apple = appleGroup[j];

            if (!chickOverlapping) { 
                apple.collider = "d"; // Reset to dynamic if no chicks are touching it
            }
        }
    }
}

// FOLLOWING FUNCTION OF duckAppleCollision WAS GENERATED BY CHATGPT
//This function was created to prevent the ducks from moving apples
function duckAppleCollision(){
    for (let i = 0; i < duckGroup.length; i++) {
        let duck = duckGroup[i];
        let duckOverlapping = false; // Track if any duck is overlapping an apple

        for (let j = 0; j < appleGroup.length; j++) {
            let apple = appleGroup[j];

            if (duck.overlapping(apple)) {
                apple.collider = "none"; // Disable apple collider
                duckOverlapping = true; // Mark this apple as being overlapped
            }
        }

        // Restore collider if no ducks are overlapping the apple
        for (let j = 0; j < appleGroup.length; j++) {
            let apple = appleGroup[j];

            if (!duckOverlapping) { 
                apple.collider = "d"; // Reset to dynamic if no ducks are touching it
            }
        }
    }
}

//This function was created by chatGPT
//This function deletes any extra sprites that are a chick, apple or duck not a part of the groups.
function cleanupExtraSprites(){
    for (let i = 0; i < allSprites.length; i++) {
        let sprite = allSprites[i];
        if (sprite !== player &&  // Don't remove the player
            !chickGroup.includes(sprite) && 
            !duckGroup.includes(sprite) && 
            !chickenGroup.includes(sprite) &&
            !appleGroup.includes(sprite)) {
            sprite.remove(); 
        }
    }
}

function walls(){
    wallLH  = new Sprite(0, height/2, 8, height, 's');
	wallRH  = new Sprite(500, height/2, 8, height, 's');
	wallTop = new Sprite(250, 0, width, 8, 's');
	wallBot = new Sprite(250, 500, width, 8, 's');
	wallLH.color = 'brown';
	wallRH.color = 'brown';
	wallTop.color = 'brown';
	wallBot.color = 'brown';
}