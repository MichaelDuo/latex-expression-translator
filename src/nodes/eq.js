

function EqNode(left, right) {
  this.left = left;
  this.right = right;
}

EqNode.prototype.toSympy = function toSympy() {
  const left = this.left.toSympy();
  const right = this.right.toSympy();
  return `${left}-(${right})`;
};

EqNode.prototype.type = 'EqNode';
EqNode.prototype.isEqNode = true;

module.exports = EqNode;
