'use strict';
const assert = require('assert')
const translate = require('./parser.js').compute
describe('#Translator test', function() {
  describe('Basic cases', function () {
	  it("#1 Should be: '(123+567)' if passed: '123+567'", function () {
	  	assert.equal(translate('123+567'), '(123+567)')
	  })
	  it("#2 Should be: '(x+y)' if passed: 'x+y'", function () {
	  	assert.equal(translate('x+y'), '(x+y)')
	  })
	  it("#3 Should be: '(123-567)' if passed: '123-567'", function () {
	  	assert.equal(translate('123-567'), '(123-567)')
	  })
	  it("#4 Should be: '(123*567)' if passed: '123*567", function () {
	  	assert.equal(translate('123*567'), '(123*567)')
	  })
	  it("#5 Should be: '(x*y)' if passed: 'x*y'", function () {
	  	assert.equal(translate('x*y'), '(x*y)')
	  })
	  it("#6 Should be: '(x*y)' if passed: 'xy'", function () {
	  	assert.equal(translate('xy'), '(x*y)')
	  })
	  it("#7 Should be: '((x*7)*y)' if passed: 'x*7*y'", function () {
	  	assert.equal(translate('x*7*y'), '((x*7)*y)')
	  })
	  it("#8 Should be: '((x*7)*y)' if passed: 'x7y'", function () {
	  	assert.equal(translate('x*7*y'), '((x*7)*y)')
	  })
	  it("#9 Should be: '(123*567)' if passed: '123\\cdot 567'", function () {
	  	assert.equal(translate('123\\cdot 567'), '(123*567)')
	  })
	  it("#10 Should be: '(x*y)' if passed: 'x\\cdot y'", function () {
	  	assert.equal(translate('x\\cdot y'), '(x*y)')
	  })
	  it("#11 Should be: '(123/567)' if passed: '123/567'", function () {
	  	assert.equal(translate('123/567'), '(123/567)')
	  })
	  it("#12 Should be: '(x/y)' if passed: 'x/y'", function () {
	  	assert.equal(translate('x/y'), '(x/y)')
	  })
	  it("#13 Should be: '((x)/(y))' if passed: '\\frac{x}{y}'", function () {
	  	assert.equal(translate('\\frac{x}{y}'), '((x)/(y))')
	  })
	  it("#14 Should be: '(((x*y))/((3*x)))' if passed: '\\frac{xy}{3x}'", function () {
	  	assert.equal(translate('\\frac{xy}{3x}'), '(((x*y))/((3*x)))')
	  })
	  it("#15 Should be: '(x**2)' if passed: 'x^2'", function () {
	  	assert.equal(translate('x^2'), '(x**2)')
	  })
	  it("#16 Should be: '(x**y)' if passed: 'x^y'", function () {
	  	assert.equal(translate('x^y'), '(x**y)')
	  })
	  it("#17 Should be: '(x**((2*y)))' if passed: 'x^{2y}'", function () {
	  	assert.equal(translate('x^{2y}'), '(x**((2*y)))')
	  })
	  it("#18 Should be: '(x**(((2*y)+3)))' if passed: 'x^{2y+3}'", function () {
	  	assert.equal(translate('x^{2y+3}'), '(x**(((2*y)+3)))')
	  })
	  it("#19 Should be: '(x**(((((2)/(3))*y)*x)))' if passed: 'x^{\\frac{2}{3}yx}'", function () {
	  	assert.equal(translate('x^{\\frac{2}{3}yx}'), '(x**(((((2)/(3))*y)*x)))')
	  })
	  it("#20 Should be: 'exp(1)' if passed: 'e;", function () {
	  	assert.equal(translate('e'), 'exp(1)')
	  })
	  it("#21 Should be: '(exp(1)**7)' if passed: 'e^7;", function () {
	  	assert.equal(translate('e^7'), '(exp(1)**7)')
	  })
	  it("#22 Should be: '(exp(1)*((7*x)*y))' if passed: 'e\\cdot 7xy'", function () {
	  	assert.equal(translate('e\\cdot 7xy'), '(exp(1)*((7*x)*y))')
	  })
	  it("#23 Should be: '(x**exp(1))' if passed: 'x**(exp(1))'", function () {
	  	assert.equal(translate('x^e'), '(x**exp(1))')
	  })
	  it("#24 Should be: '(x**((exp(1)*y)))' if passed: 'x^{ey}'", function () {
	  	assert.equal(translate('x^{ey}'), '(x**((exp(1)*y)))')
	  })
	  it("#25 Should be: '(x**((exp(1)+(5*y))))' if passed: 'x^{e+5y}'", function () {
	  	assert.equal(translate('x^{e+5y}'), '(x**((exp(1)+(5*y))))')
	  })
	  it("#26 Should be: '(x*exp(1))' if passed: 'xe'", function () {
	  	assert.equal(translate('xe'), '(x*exp(1))')
	  })
	  it("#27 Should be: '(x*(exp(1)**2))' if passed: 'xe^2'", function () {
	  	assert.equal(translate('xe^2'), '(x*(exp(1)**2))')
	  })
	  it("#28 Should be: '((x**2)+(9*x))' if passed: 'x^2+9x'", function () {
	  	assert.equal(translate('x^2+9x'), '((x**2)+(9*x))')
	  })
	  it("#29 Should be: '((7*(x**2))+(9*x))' if passed: '7x^2+9x'", function () {
	  	assert.equal(translate('7x^2+9x'), '((7*(x**2))+(9*x))')
	  })
    it("#30 Should be: 'pi' if passed: '\\pi'", function () {
      assert.equal(translate('\\pi'), 'pi')
    })
    it("#31 Should be: 'sin((x+1))' if passed: 'sin\\left(x+1\\right)'", function () {
      assert.equal(translate('sin\\left(x+1\\right)'), 'sin((x+1))')
    })
    it("#32 Should be: 'cos((x+1))' if passed: 'cos\\left(x+1\\right)'", function () {
      assert.equal(translate('cos\\left(x+1\\right)'), 'cos((x+1))')
    })
    it("#33 Should be: 'tan((x+1))' if passed: 'tan\\left(x+1\\right)'", function () {
      assert.equal(translate('tan\\left(x+1\\right)'), 'tan((x+1))')
    })
    it("#34 Shoud be: '((sqrt(8))/(x))**2' if passed: '\\frac{\\sqrt{8}}{x}^2'", function(){
    	assert.equal(translate('\\frac{\\sqrt{8}}{x}^2'), '(((sqrt(8))/(x))**2)')
    })
    it("#35 Shoud be: 'log(3)' if passed: 'lg(3)'", function(){
    	assert.equal(translate('lg(3)'), 'log(3)')
    })
    it("#36 Shoud be: '((2*sqrt(3))*(Abs(cos((3*x)))))' if passed: '2\\sqrt{3}\\left|\\cos \\left(3x\\right)\\right|'", function(){
    	assert.equal(translate('2\\sqrt{3}\\left|\\cos \\left(3x\\right)\\right|'), '((2*sqrt(3))*(Abs(cos((3*x)))))')
    })
    it("#37 Shoud be: '(Abs((cos((x))**2)))' if passed: '\\left|\\cos ^2\\left(x\\right)\\right|'", function(){
    	assert.equal(translate('\\left|\\cos ^2\\left(x\\right)\\right|'), '(Abs((cos((x))**2)))')
    })
    it("#38 Shoud be: 'oo' if passed: '\\infty'", function(){
    	assert.equal(translate('\\infty'), 'oo')
    })
    it("#39 Shoud be: '(log((y),x))' if passed: '\\log _x\\left(y\\right)'", function(){
    	assert.equal(translate('\\log _x\\left(y\\right)'), '(log((y),x))')
    })
    it("#40 Shoud be: '((log(x,((x+y))))+y)' if passed: '\\log _{x+y}x+y'", function(){
    	assert.equal(translate('\\log _{x+y}x+y'), '((log(x,((x+y))))+y)')
    })

    it("#41 Shoud be: '((log(x,((x+y))))+y)' if passed: '\\log _{x+y}x+y'", function(){
    	assert.equal(translate('\\log _{x+y}x+y'), '((log(x,((x+y))))+y)')
    })
    it("#42 Shoud be: '((log(x,((x+y))))+y)' if passed: '\\log _{x+y}x+y'", function(){
    	assert.equal(translate('\\log _{x+y}x+y'), '((log(x,((x+y))))+y)')
    })
  })
})
