export class Environment implements Environment {
    private values: Map<string, any>;
    private parent: Environment | null;
  
    constructor(parent?: Environment) {
      this.values = new Map();
      this.parent = parent || null;
    }
  
    public define(name: string, value: any) {
      // Implementation
    }
  
    public get(name: string) {
      // Implementation
    }
  
    public set(name: string, value: any) {
      // Implementation
    }
  }
  