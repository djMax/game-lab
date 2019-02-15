import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, Grid, Button, Select, MenuItem } from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';
import Editor from '../common/ide';
import Console from './Console';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';
import SignIn from '../common/SignIn';
import CodeManager from '../common/interpreter/CodeManager';

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
  invisible: {
    display: 'none',
  },
  running: {
    backgroundColor: '#44535a',
  },
});

function othersWithCode(mp) {
  const withCode = Object.entries(mp.state.others).filter(([id, s]) => s.playground);
  return withCode.length ? withCode : null;
}

const sampleCode = `/*
 * This playground supports printing and getting data from the console
 *
 * You have these functions:
 *   print(...args) - print the values received
 *   ask(question) - Ask a question and wait for keyboard entry
 *
 * You must have a "main" function which will be called to run your program.
 */
async function main() {
  const name = await ask('What is your name?');
  print(\`Hello \${name}\`);
}
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

  onCodeChange = (code) => {
    this.setState({ code });
    window.localStorage.setItem('playground.code', code);
  }

  onCodeCommit = (multiplayer) => {
    const { code } = this.state;
    multiplayer.newCode('playground', code);
  }

  accelerator = (key) => {
    if (key === 'r') {
      setTimeout(this.run, 1);
    }
  }

  copyFrom = ({ target: { value } }) => {
    const { code } = this.state;
    this.setState({ code: value, revert: code });
  }

  step = async () => {
    const shouldContinue = this.activeCode.step();
    if (!shouldContinue) {
      this.consoleRef.current.addLine(['', '⏹ Your program has completed.']);
    } else {
      const sourcePosition = await this.activeCode.sourcePosition();
      this.setState({
        markers: [{
          ...sourcePosition,
          type: 'text',
          className: this.props.classes.running,
        }],
      });
    }
  }

  run = (e) => {
    e && e.preventDefault();
    const { code, running } = this.state;
    if (running) {
      return;
    }
    this.setState({ running: true }, async () => {
      await this.consoleRef.current.clear();
      try {
        if (code !== this.cachedSource) {
          const cm = new CodeManager(code);
          cm.transform();
          this.cachedSource = code;
          this.activeCode = cm;
          cm.start({ print: this.print });
        }
        this.setState({ running: true });
      } catch (error) {
        console.error('Code failure', error);
        this.setState({ running: false, error });
        return error.message;
      }
    });
  }

  clear = (e) => {
    e && e.preventDefault();
    this.consoleRef.current.clear();
  }

  render() {
    const { classes, multiplayer } = this.props;
    const { code, error, running, revert, markers } = this.state;

    if (!multiplayer.state.name) {
      return <SignIn />;
    }

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs>
            {error && (
              <Typography variant="body1" className={classes.message} component="pre">
                {JSON.stringify(error, null, '\t')}
              </Typography>
            )}
            <Console innerRef={this.consoleRef} onCtrl={this.accelerator} />
          </Grid>
          <Grid item xs>
            <div className={classes.buttons}>
              <Button variant="contained" color="primary" onClick={this.run} disabled={!!running}>
                <PlayArrow />
                Run Code
              </Button>
              <Button onClick={this.step}>Step</Button>
              <Button variant="contained" color="secondary" onClick={this.clear}>
                <ClearIcon />
                Clear Output
              </Button>
              {othersWithCode(multiplayer) && (
                <Select
                  displayEmpty
                  className={classes.formControl}
                  onChange={this.copyFrom}
                  value="-"
                  inputProps={{
                    id: 'copy-simple',
                  }}
                >
                  <MenuItem value="-" className={classes.invisible}>Copy code from...</MenuItem>
                  {othersWithCode(multiplayer).map(([id, { name, playground }]) => (
                    <MenuItem key={id} value={playground}>{name}</MenuItem>
                  ))}
                </Select>
              )}
            </div>
            <Editor
              markers={markers}
              code={code}
              onChange={this.onCodeChange}
              onCommit={() => this.onCodeCommit(multiplayer)}
            />
            {revert && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ revert: null, code: revert });
                }}
              >Restore Previous Code</Button>
            )}
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

export default withStyles(styles)(props => (
  <Subscribe to={[MultiplayerContainer]}>
    {multiplayer => <Playground {...props} multiplayer={multiplayer} />}
  </Subscribe>
));
