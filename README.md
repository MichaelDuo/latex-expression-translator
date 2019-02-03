latex-expression-translator
===========================

A javascript library which transforms Latex Expression To Sympy Expression

Install
=========
```
npm install latex-expression-translator
```

Usage
=====
```javascript
const translateLatex = require('latex-expression-translator')

const sympyExpression = translateLatex('\\frac{\\sqrt{8}}{x}^2') // output: (((sqrt(8))/(x))**2)
```