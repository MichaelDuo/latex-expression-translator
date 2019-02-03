function ConstantNode(value, valueType) {
  this.value = value;
  this.valueType = valueType || 'string';
}

ConstantNode.prototype.toSympy = function toSympy() {
  return `${this.value}`;
};

ConstantNode.prototype.type = 'ConstantNode';
ConstantNode.prototype.isConstantNode = true;

module.exports = ConstantNode;
