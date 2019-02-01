import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import { BoardStyle } from './styles';

class Board extends React.Component {
  renderRadio(col, row) {
    const { classes } = this.props;
    return (
      <div className={classes.slot}>
        <div className={classnames(classes.disc, { [classes.red]: row % 2, [classes.black]: !(row % 2)})} />
      </div>
    );
  }

  render() {
    const { G: { columns }, classes } = this.props;
    return (
      <form class={classes.root}>
        <div class={classes.board}>
          <div class={classes.field}>
            {columns.map((col, colIx) => (
              <div className={classnames(classes.column, { [classes.grid]: colIx === 0 })}>
              {col.map((row, rowIx) => this.renderRadio(colIx, rowIx))}
              </div>
            ))}
          </div>
          <div class={classes.front}>
          </div>
        </div>
      </form>
    );
  }
}

export default withStyles(BoardStyle)(Board);
