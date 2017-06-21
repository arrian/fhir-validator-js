var _ = require('lodash'),
	Ajv = require('ajv'),
	ajv = new Ajv({ extendRefs: true }),
	conformance = require('./conformance/3.0.0/fhir-3.0.0.js'),
	validateResource = {};

(function(fhir) {
	fhir.conformance = conformance;
	
	_.forOwn(conformance.resources, function(resource, resourceName) {
		validateResource[resourceName] = ajv.compile(resource);
	});

	function ValidationError(message, exception, path) {
	    this.name = "ValidationError";
	    this.message = message || "";
	    this.exception = exception || null;
	    this.path = path;
	}

	fhir.isValidResourceType = function(resourceType) {
		if(_.includes(resourceType, '.')) return false;
		return _.has(conformance.resources, resourceType);
	}

	fhir.validate = function(data, expectedType) {
		var result,
			resource,
			valid;

		result = {
			resource: null,
			errors: []
		};

		// Ensure the expected type argument is actually a valid resource
		if(expectedType && !fhir.isValidResourceType(expectedType)) {
			result.errors.push(new ValidationError('The expected type provided ("' + expectedType + '") is not a valid FHIR resource type'));
			return result;
		}

		// Ensure that the data provided is a javascript object. If it is a string then attempt to parse it
		try {
			if(_.isString(data)) resource = JSON.parse(data);
			else if(_.isPlainObject(data)) resource = data;
			else {
				result.errors.push(new ValidationError('Data provided must be a string or plain javascript object'));
				return result;
			}
			result.resource = resource;
		} catch(e) {
			result.errors.push(new ValidationError('Invalid JSON', e));
			return result;
		}

		if(data && data.resourceType && fhir.isValidResourceType(data.resourceType)) {
			if(!expectedType || expectedType === data.resourceType) {
				var validate = validateResource[data.resourceType];
				validate(data);
				if(validate.errors) result.errors = _.concat(result.errors, validate.errors);
			} else {
				result.errors.push(new ValidationError('The resource provided did not match the expected resource type'));
			}

			
		} else {
			result.errors.push(new ValidationError('Not a valid resource type'));
		}
		return result;
	}


})(typeof module !== 'undefined' && module.exports ? module.exports : this['fhir'] = {});