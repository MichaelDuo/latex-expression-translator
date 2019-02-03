function LatexFunctionNode(name, contentNode) {
  this.name = name;
  this.contentNode = contentNode;
}

LatexFunctionNode.prototype.toSympy = function toSympy() {
  return this.name + this.contentNode.toSympy();
};

LatexFunctionNode.prototype.type = 'LatexFunctionNode';
LatexFunctionNode.prototype.isLatexFunctionNode = true;

module.exports = LatexFunctionNode;
