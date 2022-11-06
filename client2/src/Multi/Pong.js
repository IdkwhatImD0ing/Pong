import React, {useState} from 'react';
import Sketch from 'react-p5';
import {useReadChannelState} from '@onehop/react';
import {useSearchParams} from 'react-router-dom';

export default function PongComponent(props) {
  const [params] = useSearchParams();
  //console.log(params.get("channelId"));
  const {state} = useReadChannelState(props.channelId);
  //p5 Canvas Setup
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(state.windowWidth, state.windowHeight, 'p2d').parent(
      canvasParentRef,
    );
  };

  //p5 Canvas Re-draw method
  const draw = (p5) => {
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

  return <Sketch setup={setup} draw={draw} />;
}