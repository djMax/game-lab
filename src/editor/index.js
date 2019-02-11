/* globals Blockly */
import React from 'react';
import AceEditor from 'react-ace';
import Toolbox from './toolbox';
import ScratchVM from 'scratch-vm';
import Target from 'scratch-vm/src/engine/target';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

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

  greenFlag = () => {
    window.blocklyVm.greenFlag();
  }

  render() {
    const { classes, code, offerBlocks } = this.props;
    const { useBlocks } = this.state;

    if (useBlocks && !window.blocklyWorkspace) {
      setTimeout(() => {
        Blockly.ScratchMsgs.setLocale('en');
        window.blocklyWorkspace = Blockly.inject('blocklyDiv', {
          toolbox: document.getElementById('toolbox-categories'),
          comments: true,
          media: '/scratch/media/',
          scrollbars: true,
          zoom: {
            controls: true,
            wheel: true,
            startScale: 0.75,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1
          },
          colours: {
            fieldShadow: 'rgba(255, 255, 255, 0.3)',
            dragShadowOpacity: 0.6
          },
        });
        const vm = new ScratchVM();
        window.blocklyWorkspace.addChangeListener((a) => console.log('CHANGE L', a));
        window.blocklyWorkspace.addChangeListener(vm.blockListener);
        window.blocklyWorkspace.addChangeListener(vm.variableListener);
        vm.addListener('PROJECT_START', () => {
          console.error('PROJECT_START STARTED');
        });
        vm.addListener('PROJECT_RUN_START', () => {
          console.error('PROJECT_RUN_START');
        });
        vm.addListener('PROJECT_RUN_STOP', () => {
          console.error('PROJECT_RUN_STOP');
        });
        vm.addListener('PROJECT_CHANGED', () => {
          console.error('PROJECT_CHANGED');
        });
        vm.addListener('targetsUpdate', (...args) => {
          console.error('targetsUpdate', args);
        });
        const target = new Target(vm.runtime);
        target.id = 'Game_Target';
        target.onStopAll = () => {
          console.error('STOP ALL');
        };
        target.setCustomState = (stateId, newValue) => {
          console.error('SET STATE', stateId, newValue);
        };
        target.sprite = {};
        vm.runtime.targets = [target];
        vm.start();
        window.blocklyVm = vm;
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
            value={code || ''}
            width="100%"
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        )}
        {offerBlocks && (
          <div className={classes.button}>
            <Button onClick={this.toggleMode}>Switch to {useBlocks ? 'Javascript Editor' : 'Block Editor'}</Button>
          </div>
        )}
        <Toolbox />
      </div>
    );
  }
}

export default withStyles(styles)(CodeEditor);