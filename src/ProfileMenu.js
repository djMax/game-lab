import React from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Subscribe } from 'unstated';
import MultiplayerContainer from './common/MultiplayerContainer';

export default class ProfileMenu extends React.Component {
  state = {
    anchorEl: null,
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    window.localStorage.removeItem('player.name');
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <Subscribe to={[MultiplayerContainer]}>
      {multiplayer => (
        <div>
          <IconButton
            aria-owns={open ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
          >
            <AccountCircle />
            &nbsp;
            <Typography color="inherit">
              {window.localStorage.getItem('player.name')}
            </Typography>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={multiplayer.signOut}>Change Nickname</MenuItem>
          </Menu>
        </div>
      )}
      </Subscribe>
    );
  }
}