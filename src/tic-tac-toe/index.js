import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, withStyles, Grid, Chip, Avatar } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faDotCircle } from '@fortawesome/free-solid-svg-icons'
import Board from './Board';
import Editor from '../editor';
import GameFunctions from './game-functions';
import PlayerTypeMenu from './PlayerTypeMenu';

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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
    textAlign: 'right',
  },
  chips: {
    textAlign: 'center',
    '&>div': {
      margin: theme.spacing.unit,
    },
  },
});

const sampleCode = `/*
 * This code decides how the computer makes a move. You must return
 * the number of the spot you want to fill with your "piece."
 * Sometimes you will be playing X, sometimes you will be playing O.
 *
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

function defaultBaseState() {
  const player1IsX = Math.random() >= 0.5;
  return {
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    xMoving: true,
    player1IsX,
    error: null,
    scoreCounted: false,
  };
}

class TicTacToe extends React.Component {
  state = {
    ...defaultBaseState(),
    code: window.localStorage.getItem('tictactoe.code') || sampleCode,
    player1Wins: 0,
    player2Wins: 0,
    ties: 0,
    player1: 'human',
    player2: 'code',
    autoMove: false,
  }

  resetBoard = (e) => {
    e.preventDefault();
    this.setState(defaultBaseState());
  }

  player1Change = ({ target: { value } }) => {
    this.setState({ player1: value });
  }

  player2Change = ({ target: { value } }) => {
    this.setState({ player2: value });
  }

  whoseMove() {
    const { player1IsX, player1, player2, xMoving } = this.state;
    if ((player1IsX && xMoving) || (!player1IsX && !xMoving)) {
      return player1;
    }
    return player2;
  }

  run100 = () => {
    this.setState({ games: 100, autoMove: true }, () => {
      this.nonHumanMove();
    });
  }

  checkForWin(newState) {
    const { player1IsX, player1Wins, player2Wins, ties } = this.state;
    const newGameState = new GameFunctions(newState.board);
    const winner = newGameState.won();
    if (winner) {
      newState.scoreCounted = true;
      if ((winner === 'x' && player1IsX) || (winner !== 'x' && !player1IsX)) {
        newState.player1Wins = player1Wins + 1;
      } else {
        newState.player2Wins = player2Wins + 1;
      }
      return true;
    } else if (newGameState.done()) {
      newState.ties = ties + 1;
      return true;
    }
  }

  onHumanMove = (spot) => {
    const { board } = this.state;
    const gameState = new GameFunctions(board);
    const winner = gameState.won();
    if (winner || gameState.done()) {
      return;
    }
    if (this.whoseMove() !== 'human') {
      return;
    }

    this.applyMove(spot);
  }

  saveCode = (code) => {
    this.setState({ code });
    window.localStorage.setItem('tictactoe.code', code);
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

  applyMove(move) {
    const { board, xMoving, games } = this.state;
    const newBoard = [...board];
    newBoard[move - 1] = xMoving ? 1 : 2;
    const newState = {
      xMoving: !xMoving,
      board: newBoard,
      error: null,
    };
    const shouldReset = this.checkForWin(newState);
    this.setState(newState, () => {
      if (shouldReset) {
        if (games) {
          this.setState({
            ...defaultBaseState(),
            games: games - 1,
          }, () => {
            setTimeout(() => this.nonHumanMove(), 1);
          });
        }
        return;
      }
      const { autoMove } = this.state;
      if (autoMove && this.whoseMove() !== 'human') {
        setTimeout(() => this.nonHumanMove(), 1);
      }
    });
  }

  computerMove = async (e) => {
    e && e.preventDefault();
    const { board, xMoving } = this.state;
    const gameState = new GameFunctions(board, xMoving ? 'x' : 'o');
    if (gameState.done() || gameState.won()) {
      return;
    }
    const rawMove = await this.runMove(gameState);
    const move = parseInt(rawMove, 10);
    if (Number.isNaN(move) || gameState.whoHas(move) !== false || move < 1 || move > 9) {
      this.setState({
        error: `Move function returned invalid location ${rawMove}`,
        games: 0,
      });
      return;
    }
    this.applyMove(move);
  }

  nonHumanMove() {
    const type = this.whoseMove();
    const { board, xMoving } = this.state;
    const gameState = new GameFunctions(board, xMoving ? 'x' : 'o');
    switch (type) {
      case 'random':
        this.applyMove(gameState.random());
        return;
      case 'centerCorner':
        this.applyMove(gameState.centerCorner());
        return;
      default:
        this.computerMove();
        return;
    }
  }

  enableAutoMove = () => {
    this.setState({
      autoMove: true,
    }, () => {
      if (this.whoseMove() !== 'human') {
        this.nonHumanMove();
      }
    });
  }

  headlineForState(gameState) {
    const { xMoving, error, games } = this.state;
    const winner = gameState.won();
    const moveCount = gameState.moveCount();
    if (error) {
      return (
        <div>
          <FontAwesomeIcon icon={xMoving ? faTimes : faDotCircle} /> failed to move.
        </div>
      )
    }
    if (games) {
      return <div>{games} games left</div>
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
    if (this.whoseMove() === 'human') {
      return (
        <div>
          <FontAwesomeIcon icon={xMoving ? faTimes : faDotCircle} />'s turn to move.
          Your move, human.
        </div>
      );
    }
    return (
      <div>
        <FontAwesomeIcon icon={xMoving ? faTimes : faDotCircle} />'s turn to move.
        Press the {moveCount ? 'MAKE A MOVE' : 'START'} button to continue.
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const {
      board, error, code, player1Wins, player2Wins,
      ties, player1, player2, player1IsX, games,
    } = this.state;
    const hasMoves = board.find(v => v !== 0);
    const isComputerMove = this.whoseMove() !== 'human';
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
              <Board board={board} onMove={this.onHumanMove} />
            </div>
            {!games && (<div className={classes.buttons}>
              {hasMoves ? (
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={this.resetBoard}
                >
                  Reset Board
                </Button>
              ) : (
                <React.Fragment>
                  <div>
                    <PlayerTypeMenu
                      className={classes.formControl}
                      index="1"
                      isX={player1IsX}
                      onChange={this.player1Change}
                      value={this.state.player1}
                    />
                    <PlayerTypeMenu
                      className={classes.formControl}
                      index="2"
                      isX={!player1IsX}
                      onChange={this.player2Change}
                      value={this.state.player2}
                    />
                  </div>
                  {this.whoseMove() !== 'human' && (
                    <div>
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={this.computerMove}
                      >
                        Start
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={this.enableAutoMove}
                      >
                        {(player1 === 'human' || player2 === 'human') ? 'Start with Auto-Move' : 'Run Complete Game'}
                      </Button>
                      {player1 !== 'human' && player2 !== 'human' && (
                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={this.run100}
                        >
                          Run 100 Games
                        </Button>
                      )}
                    </div>
                  )}
                </React.Fragment>
              )}
              {hasMoves && isComputerMove && !gameState.done() && !gameState.won() && (
                <React.Fragment>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={this.computerMove}
                  >
                    Make a Move
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={this.enableAutoMove}
                  >
                    Enable auto-move
                  </Button>
                </React.Fragment>
              )}
            </div>)}
            <div className={classes.chips}>
              <Chip
                avatar={<Avatar>{player1Wins}</Avatar>}
                label="Player 1"
              />
              <Chip
                avatar={<Avatar>{player2Wins}</Avatar>}
                label="Player 2"
              />
              <Chip
                avatar={<Avatar>{ties}</Avatar>}
                label="Ties"
              />
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