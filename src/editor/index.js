import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import { withStyles } from '@material-ui/core';

const styles = {
  root: {
    flexGrow: 1,
  },
}

class CodeEditor extends React.Component {
  onChange = (code) => {
    this.props.onChange(code);
  }

  onCommit = () => {
    this.props.onCommit();
  }

  render() {
    const { classes, code } = this.props;

    return (
      <div className={classes.root}>
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
      </div>
    );
  }
}

export default withStyles(styles)(CodeEditor);