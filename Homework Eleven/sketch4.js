// ============================================================
// GRAVITY MAZE + MONSTER — Definitive Version
// ============================================================
let cols = 10;
let rows = 10;
let cellSize = 60;
let canvasW, canvasH;

let gravityDir = 0;
let lastGravityChange = 0;
let gravityInterval = 15000;
let gravityStrength = 0.25;

let ball = { x: 90, y: 30, r: 12, vx: 0, vy: 0, speed: 3 };

let monster = {
  x: 400,
  y: 200,
  r: 18,
  speed: 0.2,
  certainty: 0.3,
  stillnessTimer: 1
};

let block = { x: -100, y: -100, size: 60, timer: 0, active: false };

let gameWon = false;
let gameOver = false;

let gameStarted = false;
let showControls = false;
let controlsTimer = 0;

let endScreenTimer = 0;

let maze = [];
let walls = [];

function buildMaze() {
  for (let r = 0; r < rows; r++) {
    maze[r] = [];
    for (let c = 0; c < cols; c++) {
      maze[r][c] = { top: false, bottom: false, left: false, right: false };
    }
  }

  for (let c = 0; c < cols; c++) {
    maze[0][c].top = true;
    maze[9][c].bottom = true;
  }
  for (let r = 0; r < rows; r++) {
    maze[r][0].left = true;
    maze[r][9].right = true;
  }
  maze[9][5].bottom = false;

  maze[0][6].bottom = true; maze[0][7].bottom = true; maze[0][8].bottom = true;
  maze[1][1].bottom = true; maze[1][2].bottom = true;
  maze[2][0].bottom = true; maze[2][1].bottom = true;
  maze[4][3].bottom = true; maze[4][4].bottom = true; maze[4][5].bottom = true;
  maze[4][6].bottom = true; maze[4][7].bottom = true;
  maze[5][1].bottom = true; maze[5][2].bottom = true; maze[5][3].bottom = true;
  maze[7][7].bottom = true; maze[7][8].bottom = true; maze[7][9].bottom = true;
  maze[8][1].bottom = true; maze[8][2].bottom = true; maze[8][3].bottom = true;
  maze[8][4].bottom = true; maze[8][5].bottom = true; maze[8][6].bottom = true;
  maze[8][7].bottom = true; maze[8][8].bottom = true;

  maze[6][1].right = true; maze[7][1].right = true; maze[9][1].right = true;
  maze[2][2].right = true; maze[3][2].right = true; maze[4][2].right = true;
  maze[0][3].right = true; maze[6][3].right = true; maze[7][3].right = true;
  maze[0][4].right = true; maze[1][4].right = true; maze[2][4].right = true;
  maze[3][4].right = true; maze[6][4].right = true; maze[7][4].right = true;
  maze[8][4].right = true;
  maze[1][6].right = true; maze[2][6].right = true;
  maze[5][7].right = true; maze[6][7].right = true; maze[7][7].right = true;
  maze[2][8].right = true; maze[3][8].right = true; maze[4][8].right = true;
  maze[5][8].right = true; maze[6][8].right = true;
  maze[2][9].right = true; maze[3][9].right = true; maze[4][9].right = true;
  maze[5][9].right = true; maze[6][9].right = true; maze[7][9].right = true;
  maze[8][9].right = true;
}

function buildWallRectangles() {
  walls = [];
  const thick = 8;

  walls.push({x: 0, y: 0, w: canvasW, h: thick});
  walls.push({x: 0, y: 0, w: thick, h: canvasH});
  walls.push({x: canvasW - thick, y: 0, w: thick, h: canvasH});

  let bottomY = canvasH - thick;
  walls.push({x: 0, y: bottomY, w: 5*cellSize, h: thick});
  walls.push({x: 6*cellSize, y: bottomY, w: canvasW - 6*cellSize, h: thick});

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * cellSize;
      let y = r * cellSize;
      if (maze[r][c].top)    walls.push({x: x, y: y - thick/2, w: cellSize, h: thick});
      if (maze[r][c].bottom) walls.push({x: x, y: y + cellSize - thick/2, w: cellSize, h: thick});
      if (maze[r][c].left)   walls.push({x: x - thick/2, y: y, w: thick, h: cellSize});
      if (maze[r][c].right)  walls.push({x: x + cellSize - thick/2, y: y, w: thick, h: cellSize});
    }
  }
}

function setup() {
  canvasW = cols * cellSize;
  canvasH = rows * cellSize;
  createCanvas(canvasW, canvasH);
  buildMaze();
  buildWallRectangles();
  lastGravityChange = millis();
  monster.x = random(100, canvasW - 100);
  monster.y = random(100, canvasH - 100);
}

function draw() {
  background(30);
  drawGrid();
  drawWalls();
  drawBlock();
  if (gameStarted && !gameOver && !gameWon) {
    updateBall();
    updateMonster();
  }
  if (!gameStarted) {
    drawStartScreen();
  }
  if (showControls) {
    drawControls();
  }
  drawMonster();
  drawBall();
  checkWin();
  checkGravityChange();

  // Green border
  noFill();
  stroke(0, 255, 100);
  strokeWeight(6);
  rect(3, 3, canvasW - 6, canvasH - 6);

  // Exit marker — electric blue, drawn after border so it shows on top
  stroke(0, 200, 255);
  strokeWeight(6);
  line(5*cellSize, canvasH - 3, 6*cellSize, canvasH - 3);

if (gameOver || gameWon) {
    drawEndScreen();
    if (endScreenTimer === 0) endScreenTimer = millis();
    if (millis() - endScreenTimer > 60000) { // 60 seconds
      resetGame();
      gameStarted = false;
      endScreenTimer = 0;
    }
  }
}

// ====================== COLLISION ======================
function checkCollision() {
  for (let w of walls) {
    let left = w.x, right = w.x + w.w, top = w.y, bottom = w.y + w.h;

    if (ball.x + ball.r > left && ball.x - ball.r < right &&
        ball.y + ball.r > top  && ball.y - ball.r < bottom) {

      let ol = (ball.x + ball.r) - left;
      let or = right - (ball.x - ball.r);
      let ot = (ball.y + ball.r) - top;
      let ob = bottom - (ball.y - ball.r);
      let minO = min(ol, or, ot, ob);

      if (minO === ot)      { ball.y = top    - ball.r; ball.vy = 0; }
      else if (minO === ob) { ball.y = bottom + ball.r; ball.vy = 0; }
      else if (minO === ol) { ball.x = left   - ball.r; ball.vx = 0; }
      else if (minO === or) { ball.x = right  + ball.r; ball.vx = 0; }
    }
  }

  // Blue block
  if (block.active) {
    let bLeft = block.x, bRight = block.x + block.size;
    let bTop = block.y, bBottom = block.y + block.size;

    if (ball.x + ball.r > bLeft && ball.x - ball.r < bRight &&
        ball.y + ball.r > bTop  && ball.y - ball.r < bBottom) {

      let ol = (ball.x + ball.r) - bLeft;
      let or = bRight - (ball.x - ball.r);
      let ot = (ball.y + ball.r) - bTop;
      let ob = bBottom - (ball.y - ball.r);
      let minO = min(ol, or, ot, ob);

      if (minO === ot)      { ball.y = bTop    - ball.r; ball.vy = 0; }
      else if (minO === ob) { ball.y = bBottom + ball.r; ball.vy = 0; }
      else if (minO === ol) { ball.x = bLeft   - ball.r; ball.vx = 0; }
      else if (minO === or) { ball.x = bRight  + ball.r; ball.vx = 0; }
    }
  }

  // Exit gap
  if (gravityDir === 0 && ball.y + ball.r > canvasH) {
    if (ball.x > 5*cellSize && ball.x < 6*cellSize) {
      if (ball.y > canvasH + 30) gameWon = true;
    } else {
      ball.y = canvasH - ball.r;
      ball.vy = 0;
    }
  }

  if (ball.y - ball.r < 0)       { ball.y = ball.r;           ball.vy = 0; }
  if (ball.x + ball.r > canvasW) { ball.x = canvasW - ball.r; ball.vx = 0; }
  if (ball.x - ball.r < 0)       { ball.x = ball.r;           ball.vx = 0; }
}

// ====================== UPDATES ======================
function updateBall() {
  if (gameOver || gameWon) return;

  if (gravityDir === 0)      ball.vy += gravityStrength;
  else if (gravityDir === 1) ball.vx -= gravityStrength;
  else if (gravityDir === 2) ball.vy -= gravityStrength;
  else if (gravityDir === 3) ball.vx += gravityStrength;

  ball.vx = constrain(ball.vx, -cellSize, cellSize);
  ball.vy = constrain(ball.vy, -cellSize, cellSize);

  let move = 0;
  if (keyIsDown(LEFT_ARROW))  move = -ball.speed;
  if (keyIsDown(RIGHT_ARROW)) move = ball.speed;

  if (gravityDir === 0 || gravityDir === 2) ball.vx = move;
  else ball.vy = move;

  let steps = 10;
  for (let i = 0; i < steps; i++) {
    ball.x += ball.vx / steps;
    ball.y += ball.vy / steps;
    checkCollision();
  }
}

function updateMonster() {
  if (gameOver || gameWon) return;

  let speedSq = ball.vx*ball.vx + ball.vy*ball.vy;

  if (speedSq < 3) {
    monster.stillnessTimer += 1/60;
    if (monster.stillnessTimer > 1.6) monster.certainty = 1.0;
  } else {
    monster.stillnessTimer = 0;
    monster.certainty = map(speedSq, 0, 400, 0.25, 0.92);
  }

  let targetX = ball.x + random(-90 + 170*monster.certainty, 90 - 170*monster.certainty);
  let targetY = ball.y + random(-90 + 170*monster.certainty, 90 - 170*monster.certainty);

  let dx = targetX - monster.x;
  let dy = targetY - monster.y;
  let d = sqrt(dx*dx + dy*dy) || 1;

  monster.x += (dx / d) * monster.speed;
  monster.y += (dy / d) * monster.speed;

  // Monster blocked by blue block
  if (block.active) {
    let bLeft = block.x, bRight = block.x + block.size;
    let bTop = block.y, bBottom = block.y + block.size;

    if (monster.x + monster.r > bLeft && monster.x - monster.r < bRight &&
        monster.y + monster.r > bTop  && monster.y - monster.r < bBottom) {
      let dx = monster.x - (bLeft + block.size/2);
      let dy = monster.y - (bTop  + block.size/2);
      let d = sqrt(dx*dx + dy*dy) || 1;
      monster.x += (dx / d) * 4;
      monster.y += (dy / d) * 4;
    }
  }

  if (dist(monster.x, monster.y, ball.x, ball.y) < monster.r + ball.r &&
      monster.certainty > 0.95 && speedSq < 8) {
    gameOver = true;
  }
}

// ====================== DRAWING ======================
function drawGrid() {
  stroke(20); strokeWeight(0.5);
  for (let r = 0; r <= rows; r++) line(0, r*cellSize, canvasW, r*cellSize);
  for (let c = 0; c <= cols; c++) line(c*cellSize, 0, c*cellSize, canvasH);

  //noStroke(); fill(255,255,0); textSize(10); textAlign(CENTER,CENTER);
  //for (let c = 0; c < cols; c++) text(c, c*cellSize + cellSize/2, cellSize/2);
  //for (let r = 0; r < rows; r++) text(r, cellSize/2, r*cellSize + cellSize/2);

  //let dirs = ['↓ DOWN', '← LEFT', '↑ UP', '→ RIGHT'];
  //fill(255, 180, 0);
  //textSize(14);
  //textAlign(LEFT, CENTER);
  //text('Gravity: ' + dirs[gravityDir], 10, canvasH - 25);
}

function drawWalls() {
  stroke(220); strokeWeight(4);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * cellSize;
      let y = r * cellSize;
      if (maze[r][c].top)    line(x, y, x + cellSize, y);
      if (maze[r][c].bottom) line(x, y + cellSize, x + cellSize, y + cellSize);
      if (maze[r][c].left)   line(x, y, x, y + cellSize);
      if (maze[r][c].right)  line(x + cellSize, y, x + cellSize, y + cellSize);
    }
  }
stroke(0, 200, 255); strokeWeight(6);
line(5*cellSize, 10*cellSize, 6*cellSize, 10*cellSize);
}

function drawMonster() {
  let alpha = map(monster.certainty, 0.2, 1, 100, 255);
  let sizeBoost = map(monster.certainty, 0.2, 1, 0, 4);

  fill(160, 40, 220, alpha);
  noStroke();
  circle(monster.x, monster.y, (monster.r + sizeBoost) * 2);

  if (monster.certainty > 0.65) {
    fill(255);
    circle(monster.x - 7, monster.y - 4, 8);
    circle(monster.x + 7, monster.y - 4, 8);
    let pupilOffset = monster.certainty > 0.9 ? 2 : 0;
    fill(0);
    circle(monster.x - 7 + pupilOffset, monster.y - 4, 4);
    circle(monster.x + 7 + pupilOffset, monster.y - 4, 4);
  }

  if (monster.certainty > 0.92) {
    fill(255, 60, 60, 80);
    noStroke();
    circle(monster.x, monster.y, monster.r * 2.4);
  }
}

function drawBall() {
  if (gameWon || gameOver) return;
  fill(255, 100, 100);
  noStroke();
  circle(ball.x, ball.y, ball.r*2);
}

function drawBlock() {
  if (!block.active) return;
  if (millis() - block.timer > 5000) { block.active = false; return; }
  fill(100, 200, 255, 180);
  noStroke();
  rect(block.x, block.y, block.size, block.size);
}

function drawEndScreen() {
  fill(0, 0, 0, 180);
  noStroke();
  rect(0, 0, canvasW, canvasH);

  textAlign(CENTER, CENTER);

  if (gameOver) {
    fill(200, 50, 50);
    textSize(50);
    text("WORK WORK WORK", canvasW/2, canvasH/2 - 60);
  } else {
    fill(50, 200, 100);
    textSize(50);
    text("Now Get Back To Work!", canvasW/2, canvasH/2 - 60);
  }

  // No. button
  let btnX = canvasW/2;
  let btnY = canvasH/2 + 80;
  let btnW = 140;
  let btnH = 50;

  fill(70, 70, 70);
  stroke(0, 255, 100);
  strokeWeight(3);
  rect(btnX - btnW/2, btnY - btnH/2, btnW, btnH, 10);

  fill(255);
  noStroke();
  textSize(28);
  text("No.", btnX, btnY);
}

function checkWin() {
  // Win handled in checkCollision and drawEndScreen
}

// ====================== INPUT ======================
function mousePressed() {
  if (!gameStarted) {
    let btnX = canvasW/2;
    let btnY = canvasH/2 + 80;
    let btnW = 140;
    let btnH = 50;
    if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 &&
        mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      gameStarted = true;
      showControls = true;
      controlsTimer = millis();
    }
    return;
  }

  if (gameOver || gameWon) {
    let btnX = canvasW/2;
    let btnY = canvasH/2 + 80;
    let btnW = 140;
    let btnH = 50;
    if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 &&
        mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      resetGame();
    }
    return;
  }

  block.x = Math.floor(mouseX / cellSize) * cellSize;
  block.y = Math.floor(mouseY / cellSize) * cellSize;
  block.timer = millis();
  block.active = true;
}

function resetGame() {
  ball.x = 90; ball.y = 30;
  ball.vx = 0; ball.vy = 0;
  gravityDir = 0;
  monster.x = random(100, canvasW - 100);
  monster.y = random(100, canvasH - 100);
  monster.certainty = 0.3;
  monster.stillnessTimer = 1;
  monster.speed = 0.2;
  block.active = false;
  gameWon = false;
  gameOver = false;
  gameStarted = true;
  showControls = true;
  controlsTimer = millis();
  lastGravityChange = millis();
}

function checkGravityChange() {
  if (millis() - lastGravityChange > gravityInterval) {
    let dirs = [0,1,2,3].filter(d => d !== gravityDir);
    gravityDir = dirs[Math.floor(Math.random()*dirs.length)];
    gravityInterval = 15000 + Math.random()*15000;
    lastGravityChange = millis();
    ball.vx = 0; ball.vy = 0;
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') resetGame();
}
  function drawStartScreen() {
  fill(0, 0, 0, 200);
  noStroke();
  rect(0, 0, canvasW, canvasH);
  fill(50, 200, 100);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("The AntiWerk", canvasW/2, canvasH/2 - 60);
  fill(70, 70, 70);
  stroke(0, 255, 100);
  strokeWeight(3);
  rect(canvasW/2 - 70, canvasH/2 + 55, 140, 50, 10);
  fill(255);
  noStroke();
  textSize(28);
  text("Yes.", canvasW/2, canvasH/2 + 80);
}

function drawControls() {
  if (millis() - controlsTimer > 2000) {
    showControls = false;
    return;
  }
  fill(0, 0, 0, 180);
  noStroke();
  rect(0, 0, canvasW, canvasH);
  fill(0, 200, 255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Arrow keys", canvasW/2, canvasH/2 - 20);
  text("Rt Click", canvasW/2, canvasH/2 + 20);
}
