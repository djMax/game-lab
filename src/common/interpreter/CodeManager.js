import Interpreter from './interpreter';

const prefix = '(function main() {\n';
const suffix = '\n})()';

export default class CodeManager {
  constructor(userCode) {
    this.code = userCode;
    this.lineLengths = userCode.split('\n').map(l => l.length);
  }

  transform() {
    this.transformed = window.Babel.transform(`${prefix}${this.code}${suffix}`, {
      retainLines: true,
      presets: [['env']],
    }).code;
  }

  start(funcs, props) {
    this.interpreter = new Interpreter(this.transformed, (interpreter, scope) => {
      Object.entries(funcs).forEach(([name, impl]) => {
        interpreter.setProperty(scope, name, interpreter.createNativeFunction(impl));
      });
    });
  }

  step() {
    return this.interpreter.step();
  }

  /**
   * Return the current execution position relative to the original source,
   * compatible with Ace ranges
   */
  get sourcePosition() {
    const { node } = this.interpreter.stateStack[this.interpreter.stateStack.length - 1];
    return {
      startRow: 0,
      startCol: 0,
      endRow: 1,
      endCol: 1,
    };
  }
}