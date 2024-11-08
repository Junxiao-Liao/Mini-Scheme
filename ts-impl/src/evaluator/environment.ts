import { SchemeValue, UndefinedVariableError } from '../types/types';

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
    throw new UndefinedVariableError(name);
  }

  set(name: string, value: SchemeValue): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.parent && this.parent.values.has(name)) {
      this.parent.set(name, value);
      return;
    }
    throw new UndefinedVariableError(name);
  }

  // Helper method (to be used outside) to check if a variable exists in the current or parent environments
  has(name: string): boolean {
    return this.values.has(name) || (this.parent?.has(name) ?? false);
  }
}
