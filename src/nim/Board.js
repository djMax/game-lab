import React from 'react';
import classnames from 'classnames';
import { withStyles, Typography, Chip, Avatar, Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    '& tr': {
      textAlign: 'center',
    },
    '& table': {
      width: '100%',
      margin: 20,
    },
  },
  number: {
    width: 50,
  },
  balls: {
    textAlign: 'left',
    display: 'flex',
    '&>div': {
      padding: 5,
      cursor: 'pointer',
      fontSize: '2em',
    }
  },
  hover: {
    backgroundColor: '#CCCCCC',
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
  leave: {
    '& button': {
      margin: 30,
    }
  },
  pileNumber: {
    fontSize: '28px !important',
    color: 'gray',
  },
});

const emojis = ['⚽', '🏀', '🎾', '⚾', '🏐', '🎱'];

class Board extends React.Component {
  state = {}

  move = (colIx, number) => {
    const { moves, G: { piles } } = this.props;
    moves.pick(colIx, piles[colIx] - number);
  }

  headlineForState() {
    const { ctx, G: { lastPlay }, moves, playerID } = this.props;
    if (ctx.phase === 'score') {
      if (ctx.currentPlayer === String(playerID)) {
        return (
          <span>
            Game Over. You win!
            <Button onClick={() => moves.continue()}>Next Game</Button>
          </span>
        );
      }
      return (
        <span>
          {`Game Over. Player ${ctx.currentPlayer === '0' ? '1' : '2'} won!`}
          <Button onClick={() => moves.continue()}>Next Game</Button>
        </span>
      );
    }
    if (ctx.currentPlayer === String(playerID)) {
      if (lastPlay) {
        return `Player ${Number(lastPlay[0]) + 1} took ${lastPlay[2]} ball${lastPlay[2] > 1 ? 's' : ''} from pile ${lastPlay[1]}. Your turn human.`;
      }
      return 'Your turn human.';
    }
    return `${ctx.currentPlayer === '0' ? 'Player 1' : 'Player 2'}'s move`;
  }

  shouldHover(pileIx, ballIx) {
    const { hoverPile, hoverIndex } = this.state;
    const { G: { piles, maxPick } } = this.props;
    if (hoverPile === pileIx) {
      if (hoverIndex || hoverIndex === 0) {
        const count = ballIx - hoverIndex;
        return count >= 0
          && (!maxPick || piles[pileIx] - maxPick <= ballIx);
      }
    }
    return false;
  }

  hover(hoverPile, hoverIndex) {
    this.setState({ hoverPile, hoverIndex });
  }

  unhover(p, b) {
    const { hoverPile, hoverIndex } = this.state;
    if (hoverPile === p && hoverIndex === b) {
      this.setState({ hoverPile: null });
    }
  }

  render() {
    const { G: { piles, scores }, classes, onLeave } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5" color="primary" className={classes.message}>
          {this.headlineForState()}
        </Typography>
        <div className={classes.board}>
          <table>
            <thead>
              <tr><th className={classes.number}>Pile #</th><th>Balls</th></tr>
            </thead>
            <tbody>
              {piles.map((p, ix) => (
                <tr key={`balls-${ix}`}><td>{ix}</td>
                <td className={classes.balls}>
                {new Array(p).fill(0).map((_unused, ballIndex) => (
                  <div
                    key={`balls-${ix}-${ballIndex}`}
                    onMouseEnter={() => this.hover(ix, ballIndex)}
                    onMouseOut={() => this.unhover(ix, ballIndex)}
                    onClick={() => this.move(ix, ballIndex)}
                    className={classnames({ [classes.hover]: this.shouldHover(ix, ballIndex) })}
                  >
                    {emojis[ix % emojis.length]}
                  </div>
                ))}
                <div className={classes.pileNumber}>{` (${p})`}</div>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={classes.chips}>
          <Chip
            avatar={<Avatar>{scores.p1Start.p1}</Avatar>}
            label="Player 1 Start/Win"
          />
          <Chip
            avatar={<Avatar>{scores.p2Start.p2}</Avatar>}
            label="Player 2 Start/Win"
          />
        </div>
        <div className={classes.chips}>
          <Chip
            avatar={<Avatar>{scores.p2Start.p1}</Avatar>}
            label="Player 1 2nd/Win"
          />
          <Chip
            avatar={<Avatar>{scores.p1Start.p2}</Avatar>}
            label="Player 2 2nd/Win"
          />
          <div className={classes.leave}>
            <Button variant="contained" onClick={onLeave}>Leave Game</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Board);
