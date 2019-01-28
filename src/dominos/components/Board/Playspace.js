import React from 'react';
import Layout from './Layout';
import Piece from '../Piece';
import LogicalPiece from '../../models/LogicalPiece';
import { withStyles } from '@material-ui/core';

const styles = {
  root: {
    position: 'absolute',
    fontSize: 8,
    top: '18em',
    left: '23em',
    bottom: '23em',
    right: '23em',
    '&>div': {
      position: 'absolute',
      transformOrigin: 'center center',
      top: '50%',
      left: '50%',
    },
  },
};

const BoardPiece = ({ piece, maxSequence, isRight, onClick }) => (
  <Piece
    first={piece.values[isRight ? 1 : 0]}
    second={piece.values[isRight ? 0 : 1]}
    by={Number(piece.by) + 1}
    sequence={piece.sequence}
    highlight={piece.sequence === maxSequence}
    onClick={() => onClick(piece)}
  />
);

class Playspace extends React.Component {
  onClick = (piece) => {
    const { onEndClick, root, left, right } = this.props;
    if (left.length && LogicalPiece.isSamePiece(piece, left[left.length - 1])) {
      onEndClick(piece, 'left');
    }
    if (right.length && LogicalPiece.isSamePiece(piece, right[right.length - 1])) {
      onEndClick(piece, 'right');
    }
    if (LogicalPiece.isSamePiece(piece, root)) {
      if (left.length === 0) {
        onEndClick(piece, 'left');
      } else if (right.length === 0) {
        onEndClick(piece, 'right');
      }
    }
  }

  render() {
    const { root, left, right, classes } = this.props;

    const rootTransform = { zIndex: 29 };
    const start = { y: -12, rx: 0, lx: 0 };
    const maxSequence = root ? [root, ...left || [], ...right || []].reduce((prev, cur) => Math.max(prev, cur.sequence), 0) : 0;

    if (root && LogicalPiece.isDouble(root)) {
      rootTransform.transform = 'translate(-2em,-12em)';
      Object.assign(start, { rx: 7.6, lx: 1, y: -12 });
    } else {
      rootTransform.transform = 'rotate(90deg) translate(-12em,0em)';
      Object.assign(start, { rx: 12.5, lx: -0.5, y: -12 });
    }

    const leftLayout = new Layout({ left: true, max: 45, up: true, x: start.lx, y: start.y });
    const rightLayout = new Layout({ left: false, max: 45, up: false, x: start.rx, y: start.y });
    return (
      <div className={classes.root}>
        {root &&
        <div
          className="rootTile"
          style={rootTransform}
        >
          <BoardPiece piece={root} maxSequence={maxSequence} isRight onClick={this.onClick} />
        </div>}
        {left && left.map(p =>
          <div key={p.values.join('-')} style={leftLayout.getTransform(p)}>
            <BoardPiece piece={p} maxSequence={maxSequence} onClick={this.onClick} />
          </div>)}
        {right && right.map(p =>
          <div style={rightLayout.getTransform(p)}>
            <BoardPiece piece={p} maxSequence={maxSequence} isRight onClick={this.onClick} />
          </div>)}
      </div>
    )
  }
}

export default withStyles(styles)(Playspace);
