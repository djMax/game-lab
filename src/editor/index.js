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
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={code}
          width="100%"
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true,
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