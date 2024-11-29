# Mini-Scheme TypeScript Implementation

## Processing Pipeline

```
Input String
    ↓
Tokenizer (Lexical Analysis)
    ↓
Parser (Syntactic Analysis)
    ↓
AST (Abstract Syntax Tree)
    ↓
Evaluator (Execution)
    ↓
Result
```

## Project Structure

```
ts-impl/
├── src/
│   ├── types/          # Type definitions
│   ├── tokenizer/      # Lexical analysis
│   ├── parser/         # Syntactic analysis
│   ├── evaluator/      # Expression evaluation
│   └── utils/          # Utility functions
└── tests/              # Test suites
```

## Architecture Overview

The interpreter is divided into three main processing stages, each implemented as a separate module:

1. **Tokenizer**: Converts source code into tokens
2. **Parser**: Transforms tokens into an Abstract Syntax Tree (AST)
3. **Evaluator**: Executes the AST to produce results

### Module Details

1. **Types Module** (`src/types/`): Contains core type definitions used throughout the project.
2. **Tokenizer Module** (`src/tokenizer/`): Handles lexical analysis, converting input strings into a sequence of tokens.
3. **Parser Module** (`src/parser/`): Performs syntactic analysis, converting tokens into an AST.
4. **Evaluator Module** (`src/evaluator/`): Contains the core evaluation logic and environment handling.
5. **Environment Handling** (`src/evaluator/environment.ts`): Manages variable and function bindings.

## Testing Structure

The project uses Jest for testing, with separate test suites for each module.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Build and Run the project:
```bash
npm run repl
```
