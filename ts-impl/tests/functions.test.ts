import { describe, expect, test } from '@jest/globals';

import { Tokenizer } from '../src/tokenizer/tokenizer';
import { Parser } from '../src/parser/parser';
import { Evaluator } from '../src/evaluator/evaluator';
import { FunctionError } from '../src/types/types';

function evaluate(expressions: string[]) {
  const evaluator = new Evaluator();
  return expressions.map(expr => {
    const tokens = new Tokenizer(expr).tokenize();
    const ast = new Parser(tokens).parse();
    return evaluator.evaluate(ast);
  });
}

describe('Evaluator - Functions', () => {
  describe('Lambda Expressions', () => {
    test('creates and calls simple lambda', () => {
      const results = evaluate([
        '((lambda (x) (* x x)) 5)'
      ]);
      expect(results[0]).toBe(25);
    });

    test('lambda with multiple parameters', () => {
      const results = evaluate([
        '((lambda (x y) (+ x y)) 3 4)'
      ]);
      expect(results[0]).toBe(7);
    });

    test('nested lambda expressions', () => {
      const results = evaluate([
        '((lambda (x) ((lambda (y) (+ x y)) 3)) 4)'
      ]);
      expect(results[0]).toBe(7);
    });

    test('lambda capturing environment', () => {
      const results = evaluate([
        '(define x 10)',
        '((lambda (y) (+ x y)) 5)'
      ]);
      expect(results[1]).toBe(15);
    });
  });

  describe('Function Definitions', () => {
    test('defines and calls simple function', () => {
      const results = evaluate([
        '(define (square x) (* x x))',
        '(square 5)'
      ]);
      expect(results[1]).toBe(25);
    });

    test('function with multiple parameters', () => {
      const results = evaluate([
        '(define (add x y) (+ x y))',
        '(add 3 4)'
      ]);
      expect(results[1]).toBe(7);
    });

    test('recursive function', () => {
      const results = evaluate([
        '(define (fact n) (if (= n 0) 1 (* n (fact (- n 1)))))',
        '(fact 5)'
      ]);
      expect(results[1]).toBe(120);
    });

    test('functions calling other functions', () => {
      const results = evaluate([
        '(define (square x) (* x x))',
        '(define (sum-of-squares x y) (+ (square x) (square y)))',
        '(sum-of-squares 3 4)'
      ]);
      expect(results[2]).toBe(25);
    });
  });

  describe('Closures', () => {
    test('function creating closure', () => {
      const results = evaluate([
        '(define (make-adder x) (lambda (y) (+ x y)))',
        '(define add5 (make-adder 5))',
        '(add5 3)'
      ]);
      expect(results[2]).toBe(8);
    });

    test('multiple closures', () => {
      const results = evaluate([
        '(define (make-adder x) (lambda (y) (+ x y)))',
        '(define add5 (make-adder 5))',
        '(define add10 (make-adder 10))',
        '(add5 3)',
        '(add10 3)'
      ]);
      expect(results[3]).toBe(8);
      expect(results[4]).toBe(13);
    });
  });

  describe('Error Handling', () => {
    test('wrong number of arguments', () => {
      expect(() => {
        evaluate([
          '(define (add x y) (+ x y))',
          '(add 1)'
        ]);
      }).toThrow(FunctionError);
    });

    test('invalid function definition', () => {
      expect(() => {
        evaluate(['(define (1 x) x)']);
      }).toThrow(FunctionError);
    });

    test('invalid lambda syntax', () => {
      expect(() => {
        evaluate(['(lambda x x)']);
      }).toThrow(FunctionError);
    });
  });

  describe('Complex Scenarios', () => {
    test('higher-order function', () => {
      const results = evaluate([
        '(define (apply-twice f x) (f (f x)))',
        '(define (add1 x) (+ x 1))',
        '(apply-twice add1 5)'
      ]);
      expect(results[2]).toBe(7);
    });

    test('function returning function', () => {
      const results = evaluate([
        '(define (compose f g) (lambda (x) (f (g x))))',
        '(define (square x) (* x x))',
        '(define (add1 x) (+ x 1))',
        '(define square-then-add1 (compose add1 square))',
        '(square-then-add1 5)'
      ]);
      expect(results[4]).toBe(26);
    });

    test('mutual recursion', () => {
      const results = evaluate([
        '(define (even? n) (if (= n 0) #t (odd? (- n 1))))',
        '(define (odd? n) (if (= n 0) #f (even? (- n 1))))',
        '(even? 4)',
        '(odd? 3)'
      ]);
      expect(results[2]).toBe(true);
      expect(results[3]).toBe(true);
    });
  });
});
