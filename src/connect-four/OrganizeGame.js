import React from 'react';
import { Button, withStyles, Typography, Card, CardContent, CardActions } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import PlayerMenu from '../common/PlayerMenu';

class OrganizeGame extends React.Component {
  state = {
    players: this.props.defaultPlayers,
  }

  setPlayer = (multiplayer, index, value) => {
    const players = this.state.players.slice(0);
    const exPlayer = players[index];
    const existingIndex = players.findIndex(p => p === value);
    if (existingIndex >= 0) {
      players[existingIndex] = exPlayer;
    }
    players[index] = value;
    this.setState({ players });
  }

  play = (multiplayer) => {
    const { players } = this.state;
    const { onReady } = this.props;
    this.setState({ loading: true }, () => {
      onReady(players.map(p => (p === 'human' ? `human:${multiplayer.id}` : p)));
      this.setState({ loading: false });
    });
  }

  render() {
    const { players } = this.state;
    const { classes, ai } = this.props;

    return (
      <Subscribe to={[MultiplayerContainer]}>
        {multiplayer => (
          <Card className={classes.root}>
          <CardContent>
            <Typography variant="h4">Start a New Game</Typography>
            <Typography component="p">
              Choose players for a game of Connect Four. First one to make
              4 connected chips of their color wins - horizontal, vertical, or diagonal.
            </Typography>

            <div className={classes.board}>
              <div className={classes.c}>
                vs.
              </div>
              <div className={classes.l}>
                <PlayerMenu value={players[0]} ai={ai} classes={classes} onChange={this.setPlayer} gameName="ConnectFour" playerIndex={0} multiplayer={multiplayer} />
              </div>
              <div className={classes.r}>
                <PlayerMenu value={players[1]} ai={ai} classes={classes} onChange={this.setPlayer} gameName="ConnectFour" playerIndex={1} multiplayer={multiplayer} />
              </div>
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={() => this.play(multiplayer)}
              color="primary"
            >
              Let's Play
            </Button>
            </CardActions>
          </Card>
        )}
      </Subscribe>
    );
  }
}

export default withStyles({
  root: {
    position: 'absolute',
    top: 200,
    left: 80,
    maxWidth: 520,
  },
  board: {
    position: 'relative',
    width: 520,
    height: 90,
  },
  menu: {
    minWidth: 150,
  },
  c: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    marginLeft: -110,
    marginTop: -20,
    textAlign: 'center',
  },
  l: {
    position: 'absolute',
    bottom: '50%',
    left: 20,
  },
  r: {
    position: 'absolute',
    bottom: '50%',
    right: 40,
  },
})(OrganizeGame);
