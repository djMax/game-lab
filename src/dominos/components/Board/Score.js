import React from 'react';
import { withStyles } from '@material-ui/core';

const Score = ({ ns, ew, className, classes }) => (
  <div className={className}>
  <table className={classes.root}>
    <thead>
      <tr><th colSpan={2}>Score</th></tr>
    </thead>
    <tbody>
      <tr><td>North/South</td><td>{ns}</td></tr>
      <tr><td>East/West</td><td>{ew}</td></tr>
    </tbody>
  </table>
  </div>
);

export default withStyles({
  root: {
    '& thead th': {
      backgroundColor: '#DDEFEF',
      border: 'solid 1px #DDEEEE',
      color: '#336B6B',
      padding: 10,
      textAlign: 'left',
      textShadow: '1px 1px 1px #fff',
    },
    '& tbody td': {
      border: 'solid 1px #DDEEEE',
      color: '#333',
      padding: 10,
      textShadow: '1px 1px 1px #fff'
    },
  }
})(Score);
