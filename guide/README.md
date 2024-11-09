# Instructions for Each Step

For each step:

1. Implement the required features as described in the guide.
2. Write corresponding unit tests based on the provided test cases. (Provided test cases are in Jest for TS.)

# Steps

## Step 1: Implement Tokenizer and Parser

### Objective

Create a tokenizer to break input strings into tokens and a parser to convert tokens into an Abstract Syntax Tree (AST).

### Guide

-  **Tokenizer**:

	- Implement a function to read an input string and split it into meaningful tokens (parentheses, symbols, numbers).
	- Handle numbers (integers and floats), symbols, and parentheses.

-  **Parser**:

	- Convert the list of tokens into an AST representing the nested structure of Scheme expressions.
	- Represent atoms (numbers and symbols) and lists (expressions within parentheses).

-  **Data Structures**:

	- Use lists or custom classes to represent the AST nodes.

### Token List

1.  **Delimiters**

	- Left parenthesis: `(`
	- Right parenthesis: `)`

1. **String**

    - Double quote: `"`

2.  **Numbers**

	- Integers: e.g., `0`, `42`, `-17`
	- Floating-point numbers: e.g., `3.14`, `-0.5`

3.  **Special Forms**

	-  `define` - Variable and function definition
	-  `lambda` - Anonymous function creation
	-  `if` - Conditional expression
	-  `set!` - Variable assignment

4.  **Arithmetic Operators**

	-  `+` - Addition
	-  `-` - Subtraction
	-  `*` - Multiplication
	-  `/` - Division

5.  **Comparison Operators**

	-  `=` - Equality
	-  `<` - Less than
	-  `>` - Greater than
	-  `<=` - Less than or equal
	-  `>=` - Greater than or equal

6.  **List Operations**

	-  `cons` - Construct pair
	-  `car` - Get first element
	-  `cdr` - Get rest of list
	-  `'` - Quote symbol (for list literals)

7.  **Identifiers**

	- Variable names: e.g., `x`, `square`, `factorial`
	- Must start with letter or special character
	- Can contain letters, digits, and special characters

8.  **Boolean Values**

	-  `#t` - True
	-  `#f` - False

### [Test Cases for Tokenizer](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/tokenizer.test.ts); [Test Cases for Parser](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/parser.test.ts)

## Step 2: Evaluate Basic Arithmetic Expressions

### Objective

Implement evaluation of arithmetic expressions involving `+`, `-`, `*`, `/`.

### Guide

- **Evaluation Function**:
    - Traverse the AST and evaluate expressions.
    - For atoms (numbers), return their value.
    - For expressions, evaluate according to the operator.

- **Operators**:
    - Implement functions for `+`, `-`, `*`, `/`.

- **Error Handling**:
    - Handle division by zero.
    - Handle invalid syntax.

### [Test Cases](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/evaluator.test.ts)

## Step 3: Implement Variables and Assignments

### Objective

Add support for `define` to create variables and `set!` to update them.

### Guide

- **Environment**:
    - Implement an environment (a mapping from variable names to values).
    - When evaluating a symbol, retrieve its value from the environment.

- **`define`**:
    - When encountering `(define <var> <value>)`, add `<var>` to the environment with the evaluated `<value>`.

- **`set!`**:
    - Update the value of an existing variable in the environment.

- **Scope**:
    - Start with a global environment.

### [Test Cases](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/evaluatorVarAssign.test.ts)

## Step 4: Implement Conditionals

### Objective

Implement the `if` expression to allow conditional execution.

### Guide

- **`if` Syntax**:
    - `(if <test> <consequent> <alternative>)`

- **Evaluation**:
    - Evaluate `<test>`. If it's true (non-zero, non-false), evaluate `<consequent>`, else evaluate `<alternative>`.

- **Truthiness in Scheme**:
    - Only `#f` (false) is false; everything else is true.

### [Test Cases](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/conditionals.test.ts)

## Step 5: Implement Functions (Lambda Expressions and Function Definitions)

### Objective

Add support for function definitions using `lambda` and `define`.

### Guide

- **Lambda Expressions**:
    - `(lambda (<params>) <body>)`
    - Return a function object that can be called with arguments.

- **Define Functions**:
    - `(define (<name> <params>) <body>)`
    - Sugar for `(define <name> (lambda (<params>) <body>))`

- **Function Calls**:
    - When a list is encountered, evaluate the first element; if it's a function, call it with the evaluated arguments.

- **Closures**:
    - Functions should carry their own environment for variables.

### [Test Cases](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/functions.test.ts)

## Step 6: Implement Basic Data Structures (Lists)

### Objective

Add support for lists using `cons`, `car`, `cdr`.

### Guide

- **Cons Cell**:
    - Implement a data structure for cons cells.

- **List Operations**:
    - `cons`: Creates a new pair.
    - `car`: Returns the first element.
    - `cdr`: Returns the second element.

- **List Literals**:
    - Implement quoting to create lists: `'(1 2 3)`

### [Test Cases](https://github.com/Junxiao-Liao/Mini-Scheme/blob/main/ts-impl/tests/list.test.ts)
