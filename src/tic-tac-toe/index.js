import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, withStyles, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faDotCircle } from '@fortawesome/free-solid-svg-icons'
import Board from './Board';
import Editor from '../editor';
import GameFunctions from './game-functions';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  message: {
    textAlign: 'center',
    margin: 10,
    fontWeight: 900,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttons: {
    textAlign: 'center',
  },
});

const sampleCode = `/*
 * You have these functions:
 *   whoHas(spot) - Who has the requested spot? returns false, 'x', or 'o'
 *   iAmX() - Returns true if your code is playing X
 *   moveCount() - Returns the number of moves that have occurred
 *   mine(...spots) - Returns true if all the spots you specify have your piece in them
 *   theirs(...spots) - Returns true if all the spots you specify have your opponents piece in them
 *   firstEmpty(...spots) - Returns the first spot with no piece in it
 *   winners - an array of arrays of winning patterns (e.g. 1, 2, 3)
 */
for (let i = 1; i <= 9; i++) {
  if (!whoHas(i)) {
    return i;
  }
}`;

function defaultState() {
  const humanIsX = Math.random() >= 0.5;
  return {
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    xMoving: true,
    humanIsX,
    humanIsO: !humanIsX,
    error: null,
    scoreCounted: false,
  };
}

class TicTacToe extends React.Component {
  state = {
    ...defaultState(),
    code: sampleCode,
    computerWins: 0,
    humanWins: 0,
  }

  resetBoard = (e) => {
    e.preventDefault();
    this.setState(defaultState());
  }

  checkForWin(newState) {
    const { humanIsO, humanIsX, humanWins, computerWins } = this.state;
    const newGameState = new GameFunctions(newState.board);
    const winner = newGameState.won();
    if (winner) {
      newState.scoreCounted = true;
      if ((winner === 'x' && humanIsX) || (winner !== 'x' && humanIsO)) {
        newState.humanWins = humanWins + 1;
      } else {
        newState.computerWins = computerWins + 1;
      }
    }
  }

  onMove = (spot) => {
    const { board, xMoving, humanIsX, humanIsO } = this.state;
    const gameState = new GameFunctions(board);
    const winner = gameState.won();
    if (winner || gameState.done()) {
      return;
    }
    if ((xMoving && humanIsX) || (!xMoving && humanIsO)) {
      const newBoard = [...board];
      newBoard[spot - 1] = xMoving ? 1 : 2;
      const newState = {
        xMoving: !xMoving,
        board: newBoard,
        error: null,
      };
      this.checkForWin(newState);
      this.setState(newState);
    }
  }

  saveCode = (code) => {
    this.setState({ code });
  }

  async runMove(gameState) {
    const { code } = this.state;
    try {
      const retVal = [];
      const transformed = window.Babel.transform(`retVal[0] = (function yourCode() { ${code} })()`, { presets: ['es2015'] }).code;
      // eslint-disable-next-line no-new-func
      const fn = new Function(...gameState.exposedProperties, 'retVal', transformed);
      fn(...gameState.exposedProperties.map(f => gameState[f]), retVal);
      return retVal[0];
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  computerMove = async (e) => {
    e && e.preventDefault();
    const { board, xMoving } = this.state;
    const gameState = new GameFunctions(board);
    const rawMove = await this.runMove(gameState);
    const move = parseInt(rawMove, 10);
    if (gameState.whoHas(move) !== false || move < 1 || move > 9) {
      this.setState({
        error: `Move function returned invalid location ${rawMove}`,
      });
      return;
    }
    const newBoard = [...board];
    newBoard[move - 1] = xMoving ? 1 : 2;
    const newState = {
      xMoving: !xMoving,
      board: newBoard,
      error: null,
    };
    this.checkForWin(newState);
    this.setState(newState);
  }

  headlineForState(gameState) {
    const { xMoving, humanIsX, humanIsO, error } = this.state;
    const winner = gameState.won();
    if (error) {
      return (
        <div>
          <FontAwesomeIcon icon={xMoving ? faTimes : faDotCircle} /> failed to move.
        </div>
      )
    }
    if (winner) {
      return (
        <div>
          Game over, <FontAwesomeIcon icon={winner === 'x' ? faTimes : faDotCircle} /> wins.
        </div>
      )
    }
    if (gameState.done()) {
      return (
        <div>
          This game ends in a tie. Well done.
        </div>
      );
    }
    if ((xMoving && humanIsX) || (!xMoving && humanIsO)) {
      return (
        <div>
          <FontAwesomeIcon icon={xMoving ? faTimes : faDotCircle} />'s turn to move.
          Your move, human.
        </div>
      );
    }
    if ((xMoving && !humanIsX) || (!xMoving && !humanIsO)) {
      return (
        <div>
          <FontAwesomeIcon icon={xMoving ? faTimes : faDotCircle} />'s turn to move.
          Press the MAKE A MOVE button to continue.
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const { board, xMoving, humanIsX, humanIsO, error, code, humanWins, computerWins } = this.state;
    const hasMoves = board.find(v => v !== 0);
    const isComputerMove = ((xMoving && !humanIsX) || (!xMoving && !humanIsO))
    const gameState = new GameFunctions(board);

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            <Typography variant="h5" color="primary" className={classes.message}>
              {this.headlineForState(gameState)}
            </Typography>
            {error && (
              <Typography variant="body1" className={classes.message}>
                {error}
              </Typography>
            )}
            <div>
              <Board board={board} onMove={this.onMove} />
            </div>
            <div className={classes.buttons}>
              {hasMoves && (
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={this.resetBoard}
                >
                  Reset Board
                </Button>
              )}
              {isComputerMove && !gameState.done() && (
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={this.computerMove}
                >
                  Make a Move
                </Button>
              )}
            </div>
            <div>
              Human: {humanWins} Computer: {computerWins}
            </div>
          </Grid>
          <Grid item xs>
            <Editor code={code} onChange={this.saveCode} />
          </Grid>
        </Grid>
      </div>
    );
  }
}
TicTacToe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TicTacToe);