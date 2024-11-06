# Mini-Scheme

The goal is to design and implement a mini-Scheme interpreter capable of handling LeetCode-level tasks. This means the interpreter should support essential features required for implementing data structures and algorithms, such as arithmetic operations, variables, conditionals, functions, recursion, and basic data structures like lists. We will choose a subset of Scheme that includes these features while keeping the interpreter manageable.

You can implement the interpreter in any programming language you are comfortable with.

See [A Typescript implementation sample](https://github.com/Junxiao-Liao/Mini-Scheme/tree/main/ts-impl).

See [through guide](https://github.com/Junxiao-Liao/Mini-Scheme/tree/main/guide).

## Subset of Scheme to Implement

1. **Arithmetic Operations**: `+`, `-`, `*`, `/`
   - Example: `(+ 1 2)` evaluates to `3`

2. **Variables and Assignments**:
   - `define`: Define a new variable
     - Example: `(define x 5)`
   - `set!`: Update an existing variable
     - Example: `(set! x 10)`

3. **Conditionals**:
   - `if`: Conditional expressions
     - Example: `(if (> x 0) x (- x))`

4. **Functions**:
   - `lambda`: Anonymous functions
     - Example: `((lambda (x) (* x x)) 5)` evaluates to `25`
   - `define`: Define named functions
     - Example: `(define (square x) (* x x))`

5. **Recursion**:
   - Functions that call themselves
     - Example: Factorial function

6. **Basic Data Structures**:
   - `cons`, `car`, `cdr`: Working with lists
     - Example: `(car (cons 1 '(2 3)))` evaluates to `1`

By the end of this project, we'll have an interpreter that can parse and evaluate Scheme expressions involving these constructs, sufficient for solving algorithmic problems.