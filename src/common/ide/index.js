import React from 'react';
import Editor from '../editor';

// IDE stands for "integrated development environment," which is a bit of a stretch here,
// but this is an editor + a debugger + a console
function Ide({ ...rest }) {
  return (
    <Editor {...rest} />
  );
}

export default Ide;
