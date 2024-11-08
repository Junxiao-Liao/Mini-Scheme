import { SchemeValue, SchemeError } from '../types/types';

export class Environment {
  private values: Map<string, SchemeValue>;
  private parent: Environment | null;

  constructor(parent: Environment | null = null) {
    this.values = new Map();
    this.parent = parent;
  }

  define(name: string, value: SchemeValue): void {
    this.values.set(name, value);
  }

  get(name: string): SchemeValue {
    if (this.values.has(name)) {
      return this.values.get(name)!;
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new SchemeError(`Undefined variable: ${name}`);
  }
}
