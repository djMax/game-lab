import React from 'react';
import { withStyles } from '@material-ui/core';

const styles = {
  panel: {
    height: 515,
    width: '95%',
    backgroundColor: '#002f05',
    color: '#00fe00',
    padding: 20,
    fontFamily: 'Source Code Pro',
    overflow: 'scroll',
    overflowX: 'hidden',
    overflowY: 'scroll',
    border: '1px dashed #E6EBE0',
    fontWeight: 'bold',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  cursor: {
    animationName: 'fadeIn',
    animationDuration: '1200ms',
    animationIterationCount: 'infinite',
    opacity: 1,
  },
};

const baseText = 'Your program output will appear here.';

class Console extends React.Component {
  state = {
    lines: [baseText],
    blank: true,
    reading: false,
    line: null,
  }

  onKeyDown = (event) => {
    const { reading, line } = this.state;
    const { onCtrl } = this.props;
    if (reading) {
      if (event.keyCode === 8 || event.keyCode === 46) {
        this.setState({
          line: line.substring(0, line.length - 1),
        });
        return;
      }
    }
    if (event.ctrlKey && event.key && onCtrl) {
      onCtrl(event.key);
    }
  }

  onKeyPress = (event) => {
    const { reading, line, lines } = this.state;
    if (reading) {
      if (event.which === 13) {
        this.setState({
          line: null,
          lines: [
            ...lines,
            `⏎ ${line}`,
          ],
          reading: false,
        }, () => {
          const lc = this.lineCompleted;
          delete this.lineCompleted;
          lc(line);
        });
        return;
      }
      if (event.key) {
        this.setState({
          line: `${line || ''}${event.key}`,
        });
        return;
      }
    }
  }

  componentDidMount() {
    this.handler = window.addEventListener('keypress', this.onKeyPress);
    this.handler = window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPress);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  addLine(l) {
    const { blank, lines } = this.state;
    let newLines = Array.isArray(l) ? l : [l];
    this.setState({
      blank: false,
      lines: [
        ...blank ? [] : lines,
        ...newLines,
      ]
    })
  }

  readLine() {
    return new Promise((accept) => {
      this.setState({
        reading: true,
      }, () => {
        this.lineCompleted = accept;
      });
    })
  }

  async clear() {
    return new Promise(accept => this.setState({
      blank: true,
      lines: [],
    }, accept));
  }

  render() {
    const { classes } = this.props;
    const { lines, reading, line } = this.state;

    return (
      <div className={classes.panel}>
        {lines.map((l, ix) => <div key={`l-${ix}`} className={classes.line}>&nbsp;{l}</div>)}
        {reading && (
          <div className={classes.promptLine}>
            <span className={classes.prompt}>&gt;&nbsp;</span>
            <span className={classes.input}>
              <span className={classes.left}>{line || ''}</span>
              <span className={classes.cursor}>_</span>
              <span className={classes.right}></span>
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Console);
