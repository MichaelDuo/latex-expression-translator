latex-expression-translator
===========================
[![Build Status](https://travis-ci.org/MichaelDuo/latex-expression-translator.svg?branch=master)](https://travis-ci.org/MichaelDuo/latex-expression-translator)
[![codecov](https://codecov.io/gh/michaelduo/latex-expression-translator/branch/master/graph/badge.svg)](https://codecov.io/gh/MichaelDuo/latex-expression-translator)

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