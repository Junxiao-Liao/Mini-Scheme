import { describe, expect, test } from '@jest/globals';
import { Tokenizer } from '../src/tokenizer/tokenizer';

describe('Tokenizer', () => {
  test('tokenizes numbers', () => {
    const cases = [
      ['42', [{ type: 'number', value: 42 }]],
      ['3.14', [{ type: 'number', value: 3.14 }]],
      ['-17', [{ type: 'number', value: -17 }]],
      ['-2.5', [{ type: 'number', value: -2.5 }]]
    ];

    cases.forEach(([input, expected]) => {
      expect(new Tokenizer(input as string).tokenize()).toEqual(expected);
    });
  });

  test('tokenizes boolean values', () => {
    const cases = [
      ['#t', [{ type: 'boolean', value: true }]],
      ['#f', [{ type: 'boolean', value: false }]]
    ];

    cases.forEach(([input, expected]) => {
      expect(new Tokenizer(input as string).tokenize()).toEqual(expected);
    });
  });

  test('tokenizes basic arithmetic expressions', () => {
    const input = '(+ 1 2)';
    const expected = [
      { type: 'leftParen', value: '(' },
      { type: 'symbol', value: '+' },
      { type: 'number', value: 1 },
      { type: 'number', value: 2 },
      { type: 'rightParen', value: ')' }
    ];
    expect(new Tokenizer(input).tokenize()).toEqual(expected);
  });

  test('tokenizes nested expressions', () => {
    const input = '(+ (* 2 3) (/ 8 4))';
    const expected = [
      { type: 'leftParen', value: '(' },
      { type: 'symbol', value: '+' },
      { type: 'leftParen', value: '(' },
      { type: 'symbol', value: '*' },
      { type: 'number', value: 2 },
      { type: 'number', value: 3 },
      { type: 'rightParen', value: ')' },
      { type: 'leftParen', value: '(' },
      { type: 'symbol', value: '/' },
      { type: 'number', value: 8 },
      { type: 'number', value: 4 },
      { type: 'rightParen', value: ')' },
      { type: 'rightParen', value: ')' }
    ];
    expect(new Tokenizer(input).tokenize()).toEqual(expected);
  });

  test('tokenizes define expressions', () => {
    const input = '(define x 5)';
    const expected = [
      { type: 'leftParen', value: '(' },
      { type: 'symbol', value: 'define' },
      { type: 'symbol', value: 'x' },
      { type: 'number', value: 5 },
      { type: 'rightParen', value: ')' }
    ];
    expect(new Tokenizer(input).tokenize()).toEqual(expected);
  });

  test('tokenizes quoted lists', () => {
    const input = "'(1 2 3)";
    const expected = [
      { type: 'quote', value: '\'' },
      { type: 'leftParen', value: '(' },
      { type: 'number', value: 1 },
      { type: 'number', value: 2 },
      { type: 'number', value: 3 },
      { type: 'rightParen', value: ')' }
    ];
    expect(new Tokenizer(input).tokenize()).toEqual(expected);
  });
});

  