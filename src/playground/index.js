import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, Grid, Button } from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';
import Editor from '../editor';
import Console from './Console';

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
    margin: 10,
    '& button': {
      marginLeft: 10,
    }
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

  exposedProperties = ['ask', 'print']

  constructor(props) {
    super(props);
    this.consoleRef = React.createRef();
  }

  saveCode = (code) => {
    this.setState({ code });
    window.localStorage.setItem('playground.code', code);
  }

  accelerator = (key) => {
    if (key === 'r') {
      console.error('ACCELERATOR');
      setTimeout(this.run, 1);
    }
  }

  run = async (e) => {
    console.error(new Error());
    e && e.preventDefault();
    e && e.stopPropagation();
    const { code } = this.state;
    await this.consoleRef.current.clear();
    try {
      const retVal = [];
      let fn = this.cachedFn;
      if (code !== this.cachedSource || !fn) {
        const transformed = window.Babel.transform(`retVal[0] = (async function yourCode() { ${code} })()`, { presets: ['es2015'] }).code;
        // eslint-disable-next-line no-new-func
        fn = new Function(...this.exposedProperties, 'retVal', transformed);
        this.cachedFn = fn;
        this.cachedSource = code;
      }
      fn(...this.exposedProperties.map(f => this[f]), retVal);
      await retVal[0];
      this.consoleRef.current.addLine(['', '⏹ Your program has completed.']);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  clear = (e) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    this.consoleRef.current.clear();
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
            <Console innerRef={this.consoleRef} onCtrl={this.accelerator} />
          </Grid>
          <Grid item xs>
            <div className={classes.buttons}>
            <Button variant="contained" color="primary" onClick={this.run}>
              <PlayArrow />
              Run Code
            </Button>
            <Button variant="contained" color="secondary" onClick={this.clear}>
              <ClearIcon />
              Clear Output
            </Button>
            </div>
            <Editor code={code} onChange={this.saveCode} />
          </Grid>
        </Grid>
      </div>
    );
  }

  print = (...values) => {
    const finalOutput = values.join(' ');
    this.consoleRef.current.addLine(finalOutput);
  }

  ask = async (question) => {
    this.print(question);
    const line = await this.consoleRef.current.readLine();
    return line;
  }
}

Playground.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Playground);