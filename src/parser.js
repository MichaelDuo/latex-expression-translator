'use strict'
const ConstantNode = require('./node/ConstantNode.js')
const SymbolNode = require('./node/SymbolNode.js')
const OperatorNode = require('./node/OperatorNode.js')
const ParenthesisNode = require('./node/ParenthesisNode.js')
const LatexFunctionNode = require('./node/LatexFunctionNode.js')
const AbsNode = require('./node/AbsNode.js')
const RootNode = require('./node/RootNode.js')
const LogNode = require('./node/LogNode.js')
const EqNode = require('./node/EqNode.js')
const errors = require('../../error')
const EngineError = require('../../error').EngineError
const _ = require('lodash')

const TOKENTYPE = {
	NULL: 0,
	DELIMITER: 1,
	NUMBER: 2,
	SYMBOL: 3,
	UNKNOWN: 4,
	LATEX: 5,
	FUNCTION: 6,
	LATEX_FUNCTION: 7,
	LATEX_SYMBOL: 8
}

const DELIMITERS = {
    ',': true,
    '(': true,
    ')': true,
    '[': true,
    ']': true,
    '\"': true,
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
		'_': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true,

    '<<': true,
    '>>': true,
    '>>>': true
}

const VARS = {
	"x": true,
	"y": true,
	"z": true,
	"a": true,
	"b": true,
	"c": true,
	"i": true,
	"e": true
}

//Latex Functions
const LatexFunction = {
	"\\frac": {token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\cdot": {token_type: TOKENTYPE.DELIMITER},
	"\\sqrt": {tokenEqv:"sqrt", token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\sin": {tokenEqv:"sin" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\cos": {tokenEqv:"cos" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\tan": {tokenEqv:"tan" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\arcsin": {tokenEqv:"asin" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\sec": {tokenEqv:"sec" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\arccos": {tokenEqv:"acos" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\csc": {tokenEqv:"csc" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\arctan": {tokenEqv:"atan" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\cot": {tokenEqv:"cot" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\lg": {tokenEqv:"log" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\log": {tokenEqv:"log" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\ln": {tokenEqv:"ln" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\sh": {tokenEqv:"sinh" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\ch": {tokenEqv:"cosh" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\sinh": {tokenEqv:"sinh" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\cosh": {tokenEqv:"cosh" ,token_type: TOKENTYPE.LATEX_FUNCTION},
	"\\pi": {tokenEqv: "pi", token_type: TOKENTYPE.SYMBOL},
	"\\infty": {tokenEqv: "oo", token_type: TOKENTYPE.SYMBOL},
	"\\left|": {tokenEqv: "l|", token_type: TOKENTYPE.DELIMITER},
	"\\right|": {tokenEqv: "r|", token_type: TOKENTYPE.DELIMITER}
}

//Also Latex Functions but without '\' at the start
const Functions = {
	"sin": true,
	"cos": true,
	"tan": true,
	"cot": true,
	"sec": true,
	"csc": true,
	"asin": true,
	"acos": true,
	"atan": true,
	"arcsin": "asin",
	"arccos": "acos",
	"arctan": "atan",
	"lg": "log",
	"log": "log",
	"ln": "ln",
	"sh": "sinh",
	"sinh": "sinh",
	"ch": "cosh",
	"cosh": "cosh",
	"infty": "oo"
}

var extra_nodes = {}
var expression = ''
var index = 0
var c = ''
var token = ''
var token_type = TOKENTYPE.NULL
var nesting_level = 0
var conditional_level = null;

function first(){
	index = 0
	c=expression.charAt(0)
	nesting_level = 0
	conditional_level = null
}

function next(count=1){
	for(let i=0; i<count; i++){
		index++
		c=expression.charAt(index)
	}
}

function preview(count){
	return expression.substr(index, count)
}

function openParams(){
	nesting_level++
}

function closeParams(){
	nesting_level--
}

function getToken(){
	token_type = TOKENTYPE.NULL
	token = ''

	while(c==' '||c=='\t'){
		//Skipping white space
		next()
	}

	if(c==''){
		token_type = TOKENTYPE.DELIMITER
		return;
	}

	//Recognizing delimiters with length 3
	var c2 = preview(2)
	var c3 = preview(3)
	var c4 = preview(4)
	var c5 = preview(5)
	var c6 = preview(6)

	if(c6.length ==6 && Functions[c6]){
		token_type = TOKENTYPE.LATEX_FUNCTION
		token = c6
		if(typeof Functions[c6] === "string"){
			token = Functions[c6]
		}
		next(6)
		return
	}

	if(c4.length ==4 && Functions[c4]){
		token_type = TOKENTYPE.LATEX_FUNCTION
		token = c4
		next(4)
		return
	}

	if(c3.length == 3 && DELIMITERS[c3]){
		token_type = TOKENTYPE.DELIMITER
		token=c3;
		next(3)
		return
	}

	if(c3.length == 3 && Functions[c3]){
		token_type = TOKENTYPE.LATEX_FUNCTION
		token=c3
		next(3)
		return
	}

	if (c2.length == 2 && Functions[c2]) {
		token_type = TOKENTYPE.LATEX_FUNCTION
		token = Functions[c2]
		next(2)
		return
	}

	//Recognizing delimiters with length 2
  if (c2.length == 2 && DELIMITERS[c2]) {
    token_type = TOKENTYPE.DELIMITER;
    token = c2;
    next(2);
    return;
  }

	//Recognizing delimiters with length 1
  if (DELIMITERS[c]) {
    token_type = TOKENTYPE.DELIMITER;
    token = c;
    next();
    return;
  }

	if(isDigitOrDot(c)){
		token_type = TOKENTYPE.NUMBER
		if(c=='.'){
			token+=c;
			next()

			if(!isDigit(c)){
				token_type = TOKENTYPE.UNKNOWN
			}
		} else {
			while(isDigit(c)){
				token+=c
				next()
			}
			if(c=='.'){
				token+=c
				next()
			}
		}
		while(isDigit(c)){
			token+=c
			next()
		}
		c2 = preview(2)
		if((c=='E' || c=='e') && (isDigit(c2) || c2=='-' || c2=='+')){
			token += c
			next()
			if(c=='+' || c=='-'){
				token += c
				next()
			}
			if(!isDigit(c)){
				//Tes this condition
				token_type = TOKENTYPE.UNKNOWN
			}
			while(isDigit(c)){
				token+=c
				next()
			}
		}
		return
	}

	//Checking Latex Expression
	if(c=="\\"){
		while(currentIsAlpha() && !LatexFunction[token]){
			token+=c
			next()
		}
		token_type = LatexFunction[token] ? LatexFunction[token].token_type : TOKENTYPE.UNKNOWN
		//Could be a bug
		if(token_type!=TOKENTYPE.UNKNOWN){
			//translate to token without
			token = LatexFunction[token].tokenEqv ? LatexFunction[token].tokenEqv : token
		}
		return
	}

	//what if it's sin and we need to support s as a variable?
	if(isVar(c)){
		token = c
		token_type = TOKENTYPE.SYMBOL
		next()
		return
	}

	if(currentIsAlpha()){
		//Why it needs to check is digit? somthing like a3b ???
		while(currentIsAlpha() || isDigit(c)){
			token+=c
			next()
		}
		token_type = TOKENTYPE.SYMBOL
		return
	}

	token_type = TOKENTYPE.UNKNOWN
	while(c!=''){
		token+=c
		next()
	}
	throw new Error("Syntax error in part '"+token+"'")

}

function isDigitOrDot(c){
	return ((c>='0' && c<='9') || c== '.')
}

function isDigit(c){
	return (c>='0' && c<='9')
}

function isVar(c){
	return VARS[c]
}

function currentIsAlpha () {
	// http://unicode-table.com/en/
	// http://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
	//
	// Note: In ES6 will be unicode aware:
	//   http://stackoverflow.com/questions/280712/javascript-unicode-regexes
	//   https://mathiasbynens.be/notes/es6-unicode-regex
	var cPrev = expression.charAt(index - 1);
	var cNext = expression.charAt(index + 1);

	var isValidLatinOrGreek = function (p) {
		//Added \\ to fit regular expression
		return /^[a-zA-Z_\u00C0-\u02AF\u0370-\u03FF\\]$/.test(p);
	};

	var isValidMathSymbol = function (high, low) {
		return /^[\uD835]$/.test(high) &&
			/^[\uDC00-\uDFFF]$/.test(low) &&
			/^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(low);
	};

	var isAbs = function (c) {
		return /^\|$/.test(c)
	}

	return isValidLatinOrGreek(c)
		|| isValidMathSymbol(c, cNext)
		|| isValidMathSymbol(cPrev, c)
		|| isAbs(c)
}


function parseStart(){
	expression = expression.replace(/{/g, '{')
	expression = expression.replace(/}/g, '}')
	expression = expression.replace(/\\left\(/g, '(');
	expression = expression.replace(/\\right\)/g, ')')
	expression = expression.replace(/\\left\[/g, '[');
	expression = expression.replace(/\\right\]/g, ']')
	expression = expression.replace(/\\cdot/g, '*')
	expression = expression.replace(/\\times/g, '*')
	expression = expression.replace(/\\dfrac/g, '\\frac')
	expression = expression.replace(/X/g, 'x')
	expression = expression.replace(/\s/g, '')
	expression = _.trim(expression)
	first()
	getToken()
	var node = parseBlock()
	return node
}

function parseBlock(){
	var node
	if(token == ''){
		//Return new node
		return
	}
	node = parseAssignment()
	return node;
}

function parseAssignment(){
	var node = parseEquation()
	return node
}

function parseEquation(){
	var node1 = parseAddSubtract()
	if(token === "="){
		getToken()
		var node2 = parseAddSubtract()
		return new EqNode(node1, node2)
	}
	return node1
}

function parseAddSubtract(){
	var node, operators, name, fn, params
	node = parseMultiplyDivide()
	operators = {
		'+': 'add',
		'-': 'subtract'
	}
	while(token in operators){
		name = token
		fn = operators[name]
		getToken()
		params = [node, parseMultiplyDivide()]
		node = new OperatorNode(name, fn, params)
	}
	return node
}


function parseMultiplyDivide (){
	var node, last, operators, name, fn
	node = parseConsecutiveMultiple()
	last = node
	operators = {
		"*": "multiply",
		"/": "divide",
	}
	while(true){
		if(token in operators){
			name = token
			fn = operators[name]
			getToken()
			last = parseConsecutiveMultiple()
			node = new OperatorNode(name, fn, [node, last])
		}
		else {
			break
		}
	}
	return node;
}

function parseConsecutiveMultiple(){
	var node, last, operators, name, fun
	node = parseConsecutiveMultipleWithoutParenthesis()
	last = node
	while(true){
		if((token == '(') || (token=='l|')){
					last = parseConsecutiveMultipleWithoutParenthesis()
					node = new OperatorNode("*", 'multiply', [node, last])
		} else {
			break
		}
	}
	return node
}

function parseConsecutiveMultipleWithoutParenthesis(){
	var node, last, operators, name, fun
	node = parseUnary()
	last = node
	while(true){
		if((token_type == TOKENTYPE.SYMBOL) ||
				(token_type == TOKENTYPE.LATEX_FUNCTION) ||
				(token_type == TOKENTYPE.NUMBER && !last.isConstantNode) ||
				(token=='l|') //??? really?
			){
					last = parseUnary()
					node = new OperatorNode("*", 'multiply', [node, last])
		} else {
			break
		}
	}
	return node
}

//+3
function parseUnary(){
	var name, params
	var fn = {
		'-': 'unaryMinus',
		'+': 'unaryPlus'
	}[token]

	name = token
	if(fn){
		getToken()
		params = [parseUnary()]
		return new OperatorNode(name, fn, params)
	}

	return parsePow()
}

function parsePow(){
	var node, name, fn, params;
	node = parseLatexFrac()

	if(token == "^"){
		name = token
		fn = 'pow'

		getToken()
		params = [node, parseUnary()]
		node = new OperatorNode(name, fn, params)
	}
	return node
}

//Latex elements
function parseLatexFrac() {
	if(token == "\\frac"){
		var numerator
		var denominator
		getToken()
		if(token=="{"){
			numerator = parseParentheses()
		} else {
			throw new Error("\\frac expecting {")
		}
		if(token == "{"){
			denominator = parseParentheses()
		} else {
			throw new Error("\\frac expecting second {")
		}
		return new OperatorNode("/", "divide", [numerator, denominator])
	}
	return parseLatexRootOf()
}

function parseLatexRootOf(){
	if(token == "sqrt"){
		var rootNode = null
		var contentNode = null
		getToken()
		if(token=="[" || token=="{"){
			if(token=="["){
				rootNode = parseBrackets()
				if(token=="{"){
					contentNode = parseParentheses()
				}
			} else {
				contentNode = parseParentheses()
			}
		} else {
			throw new Error("sqrt expecting [ or {")
		}
		if(!rootNode){
			return new LatexFunctionNode("sqrt", contentNode)
		} else {
			return new RootNode(rootNode, contentNode)
		}
	}
	return parseLatexFunction()
}

function parseLatexFunction(){
	if(token_type == TOKENTYPE.LATEX_FUNCTION){
		var name, contentNode
		name = token
		getToken()
		if(token=="{" || token=="("){
			contentNode = parseParentheses()
		} else if(token==="l|"){
			contentNode = parseAbs()
		} else if(token=="^"){
			if(isDigit(c)){
				var node = new ConstantNode(c, 'number')
				next()
				getToken()
				if(token_type===TOKENTYPE.SYMBOL){
					var node2 = parseConsecutiveMultipleWithoutParenthesis()
				} else if(token_type===TOKENTYPE.NUMBER){
					var node2 = parseConsecutiveMultipleWithoutParenthesis()
				} else if(token==="{" || token==="(") {
					var node2 = parseParentheses()
				}
				return new OperatorNode("^", "pow" ,[(new LatexFunctionNode(name, new ParenthesisNode(node2))), node])
			} else {
				getToken()
				var node= parseUnary()
				var node2 = parseConsecutiveMultipleWithoutParenthesis() // Getting trig content //POTENTIAL BUG????
				//For case sin^{-1}x
				if(node2.isSymbolNode){
					node2 = new ParenthesisNode(node2)
				}
				return new OperatorNode("^", "pow" ,[(new LatexFunctionNode(name, node2)), node])
			}
		} else if(Functions[name] && token_type==TOKENTYPE.NUMBER){
			var cst = new ConstantNode(token, 'number')
			getToken()
			if(token_type===TOKENTYPE.SYMBOL){
				var symb = new SymbolNode(token)
				getToken()
				return new LatexFunctionNode(name, new ParenthesisNode(new OperatorNode("*", 'multiply', [cst, symb])))
			} else {
				return new LatexFunctionNode(name, new ParenthesisNode(cst))
			}

		} else if(Functions[name] && token_type==TOKENTYPE.SYMBOL){ //Should be token type symbol not length 1 //Please check type
			var node
			node = new LatexFunctionNode(name, new ParenthesisNode(new SymbolNode(token)))
			getToken()
			return node
		} else if(name==="log"){
			//Log with root
			if(token==="_"){
				var logRoot
				var logContent
				let nextChar = preview(1)
				if(isDigit(nextChar)){
					logRoot = logRoot = new ConstantNode(nextChar, 'number')
					next()
					getToken()
				} else {
					getToken()
					if(token==="{"){
						logRoot = parseParentheses()
					} else if(token_type==TOKENTYPE.SYMBOL) {
						logRoot =  new SymbolNode(token)
						getToken()
					} else if(token_type==TOKENTYPE.NUMBER){
						logRoot = new ConstantNode(token, 'number')
						getToken()
					} else {
						console.log("Error?");
					}
				}
				if(token==="{" || token==="("){
					contentNode = parseParentheses()
				} else if(token_type==TOKENTYPE.SYMBOL){
					contentNode =  new SymbolNode(token)
					getToken()
				} else if(token_type==TOKENTYPE.NUMBER){
					contentNode =  new ConstantNode(token, 'number')
					getToken()
				} else if(token==="l|"){
					console.log("Somthing to worry about?");
				}
				else {
					console.log("Error?");
				}
				return new LogNode(contentNode, logRoot)
			}

		} else {
			throw new Error("\\Latex function without parenthese")
		}
		return new LatexFunctionNode(name, contentNode)
	}
	return parseSymbol()
}

function parseSymbol(){
	var node, name

	if(token_type == TOKENTYPE.SYMBOL){
		name = token
		getToken()
		return new SymbolNode(name)
	}
	return parseNumber()
}

function parseNumber(){
	var number

	if(token_type == TOKENTYPE.NUMBER){
		number = token
		getToken()
		return new ConstantNode(number, 'number')
	}

	return parseAbs()
}

function parseAbs(){
	if(token == 'l|'){
		openParams()
		getToken()
		let node = parseAssignment()
		if(token!='r|'){
			throw new Error("Abs | expected")
		}
		closeParams()
		getToken()
		return new AbsNode(node)
	}
	return parseBrackets()
}

function parseBrackets(){
	if(token == '['){
		openParams()
		getToken()
		let node = parseAssignment()
		if(token!=']'){
			throw new Error("Bracket ] expected")
		}
		closeParams()
		getToken()
		return new ParenthesisNode(node)
	}
	return parseParentheses()
}

function parseSet(){
	if(token=='{'){

	}
}

function parseParentheses(){
	var node
	if(token == '('){
		openParams()
		getToken()
		node = parseAssignment()
		if(token != ')'){
			throw new Error("Parenthesis ) expected")
		}
		closeParams();
		getToken();
		return new ParenthesisNode(node)
	}

	if(token == '{'){
		openParams()
		getToken()
		node = parseAssignment()
		if(token != '}'){
			throw new Error("Parenthesis } expected")
		}
		closeParams();
		getToken();
		return new ParenthesisNode(node)
	}
	return parseEnd()
}

function parseEnd(){
	throw new Error("Unexpected expression")
}

function compute(exp){
	if(hasChinese(exp)){
		throw new EngineError({
			errorType: "CHINESE"
			, message: "输入有误，表达式中不能含有中文字符，不要忘了关闭中文输入法噢"
		})
	}
	//Error control and why it can't handle null case
	if(!exp){
		return ""
	}
	expression = exp
	let result
	try {
		result = parseStart().toSympy()
	} catch(err) {
		throw new errors.InputError({
			errorType: "INPUTERROR"
			, message: "输入有误"
		})
	}
	return result
}

function hasChinese(exp){
	let illegalChars = ["。", "？", "！", "，", "、", "；", "：", "「", "」", "『"
	, "』", "‘", "’", "“", "”", "（", "）", "〔", "〕", "【", "】", "—", "…", "–"
	, "．", "《", "》", "〈", "〉"]
	let illegalCharsRegFormat = "\\u"+illegalChars.map(elem=>elem.charCodeAt(0)
															.toString(16)).join('\\u')
	let chineseReg = new RegExp(`[\\u4E00-\\u9FFF${illegalCharsRegFormat}]+`,"g")
	return chineseReg.test(exp)
}

exports.compute = compute
