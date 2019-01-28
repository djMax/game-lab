import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import Piece from './Piece';
import Hand from './Hand';

const playerDirection = {
  0: 'North',
  1: 'East',
  2: 'South',
  3: 'West',
};

const teams = {
  0: 'North/South',
  1: 'East/West',
  2: 'North/South',
  3: 'East/West',
}

export default ({ winner, points, hands, onNext }) => {
  return (
    <Dialog
      open
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Game Over</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {playerDirection[winner]} won. {teams[winner]} gets {points} points.
        </DialogContentText>
        <div style={{ fontSize: 8 }}>
          <Hand pieces={hands} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onNext} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
