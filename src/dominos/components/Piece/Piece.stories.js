import React from 'react';
import { storiesOf } from '@storybook/react';
import Piece from '.';

storiesOf('Domino Piece', module)
  .add('double six', () => <Piece first={6} second={6} />)
  .add('zero one', () => <Piece first={0} second={1} />)
  .add('two three', () => <Piece first={2} second={3} />)
  .add('four five', () => <Piece first={4} second={5} />);
