# Instructions for Each Step

For each step:

1. Implement the required features as described in the guide.
2. Write corresponding unit tests based on the provided test cases.

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

### Test Cases

Each line is an input expression to tokenize and parse.

```
42

3.14

-17

-2.5

#t

#f

  

(+  1  2)

(-  3.14  2)

(*    -4  5)

(/  10  2)

  

(+ (*  2  3) (/  8  4))

(- (*  3 (+  2  1)) (/  10  2))

  

(define  x  5)

(set!  x  10)

  

(>  5  3)

(<=  2  2)

(=  x  10)

  

(define (square  x) (*  x  x))

(define (add  a  b) (+  a  b))

  

(lambda (x) (*  x  x))

((lambda (x  y) (+  x  y)) 3  4)

  

(if (>  5  3) 1  0)

(if (<  x  0) (-  x) x)

  

(cons  1  2)

(cons  1 (cons  2  3))

'(1  2  3)

(car '(1  2  3))

(cdr '(1  2  3))

  

(define (factorial  n)

(if (=  n  0)

1

(*  n (factorial (-  n  1)))))

  

(define (fib  n)

(if (<=  n  1)

n

(+ (fib (-  n  1))

(fib (-  n  2)))))

  

((lambda (x)

(if (>  x  0)

(+  x (car '(1  2  3)))

(*  x  2)))

5)
```

#### Expected Values

Each line is the AST representation of the corresponding input expression.

```
42

3.14

-17

-2.5

#t

#f

  

['+', 1, 2]

['-', 3.14, 2]

['*', -4, 5]

['/', 10, 2]

  

['+', ['*', 2, 3], ['/', 8, 4]]

['-', ['*', 3, ['+', 2, 1]], ['/', 10, 2]]

  

['define', 'x', 5]

['set!', 'x', 10]

  

['>', 5, 3]

['<=', 2, 2]

['=', 'x', 10]

  

['define', ['square', 'x'], ['*', 'x', 'x']]

['define', ['add', 'a', 'b'], ['+', 'a', 'b']]

  

['lambda', ['x'], ['*', 'x', 'x']]

[['lambda', ['x', 'y'], ['+', 'x', 'y']], 3, 4]

  

['if', ['>', 5, 3], 1, 0]

['if', ['<', 'x', 0], ['-', 'x'], 'x']

  

['cons', 1, 2]

['cons', 1, ['cons', 2, 3]]

['quote', [1, 2, 3]]

['car', ['quote', [1, 2, 3]]]

['cdr', ['quote', [1, 2, 3]]]

  

['define', ['factorial', 'n'],

['if', ['=', 'n', 0],

1,

['*', 'n', ['factorial', ['-', 'n', 1]]]]]

  

['define', ['fib', 'n'],

['if', ['<=', 'n', 1],

'n',

['+', ['fib', ['-', 'n', 1]],

['fib', ['-', 'n', 2]]]]]

  

[['lambda', ['x'],

['if', ['>', 'x', 0],

['+', 'x', ['car', ['quote', [1, 2, 3]]]],

['*', 'x', 2]]], 5]
```

*Note*: The actual format may vary depending on your implementation.

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

### Test Cases

```
(+ 1 2)
(- 5 3)
(* 4 2)
(/ 10 2)
(+ (* 2 3) (/ 8 4))
```

#### Expected Values

```
3
2
8
5
8
```

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

### Test Cases

```
(define x 10)
x
(set! x 20)
x
(+ x 5)
```

#### Expected Values

```
null
10
null
20
25
```

*Note*: For expressions that perform definitions or assignments, you can output `null` or a confirmation message.

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

### Test Cases

```
(define x 5)
(if (> x 0) 'positive 'non-positive)
(if (< x 0) 'negative 'non-negative)
(if (= x 5) (* x 2) (/ x 2))
```

#### Expected Values

```
null
positive
non-negative
10
```

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

### Test Cases

#### `step5-in`

```
(define (square x) (* x x))
(square 5)
((lambda (x y) (+ x y)) 3 4)
(define add (lambda (a b) (+ a b)))
(add 10 15)
```

#### `step5-solution`

```
null
25
7
null
25
```

## Step 6: Implement Recursion

### Objective

Support recursive function calls.

### Guide

- **Recursive Functions**:
    - Functions that call themselves within their body.

- **Environment Handling**:
    - Ensure that the function name is bound in its own environment so that recursive calls can find it.

### Test Cases

```
(define (factorial n)
  (if (= n 0)
      1
      (* n (factorial (- n 1)))))
(factorial 5)
(define (fib n)
  (if (<= n 1)
      n
      (+ (fib (- n 1)) (fib (- n 2)))))
(fib 6)
```

#### Expected Values

```
null
120
null
8
```

## Step 7: Implement Basic Data Structures (Lists)

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

### Test Cases

```
(define lst (cons 1 (cons 2 (cons 3 '()))))
(car lst)
(cdr lst)
(define lst2 '(4 5 6))
(car lst2)
(cdr lst2)
```

#### Expected Values

```
null
1
(2 3)
null
4
(5 6)
```
