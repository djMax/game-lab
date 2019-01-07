import React, { Component } from 'react';
import { TextField, Button, AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import Api from './Api';
import SignIn from './SignIn';
import ProfileMenu from './ProfileMenu';
import TicTacToe from './tic-tac-toe';

const styles = {
  root: {
    minHeight: '100vh',
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,

    '&>div': {
      flex: 1,
    },
  },
};

class App extends Component {
  state = {
    name: window.localStorage.getItem('player.name'),
  }

  componentDidMount() {
    this.api = new Api();
    this.api.subscribe(this);
  }

  render() {
    const { name } = this.state;
    const { classes } = this.props;

    if (!name) {
      return <SignIn onComplete={() => this.setState({ name: window.localStorage.getItem('player.name') })} />;
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Advent Game Lab
            </Typography>
            <ProfileMenu />
          </Toolbar>
        </AppBar>
        <div className={classes.app}>
          <TicTacToe />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
