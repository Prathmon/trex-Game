var trex, trex_Running,trex_Collided;

var ground, ground_Image, invisibleGround;

var cloud, cloud_Image,cloudGroup;

var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6,obstacleGroup;

var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var score;
var gamove,reset,game_Over,re_Set,gamove_Sound,
    jump_Sound,hundr_Sound;

function preload()
{
  
  trex_Running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_Collided = loadAnimation("trex_collided.png");
  
  ground_Image = loadImage("ground2.png");
  
  cloud_Image = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  game_Over = loadImage("gameOver.png");
  re_Set = loadImage("restart.png");
  
  gamove_Sound = loadSound("die.mp3");
  jump_Sound = loadSound("jump.mp3");
  hundr_Sound = loadSound("checkPoint.mp3");
  
}

function setup()
{
  
  createCanvas(600, 200);
  
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_Running);
  trex.addAnimation("collided", trex_Collided);
  trex.scale = 0.5;
  
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", ground_Image);
  
  invisibleGround  = createSprite(300,190,600,5);
  invisibleGround.visible = false;
  
  cloudGroup = new Group();
  obstacleGroup = new Group();
  
  trex.setCollider("rectangle",0,0,80,trex.height);
  trex.debug = false;
  
  score = 0;
  
   gamove = createSprite(300,100,20,20);
   gamove.addImage("GO",game_Over);
   gamove.scale = 0.4;
   reset = createSprite(300,120,10,10);
   reset.addImage("RS",re_Set);
   reset.scale = 0.4;
  
}

function draw()
{
   
  background(250);
  
  trex.collide(invisibleGround);
  
  text("Score : " + score,470,50)
  
  if(gamestate === PLAY) {
    
    gamove.visible = false;
    reset.visible = false;
    
    ground.velocityX = -(6+3*score/1000);
    
    score = score + Math.round(getFrameRate()/60);
    
    if(ground.x < 0)
    {
     ground.x = ground.width/2;
    }
     
   if(keyDown("space") && trex.y >= 160)
   {
    trex.velocityY = -13;
    jump_Sound.play();
   }
     
   trex.velocityY = trex.velocityY + 0.8;
     
   createClouds();
  
   createObstacles();
    
   if(obstacleGroup.isTouching(trex))
   {
     gamestate = END;
     gamove_Sound.play();
   }
    
    if(score > 0 && score % 100 === 0){
      hundr_Sound.play();
    }
  }
  
  else if(gamestate === END)
  {
   trex.changeAnimation("collided",trex_Collided);
   ground.velocityX = 0;
   cloudGroup.setVelocityXEach(0);
   obstacleGroup.setVelocityXEach(0);
   cloudGroup.setLifetimeEach(-1);
   obstacleGroup.setLifetimeEach(-1);
    
    gamove.visible = true;
    reset.visible = true;
    
    if(mousePressedOver(reset)){
      restart();
    }
  
  }
  
  drawSprites();

}

function createClouds()
{
  if(frameCount % 125 === 0)
  {
    cloud = createSprite(600,100,50,50);
    cloud.addImage("clo",cloud_Image);
    cloud.y = random(10,100)
    cloud.scale = 0.5;
    cloud.velocityX = -4;
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudGroup.add(cloud);
  }
}

function createObstacles()
{
  if(frameCount % 93 === 0)
  {
    obstacle = createSprite(600,170,10,10);
    obstacle.velocityX = -(6+3*score/1000);
    var ran = Math.round(random(1,6));
    switch (ran)
    {
      case 1 : obstacle.addImage("o",obstacle1);
      break;
      case 2 : obstacle.addImage("ob",obstacle2);
      break;
      case 3 : obstacle.addImage("obs",obstacle3);
      break;
      case 4 : obstacle.addImage("obst",obstacle4);
      break;
      case 5 : obstacle.addImage("obsta",obstacle5);
      break;
      case 6 : obstacle.addImage("obstac",obstacle6);
      break;
      default : break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    obstacleGroup.add(obstacle);
  }
}

function restart(){
  gamestate = PLAY;
  gamove.visible = false;
  reset.visible = false;
  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_Running);
}