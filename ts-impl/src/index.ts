import { createInterface } from 'readline';
import { Tokenizer } from './tokenizer/tokenizer';
import { Parser } from './parser/parser';
import { Evaluator } from './evaluator/evaluator';
import { SchemeError, SchemeValue } from './types/types';

class REPL {
  private evaluator: Evaluator;
  private rl: ReturnType<typeof createInterface>;
  private prompt = 'minischeme> ';

  constructor() {
    this.evaluator = new Evaluator();
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.prompt,
      terminal: true
    });
  }

  private formatOutput(value: SchemeValue): string {
    if (value === null) {
      return '()';
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (typeof value === 'object' && value.type === 'list') {
      let current: typeof value = value;
      const elements: string[] = [];
      while (current !== null) {
        elements.push(this.formatOutput(current.car));
        current = current.cdr as typeof value;
      }
      return `(${elements.join(' ')})`;
    }
    return String(value);
  }

  private async evaluate(input: string): Promise<string> {
    try {
      const tokens = new Tokenizer(input).tokenize();
      const ast = new Parser(tokens).parse();
      const result = this.evaluator.evaluate(ast);
      return this.formatOutput(result);
    } catch (error) {
      if (error instanceof SchemeError) {
        return `Error: ${error.message}`;
      }
      return `Internal Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  public async start(): Promise<void> {
    console.log('Mini-Scheme REPL (Ctrl D to exit)');
    console.log('Type .help for commands, .exit to quit');    
    console.log('----------------------------------------\n')

    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const input = line.trim();

      // Handle special commands
      switch (input) {
        case '.exit':
          this.rl.close();
          return;
        case '.help':
          console.log('\nCommands:');
          console.log('.help  - Show this help message');
          console.log('.exit  - Exit the REPL');
          console.log('.clear - Clear the screen\n');
          break;
        case '.clear':
          console.clear();
          break;
        default:
          if (input) {
            try {
              const result = await this.evaluate(input);
              console.log(result);
            } catch (error) {
              console.error('Evaluation error:', error);
            }
          }
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\n\nExiting REPL...');
      process.exit(0);
    });

    // Handle Ctrl+C
    this.rl.on('SIGINT', () => {
      console.log('\n(To exit, press Ctrl+D or type .exit)');
      this.rl.prompt();
    });
  }
}

// Start the REPL
if (require.main === module) {
  const repl = new REPL();
  repl.start().catch(console.error);
}

export { REPL };
