const getInitialState = require('./init');

require('dotenv').config();
const {Hop, ChannelType} = require('@onehop/js');
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);

const ESC = 27;
const SPACEBAR = 32;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const W_KEY = 87;
const S_KEY = 83;

class Pong {
  constructor(channelId) {
    this.channelId = channelId;
    this.state = getInitialState();
  }

  // When a player joins the game
  joinGame(name, playerId) {
    if (!this.state.playerOne) {
      this.state.playerOne = true;
      this.state.playerOneName = name;
      this.state.playerOneId = playerId;
      hop.channels.patchState(this.channelId, {
        playerOne: this.state.playerOne,
        playerOneName: this.state.playerOneName,
        playerOneId: this.state.playerOneId,
      });
    } else if (!this.state.playerTwo) {
      this.state.playerTwo = true;
      this.state.playerTwoName = name;
      this.state.playerTwoId = playerId;
      hop.channels.patchState(this.channelId, {
        playerTwo: this.state.playerTwo,
        playerTwoName: this.state.playerTwoName,
        playerTwoId: this.state.playerTwoId,
      });
    }
  }

  ready(playerId) {
    if (this.state.gameStarted && !this.state.gameEnded) {
      return;
    }
    console.log('game ready');
    if ((this.state.playerId = playerId)) {
      this.state.playerOneReady = true;
      hop.channels.patchState(this.channelId, {
        playerOneReady: this.state.playerOneReady,
      });
    } else if ((this.state.playerId = playerId)) {
      this.state.playerTwoReady = true;
      hop.channels.patchState(this.channelId, {
        playerTwoReady: this.state.playerTwoReady,
      });
    }
    if (this.state.playerOneReady && this.state.playerTwoReady) {
      this.startGame();
    }
  }

  startGame() {
    console.log('gameStarted');
    this.state.gameStarted = true;
    hop.channels.patchState(this.channelId, {
      playerOneReady: this.state.playerOneReady,
      playerTwoReady: this.state.playerTwoReady,
      gameStarted: true,
    });

    this.periodicInterval = setInterval(() => {
      // Game loop
      this.state.xBall += this.state.xBallSpeed;
      this.state.yBall += this.state.yBallSpeed;

      // Detect collision with left paddle
      // if hit with upper half of paddle, redirect up, if lower half, redirect down
      if (
        this.state.xBall <=
          0 +
            this.state.xPaddleLeft +
            this.state.paddleWidth +
            this.state.borderOffset +
            this.state.diameter / 2 &&
        this.state.yBall < this.state.yPaddleLeft + this.state.paddleHeight &&
        this.state.yBall >= this.state.yPaddleLeft
      ) {
        if (
          this.state.yBall >= this.state.yPaddleLeft &&
          this.state.yBall <
            this.state.yPaddleLeft + 0.5 * this.state.paddleHeight
        ) {
          this.state.yBallSpeed = Math.abs(this.state.yBallSpeed) * -1;
          this.state.xBallSpeed = Math.abs(this.state.xBallSpeed);
        }
        if (
          this.state.yBall >
            this.state.yPaddleLeft + 0.5 * this.state.paddleHeight &&
          this.state.yBall <= this.state.yPaddleLeft + this.state.paddleHeight
        ) {
          this.state.yBallSpeed = Math.abs(this.state.yBallSpeed);
          this.state.xBallSpeed = Math.abs(this.state.xBallSpeed);
        }
      }
      // points only if behind left wall
      else if (this.state.xBall < this.state.diameter / 2) {
        this.state.xBallSpeed *= -1;
        this.state.scoreRight++;

        this.state.started = false;
        // put ball for left serve
        this.state.xBall =
          this.state.xPaddleLeft +
          this.state.paddleWidth +
          this.state.diameter / 2;
        this.state.yBall =
          this.state.yPaddleLeft + 0.5 * this.state.paddleHeight;
        this.state.leftServe = true;
      }

      // Detect collision with right paddle
      // if hit with upper half of paddle, redirect up, if lower half, redirect down
      if (
        this.state.xBall >=
          this.state.windowWidth -
            this.state.borderOffset -
            this.state.paddleWidth -
            this.state.diameter / 2 &&
        this.state.yBall <= this.state.yPaddleRight + this.state.paddleHeight &&
        this.state.yBall >= this.state.yPaddleRight
      ) {
        if (
          this.state.yBall >= this.state.yPaddleRight &&
          this.state.yBall <
            this.state.yPaddleRight + 0.5 * this.state.paddleHeight
        ) {
          this.state.yBallSpeed = Math.abs(this.state.yBallSpeed) * -1;
          this.state.xBallSpeed = Math.abs(this.state.xBallSpeed) * -1;
        }
        if (
          this.state.yBall >
            this.state.yPaddleRight + 0.5 * this.state.paddleHeight &&
          this.state.yBall <= this.state.yPaddleRight + this.state.paddleHeight
        ) {
          this.state.yBallSpeed = Math.abs(this.state.yBallSpeed);
          this.state.xBallSpeed = Math.abs(this.state.xBallSpeed) * -1;
        }
      }
      // points if behind right wall
      // pause game and do serve position for the lost point user
      else if (
        this.state.xBall + this.state.diameter / 2 >
        this.state.windowWidth
      ) {
        this.state.xBallSpeed *= -1;
        this.state.scoreLeft++;
        this.state.started = false;
        // put ball for right serve
        this.state.xBall = this.state.xPaddleRight - this.state.diameter / 2;
        this.state.yBall =
          this.state.yPaddleRight + 0.5 * this.state.paddleHeight;
        this.state.rightServe = true;
      }

      if (
        this.state.yBall < this.state.diameter / 2 ||
        this.state.yBall > this.state.windowHeight - this.state.diameter
      ) {
        this.state.yBallSpeed *= -1;
      }

      hop.channels.setState(this.channelId, this.state);
    }, this.state.speed);
  }

  moveBallDuringRightServe = () => {
    if (this.state.rightServe) {
      this.state.xBall = this.state.xPaddleRight - this.state.diameter / 2;
      this.state.yBall =
        this.state.yPaddleRight + 0.5 * this.state.paddleHeight;
    }
  };

  moveBallDuringLeftServe = () => {
    if (this.state.leftServe) {
      this.state.xBall =
        this.state.xPaddleLeft +
        this.state.paddleWidth +
        this.state.diameter / 2;
      this.state.yBall = this.state.yPaddleLeft + 0.5 * this.state.paddleHeight;
    }
  };

  boundToWindow = () => {
    if (this.state.yPaddleLeft <= 0) this.state.yPaddleLeft = 0;
    if (
      this.state.yPaddleLeft + this.state.paddleHeight >=
      this.state.windowHeight
    )
      this.state.yPaddleLeft =
        this.state.windowHeight - this.state.paddleHeight;
    if (this.state.yPaddleRight <= 0) this.state.yPaddleRight = 0;
    if (
      this.state.yPaddleRight + this.state.paddleHeight >=
      this.state.windowHeight
    )
      this.state.yPaddleRight =
        this.state.windowHeight - this.state.paddleHeight;
  };

  //p5 event on key press
  keyPressed = (keyCode) => {
    // esc to menu
    if (keyCode === ESC) {
      //state.setState({goToMenu: true}); TODO
    }
    if (keyCode === SPACEBAR) {
      // space
      this.state.started = true;
      if (this.state.leftServe) {
        this.state.xBallSpeed = Math.abs(this.state.xBallSpeed);
      }
      if (this.state.rightServe) {
        this.state.xBallSpeed = Math.abs(this.state.xBallSpeed) * -1;
      }
      this.state.leftServe = false;
      this.state.rightServe = false;
    }
    if (keyCode === UP_ARROW || keyCode === LEFT_ARROW) {
      this.state.yPaddleRight -= this.state.paddleStep;
    }
    if (keyCode === DOWN_ARROW || keyCode === RIGHT_ARROW) {
      this.state.yPaddleRight += this.state.paddleStep;
    }

    // 2nd player keys W (87) and S (83)
    if (keyCode === W_KEY) {
      this.state.yPaddleLeft -= this.state.paddleStep;
    }
    if (keyCode === S_KEY) {
      this.state.yPaddleLeft += this.state.paddleStep;
    }

    moveBallDuringLeftServe(this.state);
    moveBallDuringRightServe(this.state);
    boundToWindow(this.state);
    hop.channels.setState(this.channelId, this.state);
  };
}

module.exports = {Pong};
