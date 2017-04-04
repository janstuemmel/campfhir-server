function Memory() {
  this.resources = [];
}

Memory.prototype.add = function(resource) {
  this.resources.push(resource);
}

Memory.prototype.get = function(limit) {
  return this.resources;
}

module.exports = new Memory;
