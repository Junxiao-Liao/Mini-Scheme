import { describe, expect, test } from '@jest/globals';

import { Tokenizer } from '../src/tokenizer/tokenizer';
import { Parser } from '../src/parser/parser';
import { Evaluator } from '../src/evaluator/evaluator';
import { SchemeError } from '../src/types/types';

function evaluate(input: string) {
  const tokens = new Tokenizer(input).tokenize();
  const ast = new Parser(tokens).parse();
  return new Evaluator().evaluate(ast);
}

describe('Evaluator - Arithmetic Operations', () => {
  describe('Addition (+)', () => {
    test('adds two numbers', () => {
      expect(evaluate('(+ 1 2)')).toBe(3);
    });

    test('adds multiple numbers', () => {
      expect(evaluate('(+ 1 2 3 4)')).toBe(10);
    });

    test('adds no numbers', () => {
      expect(evaluate('(+)')).toBe(0);
    });

    test('adds negative numbers', () => {
      expect(evaluate('(+ -1 -2)')).toBe(-3);
    });
  });

  describe('Subtraction (-)', () => {
    test('subtracts two numbers', () => {
      expect(evaluate('(- 5 3)')).toBe(2);
    });

    test('subtracts multiple numbers', () => {
      expect(evaluate('(- 10 2 3)')).toBe(5);
    });

    test('negates single number', () => {
      expect(evaluate('(- 5)')).toBe(-5);
    });

    test('handles no arguments', () => {
      expect(() => evaluate('(-)')).toThrow(SchemeError);
    });
  });

  describe('Multiplication (*)', () => {
    test('multiplies two numbers', () => {
      expect(evaluate('(* 2 3)')).toBe(6);
    });

    test('multiplies multiple numbers', () => {
      expect(evaluate('(* 2 3 4)')).toBe(24);
    });

    test('multiplies no numbers', () => {
      expect(evaluate('(*)')).toBe(1);
    });

    test('handles negative numbers', () => {
      expect(evaluate('(* -2 3)')).toBe(-6);
      expect(evaluate('(* -2 -3)')).toBe(6);
    });
  });

  describe('Division (/)', () => {
    test('divides two numbers', () => {
      expect(evaluate('(/ 6 2)')).toBe(3);
    });

    test('divides multiple numbers', () => {
      expect(evaluate('(/ 12 2 3)')).toBe(2);
    });

    test('handles single number', () => {
      expect(evaluate('(/ 2)')).toBe(0.5);
    });

    test('throws error on division by zero', () => {
      expect(() => evaluate('(/ 1 0)')).toThrow(SchemeError);
    });

    test('handles no arguments', () => {
      expect(() => evaluate('(/)')).toThrow(SchemeError);
    });
  });

  describe('Nested Expressions', () => {
    test('evaluates nested arithmetic expressions', () => {
      expect(evaluate('(+ (* 2 3) (/ 8 4))')).toBe(8);
    });

    test('evaluates complex nested expressions', () => {
      expect(evaluate('(- (* 3 (+ 2 1)) (/ 10 2))')).toBe(4);
    });

    test('evaluates deeply nested expressions', () => {
      expect(evaluate('(+ (* 2 (- 4 1)) (/ 10 (* 2 1)))')).toBe(11);
    });
  });

  describe('Error Handling', () => {
    test('throws error for non-numeric arguments', () => {
      expect(() => evaluate('(+ 1 #t)')).toThrow(SchemeError);
    });

    test('throws error for undefined operators', () => {
      expect(() => evaluate('(undefined 1 2)')).toThrow(SchemeError);
    });

    test('throws error for invalid syntax', () => {
      expect(() => evaluate('(1 2 3)')).toThrow(SchemeError);
    });
  });
});
