// For tokenizer.
type TokenType = 
  | 'number'
  | 'string'
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
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'symbol'; value: string }
  | { type: 'list'; value: ASTNode[] }
  | { type: 'quote'; value: ASTNode };

// For evaluator.
export type SchemeValue = 
  | number
  | string
  | boolean
  | SchemeFunction
  | null;

export type SchemeFunction = {
  type: 'primitive';
  func: (...args: SchemeValue[]) => SchemeValue;
}

// General.
export type SpecialForm = 'define' | 'set!' | 'if';

export class SchemeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SchemeError';
  }
}

// For Variables and Assignments.
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

// For conditions.
export class ConditionalError extends SchemeError {
  constructor(message: string) {
    super(`Conditional error: ${message}`);
  }
}
