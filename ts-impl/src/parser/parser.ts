import { Token, ASTNode } from "src/types/types";

export class Parser {
  private tokens: Token[];
  private position: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.position = 0;
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private advance(): Token | undefined {
    const current = this.tokens[this.position]
    if (this.position < this.tokens.length) {
      this.position++;
      return current;
    }
    else {
      return undefined;
    }
  }

  private parseAtom(): ASTNode {
    const token = this.advance()!;
    switch (token.type) {
      case 'number':
        return { type: 'number', value: token.value as number };
      case 'boolean':
        return { type: 'boolean', value: token.value as boolean };
      case 'symbol':
        return { type: 'symbol', value: token.value as string };
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }

  private parseList(): ASTNode {
    this.advance(); // consume left paren
    const elements: ASTNode[] = [];

    while (this.position < this.tokens.length && this.peek()!.type !== 'rightParen') {
      elements.push(this.parse());
    }

    if (this.position >= this.tokens.length || this.peek()!.type !== 'rightParen') {
      throw new Error('Unclosed parenthesis');
    }

    this.advance(); // consume right paren
    return { type: 'list', value: elements };
  }

  private parseQuote(): ASTNode {
    this.advance(); // consume quote
    return { type: 'quote', value: this.parse() };
  }

  public parse(): ASTNode {
    if (this.position >= this.tokens.length) {
      throw new Error('Unexpected end of input');
    }

    const token = this.peek()!;

    switch (token.type) {
      case 'leftParen':
        return this.parseList();
      case 'quote':
        return this.parseQuote();
      case 'number':
      case 'boolean':
      case 'symbol':
        return this.parseAtom();
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }
}
