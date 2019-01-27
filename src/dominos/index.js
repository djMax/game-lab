import React from 'react';
import { withStyles, Drawer, Fab } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Editor from '../editor';
import { Subscribe } from 'unstated';
import MultiplayerContainer from '../common/MultiplayerContainer';

const styles = {
  root: {
    flexGrow: 1,
  },
  code: {
    width: '65vw',
    minWidth: 500,
    padding: 50,
  },
  expander: {
    position: 'absolute',
    right: 28,
    top: '50%',
    marginTop: -28,
  },
  expanded: {
    position: 'absolute',
    left: -28,
    top: '50%',
    marginTop: -28,
    '& svg': {
      marginLeft: 20,
    }
  },
};

class Dominos extends React.Component {
  state = {
    codeOpen: true
  }

  toggle = () => this.setState({ codeOpen: !this.state.codeOpen })

  render() {
    const { codeOpen, code } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        Hello World

        <Drawer anchor="right" open={codeOpen} onClose={this.closeCode}>
          <div className={classes.code}>
            <Subscribe to={[MultiplayerContainer]}>
            {multiplayer => (
              <Editor
                code={code}
                onChange={this.onCodeChange}
                onCommit={() => this.onCodeCommit(multiplayer)}
              />
            )}
            </Subscribe>
          </div>
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.expanded}
            onClick={this.toggle}
          >
            <ArrowForwardIcon />
          </Fab>
        </Drawer>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.expander}
          onClick={this.toggle}
        >
          <ArrowBackIcon />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(Dominos);
