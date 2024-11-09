import {
  ASTNode,
  SchemeValue,
  SchemeUserFunction,
  SchemeList,
  SchemeError,
  InvalidArgumentError,
  UndefinedVariableError,
  ConditionalError,
  FunctionError,
  ListError
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
      this.env.define('null', null);
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
            case 'lambda':
              return this.evaluateLambda(rest);
          }
        }

        // Regular procedure call.
        const proc = this.evaluate(first);
        const args = rest.map(expr => this.evaluate(expr));
        
        return this.apply(proc, args);
      }

      case 'quote':
        return this.buildSchemeList(ast.value); // Build SchemeList here

      default:
        throw new SchemeError(`Unknown expression type: ${ast}`);
    }
  }

  private buildSchemeList(astNode: ASTNode): SchemeList | SchemeValue { // Correct return type
    if (astNode.type === 'list') {
      if (astNode.value.length === 0) {
        return null; // Represent empty list as null
      }
      return {
        type: 'list',
        car: this.evaluate(astNode.value[0]), // Evaluate car
        cdr: this.buildSchemeList({ type: 'list', value: astNode.value.slice(1) }) // Recursively build cdr
      };
    } else {
      return this.evaluate(astNode); // Evaluate other quoted values
    }
  }

  private evaluateDefine(args: ASTNode[]): SchemeValue {
    if (args.length !== 2) {
      throw new InvalidArgumentError('define requires exactly 2 arguments');
    }

    const [nameNode, valueNode] = args;

    // Function definition syntax: (define (name params...) body)
    if (nameNode.type === 'list') {
      if (nameNode.value.length === 0) {
        throw new FunctionError('Invalid function definition');
      }

      const [funcName, ...params] = nameNode.value;
      if (funcName.type !== 'symbol') {
        throw new FunctionError('Function name must be a symbol');
      }

      const paramNames = params.map(param => {
        if (param.type !== 'symbol') {
          throw new FunctionError('Parameter names must be symbols');
        }
        return param.value;
      });

      const lambda: SchemeUserFunction = {
        type: 'user',
        params: paramNames,
        body: valueNode,
        env: this.env
      };

      this.env.define(funcName.value, lambda);
      return null;
    }

    // Variable definition
    if (nameNode.type !== 'symbol') {
      throw new InvalidArgumentError('First argument to define must be a symbol');
    }

    const value = this.evaluate(valueNode);
    this.env.define(nameNode.value, value);
    return null;
  }

  private evaluateLambda(args: ASTNode[]): SchemeUserFunction {
    if (args.length < 2) {
      throw new FunctionError('lambda requires at least 2 arguments');
    }

    const [paramsNode, ...bodyNodes] = args;
    if (paramsNode.type !== 'list') {
      throw new FunctionError('Lambda parameters must be a list');
    }

    const params = paramsNode.value.map(param => {
      if (param.type !== 'symbol') {
        throw new FunctionError('Parameter names must be symbols');
      }
      return param.value;
    });

    // Handle multiple expressions in body
    const body: ASTNode = bodyNodes.length === 1 ? bodyNodes[0] : {
      type: 'list',
      value: [{ type: 'symbol', value: 'begin' }, ...bodyNodes]
    };

    return {
      type: 'user',
      params,
      body,
      env: this.env
    };
  }

  private apply(proc: SchemeValue, args: SchemeValue[]): SchemeValue {
    if (typeof proc === 'object' && proc !== null) {
      if (proc.type === 'primitive') {
        // Add argument length checking for list operations
        switch (proc.func.name) {
          case 'cons':
            if (args.length !== 2) {
              throw new ListError('cons requires exactly 2 arguments');
            }
            break;
          case 'car':
          case 'cdr':
            if (args.length !== 1) {
              throw new ListError(`${proc.func.name} requires exactly 1 argument`);
            }
            break;
        }
        return proc.func(...args);
      }
      if (proc.type === 'user') {
        if (proc.params.length !== args.length) {
          throw new FunctionError(
            `Expected ${proc.params.length} arguments but got ${args.length}`
          );
        }
        const newEnv = proc.env.extend(proc.params, args);
        const evaluator = new Evaluator(newEnv);
        return evaluator.evaluate(proc.body);
      }
    }
    throw new FunctionError(`${proc} is not a procedure`);
  }

  private evaluateSet(args: ASTNode[]): SchemeValue {
    if (args.length !== 2) {
      throw new InvalidArgumentError('set! requires exactly 2 arguments');
    }

    const [nameNode, valueNode] = args;
    if (nameNode.type !== 'symbol') {
      throw new InvalidArgumentError('First argument to set! must be a symbol');
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
