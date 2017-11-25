'use strict'
function AbsNode(content){
	this.content = content
}

AbsNode.prototype.toSympy = function() {
	var c = this.content.toSympy()
	return "(Abs("+c+"))"
}

AbsNode.prototype.type = 'AbsNode'
AbsNode.prototype.isAbsNode = true

module.exports = AbsNode
