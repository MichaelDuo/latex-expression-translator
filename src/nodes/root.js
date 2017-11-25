'use strict'
function RootNode(root, content){
  this.root = root
	this.content = content
}

RootNode.prototype.toSympy = function() {
  let r = this.root.toSympy()
	let c = this.content.toSympy()
	return "(root("+c+","+r+"))"
}

RootNode.prototype.type = 'RootNode'
RootNode.prototype.isRootNode = true

module.exports = RootNode
