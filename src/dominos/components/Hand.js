import React from 'react';
import classnames from 'classnames';
import { Button, withStyles } from '@material-ui/core';
import Piece from './Piece';
import LogicalHand from '../models/LogicalHand';

const Hand = ({ classes, pieces, name, active, onClick, onPass, ...rest }) => {
  let finalHand = Array.isArray(pieces) ? LogicalHand.sorted(pieces) : Array(pieces).fill({ values: [undefined, undefined] });
  return (
    <div className={classnames(classes.root, { [classes.active]: active })} {...rest}>
      {finalHand.map((p, ix) => <Piece
        key={JSON.stringify(p.values[0] ? p.values : ix)}
        first={p.values[0]}
        second={p.values[1]}
        onClick={() => (onClick && onClick(p))}
      />)}
      <div className={classes.name}>{name}</div>
      {onPass && <Button variant="contained" onClick={onPass}>
        Pass
      </Button>}
    </div>
  );
}

export default withStyles({
  name: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 24,
    bottom: 0,
    padding: '.25em',
    borderRadius: 6,
  },
  active: {
    backgroundColor: 'pink',
  },
  root: {
    position: 'relative',
    paddingBottom: 40,
    display: 'flex',
    minWidth: '45em',
    maxWidth: '55em',
    margin: 'auto',
    borderRadius: 12,
    justifyContent: 'center',
    '& button': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 250,
      height: 30,
      marginTop: -25,
      marginLeft: -125,
    },
  },
})(Hand)