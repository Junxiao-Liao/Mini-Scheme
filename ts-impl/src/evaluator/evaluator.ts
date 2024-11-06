import { ASTNode } from "src/types/types";
import { Environment } from "src/evaluator/environment";

export class Evaluator {
    private env: Environment;
  
    constructor(env?: Environment) {
      this.env = env || new Environment();
    }
  
    public evaluate(ast: ASTNode) {
      // Implementation
    }
  
    private evaluateList(list: ASTNode[]) {
      // Implementation
    }
  
    private evaluateDefine(args: ASTNode[]) {
      // Implementation
    }
  
    private evaluateLambda(args: ASTNode[]) {
      // Implementation
    }
  
    private evaluateIf(args: ASTNode[]) {
      // Implementation
    }
  }
  