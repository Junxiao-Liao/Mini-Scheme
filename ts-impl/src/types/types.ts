// For tokenizer.
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

// For evaluator.
export type SchemeValue = 
  | number 
  | boolean 
  | SchemeFunction
  | null;

export type SchemeFunction = {
  type: 'primitive';
  func: (...args: SchemeValue[]) => SchemeValue;
}

// General.
export class SchemeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SchemeError';
  }
}

// For Variables and Assignments.
export type SpecialForm = 'define' | 'set!';

export class UndefinedVariableError extends SchemeError {
  constructor(name: string) {
    super(`Undefined variable: ${name}`);
  }
}

export class InvalidArgumentError extends SchemeError {
  constructor(message: string) {
    super(`Invalid argument: ${message}`);
  }
}
