

function ParenthesisNode(content) {
  this.content = content;
}

ParenthesisNode.prototype.toSympy = function toSympy() {
  const c = this.content.toSympy();
  return `(${c})`;
};

ParenthesisNode.prototype.type = 'ParenthesisNode';
ParenthesisNode.prototype.isParenthesisNode = true;

module.exports = ParenthesisNode;
