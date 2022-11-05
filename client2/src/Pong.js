import React, {useState} from 'react';
import Sketch from 'react-p5';
import getInitialState from './initial';

const ESC = 27;
const SPACEBAR = 32;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const W_KEY = 87;
const S_KEY = 83;

export default function PongComponent() {
  const [state, setState] = useState(getInitialState(window));

  //p5 Canvas Setup
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(state.windowWidth, state.windowHeight, 'p2d').parent(
      canvasParentRef,
    );
  };

  //p5 Canvas Re-draw method
  const draw = (p5) => {
    let tempState = structuredClone(state);
    p5.background(0, 0, 0);

    // global pause - when not started or serve in progress
    if (tempState.started) {
      tempState.xBall += tempState.xBallSpeed;
      tempState.yBall += tempState.yBallSpeed;
    }

    // Detect collision with left paddle
    // if hit with upper half of paddle, redirect up, if lower half, redirect down
    if (
      tempState.xBall <=
        0 +
          tempState.xPaddleLeft +
          tempState.paddleWidth +
          tempState.borderOffset +
          tempState.diameter / 2 &&
      tempState.yBall < tempState.yPaddleLeft + tempState.paddleHeight &&
      tempState.yBall >= tempState.yPaddleLeft
    ) {
      if (
        tempState.yBall >= tempState.yPaddleLeft &&
        tempState.yBall < tempState.yPaddleLeft + 0.5 * tempState.paddleHeight
      ) {
        tempState.yBallSpeed = Math.abs(tempState.yBallSpeed) * -1;
        tempState.xBallSpeed = Math.abs(tempState.xBallSpeed);
      }
      if (
        tempState.yBall >
          tempState.yPaddleLeft + 0.5 * tempState.paddleHeight &&
        tempState.yBall <= tempState.yPaddleLeft + tempState.paddleHeight
      ) {
        tempState.yBallSpeed = Math.abs(tempState.yBallSpeed);
        tempState.xBallSpeed = Math.abs(tempState.xBallSpeed);
      }
    }
    // points only if behind left wall
    else if (tempState.xBall < tempState.diameter / 2) {
      tempState.xBallSpeed *= -1;
      tempState.scoreRight++;
      if (tempState.scoreRight === 10) {
        tempState.settempState({finished: true});
      }
      tempState.started = false;
      // put ball for left serve
      tempState.xBall =
        tempState.xPaddleLeft + tempState.paddleWidth + tempState.diameter / 2;
      tempState.yBall = tempState.yPaddleLeft + 0.5 * tempState.paddleHeight;
      tempState.leftServe = true;
    }

    // Detect collision with right paddle
    // if hit with upper half of paddle, redirect up, if lower half, redirect down
    if (
      tempState.xBall >=
        tempState.windowWidth -
          tempState.borderOffset -
          tempState.paddleWidth -
          tempState.diameter / 2 &&
      tempState.yBall <= tempState.yPaddleRight + tempState.paddleHeight &&
      tempState.yBall >= tempState.yPaddleRight
    ) {
      if (
        tempState.yBall >= tempState.yPaddleRight &&
        tempState.yBall < tempState.yPaddleRight + 0.5 * tempState.paddleHeight
      ) {
        tempState.yBallSpeed = Math.abs(tempState.yBallSpeed) * -1;
        tempState.xBallSpeed = Math.abs(tempState.xBallSpeed) * -1;
      }
      if (
        tempState.yBall >
          tempState.yPaddleRight + 0.5 * tempState.paddleHeight &&
        tempState.yBall <= tempState.yPaddleRight + tempState.paddleHeight
      ) {
        tempState.yBallSpeed = Math.abs(tempState.yBallSpeed);
        tempState.xBallSpeed = Math.abs(tempState.xBallSpeed) * -1;
      }
    }
    // points if behind right wall
    // pause game and do serve position for the lost point user
    else if (tempState.xBall + tempState.diameter / 2 > tempState.windowWidth) {
      tempState.xBallSpeed *= -1;
      tempState.scoreLeft++;
      if (tempState.scoreLeft === 10) {
        tempState.settempState({finished: true});
      }
      tempState.started = false;
      // put ball for right serve
      tempState.xBall = tempState.xPaddleRight - tempState.diameter / 2;
      tempState.yBall = tempState.yPaddleRight + 0.5 * tempState.paddleHeight;
      tempState.rightServe = true;
    }

    bounceTopBottom(tempState);

    // Draw paddle left
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.rect(
      tempState.xPaddleLeft,
      tempState.yPaddleLeft,
      tempState.paddleWidth,
      tempState.paddleHeight,
    );

    // Draw paddle right
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.rect(
      tempState.xPaddleRight,
      tempState.yPaddleRight,
      tempState.paddleWidth,
      tempState.paddleHeight,
    );

    drawStaticItems(p5);

    // Draw ball (top layer)
    p5.fill(255, 255, 255);
    p5.ellipse(
      tempState.xBall,
      tempState.yBall,
      tempState.diameter,
      tempState.diameter,
    );
    setState(tempState);
  };

  const bounceTopBottom = (state) => {
    // bounce from top and bottom
    if (
      state.yBall < state.diameter / 2 ||
      state.yBall > state.windowHeight - state.diameter
    ) {
      state.yBallSpeed *= -1;
    }
  };
  const moveBallDuringRightServe = (moveBallDuringRightServe) => {
    if (moveBallDuringRightServe) {
      state.xBall = state.xPaddleRight - state.diameter / 2;
      state.yBall = state.yPaddleRight + 0.5 * state.paddleHeight;
    }
  };

  const moveBallDuringLeftServe = (moveBallDuringLeftServe) => {
    if (moveBallDuringLeftServe) {
      state.xBall = state.xPaddleLeft + state.paddleWidth + state.diameter / 2;
      state.yBall = state.yPaddleLeft + 0.5 * state.paddleHeight;
    }
  };

  const boundToWindow = () => {
    if (state.yPaddleLeft <= 0) state.yPaddleLeft = 0;
    if (state.yPaddleLeft + state.paddleHeight >= state.windowHeight)
      state.yPaddleLeft = state.windowHeight - state.paddleHeight;
    if (state.yPaddleRight <= 0) state.yPaddleRight = 0;
    if (state.yPaddleRight + state.paddleHeight >= state.windowHeight)
      state.yPaddleRight = state.windowHeight - state.paddleHeight;
  };

  const drawStaticItems = (p5) => {
    // Draw middle line
    p5.fill(56, 56, 56);
    p5.noStroke();
    p5.rect(
      (state.windowWidth - state.paddleWidth) / 2,
      0,
      state.paddleWidth / 2,
      state.windowHeight,
    );

    // Draw scores
    p5.textFont('Visitor', 36);
    p5.fill(255, 255, 255);
    p5.textSize(70);
    p5.text(
      state.scoreLeft < 10 ? '0' + state.scoreLeft : state.scoreLeft,
      state.windowWidth * (1 / 4),
      50,
    );
    p5.text(
      state.scoreRight < 10 ? '0' + state.scoreRight : state.scoreRight,
      state.windowWidth * (3 / 4),
      50,
    );
  };

  //p5 event on key press
  const keyPressed = (e) => {
    const tempState = structuredClone(state);
    // esc to menu
    if (e.keyCode === ESC) {
      state.setState({goToMenu: true});
    }
    if (e.keyCode === SPACEBAR) {
      // space
      tempState.started = true;
      if (tempState.leftServe) {
        tempState.xBallSpeed = Math.abs(tempState.xBallSpeed);
      }
      if (tempState.rightServe) {
        tempState.xBallSpeed = Math.abs(tempState.xBallSpeed) * -1;
      }
      tempState.leftServe = false;
      tempState.rightServe = false;
    }
    if (e.keyCode === UP_ARROW || e.keyCode === LEFT_ARROW) {
      tempState.yPaddleRight -= tempState.paddleStep;
    }
    if (e.keyCode === DOWN_ARROW || e.keyCode === RIGHT_ARROW) {
      tempState.yPaddleRight += tempState.paddleStep;
    }

    // 2nd player keys W (87) and S (83)
    if (e.keyCode === W_KEY) {
      tempState.yPaddleLeft -= tempState.paddleStep;
    }
    if (e.keyCode === S_KEY) {
      tempState.yPaddleLeft += tempState.paddleStep;
    }

    moveBallDuringLeftServe(state.leftServe);
    moveBallDuringRightServe(state.rightServe);
    boundToWindow();
  };

  return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />;
}
