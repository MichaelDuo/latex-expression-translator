import translate from '../src/parser';

test("#1 Should be: '(123+567)' if passed: '123+567'", () => {
  expect(translate('123+567')).toEqual('(123+567)');
});
test("#2 Should be: '(x+y)' if passed: 'x+y'", () => {
  expect(translate('x+y')).toEqual('(x+y)');
});
test("#3 Should be: '(123-567)' if passed: '123-567'", () => {
  expect(translate('123-567')).toEqual('(123-567)');
});
test("#4 Should be: '(123*567)' if passed: '123*567", () => {
  expect(translate('123*567')).toEqual('(123*567)');
});
test("#5 Should be: '(x*y)' if passed: 'x*y'", () => {
  expect(translate('x*y')).toEqual('(x*y)');
});
test("#6 Should be: '(x*y)' if passed: 'xy'", () => {
  expect(translate('xy')).toEqual('(x*y)');
});
test("#7 Should be: '((x*7)*y)' if passed: 'x*7*y'", () => {
  expect(translate('x*7*y')).toEqual('((x*7)*y)');
});
test("#8 Should be: '((x*7)*y)' if passed: 'x7y'", () => {
  expect(translate('x*7*y')).toEqual('((x*7)*y)');
});
test("#9 Should be: '(123*567)' if passed: '123\\cdot 567'", () => {
  expect(translate('123\\cdot 567')).toEqual('(123*567)');
});
test("#10 Should be: '(x*y)' if passed: 'x\\cdot y'", () => {
  expect(translate('x\\cdot y')).toEqual('(x*y)');
});
test("#11 Should be: '(123/567)' if passed: '123/567'", () => {
  expect(translate('123/567')).toEqual('(123/567)');
});
test("#12 Should be: '(x/y)' if passed: 'x/y'", () => {
  expect(translate('x/y')).toEqual('(x/y)');
});
test("#13 Should be: '((x)/(y))' if passed: '\\frac{x}{y}'", () => {
  expect(translate('\\frac{x}{y}')).toEqual('((x)/(y))');
});
test("#14 Should be: '(((x*y))/((3*x)))' if passed: '\\frac{xy}{3x}'", () => {
  expect(translate('\\frac{xy}{3x}')).toEqual('(((x*y))/((3*x)))');
});
test("#15 Should be: '(x**2)' if passed: 'x^2'", () => {
  expect(translate('x^2')).toEqual('(x**2)');
});
test("#16 Should be: '(x**y)' if passed: 'x^y'", () => {
  expect(translate('x^y')).toEqual('(x**y)');
});
test("#17 Should be: '(x**((2*y)))' if passed: 'x^{2y}'", () => {
  expect(translate('x^{2y}')).toEqual('(x**((2*y)))');
});
test("#18 Should be: '(x**(((2*y)+3)))' if passed: 'x^{2y+3}'", () => {
  expect(translate('x^{2y+3}')).toEqual('(x**(((2*y)+3)))');
});
test("#19 Should be: '(x**(((((2)/(3))*y)*x)))' if passed: 'x^{\\frac{2}{3}yx}'", () => {
  expect(translate('x^{\\frac{2}{3}yx}')).toEqual('(x**(((((2)/(3))*y)*x)))');
});
test("#20 Should be: 'exp(1)' if passed: 'e;", () => {
  expect(translate('e')).toEqual('exp(1)');
});
test("#21 Should be: '(exp(1)**7)' if passed: 'e^7;", () => {
  expect(translate('e^7')).toEqual('(exp(1)**7)');
});
test("#22 Should be: '(exp(1)*((7*x)*y))' if passed: 'e\\cdot 7xy'", () => {
  expect(translate('e\\cdot 7xy')).toEqual('(exp(1)*((7*x)*y))');
});
test("#23 Should be: '(x**exp(1))' if passed: 'x**(exp(1))'", () => {
  expect(translate('x^e')).toEqual('(x**exp(1))');
});
test("#24 Should be: '(x**((exp(1)*y)))' if passed: 'x^{ey}'", () => {
  expect(translate('x^{ey}')).toEqual('(x**((exp(1)*y)))');
});
test("#25 Should be: '(x**((exp(1)+(5*y))))' if passed: 'x^{e+5y}'", () => {
  expect(translate('x^{e+5y}')).toEqual('(x**((exp(1)+(5*y))))');
});
test("#26 Should be: '(x*exp(1))' if passed: 'xe'", () => {
  expect(translate('xe')).toEqual('(x*exp(1))');
});
test("#27 Should be: '(x*(exp(1)**2))' if passed: 'xe^2'", () => {
  expect(translate('xe^2')).toEqual('(x*(exp(1)**2))');
});
test("#28 Should be: '((x**2)+(9*x))' if passed: 'x^2+9x'", () => {
  expect(translate('x^2+9x')).toEqual('((x**2)+(9*x))');
});
test("#29 Should be: '((7*(x**2))+(9*x))' if passed: '7x^2+9x'", () => {
  expect(translate('7x^2+9x')).toEqual('((7*(x**2))+(9*x))');
});
test("#30 Should be: 'pi' if passed: '\\pi'", () => {
  expect(translate('\\pi')).toEqual('pi');
});
test("#31 Should be: 'sin((x+1))' if passed: 'sin\\left(x+1\\right)'", () => {
  expect(translate('sin\\left(x+1\\right)')).toEqual('sin((x+1))');
});
test("#32 Should be: 'cos((x+1))' if passed: 'cos\\left(x+1\\right)'", () => {
  expect(translate('cos\\left(x+1\\right)')).toEqual('cos((x+1))');
});
test("#33 Should be: 'tan((x+1))' if passed: 'tan\\left(x+1\\right)'", () => {
  expect(translate('tan\\left(x+1\\right)')).toEqual('tan((x+1))');
});
test("#34 Shoud be: '((sqrt(8))/(x))**2' if passed: '\\frac{\\sqrt{8}}{x}^2'", () => {
  expect(translate('\\frac{\\sqrt{8}}{x}^2')).toEqual('(((sqrt(8))/(x))**2)');
});
test("#35 Shoud be: 'log(3)' if passed: 'lg(3)'", () => {
  expect(translate('lg(3)')).toEqual('log(3)');
});
test("#36 Shoud be: '((2*sqrt(3))*(Abs(cos((3*x)))))' if passed: '2\\sqrt{3}\\left|\\cos \\left(3x\\right)\\right|'", () => {
  expect(translate('2\\sqrt{3}\\left|\\cos \\left(3x\\right)\\right|')).toEqual('((2*sqrt(3))*(Abs(cos((3*x)))))');
});
test("#37 Shoud be: '(Abs((cos((x))**2)))' if passed: '\\left|\\cos ^2\\left(x\\right)\\right|'", () => {
  expect(translate('\\left|\\cos ^2\\left(x\\right)\\right|')).toEqual('(Abs((cos((x))**2)))');
});
test("#38 Shoud be: 'oo' if passed: '\\infty'", () => {
  expect(translate('\\infty')).toEqual('oo');
});
test("#39 Shoud be: '(log((y)).toEqual(),x))' if passed: '\\log _x\\left(y\\right)'", () => {
  expect(translate('\\log _x\\left(y\\right)')).toEqual('(log((y),x))');
});
test("#40 Shoud be: '((log(x,((x+y))))+y)' if passed: '\\log _{x+y}x+y'", () => {
  expect(translate('\\log _{x+y}x+y')).toEqual('((log(x,((x+y))))+y)');
});
test("#41 Shoud be: '((log(x,((x+y))))+y)' if passed: '\\log _{x+y}x+y'", () => {
  expect(translate('\\log _{x+y}x+y')).toEqual('((log(x,((x+y))))+y)');
});
test("#42 Shoud be: '((log(x,((x+y))))+y)' if passed: '\\log _{x+y}x+y'", () => {
  expect(translate('\\log _{x+y}x+y')).toEqual('((log(x,((x+y))))+y)');
});
