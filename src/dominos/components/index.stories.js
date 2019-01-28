import React from 'react';
import { storiesOf } from '@storybook/react';
import Hand from './Hand';

const pieces = new Array(7).fill(0).map(() => ({
  values: [parseInt(Math.random() * 7, 10), parseInt(Math.random() * 7, 10)]
}));

storiesOf('Domino Hand', module)
  .add('Full Hand', () => <Hand pieces={pieces} name="djMax" />)
  .add('Anonymous Full Hand', () => <Hand pieces={7} name="djMax" />)
  .add('Four Piece Hand', () => <Hand pieces={pieces.slice(0, 4)} name="djMax" />)
  .add('Small Full Hand', () => <div style={{ fontSize: '.5em' }}><Hand pieces={pieces} name="djMax" /></div>);