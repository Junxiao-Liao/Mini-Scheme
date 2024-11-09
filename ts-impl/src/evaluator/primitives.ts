import { SchemeValue, SchemeFunction, SchemeError } from '../types/types';

function checkNumbers(args: SchemeValue[]): number[] {
  return args.map(arg => {
    if (typeof arg !== 'number') {
      throw new SchemeError(`Expected number but got: ${arg}`);
    }
    return arg;
  });
}

export const primitives: Record<string, SchemeFunction> = {
  '+': {
    type: 'primitive',
    func: (...args: SchemeValue[]): number => {
      const numbers = checkNumbers(args);
      return numbers.reduce((a, b) => a + b, 0);
    }
  },
  '-': {
    type: 'primitive',
    func: (...args: SchemeValue[]): number => {
      const numbers = checkNumbers(args);
      if (numbers.length === 0) throw new SchemeError('- requires at least one argument');
      if (numbers.length === 1) return -numbers[0];
      return numbers.slice(1).reduce((a, b) => a - b, numbers[0]);
    }
  },
  '*': {
    type: 'primitive',
    func: (...args: SchemeValue[]): number => {
      const numbers = checkNumbers(args);
      return numbers.reduce((a, b) => a * b, 1);
    }
  },
  '/': {
    type: 'primitive',
    func: (...args: SchemeValue[]): number => {
      const numbers = checkNumbers(args);
      if (numbers.length === 0) throw new SchemeError('/ requires at least one argument');
      if (numbers.length === 1) return 1 / numbers[0];
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] === 0) throw new SchemeError('Division by zero');
      }
      return numbers.slice(1).reduce((a, b) => a / b, numbers[0]);
    }
  },
  '>': {
    type: 'primitive',
    func: (...args: SchemeValue[]): boolean => {
      const numbers = checkNumbers(args);
      if (numbers.length !== 2) {
        throw new SchemeError('> requires exactly 2 arguments');
      }
      return numbers[0] > numbers[1];
    }
  },
  '<': {
    type: 'primitive',
    func: (...args: SchemeValue[]): boolean => {
      const numbers = checkNumbers(args);
      if (numbers.length !== 2) {
        throw new SchemeError('< requires exactly 2 arguments');
      }
      return numbers[0] < numbers[1];
    }
  },
  '>=': {
    type: 'primitive',
    func: (...args: SchemeValue[]): boolean => {
      const numbers = checkNumbers(args);
      if (numbers.length !== 2) {
        throw new SchemeError('>= requires exactly 2 arguments');
      }
      return numbers[0] >= numbers[1];
    }
  },
  '<=': {
    type: 'primitive',
    func: (...args: SchemeValue[]): boolean => {
      const numbers = checkNumbers(args);
      if (numbers.length !== 2) {
        throw new SchemeError('<= requires exactly 2 arguments');
      }
      return numbers[0] <= numbers[1];
    }
  },
  '=': {
    type: 'primitive',
    func: (...args: SchemeValue[]): boolean => {
      const numbers = checkNumbers(args);
      if (numbers.length !== 2) {
        throw new SchemeError('= requires exactly 2 arguments');
      }
      return numbers[0] === numbers[1];
    }
  }
};
