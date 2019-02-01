import React from 'react';
import { Select, MenuItem, withStyles } from '@material-ui/core';

const PlayerMenu = ({ value, onChange, ai, gameName, playerIndex, classes, multiplayer }) => (
  <Select
    className={classes.menu}
    displayEmpty
    value={value}
    onChange={({ target: { value } }) => onChange(multiplayer, playerIndex, value)}
    inputProps={{
      name: `player${playerIndex}`,
      id: `player${playerIndex}-simple`,
    }}
  >
    <MenuItem value="human">
      <em>{multiplayer.state ? multiplayer.state.name : 'You'}</em>
    </MenuItem>
    {multiplayer.state && (
      <MenuItem value="code">
        <em>{`${multiplayer.state.name}'s code`}</em>
      </MenuItem>
    )}
    {Object.entries(ai || {}).map(([id, name]) => (
      <MenuItem value={id}>
        <em>{name}</em>
      </MenuItem>
    ))}
    {multiplayer.state && Object.entries(multiplayer.state.others)
      .map(([id, { name }]) => (
        <MenuItem key={id} value={`human:${id}`}>{name}</MenuItem>
      ))}
    {multiplayer.state && Object.entries(multiplayer.state.others)
      .filter(([id, s]) => s[gameName])
      .map(([id, s]) => (
        <MenuItem key={id} value={`code:${id}:${s[gameName]}`}>{s.name}'s code</MenuItem>
      ))}
  </Select>
);

export default PlayerMenu;
