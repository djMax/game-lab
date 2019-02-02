import React from 'react';
import { storiesOf } from '@storybook/react';
import Board from './Board';
import { emptyBoard } from './boardgame';

const oneRed = emptyBoard(7, 6);
oneRed[3][5] = 0;

const fullColumn = emptyBoard(7, 6);
fullColumn[3] = [0, 1, 0, 1, 0, 1];

storiesOf('Connect Four', module)
  .add('Empty Board Red First', () => <Board G={{ columns: emptyBoard(7, 6) }} ctx={{ currentPlayer: '0' }} />)
  .add('Empty Board Black First', () => <Board G={{ columns: emptyBoard(7, 6) }} ctx={{ currentPlayer: '1' }} />)
  .add('One Red in the Middle', () => <Board G={{ columns: oneRed }} ctx={{ currentPlayer: '1' }} />)
  .add('Full Middle', () => <Board G={{ columns: fullColumn }} ctx={{ currentPlayer: '1' }} />);