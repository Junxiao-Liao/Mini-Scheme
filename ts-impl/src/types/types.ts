type TokenType = 
  | 'number' 
  | 'symbol' 
  | 'leftParen' 
  | 'rightParen' 
  | 'boolean' 
  | 'quote';

export interface Token {
  type: TokenType;
  value: string | number | boolean;
}

export type ASTNode = 
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'symbol'; value: string }
  | { type: 'list'; value: ASTNode[] }
  | { type: 'quote'; value: ASTNode };
