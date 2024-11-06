export type Token = {
    type: 'number' | 'string' | 'symbol' | 'boolean' | 'leftParen' | 'rightParen';
    value: string | number | boolean;
  };
  
  export type ASTNode = {
    type: 'number' | 'string' | 'symbol' | 'boolean' | 'list' | 'lambda' | 'quote';
    value: any;
  };
  
  export interface Environment {
    define(name: string, value: any): void;
    get(name: string): any;
    set(name: string, value: any): void;
  }
  