const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const statusText = document.getElementById("status");

const groundY = 380;
const keys = {};
let score = 0;
let won = false;

const player = {
  x: 80, y: groundY - 64, w: 32, h: 64,
  vx: 0, vy: 0, speed: 4, color: "#19a9c7"
};

const maira = {
  x: 740, y: groundY - 64, w: 32, h: 64, color: "#ed70a5"
};

let hearts = [];

function reset() {
  score = 0;
  won = false;
  player.x = 80;
  player.y = groundY - player.h;
  player.vx = 0;
  player.vy = 0;
  hearts = [];

  for (let i = 0; i < 10; i++) {
    hearts.push({
      x: 180 + i * 65,
      y: 240 + Math.sin(i * 1.7) * 55,
      taken: false
    });
  }

  scoreText.textContent = score;
  statusText.textContent = "Encontre os corações!";
}

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function drawTree(x, y) {
  rect(x + 20, y + 40, 24, 100, "#82502c");
  rect(x, y, 64, 64, "#27753c");
  rect(x - 16, y + 24, 32, 44, "#328c43");
  rect(x + 42, y + 18, 35, 44, "#3a9a48");
  rect(x + 12, y + 12, 15, 15, "#51b653");
}

function drawPerson(p, name) {
  // Cabeça
  rect(p.x + 5, p.y, 24, 24, "#efc69c");

  // Cabelo
  if (name === "Dérik") {
    rect(p.x + 4, p.y - 3, 26, 9, "#54321f");
    rect(p.x + 4, p.y + 3, 5, 10, "#54321f");
  } else {
    rect(p.x + 3, p.y - 4, 27, 10, "#5a2e22");
    rect(p.x + 2, p.y + 4, 6, 24, "#5a2e22");
    rect(p.x + 26, p.y + 4, 6, 24, "#5a2e22");
  }

  // Olhos e corpo
  rect(p.x + 10, p.y + 10, 3, 3, "#252525");
  rect(p.x + 22, p.y + 10, 3, 3, "#252525");
  rect(p.x + 3, p.y + 25, 26, 22, p.color);
  rect(p.x - 3, p.y + 26, 6, 21, "#efc69c");
  rect(p.x + 29, p.y + 26, 6, 21, "#efc69c");
  rect(p.x + 4, p.y + 47, 10, 17, "#354f7b");
  rect(p.x + 18, p.y + 47, 10, 17, "#354f7b");

  ctx.fillStyle = "white";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(name, p.x + 16, p.y - 12);
}

function drawHeart(x, y) {
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("❤️", x, y + 10);
}

function drawWorld() {
  // Céu e sol
  rect(0, 0, 900, 500, "#79d7ff");
  rect(760, 35, 65, 65, "#ffed70");

  // Nuvens
  rect(90, 65, 75, 20, "white");
  rect(110, 48, 40, 22, "white");
  rect(470, 100, 90, 18, "white");
  rect(500, 83, 35, 20, "white");

  // Montanhas
  rect(0, 245, 180, 135, "#76a86a");
  rect(80, 210, 100, 35, "#76a86a");
  rect(500, 265, 200, 115, "#63965b");
  rect(580, 230, 100, 35, "#63965b");

  // Chão de blocos
  rect(0, groundY, 900, 120, "#80502e");
  rect(0, groundY, 900, 18, "#51ae43");

  for (let x = 0; x < 900; x += 40) {
    rect(x, groundY + 18, 2, 120, "#694027");
    rect(x, groundY + 18, 40, 3, "#3e8e34");
  }

  drawTree(35, 245);
  drawTree(280, 260);
  drawTree(630, 240);
  drawTree(820, 255);
}

function update() {
  if (won) return;

  player.vx = 0;

  if (keys.ArrowLeft || keys.a || keys.A) player.vx = -player.speed;
  if (keys.ArrowRight || keys.d || keys.D) player.vx = player.speed;

  player.x += player.vx;
  player.x = Math.max(0, Math.min(900 - player.w, player.x));

  // Gravidade e pulo
  player.vy += 0.55;
  player.y += player.vy;

  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
  }

  // Coletar corações
  for (const heart of hearts) {
    if (heart.taken) continue;

    const closeX = player.x < heart.x + 15 &&
      player.x + player.w > heart.x - 15;
    const closeY = player.y < heart.y + 15 &&
      player.y + player.h > heart.y - 15;

    if (closeX && closeY) {
      heart.taken = true;
      score++;
      scoreText.textContent = score;
    }
  }

  if (score === 10) {
    won = true;
    statusText.textContent = "Vocês venceram! 💕";
  }
}

function draw() {
  drawWorld();

  for (const heart of hearts) {
    if (!heart.taken) drawHeart(heart.x, heart.y);
  }

  drawPerson(player, "Dérik");
  drawPerson(maira, "Maíra");

  if (won) {
    rect(120, 145, 660, 110, "#214b32");
    ctx.fillStyle = "#ffe68a";
    ctx.textAlign = "center";
    ctx.font = "bold 30px monospace";
    ctx.fillText("DÉRIK E MAÍRA!", 450, 185);
    ctx.font = "18px monospace";
    ctx.fillText("Vocês coletaram todos os corações! 💚", 450, 220);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
    e.preventDefault();
  }

  if (
    (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") &&
    player.y + player.h >= groundY - 1 && !won
  ) {
    player.vy = -11;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function bindButton(id, key) {
  const button = document.getElementById(id);

  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    keys[key] = true;
    button.setPointerCapture(e.pointerId);
  });

  const release = () => { keys[key] = false; };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}

bindButton("left", "ArrowLeft");
bindButton("right", "ArrowRight");

document.getElementById("jump").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  if (player.y + player.h >= groundY - 1 && !won) player.vy = -11;
});

document.getElementById("restart").addEventListener("click", reset);

reset();
loop();
