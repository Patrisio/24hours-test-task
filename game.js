const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score;
let requiredScore = 1000;
let requiredScoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

class Player {
  constructor(coordinateX, coordinateY, width, height, color) {
    this.coordinateX = coordinateX;
    this.coordinateY = coordinateY;
    this.width = width;
    this.height = height;
    this.color = color;

    this.dy = 0;
    this.jumpForce = 20;
    this.originalHeight = height;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  animate() {
    if (keys['Space'] || keys['KeyW']) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }
    
    this.coordinateY += this.dy;

    if (this.coordinateY + this.height < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.coordinateY = canvas.height - 75;
    }

    this.draw();
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    var radius = 30;
    var startAngle = 0;
    var endAngle = Math.PI * 2;

    ctx.arc(this.coordinateX, this.coordinateY + radius / 2, radius, startAngle, endAngle);
    ctx.fill();
  }

  jump() {
    if (this.grounded && this.jumpTimer === 0) {
      console.log(111);
      console.log(this.jumpTimer);
      console.log(this.jumpForce);
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
      console.log(this.dy);
    } else {
      console.log(222);
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 50);
    }
  }
}

class Obstacle {
  constructor(coordinateX, coordinateY, width, height, color) {
    this.coordinateX = coordinateX;
    this.coordinateY = coordinateY;
    this.width = width;
    this.height = height;
    this.color = color;

    this.dx = -gameSpeed;
  }

  update() {
    this.coordinateX += this.dx;
    this.draw();
    this.dx = -gameSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.coordinateX, this.coordinateY, this.width, this.height);
    ctx.stroke();
    ctx.strokeStyle = 'yellow';
    ctx.closePath();
  }

  create() {
    let size = this.generateRandomNumberInRange(80, 170);
    
    let obstacle = new Obstacle(
      canvas.width + size,
      canvas.height - size,
      size / 2 , size, 'blue'
    );
      
    obstacles.push(obstacle);
  }

  generateRandomNumberInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}

class Text {
  constructor(text, coordinateX, coordinateY, textAlign, color, fontSize) {
    this.text = text;
    this.coordinateX = coordinateX;
    this.coordinateY = coordinateY;
    this.textAlign = textAlign;
    this.color = color;
    this.fontSize = fontSize;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.font = this.fontSize + 'px sans-serif';
    ctx.textAlign = this.textAlign;
    ctx.fillText(this.text, this.coordinateX, this.coordinateY);
    ctx.closePath();
  }
}

function runGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  gameSpeed = 3;
  gravity = 1;

  score = 0;
  requiredScore = 1000;

  player = new Player(canvas.width / 2 - 25, 0, 50, 50, 'red');
  scoreText = new Text(`Очки: ${score}`, 25, 25, 'left', 'black', '20');
  requiredScoreText = new Text(`До следующего уровня осталось: ${requiredScore - score}`, canvas.width - 25, 25, 'right', 'black', '20');
  requestAnimationFrame(update);
}

const initialTimer = 150;
let timer = initialTimer;

function update() {
  requestAnimationFrame(update);
  updateCanvas();
  
  timer--;

  if (timer <= 0) {
    obstacle.create();
    timer = initialTimer - gameSpeed * 8;

    if (timer < 60) {
      timer = 60;
    }
  }

  for (let i = 0; i < obstacles.length; i++) {
    let currentObstacle = obstacles[i];

    if (isCollidedObjects(currentObstacle)) {
      reset('Вы проиграли.');
    }

    currentObstacle.update();
  }

  player.animate();
  score++;
  updateScoreTexts(score, requiredScore);
  
  if (requiredScore - score === 0) {
    reset('Вы прошли уровень!');
  }

  gameSpeed += 0.003;
}

function reset(notificationText) {
  obstacles = [];
  score = 0;
  timer = initialTimer;
  gameSpeed = 3;
  alert(notificationText);
}

function isCollidedObjects(currentObstacle) {
  return player.coordinateX < currentObstacle.coordinateX + currentObstacle.width
        && player.coordinateX + player.width > currentObstacle.coordinateX
        && player.coordinateY < currentObstacle.coordinateY + currentObstacle.height
        && player.coordinateY + player.height > currentObstacle.coordinateY
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(40, 48, 56, 0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateScoreTexts(score, requiredScore) {
  scoreText.text = `Очки: ${score}`;
  scoreText.draw();
  requiredScoreText.draw();
  requiredScoreText.text = `До следующего уровня осталось: ${requiredScore - score}`;
}

const obstacle = new Obstacle();
obstacle.create();

runGame();