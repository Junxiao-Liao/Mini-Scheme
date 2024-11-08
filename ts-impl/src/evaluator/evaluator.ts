import { ASTNode, SchemeValue, SchemeError } from '../types/types';
import { Environment } from '../evaluator/environment';
import { primitives } from '../evaluator/primitives';

export class Evaluator {
  private env: Environment;

  constructor() {
    this.env = new Environment();
    // Initialize environment with primitive procedures (add `+` `-` `*` `/` to the environment).
    Object.entries(primitives).forEach(([name, func]) => {
      this.env.define(name, func);
    });
  }

  evaluate(ast: ASTNode): SchemeValue {
    switch (ast.type) {
      case 'number':
        return ast.value;
      
      case 'boolean':
        return ast.value;
      
      case 'symbol':
        return this.env.get(ast.value);
      
      case 'list': {
        if (ast.value.length === 0) {
          return null;
        }

        const [operator, ...operands] = ast.value;
        const proc = this.evaluate(operator);

        if (typeof proc !== 'object' || proc === null || proc.type !== 'primitive') {
          throw new SchemeError(`${operator} is not a procedure`);
        }

        const args = operands.map(operand => this.evaluate(operand));
        return proc.func(...args);
      }

      default:
        throw new SchemeError(`Unknown expression type: ${ast.type}`);
    }
  }
}
