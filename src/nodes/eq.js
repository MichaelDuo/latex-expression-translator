'use strict'
function EqNode(left, right){
	this.left = left
  this.right = right
}

EqNode.prototype.toSympy = function() {
	var left = this.left.toSympy()
  var right = this.right.toSympy()
	return `${left}-(${right})`
}

EqNode.prototype.type = 'EqNode'
EqNode.prototype.isEqNode = true

module.exports = EqNode
