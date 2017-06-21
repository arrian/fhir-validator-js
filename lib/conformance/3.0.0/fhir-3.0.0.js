var _ = require('lodash'),
	schema = require('./schema.json');

_.forOwn(schema.resources, function(resource, resourceName) {
	resource.types = _.merge(resource.types, schema.types);
});

module.exports = {
	types: schema.types,
	resources: schema.resources
}
