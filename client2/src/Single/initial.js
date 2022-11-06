export default function getInitialState() {
  const paddleWidth = 16;
  const paddleHeight = 130;
  const borderOffset = 5;
  const diameter = 20;
  const windowHeight = 600;
  const windowWidth = 1500;

  const intialState = {
    windowHeight: windowHeight,
    windowWidth: windowWidth,

    finished: false,
    scoreLeft: -1,
    scoreRight: 0,
    paddleWidth: paddleWidth,
    paddleHeight: paddleHeight,
    paddleStep: windowHeight / 9,
    borderOffset: borderOffset,
    diameter: diameter,

    xPaddleLeft: borderOffset,
    yPaddleLeft: windowHeight / 2,
    xPaddleRight: windowWidth - borderOffset - paddleWidth,
    yPaddleRight: windowHeight / 2,

    leftServeXpos: windowWidth - borderOffset + diameter / 2,
    leftServeYpos: 0.5 * paddleHeight,
    rightServeXpos: windowWidth - borderOffset - paddleWidth - diameter / 2,
    rightServeYpos: windowHeight / 2 + 0.5 * paddleHeight,
    yBall: 0.5 * paddleHeight,
    xBall: windowWidth - borderOffset + diameter / 2,
    xBallSpeed: 12,
    yBallSpeed: 12,

    started: false,
    leftServe: true,
    rightServe: false,
  };
  return intialState;
}
