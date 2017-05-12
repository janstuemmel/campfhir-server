const { find, take, filter, get, forEach, concat, forIn } = require('lodash');

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

Memory.prototype.getBy = function(rules = []) {

  var resources = concat([], this.resources);

  forEach(rules, (func) => {

    resources = filter(resources, func);

  });

  return resources;
}

Memory.prototype.getByType = function(type, filter_rules, limit = 20) {

  var resources = filter(this.resources, (r) => {
    return r.resourceType === type;
  });

  resources = filter(resources, filter_rules);

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
