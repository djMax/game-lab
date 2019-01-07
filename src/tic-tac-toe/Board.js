import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faDotCircle } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames';

const styles = {
  spot: {
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#78bec5',
    borderRadius: 14,
    cursor: 'pointer',
    height: 140,
    width: 140,
    transition: 'backgroundColor 0.3s',
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    '&>svg': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: -35,
    },
  },
  x: {
    backgroundColor: '#dc685a',
    '&>svg': {
      left: '59%',
    },
  },
  o: {
    backgroundColor: '#ecaf4f',
  },
  no: {
    '&:hover': {
      backgroundColor: '#3d4250',
    },
  },
  hint: {
    color: 'rgba(255,255,255,0.3)',
    textShadow: 'none',
    paddingTop: 30,
    fontSize: 60,
  },
};

const icons = [null, faTimes, faDotCircle];

class Board extends React.Component {
  handleClick(ix) {
    const { board, onMove } = this.props;
    if (board[ix - 1] === 0) {
      onMove(ix);
    }
  }

  render() {
    const { classes, board } = this.props;
    const rows = [
      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],
    ];
    return (
      <Grid container justify="center" className={classes.root} spacing={8} direction="row">
        {rows.map((r, ix) => (
          <Grid key={`r-${ix}`} item>
            {r.map((c, cix) => (
              <div
                key={`c-${ix}-${cix}`}
                className={classnames(classes.spot, {
                  [classes.x]: c === 1,
                  [classes.o]: c === 2,
                  [classes.no]: c === 0,
                })}
                onClick={() => this.handleClick(cix * 3 + ix + 1)}
              >
                {c ? <FontAwesomeIcon icon={icons[c]} /> : <div className={classes.hint}>{cix * 3 + ix + 1}</div>}
              </div>
            ))}
          </Grid>
        ))}
      </Grid>
    )
  }
}

export default withStyles(styles)(Board);
