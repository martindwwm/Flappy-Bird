const cvs = document.getElementById("zone_de_dessin");
cvs.width = 300;
cvs.height = 400;

const ctx = cvs.getContext("2d");

// Images
const backGroundImage = new Image();
backGroundImage.src = "images_sons_flappyBird/images/arrierePlan.png";
const foreGroundImage = new Image();
foreGroundImage.src = "images_sons_flappyBird/images/avantPlan.png";
const lowPipeImage = new Image();
lowPipeImage.src = "images_sons_flappyBird/images/tuyauBas.png";
const highPipeImage = new Image();
highPipeImage.src = "images_sons_flappyBird/images/tuyauHaut.png";
const birdImage1 = new Image();
birdImage1.src = "images_sons_flappyBird/images/oiseau1.png";
const birdImage2 = new Image();
birdImage2.src = "images_sons_flappyBird/images/oiseau2.png";

// Audio
const shockAudio = new Audio();
shockAudio.src = "images_sons_flappyBird/sons/sonChoc.mp3";
const scoreAudio = new Audio();
scoreAudio.src = "images_sons_flappyBird/sons/sonScore.mp3";
const flyAudio = new Audio();
flyAudio.src = "images_sons_flappyBird/sons/sonVole.mp3";

const pipeWidth = 40;
const pipeGap = 80;

let pipeTab = [];
pipeTab[0] = {
  x: cvs.width,
  y: cvs.height - 150,
};

// Bird
let xBird = 100;
let yBird = 150;
const gravity = 1.5;
let birdUp = 0;
const birdWidth = 34;
const birdHeight = 24;
let endGame = false;
let score = 0;

document.addEventListener("click", () => {
  if (endGame === false) {
    birdUp = 10;
    yBird -= 25;
    flyAudio.play();
  } else {
    setTimeout(reLoadGame, 500);
  }
});

function reLoadGame() {
  endGame = false;
  location.reload();
}

function draw() {
  ctx.drawImage(backGroundImage, 0, 0);

  for (let i = 0; i < pipeTab.length; i++) {
    pipeTab[i].x--;
    ctx.drawImage(lowPipeImage, pipeTab[i].x, pipeTab[i].y);
    ctx.drawImage(
      highPipeImage,
      pipeTab[i].x,
      pipeTab[i].y - pipeGap - highPipeImage.height
    );

    if (pipeTab[i].x === 100) {
      pipeTab.push({
        x: cvs.width,
        y: Math.floor(100 + Math.random() * 180),
      });
    } else if (pipeTab[i].x + pipeWidth < 0) {
      pipeTab.splice(i, 1);
    }

    // End game conditions
    if (
      yBird < 0 ||
      yBird + birdHeight > 300 ||
      (xBird + birdWidth >= pipeTab[i].x &&
        xBird <= pipeTab[i].x + pipeWidth &&
        (yBird + birdHeight >= pipeTab[i].y || yBird + pipeGap <= pipeTab[i].y))
    ) {
      shockAudio.play();
      endGame = true;
    }

    if (xBird === pipeTab[i].x + pipeWidth + 5) {
      score++;
      scoreAudio.play();
    }
  }

  ctx.drawImage(foreGroundImage, 0, cvs.height - foreGroundImage.height);
  yBird += gravity;
  if (birdUp > 0) {
    birdUp--;
    ctx.drawImage(birdImage2, xBird, yBird);
  } else {
    ctx.drawImage(birdImage1, xBird, yBird);
  }

  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, cvs.width, cvs.height);

  ctx.fillStyle = "black";
  ctx.font = "20px Verdana";
  ctx.fillText(`score : ${score}`, 10, cvs.height - 20);

  if (endGame === false) {
    requestAnimationFrame(draw);
  } else {
    ctx.fillStyle = "black";
    ctx.font = "35px Verdana";
    ctx.fillText("End game", 60, 200);
    ctx.font = "20px Verdana";
    ctx.fillText("click to restart", 75, 230);
  }
}
draw();
