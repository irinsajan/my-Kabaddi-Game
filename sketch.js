//The Kabaddi game project
//Database course project

//game states ---  0 for START, 1 for RED_RIDE, 2 for YELLOW_RIDE
//toss --- 1 for RED_RIDE, 2 for YELLOW_RIDE
//player1 --- YELLOW PLAYER
//player2 --- RED PLAYER


var database;
var player1, player2, playerAnimation1, playerAnimation2;
var posPlayer1, posPlayer2;
var gameState;
var scorePlayer1 = 0, scorePlayer2 = 0;
var toss;

function preload(){
    //loading animation after naming files in sequence
    playerAnimation2 = loadAnimation("assets/player001.png", "assets/player002.png");
    playerAnimation1 = loadAnimation("assets/player003.png", "assets/player004.png");    
}

function setup(){
    createCanvas(600,600);
    database = firebase.database();

    //permanent listener for gameState in database
    var gameStateRef = database.ref('gameState');
    gameStateRef.on("value",(data)=>{
        gameState = data.val();
    });
/*
    //permanent listener for toss in database
    var tossRef = database.ref('toss');
    tossRef.on("value",(data)=>{
        toss = data.val();
    }); 
*/

    //permanent listener for player1 score in database
    var player1ScoreRef = database.ref('player1Score');
    player1ScoreRef.on("value",(data)=>{
        scorePlayer1 = data.val();
    }); 

    //permanent listener for player2 score in database
    var player2ScoreRef = database.ref('player2Score');
    player2ScoreRef.on("value",(data)=>{
        scorePlayer2 = data.val();
    }); 

    //player1/YELLOW player created here
    player1 = createSprite(400,300);
    player1.addAnimation("player1 moving",playerAnimation1);
    player1.setCollider("circle",0,0,40);
    player1.debug = true;
    playerAnimation1.frameDelay = 200;
    player1.scale = -0.5;
    

    //reading position of player1 from database and updating the same on screen
    var playerPositionRef1 = database.ref('player1/position');
    playerPositionRef1.on("value",(data)=>{
        posPlayer1 = data.val();
        player1.x = posPlayer1.x;
        player1.y = posPlayer1.y;
    });

   // resetPosition1();

    //RED player/player2 created here
    player2 = createSprite(200,300);
    player2.addAnimation("player2 moving",playerAnimation2);
    player2.setCollider("circle",0,0,40);
    player2.debug = true;
    playerAnimation2.frameDelay = 200;
    player2.scale = 0.5;
    
    //reading position of player2 from database and updating the same on screen
    var playerPositionRef2 = database.ref('player2/position');
    playerPositionRef2.on("value",(data)=>{
        posPlayer2 = data.val();
        player2.x = posPlayer2.x;
        player2.y = posPlayer2.y;
    });

   // resetPosition2();
}

function draw(){
    background("white");

    textSize(20);
    fill("red");
    text("RED: "+scorePlayer2, 170,20);
    fill("yellow");
    text("YELLOW: "+scorePlayer1, 350,20);
    

    //drawing line through the centre of the screen
    for(var num = 0; num<=600; num=num+20)
        line(300,num,300,num+10);

    //drawing the yellow line
    for(var num = 0; num<=600; num=num+20){
        strokeWeight(3);
        stroke("yellow");
        line(100,num,100,num+10);
    }

    //drawing the red line
    for(var num = 0; num<=600; num=num+20){
        strokeWeight(3);
        stroke("red");
        line(500,num,500,num+10);
    }

    //display the text to start toss in gameState 0
    if(gameState === 0){
        textSize(20);
        stroke("black");
        text("Press 'Space' to toss",100,100);
    
    }
    
    //RED RIDE
    if(gameState === 2){
        if (player2.x>500){
            writeScore(-5,5);
            alert("RED WON");
            updateState(0);
        }
      
        if(player1.isTouching(player2)){
            writeScore(5,-5);
            alert("RED LOST");
            updateState(0);
        }
 
    }


    //YELLOW RIDE
    if(gameState === 1){
        if (player1.x<100){
            writeScore(5,-5);
            alert("YELLOW WON");
            updateState(0);           
        }

       
      
        if(player1.isTouching(player2)){
            writeScore(-5,5);
            alert("YELLOW LOST");
            updateState(0);            
        }
        
    }     
            
 

    drawSprites();
    
}

//updating player1 position in database
function writePosition1(x,y){
    database.ref('player1/position').update({
        'x': posPlayer1.x + x,
        'y': posPlayer1.y + y
    });
}

//updating player2 position in database
function writePosition2(x,y){
    database.ref('player2/position').update({
        'x': posPlayer2.x + x,
        'y': posPlayer2.y + y
    });
}

//function to update game state in database
function updateState(s){
    database.ref('/').update({
        'gameState': s
    });
}

//function to update toss in database
function updateToss(t){
    database.ref('/').update({
        'toss': t
    });
}

//function to update players' score in database
function writeScore(s1,s2){
    database.ref('/').update({
        'player1Score': scorePlayer1+s1,
        'player2Score': scorePlayer2+s2
    });
}

//function to reset player1 to original position
function resetPosition1(){
    database.ref('player1/position').update({
        'x': 400,
        'y': 300
    });
}

//function to reset player2 to original position
function resetPosition2(){
    database.ref('player2/position').update({
        'x': 200,
        'y': 300
    });
}
/*
function gameToss(){  
    var t = Math.round(random(1,2));
    if(t===toss&&t===1){
        updateToss(2);
        updateState(2);
        alert("YELLOW RIDE");
    }
    else if(t===toss&&t===2){
        updateToss(1);
        updateState(1);
        alert("RED RIDE");
    }
    else if(t!==toss){
        updateToss(t);
        updateState(t);
        if(t===1)
            alert("RED RIDE");
        else
            alert("YELLOW RIDE");
    }      
}
*/

function keyPressed(){
    if (keyCode === 32 && gameState === 0){
        resetPosition1();
        resetPosition2();
        toss = Math.round(random(1,2));
        if (toss===1){
            updateState(1);
            alert("YELLOW RIDE");
        }
        else{
            updateState(2);
            alert("RED RIDE");
        }
    }

    if (keyCode === LEFT_ARROW && gameState === 1){
        writePosition1(-5,0);
    }
    if (keyCode === RIGHT_ARROW && gameState === 1){
        writePosition1(+5,0);
    }
    if (keyCode === UP_ARROW){
        writePosition1(0,-5);
    }
    if (keyCode === DOWN_ARROW){
        writePosition1(0,+5);
    }


    if (keyCode === 65 && gameState === 2){
        writePosition2(-5,0);
    }
    if (keyCode === 68 && gameState === 2){
        writePosition2(+5,0);
    }
    if (keyCode === 87){
        writePosition2(0,-5);
    }
    if (keyCode === 83){
        writePosition2(0,+5);
    }
}



