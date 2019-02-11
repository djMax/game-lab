import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AppBar, Toolbar, Typography, withStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SignIn from './common/SignIn';
import ProfileMenu from './ProfileMenu';
import TicTacToe from './tic-tac-toe';
import Playground from './playground';
import Dominos from './dominos';
import ConnectFour from './connect-four';
import Nim from './nim';
import Intro from './Intro';

const styles = {
  root: {
    overflowX: 'hidden',
    minHeight: '100vh',
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
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
    others: {},
  }

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  goFunction = (url) => {
    const { history } = this.props;
    return () => this.setState({ anchorEl: null }, () => history.push(url));
  }

  render() {
    const { anchorEl, others } = this.state;
    const { classes } = this.props;

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
              <MenuItem onClick={this.goFunction('/playground')}>Console Playground</MenuItem>
              <MenuItem onClick={this.goFunction('/nim')}>Nim</MenuItem>
              <MenuItem onClick={this.goFunction('/tic-tac-toe')}>Tic-Tac-Toe</MenuItem>
              <MenuItem onClick={this.goFunction('/connect-four')}>Connect Four</MenuItem>
              <MenuItem onClick={this.goFunction('/dominos')}>Dominos</MenuItem>
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Advent Game Lab
            </Typography>
            <ProfileMenu others={others} />
          </Toolbar>
        </AppBar>
        <div className={classes.app}>
          <Switch>
            <Route path="/" exact component={Intro} />
            <Route path="/tic-tac-toe" exact component={TicTacToe} others={others} />
            <Route path="/playground" exact component={Playground} />
            <Route path="/dominos" exact component={Dominos} />
            <Route path="/connect-four" exact component={ConnectFour} />
            <Route path="/nim" exact component={Nim} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));