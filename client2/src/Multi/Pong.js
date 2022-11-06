import React from 'react';
import Sketch from 'react-p5';
import {useReadChannelState} from '@onehop/react';

export default function PongComponent(props) {
  //console.log(params.get("channelId"));
  // eslint-disable-next-line react/prop-types
  const {state} = useReadChannelState(props.channelId);
  //p5 Canvas Setup
  const setup = (p5, canvasParentRef) => {
    let canvas = p5
      .createCanvas(state.windowWidth, state.windowHeight, 'p2d')
      .parent(canvasParentRef);
    let x = (window.innerWidth - canvas.width) / 2;
    let y = (window.innerHeight - canvas.height) / 2;
    canvas.position(x, y);
  };

  //p5 Canvas Re-draw method
  const draw = (p5) => {
    // Draw paddle left
    p5.background(0, 0, 0);
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
    p5.text(state.playerOneName, state.windowWidth * (1 / 4), 50);
    p5.text(
      state.scoreLeft < 10 ? '0' + state.scoreLeft : state.scoreLeft,
      state.windowWidth * (1 / 4),
      100,
    );
    p5.text(state.playerTwoName, state.windowWidth * (3 / 4), 50);
    p5.text(
      state.scoreRight < 10 ? '0' + state.scoreRight : state.scoreRight,
      state.windowWidth * (3 / 4),
      100,
    );
  };

  return <Sketch setup={setup} draw={draw} />;
}
