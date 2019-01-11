import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, withStyles, Grid } from '@material-ui/core';
import Editor from '../editor';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  message: {
    textAlign: 'center',
    margin: 10,
    fontWeight: 900,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttons: {
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
    textAlign: 'right',
  },
  chips: {
    textAlign: 'center',
    '&>div': {
      margin: theme.spacing.unit,
    },
  },
});

const sampleCode = `/*
 * This playground supports printing and getting data from the console
 *
 * You have these functions:
 *   print(...args) - print the values received
 *   ask(question) - Ask a question and wait for keyboard entry
 */
const name = await ask('What is your name?');
print(\`Hello \${name}\`);
`;

class Playground extends React.Component {
  state = {
    code: window.localStorage.getItem('playground.code') || sampleCode,
  }

  saveCode = (code) => {
    this.setState({ code });
    window.localStorage.setItem('playground.code', code);
  }

  render() {
    const { classes } = this.props;
    const { code, error } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            {error && (
              <Typography variant="body1" className={classes.message}>
                {error}
              </Typography>
            )}
          </Grid>
          <Grid item xs>
            <Editor code={code} onChange={this.saveCode} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Playground.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Playground);