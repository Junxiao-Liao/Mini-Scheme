import { describe, expect, test } from '@jest/globals';

import { Tokenizer } from '../src/tokenizer/tokenizer';
import { Parser } from '../src/parser/parser';
import { Evaluator } from '../src/evaluator/evaluator';
import { ConditionalError } from '../src/types/types';

function evaluate(expressions: string[]) {
  const evaluator = new Evaluator();
  return expressions.map(expr => {
    // Join multi-line expressions
    const normalizedExpr = expr.trim().replace(/\n\s*/g, ' ');
    const tokens = new Tokenizer(normalizedExpr).tokenize();
    const ast = new Parser(tokens).parse();
    return evaluator.evaluate(ast);
  });
}

describe('Evaluator - Conditionals', () => {
  describe('Basic if expressions', () => {
    test('evaluates true condition', () => {
      expect(evaluate(['(if #t 1 2)'])[0]).toBe(1);
    });

    test('evaluates false condition', () => {
      expect(evaluate(['(if #f 1 2)'])[0]).toBe(2);
    });

    test('handles missing alternative', () => {
      expect(evaluate(['(if #f 1)'])[0]).toBe(null);
    });
  });

  describe('Comparison operators', () => {
    test('greater than', () => {
      const results = evaluate([
        '(> 5 3)',
        '(> 3 5)',
        '(if (> 5 3) 1 2)'
      ]);
      expect(results).toEqual([true, false, 1]);
    });

    test('less than', () => {
      const results = evaluate([
        '(< 3 5)',
        '(< 5 3)',
        '(if (< 3 5) 1 2)'
      ]);
      expect(results).toEqual([true, false, 1]);
    });

    test('equal to', () => {
      const results = evaluate([
        '(= 5 5)',
        '(= 5 3)',
        '(if (= 5 5) 1 2)'
      ]);
      expect(results).toEqual([true, false, 1]);
    });

    test('greater than or equal to', () => {
      const results = evaluate([
        '(>= 5 3)',
        '(>= 5 5)',
        '(>= 3 5)'
      ]);
      expect(results).toEqual([true, true, false]);
    });

    test('less than or equal to', () => {
      const results = evaluate([
        '(<= 3 5)',
        '(<= 5 5)',
        '(<= 5 3)'
      ]);
      expect(results).toEqual([true, true, false]);
    });
  });

  describe('Complex conditions', () => {
    test('nested if expressions', () => {
      const results = evaluate([
        '(if (> 5 3) (if (< 2 1) 1 2) 3)'
      ]);
      expect(results).toEqual([2]);
    });

    test('if with arithmetic', () => {
      const results = evaluate([
        '(define x 5)',
        '(if (> x 3) (+ x 1) (- x 1))'
      ]);
      expect(results).toEqual([null, 6]);
    });

    test('if with variables', () => {
      const results = evaluate([
        '(define x 10)',
        '(define y 5)',
        '(if (> x y) x y)'
      ]);
      expect(results).toEqual([null, null, 10]);
    });
  });

  describe('Truthiness', () => {
    test('all values except #f are truthy', () => {
      const results = evaluate([
        '(if 0 1 2)',
        '(if "" 1 2)',
        '(if (+ 1 2) 1 2)',
        '(if #t 1 2)'
      ]);
      expect(results).toEqual([1, 1, 1, 1]);
    });

    test('only #f is falsy', () => {
      const results = evaluate([
        '(if #f 1 2)'
      ]);
      expect(results).toEqual([2]);
    });
  });

  describe('Error handling', () => {
    test('throws error for wrong number of arguments', () => {
      expect(() => evaluate(['(if)'])).toThrow(ConditionalError);
      expect(() => evaluate(['(if #t)'])).toThrow(ConditionalError);
      expect(() => evaluate(['(if #t 1 2 3)'])).toThrow(ConditionalError);
    });

    test('throws error for invalid comparison arguments', () => {
      expect(() => evaluate(['(> 1)'])).toThrow();
      expect(() => evaluate(['(< 1 2 3)'])).toThrow();
      expect(() => evaluate(['(= "a" 1)'])).toThrow();
    });
  });

  describe('Integration scenarios', () => {
    test('absolute value function', () => {
      const results = evaluate([
        '(define x -5)',
        '(if (< x 0) (- x) x)'
      ]);
      expect(results).toEqual([null, 5]);
    });


    test('nested conditions with arithmetic', () => {
      const program = evaluate([
        `(define x 10)`,
        `(define y 5)`,
        `(if (> x y)
            (if (= (/ x y) 2)
                (* x y)
                (+ x y))
            (- x y))`
      ]);
      expect(program[program.length - 1]).toBe(50);
    });
  });
});
