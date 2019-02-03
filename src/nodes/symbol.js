

function SymbolNode(name) {
  this.name = name;
}

SymbolNode.prototype.toSympy = function toSympy() {
  if (this.name === 'e') {
    return 'exp(1)';
  }
  if (this.name === 'i') {
    return 'I';
  }
  return this.name;
};

SymbolNode.prototype.type = 'SymbolNode';
SymbolNode.prototype.isSymbolNode = true;

module.exports = SymbolNode;
