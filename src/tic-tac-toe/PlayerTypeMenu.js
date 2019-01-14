import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';

export default ({ className, index, isX, value, onChange }) => (
  <Subscribe to={[MultiplayerContainer]}>
  {multiplayer => (
    <FormControl className={className}>
      <InputLabel htmlFor={`player${index}-simple`}>Player {index} ({isX ? 'o' : 'x'})</InputLabel>
      <Select
        displayEmpty
        value={value}
        onChange={onChange}
        inputProps={{
          name: `player${index}`,
          id: `player${index}-simple`,
        }}
      >
        <MenuItem value="human">
          <em>Human</em>
        </MenuItem>
        <MenuItem value="code">
          <em>Your Code</em>
        </MenuItem>
        <MenuItem value="random">
          <em>Random Spot</em>
        </MenuItem>
        <MenuItem value="centerCorner">
          <em>Centers/Corners</em>
        </MenuItem>
        <MenuItem value="minimax">
          <em>Minmax</em>
        </MenuItem>
        {Object.entries(multiplayer.state.others)
          .filter(([id, s]) => s.tictactoe)
          .map(([id, { name, tictactoe }]) => (
            <MenuItem key={id} value={tictactoe}>{name}</MenuItem>
          ))}
      </Select>
    </FormControl>
  )}
  </Subscribe>
);