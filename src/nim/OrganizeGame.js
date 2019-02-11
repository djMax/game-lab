import React from 'react';
import { Button, withStyles, Typography, Card, CardContent, CardActions, TextField } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import PlayerMenu from '../common/PlayerMenu';

class OrganizeGame extends React.Component {
  state = {
    players: this.props.defaultPlayers,
    piles: '10',
    maxPick: 3,
  }

  setPlayer = (multiplayer, index, value) => {
    const players = this.state.players.slice(0);
    const exPlayer = players[index];
    const existingIndex = players.findIndex(p => p === value);
    if (existingIndex >= 0 && value.startsWith('human')) {
      players[existingIndex] = exPlayer;
    }
    players[index] = value;
    this.setState({ players });
  }

  play = (multiplayer) => {
    const { players, piles, maxPick } = this.state;
    const { onReady } = this.props;
    this.setState({ loading: true }, () => {
      onReady(players.map(p => (p === 'human' ? `human:${multiplayer.id}` : p)), {
        piles: piles.split(','),
        maxPick,
      });
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
              Choose players for a game of Nim. You may choose to take any number
              of balls from one of the piles. The player that
              {' '}
              <b>takes the last ball loses.</b>
            </Typography>

            <div className={classes.board}>
              <div className={classes.c}>
                vs.
              </div>
              <div className={classes.l}>
                <PlayerMenu value={players[0]} ai={ai} classes={classes} onChange={this.setPlayer} gameName="Nim" playerIndex={0} multiplayer={multiplayer} />
              </div>
              <div className={classes.r}>
                <PlayerMenu value={players[1]} ai={ai} classes={classes} onChange={this.setPlayer} gameName="Nim" playerIndex={1} multiplayer={multiplayer} />
              </div>
            </div>
            <div className={classes.details}>
              <TextField
                onChange={({ target: { value }}) => this.setState({ piles: value })}
                autoFocus
                margin="normal"
                id="piles"
                label="Initial piles and ball counts"
                defaultValue={this.state.piles}
                helperText="Comma-separated list of ball counts (example: 5,6,7)"
                fullWidth
              />
              <TextField
                onChange={({ target: { value }}) => this.setState({ maxPick: value })}
                autoFocus
                margin="normal"
                id="piles"
                label="Maximum Number of Balls Taken Per Turn"
                defaultValue={this.state.maxPick}
                helperText="Leave blank for no maximum"
                fullWidth
              />
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
    top: 60,
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
  details: {
    marginTop: 60,
  }
})(OrganizeGame);
