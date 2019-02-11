import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import { Slider } from '@material-ui/lab';

const styles = {
  root: {
    width: 150,
    margin: 'auto',
  },
  slider: {
    padding: '22px 0px',
  },
};

function AiSpeedSlider({ classes, isMaster, speed, setSpeed }) {
  if (isMaster) {
    return (
      <div className={classes.root}>
        <Typography id="slider-label">AI Speed</Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={speed}
          min={2500}
          max={0}
          aria-labelledby="slider-label"
          onChange={(e, value) => setSpeed(value)}
        />
      </div>
    );
  }
  return null;
}

export default withStyles(styles)(AiSpeedSlider);
