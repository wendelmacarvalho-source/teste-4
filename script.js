const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/////////////////////////
// CONFIGURAÇÃO
/////////////////////////

const gravidade = 0.8;

/////////////////////////
// JOGADOR
/////////////////////////

const player={

    x:100,
    y:100,

    width:40,
    height:50,

    velX:0,
    velY:0,

    speed:5,
    jump:16,

    grounded:false,

    vidas:3,

    pontos:0

};

/////////////////////////
// CONTROLES
/////////////////////////

const keys={};

document.addEventListener("keydown",e=>{

    keys[e.code]=true;

});

document.addEventListener("keyup",e=>{

    keys[e.code]=false;

});

/////////////////////////
// PLATAFORMAS
/////////////////////////

const plataformas=[

{x:0,y:460,width:2500,height:40},

{x:250,y:360,width:150,height:20},

{x:500,y:300,width:150,height:20},

{x:800,y:250,width:180,height:20},

{x:1100,y:330,width:200,height:20},

{x:1450,y:240,width:170,height:20},

{x:1700,y:170,width:200,height:20},

{x:2050,y:280,width:200,height:20}

];

/////////////////////////
// MOEDAS
/////////////////////////

const moedas=[

{x:280,y:320,coletada:false},

{x:560,y:260,coletada:false},

{x:860,y:210,coletada:false},

{x:1200,y:290,coletada:false},

{x:1500,y:200,coletada:false},

{x:1780,y:130,coletada:false}

];

/////////////////////////
// INIMIGOS
/////////////////////////

const inimigos=[

{
x:280,
y:330,
width:35,
height:30,
vel:2,
min:250,
max:370,
vivo:true
},

{
x:840,
y:220,
width:35,
height:30,
vel:2,
min:800,
max:950,
vivo:true
},

{
x:1500,
y:210,
width:35,
height:30,
vel:2,
min:1450,
max:1600,
vivo:true
}

];

/////////////////////////
// CÂMERA
/////////////////////////

let cameraX=0;

/////////////////////////
// UPDATE
/////////////////////////

function update(){

/////////////////////////
// MOVIMENTO
/////////////////////////

if(keys["ArrowRight"]){

player.velX=player.speed;

}

else if(keys["ArrowLeft"]){

player.velX=-player.speed;

}

else{

player.velX=0;

}

if(keys["Space"] && player.grounded){

player.velY=-player.jump;

player.grounded=false;

}

player.velY+=gravidade;

player.x+=player.velX;

player.y+=player.velY;

player.grounded=false;

/////////////////////////
// COLISÃO
/////////////////////////

for(let p of plataformas){

if(

player.x<p.x+p.width &&
player.x+player.width>p.x &&
player.y+player.height>p.y &&
player.y+player.height<p.y+p.height+player.velY+5 &&
player.velY>=0

){

player.y=p.y-player.height;

player.velY=0;

player.grounded=true;

}

}

/////////////////////////
// MOEDAS
/////////////////////////

for(let moeda of moedas){

if(moeda.coletada) continue;

if(

player.x<moeda.x+20 &&
player.x+player.width>moeda.x &&
player.y<moeda.y+20 &&
player.y+player.height>moeda.y

){

moeda.coletada=true;

player.pontos+=10;

}

}

/////////////////////////
// INIMIGOS
/////////////////////////

for(let inimigo of inimigos){

if(!inimigo.vivo) continue;

inimigo.x+=inimigo.vel;

if(inimigo.x<inimigo.min || inimigo.x>inimigo.max){

inimigo.vel*=-1;

}

if(

player.x<inimigo.x+inimigo.width &&
player.x+player.width>inimigo.x &&
player.y<inimigo.y+inimigo.height &&
player.y+player.height>inimigo.y

){

// jogador caiu sobre inimigo

if(player.velY>0 && player.y<inimigo.y){

inimigo.vivo=false;

player.velY=-10;

player.pontos+=50;

}

else{

player.vidas--;

player.x=100;

player.y=100;

player.velY=0;

}

}

}

/////////////////////////
// GAME OVER
/////////////////////////

if(player.vidas<=0){

alert("GAME OVER");

location.reload();

}

/////////////////////////
// CÂMERA
/////////////////////////

cameraX=player.x-300;

if(cameraX<0)cameraX=0;

}

/////////////////////////
// DESENHO
/////////////////////////

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/////////////////////////
// CÉU
/////////////////////////

ctx.fillStyle="#87CEEB";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.save();

ctx.translate(-cameraX,0);

/////////////////////////
// PLATAFORMAS
/////////////////////////

ctx.fillStyle="#8B4513";

for(let p of plataformas){

ctx.fillRect(p.x,p.y,p.width,p.height);

}

/////////////////////////
// MOEDAS
/////////////////////////

ctx.fillStyle="gold";

for(let moeda of moedas){

if(moeda.coletada) continue;

ctx.beginPath();

ctx.arc(moeda.x+10,moeda.y+10,10,0,Math.PI*2);

ctx.fill();

}

/////////////////////////
// INIMIGOS
/////////////////////////

ctx.fillStyle="purple";

for(let inimigo of inimigos){

if(!inimigo.vivo) continue;

ctx.fillRect(

inimigo.x,
inimigo.y,
inimigo.width,
inimigo.height

);

}

/////////////////////////
// JOGADOR
/////////////////////////

ctx.fillStyle="red";

ctx.fillRect(

player.x,
player.y,
player.width,
player.height

);

ctx.restore();

/////////////////////////
// HUD
/////////////////////////

ctx.fillStyle="black";
ctx.font="22px Arial";

ctx.fillText("Vidas: "+player.vidas,20,30);
ctx.fillText("Pontos: "+player.pontos,20,60);

}

/////////////////////////
// LOOP
/////////////////////////

function loop(){

update();

draw();

requestAnimationFrame(loop);

}

loop();