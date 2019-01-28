import React from 'react';
import { Button, withStyles, Select, MenuItem, Typography, Card, CardContent, CardActions } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../../common/MultiplayerContainer';

const PlayerMenu = ({ value, onChange, index, classes, multiplayer }) => (
  <Select
    className={classes.menu}
    displayEmpty
    value={value}
    onChange={({ target: { value } }) => onChange(multiplayer, index, value)}
    inputProps={{
      name: `player${index}`,
      id: `player${index}-simple`,
    }}
  >
    <MenuItem value="human">
      <em>{multiplayer.state.name}</em>
    </MenuItem>
    <MenuItem value="code">
      <em>{`${multiplayer.state.name}'s code`}</em>
    </MenuItem>
    <MenuItem value="random">
      <em>CPU Random</em>
    </MenuItem>
    <MenuItem value="highest">
      <em>CPU Highest Piece</em>
    </MenuItem>
    {Object.entries(multiplayer.state.others)
      .map(([id, { name }]) => (
        <MenuItem key={id} value={`human:${id}`}>{name}</MenuItem>
      ))}
    {Object.entries(multiplayer.state.others)
      .filter(([id, s]) => s.dominos)
      .map(([id, { name, dominos }]) => (
        <MenuItem key={id} value={`code:${id}:${dominos}`}>{name}'s code</MenuItem>
      ))}
  </Select>
);

class OrganizeGame extends React.Component {
  state = {
    players: ['human', 'highest', 'highest', 'highest'],
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
    const { classes } = this.props;

    return (
      <Subscribe to={[MultiplayerContainer]}>
        {multiplayer => (
          <Card className={classes.root}>
          <CardContent>
            <Typography variant="h4">Start a New Game</Typography>
            <Typography component="p">
              Choose your teams to play Dominos. Each player gets 7 pieces to start,
              and the board has two ends. The goal is to get rid of all your pieces,
              or "close the game" and have the least points in your hand. The player across
              from you is your partner and the two of you share points. The team that
              gets to 100 points first wins.
            </Typography>
            <Typography component="p">
              Click the arrow button on the right to expand the Code Editor, where you
              can build an AI Bot to play Dominos with or against you. You can also
              select one of the pre-built AI players from the menus below.
            </Typography>

            <div className={classes.board}>
              <div className={classes.c}>
                Choose your players
              </div>
              <div className={classes.t}>
                <PlayerMenu value={players[0]} classes={classes} onChange={this.setPlayer} index={0} multiplayer={multiplayer} />
              </div>
              <div className={classes.l}>
                <PlayerMenu value={players[3]} classes={classes} onChange={this.setPlayer} index={3} multiplayer={multiplayer} />
              </div>
              <div className={classes.r}>
                <PlayerMenu value={players[1]} classes={classes} onChange={this.setPlayer} index={1} multiplayer={multiplayer} />
              </div>
              <div className={classes.b}>
                <PlayerMenu value={players[2]} classes={classes} onChange={this.setPlayer} index={2} multiplayer={multiplayer} />
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
    top: 125,
    left: 50,
    maxWidth: 680,
  },
  board: {
    position: 'relative',
    width: 650,
    height: 300,
  },
  menu: {
    minWidth: 150,
  },
  c: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    marginLeft: -100,
    marginTop: -20,
    textAlign: 'center',
  },
  l: {
    position: 'absolute',
    bottom: '50%',
    left: 20,
  },
  b: {
    position: 'absolute',
    bottom: 20,
    left: '40%',
  },
  t: {
    position: 'absolute',
    top: 20,
    left: '40%',
  },
  r: {
    position: 'absolute',
    bottom: '50%',
    right: 10,
  },
})(OrganizeGame);
