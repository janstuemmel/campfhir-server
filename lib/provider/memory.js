const { find, take } = require('lodash');

function Memory() {
  this.resources = [];
}

Memory.prototype.add = function(resource) {
  this.resources.push(resource);
}

Memory.prototype.get = function(limit = 20) {

  if (!limit) {
    return this.resources;
  }

  return take(this.resources, limit);
}

Memory.prototype.getById = function(id) {

  const resource = find(this.resources, (e) => {
    return e.id === id;
  });

  return resource || null;
}

module.exports = new Memory;
