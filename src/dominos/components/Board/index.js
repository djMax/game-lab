import React from 'react';
import { withStyles, Snackbar, Typography } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import classnames from 'classnames';
import { Subscribe } from 'unstated';
import Hand from '../Hand';
import Playspace from './Playspace';
import LogicalBoard from '../../models/LogicalBoard';
import Score from './Score';
import Result from '../Result';
import MultiplayerContainer from '../../../common/MultiplayerContainer';
import DominoContainer from '../../DominoContainer';

class Board extends React.Component {
  state = {}

  playPiece = (piece) => {
    const { moves, isActive, G: { board } } = this.props;
    const possible = new LogicalBoard(board).validPieces;
    if (possible.length === 2 && piece.values[0] !== piece.values[1]
      && possible.includes(piece.values[0]) && possible.includes(piece.values[1])) {
      this.setState({ piece });
      return;
    }
    if (isActive) {
      moves.playDomino(piece);
      this.setState({ side: null, piece: null });
    }
  }

  onEndClick = (clickedPiece, side) => {
    const { moves, isActive } = this.props;
    const { piece } = this.state;

    if (isActive) {
      moves.playDomino(piece, side === 'left');
      this.setState({ piece: null });
    }
  }

  pass = () => {
    const { moves, isActive } = this.props;
    if (isActive) {
      moves.pass();
    }
  }

  nextGame = () => {
    const { moves } = this.props;
    moves.continue();
  }

  renderHand = (playerToRender) => {
    const { ctx: { phase, currentPlayer }, playerID, isActive, G: { names, board, players, pieces, lastPlay }, classes } = this.props;
    const { piece } = this.state;
    const handProps = {};
    if (String(playerToRender) === String(playerID) && phase === 'play') {
      handProps.onClick = this.playPiece;
      if (board.root && isActive) {
        const possible = new LogicalBoard(board).validPieces;
        if (!players[playerToRender].hand.find(p => possible.includes(p.values[0]) || possible.includes(p.values[1]))) {
          handProps.onPass = this.pass;
        }
      }
    }
    if (currentPlayer === String(playerToRender)) {
      handProps.active = true;
    }
    handProps.last = lastPlay[playerToRender];
    return (
      <div className={classnames(classes.hand, classes[`p${playerToRender}`])}>
        <Hand
          {...handProps}
          name={names[playerToRender]}
          pieces={players[playerToRender] ? players[playerToRender].hand : pieces[playerToRender]}
        />
      </div>
    );
  }

  renderSlider(multiplayer, dominoState) {
    const { classes, G: { master } } = this.props;
    if (master === multiplayer.id) {
      return (
        <div className={classes.sliderRoot}>
          <Typography id="slider-label">AI Speed</Typography>
          <Slider
            classes={{ container: classes.slider }}
            value={dominoState.state.speed}
            min={2500}
            max={0}
            aria-labelledby="slider-label"
            onChange={(e, value) => dominoState.setSpeed(value)}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    const { classes, G: { board, scores, completed }, ctx: { phase } } = this.props;
    const { piece } = this.state;

    return (
      <div className={classes.root}>
          {phase === 'score' && <Result {...completed} onNext={this.nextGame} />}
        {[0,1,2,3].map(this.renderHand)}
        <Playspace {...board} onEndClick={this.onEndClick} />
        <Score ns={scores.ns} ew={scores.ew} className={classes.scores} />
        <Subscribe to={[MultiplayerContainer, DominoContainer]}>
          {(multiplayer, domino) => this.renderSlider(multiplayer, domino)}
        </Subscribe>
        <Snackbar
          className={classes.ambiguous}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={!!piece}
          autoHideDuration={6000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Click the end of the board on which this piece should be played.</span>}
        />
      </div>
    )
  }
}

export default withStyles({
  root: {
    width: '100vw',
    maxWidth: 1280,
    height: '100vh',
    maxHeight: '70em',
    position: 'relative',
  },
  hand: {
    position: 'absolute',
    fontSize: 10,
    height: '15em',
  },
  scores: {
    position: 'absolute',
    bottom: 90,
    left: 5,
  },
  sliderRoot: {
    position: 'absolute',
    width: 150,
    bottom: 100,
    right: 30,
  },
  slider: {
    padding: '22px 0px',
  },
  p0: {
    top: 0,
    left: 0,
    right: 0,
  },
  p1: {
    transform: 'rotate(-90deg) translateX(1em) translateY(-3em)',
    transformOrigin: 'bottom right',
    top: 0,
    right: 0,
  },
  p2: {
    left: 100,
    right: 100,
    top: '62em',
  },
  p3: {
    transform: 'translateY(-3em) translateX(1em) rotate(90deg)',
    transformOrigin: 'bottom left',
    left: 0,
    top: 0,
  }
})(Board);
