const translation = {
	"^" : "**"
}

function OperatorNode(op, fn, args){
	this.op = op
	this.fn = fn
	this.args = args || [];
}

OperatorNode.prototype.toSympy =  function (){
	let op = translation[this.op] ? translation[this.op] : this.op
	let left = this.args[0] ? this.args[0].toSympy() : ""
	let right = this.args[1] ? this.args[1].toSympy() : ""
	if(!this.args[1]){
		return '('+op+left+')'
	}
	return '('+left+op+right+')'
}

OperatorNode.prototype.type = 'OperatorNode'
OperatorNode.prototype.isOperatorNode = true

module.exports = OperatorNode
