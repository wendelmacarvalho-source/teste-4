const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    color: "red",

    velX: 0,
    velY: 0,

    speed: 5,
    jump: 15,
    gravity: 0.8,
    grounded: false
};

const plataformas = [
    { x: 0, y: 360, width: 800, height: 40 },   // chão
    { x: 150, y: 280, width: 150, height: 20 },
    { x: 400, y: 220, width: 180, height: 20 },
    { x: 650, y: 150, width: 120, height: 20 }
    
];

const inimigos = [
    {
        x: 180,
        y: 250,
        width: 30,
        height: 30,
        velocidade: 2,
        minX: 150,
        maxX: 270
    },
    {
        x: 430,
        y: 190,
        width: 30,
        height: 30,
        velocidade: 1.5,
        minX: 400,
        maxX: 550
    },
    {
        x: 670,
        y: 120,
        width: 30,
        height: 30,
        velocidade: 2,
        minX: 650,
        maxX: 740
    }
];

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function update() {

    // Movimento
    if (keys["ArrowRight"]) {
        player.velX = player.speed;
    } else if (keys["ArrowLeft"]) {
        player.velX = -player.speed;
    } else {
        player.velX = 0;
    }

    // Pulo
    if (keys["Space"] && player.grounded) {
        player.velY = -player.jump;
        player.grounded = false;
    }

    // Gravidade
    player.velY += player.gravity;

    player.x += player.velX;
    player.y += player.velY;

    // Limpa o estado antes de verificar colisões
    player.grounded = false;

    // Colisão com plataformas
    for (let p of plataformas) {

        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + p.height + player.velY + 5 &&
            player.velY >= 0
        ) {
            player.y = p.y - player.height;
            player.velY = 0;
            player.grounded = true;
        }

    }

    // Limites laterais
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha plataformas
    ctx.fillStyle = "#8B4513";

    for (let p of plataformas) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    // Personagem
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();