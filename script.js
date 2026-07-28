const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
    x:100,
    y:300,
    width:40,
    height:40,
    color:"red",

    velX:0,
    velY:0,

    speed:5,
    jump:15,
    gravity:0.8,
    grounded:false
};

const keys = {};

document.addEventListener("keydown",(e)=>{
    keys[e.code]=true;
});

document.addEventListener("keyup",(e)=>{
    keys[e.code]=false;
});

function update(){

    // Movimento

    if(keys["ArrowRight"]){
        player.velX = player.speed;
    }else if(keys["ArrowLeft"]){
        player.velX = -player.speed;
    }else{
        player.velX = 0;
    }

    // Pulo

    if(keys["Space"] && player.grounded){
        player.velY = -player.jump;
        player.grounded = false;
    }

    // Gravidade

    player.velY += player.gravity;

    player.x += player.velX;
    player.y += player.velY;

    // Chão

    if(player.y + player.height >= canvas.height){
        player.y = canvas.height-player.height;
        player.velY = 0;
        player.grounded = true;
    }

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="green";
    ctx.fillRect(0,360,800,40);

    ctx.fillStyle=player.color;
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

}

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();