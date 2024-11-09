import { describe, expect, test } from '@jest/globals';
import { Parser } from '../src/parser/parser';
import { Tokenizer } from '../src/tokenizer/tokenizer';

const parse = (input: string) => {
  const tokens = new Tokenizer(input).tokenize();
  return new Parser(tokens).parse();
};

describe('Parser', () => {
  test('parses numbers', () => {
    expect(parse('42')).toEqual({ type: 'number', value: 42 });
    expect(parse('3.14')).toEqual({ type: 'number', value: 3.14 });
    expect(parse('-17')).toEqual({ type: 'number', value: -17 });
  });

  test('parses strings', () => {
    expect(parse('"str"')).toEqual({ type: 'string', value: 'str' });
    expect(parse('"\'"')).toEqual({ type: 'string', value: '\'' });
  })

  test('parses boolean values', () => {
    expect(parse('#t')).toEqual({ type: 'boolean', value: true });
    expect(parse('#f')).toEqual({ type: 'boolean', value: false });
  });

  test('parses basic arithmetic expressions', () => {
    expect(parse('(+ 1 2)')).toEqual({
      type: 'list',
      value: [
        { type: 'symbol', value: '+' },
        { type: 'number', value: 1 },
        { type: 'number', value: 2 }
      ]
    });
  });

  test('parses nested expressions', () => {
    expect(parse('(+ (* 2 3) (/ 8 4))')).toEqual({
      type: 'list',
      value: [
        { type: 'symbol', value: '+' },
        { type: 'list', value: [
          { type: 'symbol', value: '*' },
          { type: 'number', value: 2 },
          { type: 'number', value: 3 }
        ]},
        { type: 'list', value: [
          { type: 'symbol', value: '/' },
          { type: 'number', value: 8 },
          { type: 'number', value: 4 }
        ]}
      ]
    });
  });

  test('parses define expressions', () => {
    expect(parse('(define x 5)')).toEqual({
      type: 'list',
      value: [
        { type: 'symbol', value: 'define' },
        { type: 'symbol', value: 'x' },
        { type: 'number', value: 5 }
      ]
    });
  });

  test('parses quoted lists', () => {
    expect(parse("'(1 2 3)")).toEqual({
      type: 'quote',
      value: {
        type: 'list',
        value: [
          { type: 'number', value: 1 },
          { type: 'number', value: 2 },
          { type: 'number', value: 3 }
        ]
      }
    });
  });

  test('parses function definitions', () => {
    expect(parse('(define (square x) (* x x))')).toEqual({
      type: 'list',
      value: [
        { type: 'symbol', value: 'define' },
        { type: 'list', value: [
          { type: 'symbol', value: 'square' },
          { type: 'symbol', value: 'x' }
        ]},
        { type: 'list', value: [
          { type: 'symbol', value: '*' },
          { type: 'symbol', value: 'x' },
          { type: 'symbol', value: 'x' }
        ]}
      ]
    });
  });
});
