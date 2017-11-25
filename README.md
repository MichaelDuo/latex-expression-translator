# latex-to-sympy

A Pure Javascript Library Which Transform Latex Expression To Sympy Expression

## How To Use

```javascript
var latex2sympy = require('./src/parser.js').compute
var latexExpr = 'x^{\\frac{2}{3}yx}'
var sympyExpr = latex2sympy(latexExpr)
```