/* globals sourceMap */
import Interpreter from './interpreter';

const prefix = '(function main() {\n';
const suffix = '\n})()';

export default class CodeManager {
  constructor(userCode) {
    this.code = userCode;
  }

  async transform() {
    const babeled = window.Babel.transform(`${prefix}${this.code}${suffix}`, {
      retainLines: true,
      sourceMap: true,
      presets: [['env']],
    });
    this.map = babeled.map;
    this.lineLengths = babeled.code.split('\n').map(l => l.length + 1);
    this.transformed = babeled.code;
    console.log(babeled.code);
  }

  start(funcs, props) {
    this.interpreter = new Interpreter(this.transformed, (interpreter, scope) => {
      Object.entries(funcs).forEach(([name, impl]) => {
        interpreter.setProperty(scope, name, interpreter.createNativeFunction(impl));
      });
    });
  }

  step() {
    let shouldContinue;
    let endPosition;
    let len;
    do {
      shouldContinue = this.interpreter.step();
      const { node } = this.interpreter.stateStack[this.interpreter.stateStack.length - 1];
      endPosition = node.end;
      len = node.end - node.start;
    } while (endPosition < prefix.length || len === this.transformed.length);
    return shouldContinue;
  }

  toRowAndColumn(offset) {
    let column = offset;
    for (let line = 1; line <= this.lineLengths.length; line += 1) {
      if (this.lineLengths[line - 1] > column) {
        return { line, column };
      }
      column -= this.lineLengths[line - 1];
    }
    return { source: 'unknown', line: this.lineLengths.length - 1, column };
  }

  /**
   * Return the current execution position relative to the original source,
   * compatible with Ace ranges
   */
  async sourcePosition() {
    const { node } = this.interpreter.stateStack[this.interpreter.stateStack.length - 1];
    let { start, end } = node;

    await sourceMap.SourceMapConsumer.with(this.map, null, (consumer) => {
      const startRowCol = this.toRowAndColumn(start);
      const endRowCol = this.toRowAndColumn(end);
      console.log('START', start, startRowCol, consumer.originalPositionFor(startRowCol));
      console.log('END', end, endRowCol, consumer.originalPositionFor(endRowCol));
      start = consumer.originalPositionFor(startRowCol);
      end = consumer.originalPositionFor(endRowCol);
    });

    if (start.line === 1) {
      start.column -= prefix.length;
    }
    if (end.line === 1) {
      end.column -= prefix.length;
    }

    return {
      startRow: start.line - 1,
      startCol: start.column,
      endRow: end.line - 1,
      endCol: end.column,
    };
  }
}