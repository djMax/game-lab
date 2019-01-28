import React from 'react';
import { storiesOf } from '@storybook/react';
import Board from '.';

storiesOf('Domino Board', module)
  .add('blank', () => <div style={{ fontSize: '0.8em' }}><Board /></div>);
