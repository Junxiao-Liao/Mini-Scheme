import { describe, expect, test } from '@jest/globals';

import { ListError } from '../src/types/types';
import { Tokenizer } from '../src/tokenizer/tokenizer';
import { Parser } from '../src/parser/parser';
import { Evaluator } from '../src/evaluator/evaluator';

function evaluate(expressions: string[]) {
  const evaluator = new Evaluator();
  return expressions.map(expr => {
    const tokens = new Tokenizer(expr).tokenize();
    const ast = new Parser(tokens).parse();
    return evaluator.evaluate(ast);
  });
}


describe('Evaluator - Lists', () => {
  test('cons, car, and cdr', () => {
    const results = evaluate([
      "(cons 1 2)",
      "(car (cons 1 2))",
      "(cdr (cons 1 2))",
      "(cons 1 (cons 2 (cons 3 null)))",
      "(car (cons 1 (cons 2 (cons 3 null))))",
      "(cdr (cons 1 (cons 2 (cons 3 null))))",
      "'(1 2 3)",
      "(car '(1 2 3))",
      "(cdr '(1 2 3))"
    ]);
    expect(results[0]).toEqual({ type: 'list', car: 1, cdr: 2 });
    expect(results[1]).toBe(1);
    expect(results[2]).toBe(2);

    expect(results[3]).toEqual({ type: 'list', car: 1, cdr: { type: 'list', car: 2, cdr: { type: 'list', car: 3, cdr: null } } });
    expect(results[4]).toBe(1);
    expect(results[5]).toEqual({ type: 'list', car: 2, cdr: { type: 'list', car: 3, cdr: null } });

    expect(results[6]).toEqual({ type: 'list', car: 1, cdr: { type: 'list', car: 2, cdr: { type: 'list', car: 3, cdr: null } } });
    expect(results[7]).toBe(1);
    expect(results[8]).toEqual({ type: 'list', car: 2, cdr: { type: 'list', car: 3, cdr: null } });
  });


  test('quoted list with different types', () => {
    const results = evaluate([
      "'(1 \"hello\" #t)",
      "(car '(1 \"hello\" #t))",
      "(cdr '(1 \"hello\" #t))"
    ]);
    expect(results[0]).toEqual({ type: 'list', car: 1, cdr: { type: 'list', car: "hello", cdr: { type: 'list', car: true, cdr: null } } });
    expect(results[1]).toBe(1);
    expect(results[2]).toEqual({ type: 'list', car: "hello", cdr: { type: 'list', car: true, cdr: null } });
  });

  test('errors', () => {
    expect(() => evaluate(["(car 1)"])).toThrow(ListError);
    expect(() => evaluate(["(cdr 1)"])).toThrow(ListError);
    expect(() => evaluate(["(car null)"])).toThrow(ListError);
    expect(() => evaluate(["(cdr null)"])).toThrow(ListError);
    expect(() => evaluate(["(cons 1)"])).toThrow(ListError);
    expect(() => evaluate(["(cons 1 2 3)"])).toThrow(ListError);
  });

  test('empty list', () => {
    const results = evaluate([
      "null",
      "(cons 1 null)",
      "'()"
    ]);
    
    expect(results[0]).toBe(null);
    expect(results[1]).toEqual({ type: 'list', car: 1, cdr: null });
    expect(results[2]).toBe(null);
  });
});
