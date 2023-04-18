float gravity = 0.4;
PVector acceleration;
PVector position;
PVector speed = new PVector();

int PADDLE_WIDTH = 150;

PVector user;
int count = 0;

void setup() {

  size(500, 700);

  position = new PVector(width  / 2, 0);

  user = new PVector(width / 2, height);
}


void draw() {

  background(255, 255 - count, 255 - count);

  acceleration = new PVector(0, 0.4);

  speed.add(acceleration);

  speed.limit(20);

  PVector newPosition = position.copy();
  newPosition.add(speed);
  //draw
  float halfPaddle = PADDLE_WIDTH / 2;
  user.x = constrain(mouseX, halfPaddle, width - halfPaddle);
  user.y = height - 10;

  if (newPosition.x > user.x - halfPaddle && newPosition.x < user.x + halfPaddle) {
    if (newPosition.y > height - 50 - 10) {

      float offset = map(position.x, user.x - halfPaddle, user.x + halfPaddle, - 1, 1);
      //println(offset);
      speed.y = speed.y * -1;

      float difficulty = 10 * float(count) / 20.0;
      difficulty = constrain(difficulty, 0, 10);
      speed.x = offset * difficulty;
      position.add(speed);

      count ++;
    }
  }

if (newPosition.x > width - 50 || newPosition.x <  50) {
  
  speed.x = speed.x * -1;
}

  position.add(speed);

  if (position.y > height + 50) {
    speed = new PVector();
    position = new PVector(width/ 2, -50);
    count = 0;
  }


  //draw ball
  ellipse(position.x, position.y, 100, 100);

  drawPaddle();

  textSize(100);
  textMode(CENTER);
  fill(0);
  String text = "Count " + count;
  float w = textWidth(text);
  text(text, width / 2 - w / 2, 120);
}


void drawPaddle() {
  //user
  float halfPaddle = PADDLE_WIDTH / 2;
  beginShape();
  vertex(user.x - halfPaddle, user.y);
  vertex(user.x + halfPaddle, user.y);
  vertex(user.x + halfPaddle, user.y + 10);
  vertex(user.x - halfPaddle, user.y + 10);
  endShape(CLOSE);
}
