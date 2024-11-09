import {
  ASTNode,
  SchemeValue,
  SchemeError,
  InvalidArgumentError,
  UndefinedVariableError,
  ConditionalError
} from '../types/types';
import { Environment } from './environment';
import { primitives } from './primitives';

export class Evaluator {
  private env: Environment;

  constructor(parentEnv?: Environment) {
    this.env = new Environment(parentEnv);
    // Initialize environment with primitive procedures
    if (!parentEnv) {
      // Add `+` `-` `*` `/` to the base environment.
      Object.entries(primitives).forEach(([name, func]) => {
        this.env.define(name, func);
      });
    }
  }

  evaluate(ast: ASTNode): SchemeValue {
    switch (ast.type) {
      case 'number':
        return ast.value;
      
      case 'string':
        return ast.value;
      
      case 'boolean':
        return ast.value;
      
      case 'symbol':
        return this.env.get(ast.value);
      
      case 'list': {
        if (ast.value.length === 0) {
          return null;
        }

        const [first, ...rest] = ast.value;
        
        // Handle special forms.
        if (first.type === 'symbol') {
          switch (first.value) {
            case 'define':
              return this.evaluateDefine(rest);
            case 'set!':
              return this.evaluateSet(rest);
            case 'if':
              return this.evaluateIf(rest);
          }
        }

        // Regular procedure call.
        const proc = this.evaluate(first);
        if (typeof proc !== 'object' || proc === null || proc.type !== 'primitive') {
          throw new SchemeError(`${first.value} is not a procedure`);
        }

        const args = rest.map(expr => this.evaluate(expr));
        return proc.func(...args);
      }

      default:
        throw new SchemeError(`Unknown expression type: ${ast.type}`);
    }
  }

  private evaluateDefine(args: ASTNode[]): SchemeValue {
    if (args.length !== 2) {
      throw new InvalidArgumentError('define requires exactly 2 arguments');
    }

    const [nameNode, valueNode] = args;
    if (nameNode.type !== 'symbol') {
      throw new InvalidArgumentError('define requires a symbol as its first argument');
    }

    const value = this.evaluate(valueNode);
    this.env.define(nameNode.value, value);
    return null;
  }

  private evaluateSet(args: ASTNode[]): SchemeValue {
    if (args.length !== 2) {
      throw new InvalidArgumentError('set! requires exactly 2 arguments');
    }

    const [nameNode, valueNode] = args;
    if (nameNode.type !== 'symbol') {
      throw new InvalidArgumentError('set! requires a symbol as its first argument');
    }

    if (!this.env.has(nameNode.value)) {
      throw new UndefinedVariableError(nameNode.value);
    }

    const value = this.evaluate(valueNode);
    this.env.set(nameNode.value, value);
    return null;
  }

  private evaluateIf(args: ASTNode[]): SchemeValue {
    if (args.length !== 2 && args.length !== 3) {
      throw new ConditionalError('if requires 2 or 3 arguments');
    }

    const [testExpr, consequent, alternative] = args;
    const testResult = this.evaluate(testExpr);

    // In Scheme, only #f is false, everything else is true
    if (testResult !== false) {
      return this.evaluate(consequent);
    } else if (args.length === 3) {
      return this.evaluate(alternative);
    }

    return null;
  }
}
