import { Environment } from "../evaluator/environment";

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
  | SchemeUserFunction
  | null;

// General.
export type SpecialForm = 'define' | 'set!' | 'if' | 'lambda';

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

// For functions.
export interface SchemeFunction {
  type: 'primitive';
  func: (...args: SchemeValue[]) => SchemeValue;
}

export interface SchemeUserFunction {
  type: 'user';
  params: string[];
  body: ASTNode;
  env: Environment;
}

export class FunctionError extends SchemeError {
  constructor(message: string) {
    super(`Function error: ${message}`);
  }
}
