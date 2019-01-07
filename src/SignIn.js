import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@material-ui/core';

export default class SignIn extends React.Component {
  state = {
    name: window.localStorage.getItem('player.name'),
  }

  login = () => {
    const { name } = this.state;
    window.localStorage.setItem('player.name', name);
    const { onComplete } = this.props;
    onComplete();
  }

  render() {
    const { name } = this.state;

    return (<Dialog
      open
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Log In</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a nickname of your choosing. Do not impersonate someone else
              and keep it appropriate for school.
            </DialogContentText>
            <TextField
              onChange={({ target: { value }}) => this.setState({ name: value })}
              autoFocus
              margin="dense"
              id="name"
              label="Nickname"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.login} color="primary" disabled={!name || name.length <= 2}>
              {name ? `I am ${name}` : '...' }
            </Button>
          </DialogActions>
    </Dialog>);
  }
}