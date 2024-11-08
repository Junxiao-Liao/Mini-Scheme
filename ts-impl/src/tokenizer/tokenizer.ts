import { Token } from "src/types/types";

export class Tokenizer {
  private input: string;
  private position: number;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
  }

  // Returns the current char
  private peek(): string {
    return this.position < this.input.length ? this.input[this.position] : '';
  }

  // Returns current char and 1 step further
  private advance(): string {
    const current = this.input[this.position]
    if (this.position < this.input.length) {
      this.position++;
      return current;
    }
    else {
      return '';
    }
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  // Bools are included in symbols
  private isSymbolChar(char: string): boolean {
    return /[a-zA-Z0-9+\-*/<>=!?_#]/.test(char);
  }

  private readNumber(): Token {
    let numStr = '';
    let hasDot = false;

    if (this.peek() === '-') {
      numStr += this.advance();
    }

    while (this.isDigit(this.peek()) || (!hasDot && this.peek() === '.')) {
      if (this.peek() === '.') hasDot = true;
      numStr += this.advance();
    }

    return {
      type: 'number',
      value: parseFloat(numStr)
    };
  }

  private readSymbol(): Token {
    let symbol = '';
    while (this.position < this.input.length && this.isSymbolChar(this.peek())) {
      symbol += this.advance();
    }

    if (symbol === '') {
      throw new Error(`Invalid character at position ${this.position}: ${this.peek()}`);
    }

    if (symbol === '#t') return { type: 'boolean', value: true };
    if (symbol === '#f') return { type: 'boolean', value: false };

    return {
      type: 'symbol',
      value: symbol
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      const char = this.peek();

      if (this.isWhitespace(char)) {
        this.advance();
        continue;
      }

      if (char === '(') {
        tokens.push({ type: 'leftParen', value: '(' });
        this.advance();
      } else if (char === ')') {
        tokens.push({ type: 'rightParen', value: ')' });
        this.advance();
      } else if (char === '\'') {
        tokens.push({ type: 'quote', value: '\'' });
        this.advance();
      } else if (this.isDigit(char) || (char === '-' && this.isDigit(this.input[this.position + 1]))) {
        tokens.push(this.readNumber());
      } else if (this.isSymbolChar(char)) {
        tokens.push(this.readSymbol());
      } else {
        throw new Error(`Invalid character at position ${this.position}: ${char}`);
      }
    }

    return tokens;
  }
}
