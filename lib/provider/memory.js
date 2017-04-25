const { find, take, filter } = require('lodash');

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


Memory.prototype.getByType = function(type, limit = 20) {

  var resources = filter(this.resources, (r) => {
    return r.resourceType === type;
  });

  if (!limit) {
    return resources;
  }

  return take(resources, limit);
}

Memory.prototype.getById = function(id) {

  const resource = find(this.resources, (e) => {
    return e.id === id;
  });

  return resource || null;
}

module.exports = new Memory;
