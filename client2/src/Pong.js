import React, {useState, useEffect} from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
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
    p5.background(0, 0, 0);

    // global pause - when not started or serve in progress
    if (state.started) {
      state.xBall += state.xBallSpeed;
      state.yBall += state.yBallSpeed;
    }

    // Detect collision with left paddle
    // if hit with upper half of paddle, redirect up, if lower half, redirect down
    if (
      state.xBall <=
        0 +
          state.xPaddleLeft +
          state.paddleWidth +
          state.borderOffset +
          state.diameter / 2 &&
      state.yBall < state.yPaddleLeft + state.paddleHeight &&
      state.yBall >= state.yPaddleLeft
    ) {
      if (
        state.yBall >= state.yPaddleLeft &&
        state.yBall < state.yPaddleLeft + 0.5 * state.paddleHeight
      ) {
        state.yBallSpeed = Math.abs(state.yBallSpeed) * -1;
        state.xBallSpeed = Math.abs(state.xBallSpeed);
      }
      if (
        state.yBall > state.yPaddleLeft + 0.5 * state.paddleHeight &&
        state.yBall <= state.yPaddleLeft + state.paddleHeight
      ) {
        state.yBallSpeed = Math.abs(state.yBallSpeed);
        state.xBallSpeed = Math.abs(state.xBallSpeed);
      }
    }
    // points only if behind left wall
    else if (state.xBall < state.diameter / 2) {
      state.xBallSpeed *= -1;
      state.scoreRight++;
      if (state.scoreRight === 10) {
        state.setState({finished: true});
      }
      state.started = false;
      // put ball for left serve
      state.xBall = state.xPaddleLeft + state.paddleWidth + state.diameter / 2;
      state.yBall = state.yPaddleLeft + 0.5 * state.paddleHeight;
      state.leftServe = true;
    }

    // Detect collision with right paddle
    // if hit with upper half of paddle, redirect up, if lower half, redirect down
    if (
      state.xBall >=
        state.windowWidth -
          state.borderOffset -
          state.paddleWidth -
          state.diameter / 2 &&
      state.yBall <= state.yPaddleRight + state.paddleHeight &&
      state.yBall >= state.yPaddleRight
    ) {
      if (
        state.yBall >= state.yPaddleRight &&
        state.yBall < state.yPaddleRight + 0.5 * state.paddleHeight
      ) {
        state.yBallSpeed = Math.abs(state.yBallSpeed) * -1;
        state.xBallSpeed = Math.abs(state.xBallSpeed) * -1;
      }
      if (
        state.yBall > state.yPaddleRight + 0.5 * state.paddleHeight &&
        state.yBall <= state.yPaddleRight + state.paddleHeight
      ) {
        state.yBallSpeed = Math.abs(state.yBallSpeed);
        state.xBallSpeed = Math.abs(state.xBallSpeed) * -1;
      }
    }
    // points if behind right wall
    // pause game and do serve position for the lost point user
    else if (state.xBall + state.diameter / 2 > state.windowWidth) {
      state.xBallSpeed *= -1;
      state.scoreLeft++;
      if (state.scoreLeft === 10) {
        state.setState({finished: true});
      }
      state.started = false;
      // put ball for right serve
      state.xBall = state.xPaddleRight - state.diameter / 2;
      state.yBall = state.yPaddleRight + 0.5 * state.paddleHeight;
      state.rightServe = true;
    }

    bounceTopBottom();

    // Draw paddle left
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.rect(
      state.xPaddleLeft,
      state.yPaddleLeft,
      state.paddleWidth,
      state.paddleHeight,
    );

    // Draw paddle right
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.rect(
      state.xPaddleRight,
      state.yPaddleRight,
      state.paddleWidth,
      state.paddleHeight,
    );

    drawStaticItems(p5);

    // Draw ball (top layer)
    p5.fill(255, 255, 255);
    p5.ellipse(state.xBall, state.yBall, state.diameter, state.diameter);
  };

  const bounceTopBottom = () => {
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

  const mobileServeRight = (rightServe) => {
    if (rightServe) {
      state.xBallSpeed *= state.xBallSpeed > 0 ? -1 : 1;
      state.rightServe = false;
      state.started = true;
    }
  };

  const mobileServeLeft = (leftServe) => {
    if (leftServe) {
      state.xBallSpeed *= state.xBallSpeed > 0 ? 1 : -1;
      state.leftServe = false;
      state.started = true;
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

    // title & menu back text
    p5.textSize(50);
    p5.text(
      'IvoPong',
      (state.windowWidth - state.paddleWidth) / 2 - 100,
      state.windowHeight - 40,
    );
    p5.textSize(20);
    p5.text(
      'ESC to Menu',
      (state.windowWidth - state.paddleWidth) / 2 - 62,
      state.windowHeight - 20,
    );
  };

  //p5 event on mobile screen tap / desktop click
  const touchStartedSinglePlayer = (t) => {
    if (t.pmouseY < 0.5 * t.height) {
      state.yPaddleRight -= state.paddleStep;
    } else {
      state.yPaddleRight += state.paddleStep;
    }
    boundToWindow();
    mobileServeRight(state.rightServe);
  };

  //p5 event on mobile screen tap / desktop click
  const touchStartedTwoPlayers = (t) => {
    //right
    if (t.pmouseY < 0.5 * t.height && t.pmouseX > 0.5 * t.width) {
      state.yPaddleRight -= state.paddleStep;
    }
    if (t.pmouseY > 0.5 * t.height && t.pmouseX > 0.5 * t.width) {
      state.yPaddleRight += state.paddleStep;
    }
    //left
    if (t.pmouseY < 0.5 * t.height && t.pmouseX < 0.5 * t.width) {
      state.yPaddleLeft -= state.paddleStep;
    }
    if (t.pmouseY > 0.5 * t.height && t.pmouseX < 0.5 * t.width) {
      state.yPaddleLeft += state.paddleStep;
    }
    boundToWindow();
    mobileServeRight(state.rightServe);
    mobileServeLeft(state.leftServe);
  };

  //p5 event on key press
  const keyPressed = (e) => {
    // esc to menu
    if (e.keyCode === ESC) {
      state.setState({goToMenu: true});
    }
    if (e.keyCode === SPACEBAR) {
      // space
      state.started = true;
      if (state.leftServe) {
        state.xBallSpeed = Math.abs(state.xBallSpeed);
      }
      if (state.rightServe) {
        state.xBallSpeed = Math.abs(state.xBallSpeed) * -1;
      }
      state.leftServe = false;
      state.rightServe = false;
    }
    if (e.keyCode === UP_ARROW || e.keyCode === LEFT_ARROW) {
      state.yPaddleRight -= state.paddleStep;
    }
    if (e.keyCode === DOWN_ARROW || e.keyCode === RIGHT_ARROW) {
      state.yPaddleRight += state.paddleStep;
    }

    // 2nd player keys W (87) and S (83)
    if (!state.cpuMode) {
      if (e.keyCode === W_KEY) {
        state.yPaddleLeft -= state.paddleStep;
      }
      if (e.keyCode === S_KEY) {
        state.yPaddleLeft += state.paddleStep;
      }
    }

    moveBallDuringLeftServe(state.leftServe);
    moveBallDuringRightServe(state.rightServe);
    boundToWindow();
  };

  return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />;
}
