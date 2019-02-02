import React from 'react';
import classnames from 'classnames';
import { withStyles, Typography, Chip, Avatar, Button } from '@material-ui/core';
import { BoardStyle } from './styles';

class Board extends React.Component {
  state = {}

  unhover = (colIx) => {
    const { hoverCol } = this.state;
    if (hoverCol === colIx) {
      this.setState({ hoverCol: null });
    }
  }

  hover = (colIx) => {
    const { G: { columns }, playerID, ctx } = this.props;
    if (ctx.phase === 'play' && String(ctx.currentPlayer) === String(playerID) && columns[colIx].includes(-1)) {
      this.setState({ hoverCol: colIx });
    }
  }

  move = (colIx) => {
    const { moves } = this.props;
    this.setState({ hoverCol: null }, () => {
      moves.place(colIx);
    });
  }

  renderRadio(col, row) {
    const { classes, G: { columns } } = this.props;
    const isRed = columns[col][row] === 0;
    const isBlack = columns[col][row] === 1;
    return (
      <div className={classes.slot} key={`spot-${col}-${row}`}>
        <div className={classnames(classes.disc, { [classes.red]: isRed, [classes.black]: isBlack})} />
      </div>
    );
  }

  headlineForState() {
    const { G: { lastWinner }, ctx, moves } = this.props;
    if (ctx.phase === 'score') {
      if (lastWinner === 0 || lastWinner === -1) {
        return (
          <span>
            {`Game over, ${lastWinner ? 'Black' : 'Red'} Wins!`}
            <Button onClick={() => moves.continue()}>Next Game</Button>
          </span>
        );
      }
      return (
        <span>
          Game ends in a draw.
          <Button onClick={() => moves.continue()}>Next Game</Button>
        </span>
      );
    }
    return 'Start';
  }

  render() {
    const { hoverCol } = this.state;
    const { G: { columns, scores }, moves, ctx: { currentPlayer }, classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5" color="primary" className={classes.message}>
          {this.headlineForState()}
        </Typography>
        <div className={classes.board}>
            <div className={classes.hover}>
            {columns.map((c, ix) => (
              <div
                key={`hover-${ix}`}
                onMouseOver={() => this.hover(ix)}
                onMouseOut={() => this.unhover(ix)}
                onClick={() => this.move(ix) }
                className={classnames(classes.disc, {
                  [classes.red]: ix === hoverCol && currentPlayer === '0',
                  [classes.black]: ix === hoverCol && currentPlayer !== '0',
                })}
              />
            ))}
            </div>
          <div className={classes.field}>
            {columns.map((col, colIx) => (
              <div
                key={`col-${colIx}`}
                className={classes.column}
                onMouseOver={() => this.hover(colIx)}
                onMouseOut={() => this.unhover(colIx)}
                onClick={() => this.move(colIx) }
              >
                {col.map((row, rowIx) => this.renderRadio(colIx, rowIx))}
              </div>
            ))}
          </div>
          <div className={classes.front}>
          </div>
        </div>
        <div className={classes.chips}>
          <Chip
            avatar={<Avatar>{scores.p1}</Avatar>}
            label="Player 1"
          />
          <Chip
            avatar={<Avatar>{scores.p2}</Avatar>}
            label="Player 2"
          />
          <Chip
            avatar={<Avatar>{scores.draw}</Avatar>}
            label="Ties"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(BoardStyle)(Board);
