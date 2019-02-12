import React from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Subscribe } from 'unstated';
import MultiplayerContainer from './common/MultiplayerContainer';

class ProfileMenuImpl extends React.Component {
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
    const { multiplayer } = this.props;
    const open = Boolean(anchorEl);

    if (!multiplayer.state.name) {
      return null;
    }

    return (
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
    );
  }
}

export default function ProfileMenu(props) {
  return (
    <Subscribe to={[MultiplayerContainer]}>
      {multiplayer => <ProfileMenuImpl {...props} multiplayer={multiplayer} />}
    </Subscribe>
  )
}
