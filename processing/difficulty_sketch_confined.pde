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

  //update ball speed
  acceleration = new PVector(0, 0.4);
  speed.add(acceleration);

  //we want to limit the speed from increasing too much
  speed.limit(20);

  //copying the (ball) position we'll use this to check against collisions
  PVector newPosition = position.copy();
  newPosition.add(speed);
  
  //here, the mouse position represents the users head (paddle)
  float halfPaddle = PADDLE_WIDTH / 2;
  user.x = constrain(mouseX, halfPaddle, width - halfPaddle);
  user.y = height - 10;

  //check if the ball is colliding with the paddle
  if (newPosition.x > user.x - halfPaddle && newPosition.x < user.x + halfPaddle) {
    if (newPosition.y > height - 50 - 10) {

      //how far is the ball from the center of the paddle
      float offset = map(position.x, user.x - halfPaddle, user.x + halfPaddle, - 1, 1);
      
      //reverse the speed (bounce)
      speed.y = speed.y * -1;

      //determine the angle of bounce
      //the difficulty increases the angle as the game progresses
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
