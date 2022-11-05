export default function getInitialState(window) {
  const paddleWidth = 16;
  const paddleHeight = 130;
  const borderOffset = 5;
  const diameter = 20;

  const intialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,

    finished: false,
    scoreLeft: 0,
    scoreRight: 0,
    paddleWidth: paddleWidth,
    paddleHeight: paddleHeight,
    paddleStep: window.innerHeight / 9,
    borderOffset: borderOffset,
    diameter: diameter,

    xPaddleLeft: borderOffset,
    yPaddleLeft: window.innerHeight / 2,
    xPaddleRight: window.innerWidth - borderOffset - paddleWidth,
    yPaddleRight: window.innerHeight / 2,

    leftServeXpos: window.innerWidth - borderOffset + diameter / 2,
    leftServeYpos: 0.5 * paddleHeight,
    rightServeXpos:
      window.innerWidth - borderOffset - paddleWidth - diameter / 2,
    rightServeYpos: window.innerHeight / 2 + 0.5 * paddleHeight,
    yBall: 0.5 * paddleHeight,
    xBall: window.innerWidth - borderOffset + diameter / 2,
    xBallSpeed: 12,
    yBallSpeed: 12,

    started: false,
    leftServe: true,
    rightServe: false,
  };
  return intialState;
}
