/* globals Blockly */
import React from 'react';
import AceEditor from 'react-ace';
import Safe from 'react-safe';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'blockly/blocks_compressed';

import { withStyles, Button } from '@material-ui/core';


const styles = {
  root: {
    flexGrow: 1,
  },
  button: {
    textAlign: 'right',
  },
  blockly: {
    height: 600,
    width: '100%',
  },
}

class CodeEditor extends React.Component {
  state = {
    useBlocks: false,
  }

  onChange = (code) => {
    this.props.onChange(code);
  }

  onCommit = () => {
    this.props.onCommit();
  }

  toggleMode = () => {
    const { useBlocks } = this.state;
    if (useBlocks) {
      delete window.blocklyWorkspace;
    }
    this.setState({ useBlocks: !useBlocks })
  }

  render() {
    const { classes, code } = this.props;
    const { useBlocks } = this.state;

    if (useBlocks && !window.blocklyWorkspace) {
      setTimeout(() => {
        window.blocklyWorkspace = Blockly.inject('blocklyDiv', {
          toolbox: document.getElementById('toolbox'),
        });
      }, 250);
    }

    return (
      <div className={classes.root}>
        {useBlocks && (
          <div id="blocklyDiv" className={classes.blockly}>
          </div>
        )}
        {!useBlocks && (
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="codeEditor"
            onLoad={this.onLoad}
            onChange={this.onChange}
            onBlur={this.onCommit}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            width="100%"
            setOptions={{
              enableBasicAutoCompletion: false,
              enableLiveAutoCompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        )}
        {false && (
          <div className={classes.button}>
            <Button onClick={this.toggleMode}>Switch to {useBlocks ? 'Javascript Editor' : 'Block Editor'}</Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CodeEditor);