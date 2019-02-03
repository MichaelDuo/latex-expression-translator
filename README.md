latex-expression-translator
===========================
[![npm][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![codecov][codecov-image]][codecov-url]

[![NPM](https://nodei.co/npm/latex-expression-translator.png)][npm-url]

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

[npm-image]: https://img.shields.io/npm/v/latex-expression-translator.svg?style=flat
[npm-url]: https://www.npmjs.com/package/latex-expression-translator
[travis-image]: https://travis-ci.org/MichaelDuo/latex-expression-translator.svg?branch=master
[travis-url]: https://travis-ci.org/MichaelDuo/latex-expression-translator
[codecov-image]: https://codecov.io/gh/michaelduo/latex-expression-translator/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/MichaelDuo/latex-expression-translator