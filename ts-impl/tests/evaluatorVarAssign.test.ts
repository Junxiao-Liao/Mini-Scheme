import { describe, expect, test } from '@jest/globals';

import { Tokenizer } from '../src/tokenizer/tokenizer';
import { Parser } from '../src/parser/parser';
import { Evaluator } from '../src/evaluator/evaluator';
import { InvalidArgumentError, UndefinedVariableError } from '../src/types/types';

function evaluate(expressions: string[]) {
  const evaluator = new Evaluator();
  return expressions.map(expr => {
    const tokens = new Tokenizer(expr).tokenize();
    const ast = new Parser(tokens).parse();
    return evaluator.evaluate(ast);
  });
}

describe('Evaluator - Variables and Assignments', () => {
  describe('define', () => {
    test('defines and retrieves simple values', () => {
      const results = evaluate([
        '(define x 10)',
        'x'
      ]);
      expect(results).toEqual([null, 10]);
    });

    test('defines multiple variables', () => {
      const results = evaluate([
        '(define x 10)',
        '(define y 20)',
        '(+ x y)'
      ]);
      expect(results).toEqual([null, null, 30]);
    });

    test('allows redefinition of variables', () => {
      const results = evaluate([
        '(define x 10)',
        'x',
        '(define x 20)',
        'x'
      ]);
      expect(results).toEqual([null, 10, null, 20]);
    });

    test('defines variables with expressions', () => {
      const results = evaluate([
        '(define x (+ 1 2))',
        'x'
      ]);
      expect(results).toEqual([null, 3]);
    });
  });

  describe('set!', () => {
    test('updates existing variables', () => {
      const results = evaluate([
        '(define x 10)',
        '(set! x 20)',
        'x'
      ]);
      expect(results).toEqual([null, null, 20]);
    });

    test('throws error when setting undefined variable', () => {
      expect(() => {
        evaluate(['(set! undefined-var 10)']);
      }).toThrow(UndefinedVariableError);
    });

    test('updates variables with expressions', () => {
      const results = evaluate([
        '(define x 10)',
        '(set! x (+ x 5))',
        'x'
      ]);
      expect(results).toEqual([null, null, 15]);
    });
  });

  describe('variable scoping', () => {
    test('accesses variables in arithmetic expressions', () => {
      const results = evaluate([
        '(define a 5)',
        '(define b 3)',
        '(+ a b)',
        '(* a b)',
        '(- a b)',
        '(/ a b)'
      ]);
      expect(results).toEqual([null, null, 8, 15, 2, 5/3]);
    });

    test('uses most recent value in expressions', () => {
      const results = evaluate([
        '(define x 5)',
        '(+ x 3)',
        '(set! x 10)',
        '(+ x 3)'
      ]);
      expect(results).toEqual([null, 8, null, 13]);
    });
  });

  describe('error handling', () => {
    test('throws error for undefined variables', () => {
      expect(() => {
        evaluate(['undefined_variable']);
      }).toThrow(UndefinedVariableError);
    });

    test('throws error for invalid define syntax', () => {
      expect(() => {
        evaluate(['(define)']);
      }).toThrow(InvalidArgumentError);

      expect(() => {
        evaluate(['(define 1 2)']);
      }).toThrow(InvalidArgumentError);

      expect(() => {
        evaluate(['(define x 1 2)']);
      }).toThrow(InvalidArgumentError);
    });

    test('throws error for invalid set! syntax', () => {
      expect(() => {
        evaluate(['(set!)']);
      }).toThrow(InvalidArgumentError);

      expect(() => {
        evaluate(['(set! 1 2)']);
      }).toThrow(InvalidArgumentError);

      expect(() => {
        evaluate(['(define x 1)', '(set! x 1 2)']);
      }).toThrow(InvalidArgumentError);
    });
  });

  describe('complex scenarios', () => {
    test('handles complex expressions with variables', () => {
      const results = evaluate([
        '(define x 10)',
        '(define y 5)',
        '(define z (+ x y))',
        '(* z (+ x y))',
        '(set! x (* 2 y))',
        '(+ x z)'
      ]);
      expect(results).toEqual([null, null, null, 225, null, 25]);
    });

    test('maintains correct variable values in sequence', () => {
      const results = evaluate([
        '(define counter 0)',
        '(set! counter (+ counter 1))',
        'counter',
        '(set! counter (+ counter 1))',
        'counter'
      ]);
      expect(results).toEqual([null, null, 1, null, 2]);
    });
  });
});
