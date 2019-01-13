import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AppBar, Toolbar, Typography, withStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Api from './Api';
import SignIn from './SignIn';
import ProfileMenu from './ProfileMenu';
import TicTacToe from './tic-tac-toe';
import Playground from './playground';

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
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
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

  pickedName = () => {
    const name = window.localStorage.getItem('player.name');
    this.api.sendBroadcast({ name });
    this.setState({ name });
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  goFunction = (url) => {
    const { history } = this.props;
    return () => this.setState({ anchorEl: null }, () => history.push(url));
  };

  render() {
    const { name, anchorEl } = this.state;
    const { classes } = this.props;

    if (!name) {
      return <SignIn onComplete={this.pickedName} />;
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              aria-owns={anchorEl ? 'game-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="game-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.goFunction('/tic-tac-toe')}>Tic-Tac-Toe</MenuItem>
              <MenuItem onClick={this.goFunction('/playground')}>Console Playground</MenuItem>
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Advent Game Lab
            </Typography>
            <ProfileMenu />
          </Toolbar>
        </AppBar>
        <div className={classes.app}>
          <Switch>
            <Route path="/" exact component={TicTacToe} />
            <Route path="/tic-tac-toe" exact component={TicTacToe} />
            <Route path="/playground" exact component={Playground} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
