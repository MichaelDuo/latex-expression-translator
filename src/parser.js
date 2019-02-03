

/* eslint-disable no-use-before-define */
const _ = require('lodash');
const ConstantNode = require('./nodes/constant.js');
const SymbolNode = require('./nodes/symbol.js');
const OperatorNode = require('./nodes/operator.js');
const ParenthesisNode = require('./nodes/parenthesis.js');
const LatexFunctionNode = require('./nodes/latex-function.js');
const AbsNode = require('./nodes/abs.js');
const RootNode = require('./nodes/root.js');
const LogNode = require('./nodes/log.js');
const EqNode = require('./nodes/eq.js');

const TOKENTYPE = {
  NULL: 0,
  DELIMITER: 1,
  NUMBER: 2,
  SYMBOL: 3,
  UNKNOWN: 4,
  LATEX: 5,
  FUNCTION: 6,
  LATEX_FUNCTION: 7,
  LATEX_SYMBOL: 8,
};

const DELIMITERS = {
  ',': true,
  '(': true,
  ')': true,
  '[': true,
  ']': true,
  '"': true,
  ';': true,
  '{': true,
  '}': true,

  '+': true,
  '-': true,
  '*': true,
  '.*': true,
  '/': true,
  './': true,
  '%': true,
  '^': true,
  '.^': true,
  '~': true,
  '!': true,
  '&': true,
  '|': true,
  '^|': true,
  '\'': true,
  '=': true,
  ':': true,
  '?': true,
  _: true,

  '==': true,
  '!=': true,
  '<': true,
  '>': true,
  '<=': true,
  '>=': true,

  '<<': true,
  '>>': true,
  '>>>': true,
};

const VARS = {
  x: true,
  y: true,
  z: true,
  a: true,
  b: true,
  c: true,
  i: true,
  e: true,
};

// Latex Functions
const LatexFunction = {
  '\\frac': { tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\cdot': { tokenTypes: TOKENTYPE.DELIMITER },
  '\\sqrt': { tokenEqv: 'sqrt', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\sin': { tokenEqv: 'sin', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\cos': { tokenEqv: 'cos', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\tan': { tokenEqv: 'tan', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\arcsin': { tokenEqv: 'asin', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\sec': { tokenEqv: 'sec', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\arccos': { tokenEqv: 'acos', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\csc': { tokenEqv: 'csc', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\arctan': { tokenEqv: 'atan', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\cot': { tokenEqv: 'cot', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\lg': { tokenEqv: 'log', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\log': { tokenEqv: 'log', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\ln': { tokenEqv: 'ln', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\sh': { tokenEqv: 'sinh', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\ch': { tokenEqv: 'cosh', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\sinh': { tokenEqv: 'sinh', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\cosh': { tokenEqv: 'cosh', tokenTypes: TOKENTYPE.LATEX_FUNCTION },
  '\\pi': { tokenEqv: 'pi', tokenTypes: TOKENTYPE.SYMBOL },
  '\\infty': { tokenEqv: 'oo', tokenTypes: TOKENTYPE.SYMBOL },
  '\\left|': { tokenEqv: 'l|', tokenTypes: TOKENTYPE.DELIMITER },
  '\\right|': { tokenEqv: 'r|', tokenTypes: TOKENTYPE.DELIMITER },
};

// Also Latex Functions but without '\' at the start
const Functions = {
  sin: true,
  cos: true,
  tan: true,
  cot: true,
  sec: true,
  csc: true,
  asin: true,
  acos: true,
  atan: true,
  arcsin: 'asin',
  arccos: 'acos',
  arctan: 'atan',
  lg: 'log',
  log: 'log',
  ln: 'ln',
  sh: 'sinh',
  sinh: 'sinh',
  ch: 'cosh',
  cosh: 'cosh',
  infty: 'oo',
};

let expression = '';
let index = 0;
let c = '';
let token = '';
let tokenTypes = TOKENTYPE.NULL;

function first() {
  index = 0;
  c = expression.charAt(0);
}

function next(count = 1) {
  for (let i = 0; i < count; i += 1) {
    index += 1;
    c = expression.charAt(index);
  }
}

function preview(count) {
  return expression.substr(index, count);
}

function isDigitOrDot(char) {
  return ((char >= '0' && char <= '9') || char === '.');
}

function isDigit(char) {
  return (char >= '0' && char <= '9');
}

function isVar(char) {
  return VARS[char];
}

function getToken() {
  tokenTypes = TOKENTYPE.NULL;
  token = '';

  while (c === ' ' || c === '\t') {
    // Skipping white space
    next();
  }

  function currentIsAlpha() {
    // http://unicode-table.com/en/
    // http://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
    //
    // Note: In ES6 will be unicode aware:
    //   http://stackoverflow.com/questions/280712/javascript-unicode-regexes
    //   https://mathiasbynens.be/notes/es6-unicode-regex
    const cPrev = expression.charAt(index - 1);
    const cNext = expression.charAt(index + 1);

    function isValidLatinOrGreek(p) {
      // Added \\ to fit regular expression
      return /^[a-zA-Z_\u00C0-\u02AF\u0370-\u03FF\\]$/.test(p);
    }

    function isValidMathSymbol(high, low) {
      return /^[\uD835]$/.test(high) && /^[\uDC00-\uDFFF]$/.test(low) && /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(low);
    }

    function isAbs(char) {
      return /^\|$/.test(char);
    }

    return isValidLatinOrGreek(c)
              || isValidMathSymbol(c, cNext)
              || isValidMathSymbol(cPrev, c)
              || isAbs(c);
  }

  if (c === '') {
    tokenTypes = TOKENTYPE.DELIMITER;
    return;
  }

  // Recognizing delimiters with length 3
  let c2 = preview(2);
  const c3 = preview(3);
  const c4 = preview(4);
  const c6 = preview(6);

  if (c6.length === 6 && Functions[c6]) {
    tokenTypes = TOKENTYPE.LATEX_FUNCTION;
    token = c6;
    if (typeof Functions[c6] === 'string') {
      token = Functions[c6];
    }
    next(6);
    return;
  }

  if (c4.length === 4 && Functions[c4]) {
    tokenTypes = TOKENTYPE.LATEX_FUNCTION;
    token = c4;
    next(4);
    return;
  }

  if (c3.length === 3 && DELIMITERS[c3]) {
    tokenTypes = TOKENTYPE.DELIMITER;
    token = c3;
    next(3);
    return;
  }

  if (c3.length === 3 && Functions[c3]) {
    tokenTypes = TOKENTYPE.LATEX_FUNCTION;
    token = c3;
    next(3);
    return;
  }

  if (c2.length === 2 && Functions[c2]) {
    tokenTypes = TOKENTYPE.LATEX_FUNCTION;
    token = Functions[c2];
    next(2);
    return;
  }

  // Recognizing delimiters with length 2
  if (c2.length === 2 && DELIMITERS[c2]) {
    tokenTypes = TOKENTYPE.DELIMITER;
    token = c2;
    next(2);
    return;
  }

  // Recognizing delimiters with length 1
  if (DELIMITERS[c]) {
    tokenTypes = TOKENTYPE.DELIMITER;
    token = c;
    next();
    return;
  }

  if (isDigitOrDot(c)) {
    tokenTypes = TOKENTYPE.NUMBER;
    if (c === '.') {
      token += c;
      next();

      if (!isDigit(c)) {
        tokenTypes = TOKENTYPE.UNKNOWN;
      }
    } else {
      while (isDigit(c)) {
        token += c;
        next();
      }
      if (c === '.') {
        token += c;
        next();
      }
    }
    while (isDigit(c)) {
      token += c;
      next();
    }
    c2 = preview(2);
    if ((c === 'E' || c === 'e') && (isDigit(c2) || c2 === '-' || c2 === '+')) {
      token += c;
      next();
      if (c === '+' || c === '-') {
        token += c;
        next();
      }
      if (!isDigit(c)) {
        // Tes this condition
        tokenTypes = TOKENTYPE.UNKNOWN;
      }
      while (isDigit(c)) {
        token += c;
        next();
      }
    }
    return;
  }

  // Checking Latex Expression
  if (c === '\\') {
    while (currentIsAlpha() && !LatexFunction[token]) {
      token += c;
      next();
    }
    tokenTypes = LatexFunction[token] ? LatexFunction[token].tokenTypes : TOKENTYPE.UNKNOWN;
    // Could be a bug
    if (tokenTypes !== TOKENTYPE.UNKNOWN) {
      // translate to token without
      token = LatexFunction[token].tokenEqv ? LatexFunction[token].tokenEqv : token;
    }
    return;
  }

  // what if it's sin and we need to support s as a variable?
  if (isVar(c)) {
    token = c;
    tokenTypes = TOKENTYPE.SYMBOL;
    next();
    return;
  }

  if (currentIsAlpha()) {
    // Why it needs to check is digit? somthing like a3b ???
    while (currentIsAlpha() || isDigit(c)) {
      token += c;
      next();
    }
    tokenTypes = TOKENTYPE.SYMBOL;
    return;
  }

  tokenTypes = TOKENTYPE.UNKNOWN;
  while (c !== '') {
    token += c;
    next();
  }
  throw new Error(`Syntax error in part '${token}'`);
}

function parsePow() {
  let node; let name; let fn; let
    params;
  node = parseLatexFrac();

  if (token === '^') {
    name = token;
    fn = 'pow';

    getToken();
    params = [node, parseUnary()];
    node = new OperatorNode(name, fn, params);
  }
  return node;
}


function parseUnary() {
  let params;
  const fn = {
    '-': 'unaryMinus',
    '+': 'unaryPlus',
  }[token];

  const name = token;
  if (fn) {
    getToken();
    params = [parseUnary()];
    return new OperatorNode(name, fn, params);
  }

  return parsePow();
}

function parseConsecutiveMultipleWithoutParenthesis() {
  let node; let last;
  node = parseUnary();
  last = node;
  for (;;) {
    if ((tokenTypes === TOKENTYPE.SYMBOL)
                    || (tokenTypes === TOKENTYPE.LATEX_FUNCTION)
                    || (tokenTypes === TOKENTYPE.NUMBER && !last.isConstantNode)
                    || (token === 'l|') // ??? really?
    ) {
      last = parseUnary();
      node = new OperatorNode('*', 'multiply', [node, last]);
    } else {
      break;
    }
  }
  return node;
}

function parseConsecutiveMultiple() {
  let node; let last;
  node = parseConsecutiveMultipleWithoutParenthesis();
  last = node;
  for (;;) {
    if ((token === '(') || (token === 'l|')) {
      last = parseConsecutiveMultipleWithoutParenthesis();
      node = new OperatorNode('*', 'multiply', [node, last]);
    } else {
      break;
    }
  }
  return node;
}

function parseMultiplyDivide() {
  let node; let last; let name; let
    fn;
  node = parseConsecutiveMultiple();
  last = node;
  const operators = {
    '*': 'multiply',
    '/': 'divide',
  };
  for (;;) {
    if (token in operators) {
      name = token;
      fn = operators[name];
      getToken();
      last = parseConsecutiveMultiple();
      node = new OperatorNode(name, fn, [node, last]);
    } else {
      break;
    }
  }
  return node;
}


function parseAddSubtract() {
  let node; let name; let fn; let
    params;
  node = parseMultiplyDivide();
  const operators = {
    '+': 'add',
    '-': 'subtract',
  };
  while (token in operators) {
    name = token;
    fn = operators[name];
    getToken();
    params = [node, parseMultiplyDivide()];
    node = new OperatorNode(name, fn, params);
  }
  return node;
}

function parseEquation() {
  const node1 = parseAddSubtract();
  if (token === '=') {
    getToken();
    const node2 = parseAddSubtract();
    return new EqNode(node1, node2);
  }
  return node1;
}

function parseAssignment() {
  const node = parseEquation();
  return node;
}

function parseBlock() {
  if (token === '') {
    // Return new node
    return {};
  }
  const node = parseAssignment();
  return node;
}

function parseStart() {
  expression = expression.replace(/{/g, '{');
  expression = expression.replace(/}/g, '}');
  expression = expression.replace(/\\left\(/g, '(');
  expression = expression.replace(/\\right\)/g, ')');
  expression = expression.replace(/\\left\[/g, '[');
  expression = expression.replace(/\\right\]/g, ']');
  expression = expression.replace(/\\cdot/g, '*');
  expression = expression.replace(/\\times/g, '*');
  expression = expression.replace(/\\dfrac/g, '\\frac');
  expression = expression.replace(/X/g, 'x');
  expression = expression.replace(/\s/g, '');
  expression = _.trim(expression);
  first();

  getToken();
  const node = parseBlock();
  return node;
}

// Latex elements
function parseLatexFrac() {
  if (token === '\\frac') {
    let numerator;
    let denominator;
    getToken();
    if (token === '{') {
      numerator = parseParentheses();
    } else {
      throw new Error('\\frac expecting {');
    }
    if (token === '{') {
      denominator = parseParentheses();
    } else {
      throw new Error('\\frac expecting second {');
    }
    return new OperatorNode('/', 'divide', [numerator, denominator]);
  }
  return parseLatexRootOf();
}

function parseLatexRootOf() {
  if (token === 'sqrt') {
    let rootNode = null;
    let contentNode = null;
    getToken();
    if (token === '[' || token === '{') {
      if (token === '[') {
        rootNode = parseBrackets();
        if (token === '{') {
          contentNode = parseParentheses();
        }
      } else {
        contentNode = parseParentheses();
      }
    } else {
      throw new Error('sqrt expecting [ or {');
    }
    if (!rootNode) {
      return new LatexFunctionNode('sqrt', contentNode);
    }
    return new RootNode(rootNode, contentNode);
  }
  return parseLatexFunction();
}

function parseLatexFunction() {
  if (tokenTypes === TOKENTYPE.LATEX_FUNCTION) {
    let contentNode;
    const name = token;
    getToken();
    if (token === '{' || token === '(') {
      contentNode = parseParentheses();
    } else if (token === 'l|') {
      contentNode = parseAbs();
    } else if (token === '^') {
      if (isDigit(c)) {
        const node = new ConstantNode(c, 'number');
        next();
        getToken();
        let node2;
        if (tokenTypes === TOKENTYPE.SYMBOL) {
          node2 = parseConsecutiveMultipleWithoutParenthesis();
        } else if (tokenTypes === TOKENTYPE.NUMBER) {
          node2 = parseConsecutiveMultipleWithoutParenthesis();
        } else if (token === '{' || token === '(') {
          node2 = parseParentheses();
        }
        return new OperatorNode('^', 'pow', [(new LatexFunctionNode(name, new ParenthesisNode(node2))), node]);
      }
      getToken();
      const node = parseUnary();
      let node2 = parseConsecutiveMultipleWithoutParenthesis();
      // For case sin^{-1}x
      if (node2.isSymbolNode) {
        node2 = new ParenthesisNode(node2);
      }
      return new OperatorNode('^', 'pow', [(new LatexFunctionNode(name, node2)), node]);
    } else if (Functions[name] && tokenTypes === TOKENTYPE.NUMBER) {
      const cst = new ConstantNode(token, 'number');
      getToken();
      if (tokenTypes === TOKENTYPE.SYMBOL) {
        const symb = new SymbolNode(token);
        getToken();
        return new LatexFunctionNode(name, new ParenthesisNode(new OperatorNode('*', 'multiply', [cst, symb])));
      }
      return new LatexFunctionNode(name, new ParenthesisNode(cst));
    } else if (Functions[name] && tokenTypes === TOKENTYPE.SYMBOL) {
      const node = new LatexFunctionNode(name, new ParenthesisNode(new SymbolNode(token)));
      getToken();
      return node;
    } else if (name === 'log') {
      // Log with root
      if (token === '_') {
        let logRoot;
        const nextChar = preview(1);
        if (isDigit(nextChar)) {
          logRoot = new ConstantNode(nextChar, 'number');
          next();
          getToken();
        } else {
          getToken();
          if (token === '{') {
            logRoot = parseParentheses();
          } else if (tokenTypes === TOKENTYPE.SYMBOL) {
            logRoot = new SymbolNode(token);
            getToken();
          } else if (tokenTypes === TOKENTYPE.NUMBER) {
            logRoot = new ConstantNode(token, 'number');
            getToken();
          } else {
            console.log('Error?');
          }
        }
        if (token === '{' || token === '(') {
          contentNode = parseParentheses();
        } else if (tokenTypes === TOKENTYPE.SYMBOL) {
          contentNode = new SymbolNode(token);
          getToken();
        } else if (tokenTypes === TOKENTYPE.NUMBER) {
          contentNode = new ConstantNode(token, 'number');
          getToken();
        }
        return new LogNode(contentNode, logRoot);
      }
    } else {
      throw new Error('\\Latex function without parenthese');
    }
    return new LatexFunctionNode(name, contentNode);
  }
  return parseSymbol();
}

function parseSymbol() {
  let name;

  if (tokenTypes === TOKENTYPE.SYMBOL) {
    name = token;
    getToken();
    return new SymbolNode(name);
  }
  return parseNumber();
}

function parseNumber() {
  let number;

  if (tokenTypes === TOKENTYPE.NUMBER) {
    number = token;
    getToken();
    return new ConstantNode(number, 'number');
  }

  return parseAbs();
}

function parseAbs() {
  if (token === 'l|') {
    getToken();
    const node = parseAssignment();
    if (token !== 'r|') {
      throw new Error('Abs | expected');
    }
    getToken();
    return new AbsNode(node);
  }
  return parseBrackets();
}

function parseBrackets() {
  if (token === '[') {
    getToken();
    const node = parseAssignment();
    if (token !== ']') {
      throw new Error('Bracket ] expected');
    }
    getToken();
    return new ParenthesisNode(node);
  }
  return parseParentheses();
}

function parseParentheses() {
  let node;
  if (token === '(') {
    getToken();
    node = parseAssignment();
    if (token !== ')') {
      throw new Error('Parenthesis ) expected');
    }
    getToken();
    return new ParenthesisNode(node);
  }

  if (token === '{') {
    getToken();
    node = parseAssignment();
    if (token !== '}') {
      throw new Error('Parenthesis } expected');
    }
    getToken();
    return new ParenthesisNode(node);
  }
  return parseEnd();
}

function parseEnd() {
  throw new Error('Unexpected expression');
}

function compute(exp) {
  if (hasChinese(exp)) {
    throw new Error('Engine Error, Input Has Chinese Characters');
  }
  // Error control and why it can't handle null case
  if (!exp) {
    return '';
  }
  expression = exp;
  let result;
  try {
    result = parseStart().toSympy();
  } catch (err) {
    throw err;
  }
  return result;
}

function hasChinese(exp) {
  const illegalChars = ['。', '？', '！', '，', '、', '；', '：', '「', '」', '『',
    '』', '‘', '’', '“', '”', '（', '）', '〔', '〕', '【', '】', '—', '…', '–',
    '．', '《', '》', '〈', '〉'];
  const illegalCharsRegFormat = `\\u${illegalChars.map(elem => elem.charCodeAt(0)
    .toString(16)).join('\\u')}`;
  const chineseReg = new RegExp(`[\\u4E00-\\u9FFF${illegalCharsRegFormat}]+`, 'g');
  return chineseReg.test(exp);
}

exports.compute = compute;
