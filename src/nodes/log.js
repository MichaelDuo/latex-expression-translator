'use strict'

function LogNode(content, root){
	this.content = content
  this.root = root
}

LogNode.prototype.toSympy = function() {
	var c = this.content.toSympy()
  var r = this.root.toSympy()
	return "(log("+c+","+r+"))"
}

LogNode.prototype.type = 'LogNode'
LogNode.prototype.isLogNode = true

module.exports = LogNode
