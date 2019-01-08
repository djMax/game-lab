import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, withStyles, Grid, Select, FormControl, InputLabel, Input, MenuItem, Chip, Avatar } from '@material-ui/core';
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
      return;
    }
    if (newGameState.done()) {
      newState.ties = ties + 1;
    }
  }

  onHumanMove = (spot) => {
    const { board, xMoving } = this.state;
    const gameState = new GameFunctions(board);
    const winner = gameState.won();
    if (winner || gameState.done()) {
      return;
    }
    if (this.whoseMove() !== 'human') {
      return;
    }

    const newBoard = [...board];
    newBoard[spot - 1] = xMoving ? 1 : 2;
    const newState = {
      xMoving: !xMoving,
      board: newBoard,
      error: null,
    };
    this.checkForWin(newState);
    this.setState(newState, () => {
      const { autoMove } = this.state;
      if (autoMove && this.whoseMove() !== 'human') {
        this.computerMove();
      }
    });
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
    this.setState(newState, () => {
      const { autoMove } = this.state;
      if (autoMove && this.whoseMove() !== 'human') {
        this.computerMove();
      }
    });
  }

  enableAutoMove = () => {
    this.setState({
      autoMove: true,
    }, () => {
      if (this.whoseMove() !== 'human') {
        this.computerMove();
      }
    });
  }

  headlineForState(gameState) {
    const { xMoving, error } = this.state;
    const winner = gameState.won();
    const moveCount = gameState.moveCount();
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
    const { board, error, code, player1Wins, player2Wins, ties, player1, player2, player1IsX } = this.state;
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
            <div className={classes.buttons}>
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
                    <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="player1-simple">Player 1 ({player1IsX ? 'x' : 'o'})</InputLabel>
                    <Select
                      displayEmpty
                      value={this.state.player1}
                      onChange={this.player1Change}
                      inputProps={{
                        name: 'player1',
                        id: 'player1-simple',
                      }}
                      input={<Input name="player1" id="player1-helper" />}
                    >
                      <MenuItem value="human">
                        <em>Human</em>
                      </MenuItem>
                      <MenuItem value="code">
                        <em>Your Code</em>
                      </MenuItem>
                      {/* TODO add other players */}
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="player2-simple">Player 2 ({player1IsX ? 'o' : 'x'})</InputLabel>
                    <Select
                      displayEmpty
                      value={this.state.player2}
                      onChange={this.player2Change}
                      inputProps={{
                        name: 'player2',
                        id: 'player2-simple',
                      }}
                    >
                      <MenuItem value="human">
                        <em>Human</em>
                      </MenuItem>
                      <MenuItem value="code">
                        <em>Your Code</em>
                      </MenuItem>
                      {/* TODO add other players */}
                    </Select>
                  </FormControl>
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
              {hasMoves && isComputerMove && !gameState.done() && (
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
            </div>
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