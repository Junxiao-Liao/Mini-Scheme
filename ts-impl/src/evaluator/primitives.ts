export const primitives = {
    '+': (args: number[]): number => args.reduce((a, b) => a + b),
    '-': (args: number[]): number => args.reduce((a, b) => a - b),
    '*': (args: number[]): number => args.reduce((a, b) => a * b),
    '/': (args: number[]): number => args.reduce((a, b) => a / b),
    'cons': (car: any, cdr: any) => [car, cdr],
    'car': (pair: any[]) => pair[0],
    'cdr': (pair: any[]) => pair[1],
  };
  