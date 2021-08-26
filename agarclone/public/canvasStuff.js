//========DRAW============
const xCoor = 500;
const yCoor = 500;
// player.locX = Math.floor(xCoor * Math.random() + 10);
// player.locY = Math.floor(yCoor * Math.random() + 10);
function draw() {
  //reset context translate
  context.setTransform(1, 0, 0, 1, 0, 0);
  //clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  //clamp the camera to the player
  const cameraX = -player.locX + canvas.width / 2;
  const cameraY = -player.locY + canvas.height / 2;
  //translate is cumulative
  context.translate(cameraX, cameraY);
  //start drawing

  //draw all the players
  players.forEach((p) => {
    context.beginPath();
    context.lineWidth = 3;
    context.fillStyle = p.color;
    context.strokeStyle = p.color;
    //https://www.w3schools.com/tags/canvas_arc.asp
    context.arc(p.locX, p.locY, 10, 0, 2 * Math.PI);
    // context.arc(200, 200, 10, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  });
  //draw orbs
  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, 2 * Math.PI);
    context.fill();
  });
  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", move);

//Event listeners
function move(event) {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }
  //update camera for specific player
  player.xVector = xVector;
  player.yVector = yVector;
}
