var _ = require('lodash'),
	util = require('util'),
	EXTENSION_PATTERN = { '^_': { '$ref': '#/types/Extensions' } };

var profiles = require('./profiles-resources.json');

function log(item) {
	console.log(util.inspect(item, {showHidden: false, depth: null}));
}

function Types() {
	var _this = this,
		arraySuffix = 'Array';

	this.types = [];
	this.reference = {};

	this.getTypeReference = function(typeName) {
		return '#/types/' + typeName;
	}

	this.getTypeFromReference = function(typeReference) {
		return typeReference.replace('#/types/', '');
	}

	this.addType = function(name, type, properties) {
		_this[name] = _.merge(type, properties);
		_this.types.push(name);
		_this.reference[name] = { $ref: _this.getTypeReference(name) };
		

		_this[name + arraySuffix] = {
			type: 'array',
			items: _this.reference[name]
		}
		_this.types.push(name + arraySuffix);
		_this.reference[name + arraySuffix] = { $ref: _this.getTypeReference(name + arraySuffix) };

		return _this[name];
	};

	this.addObjectType = function(name, properties, required, allowAdditionalProperties) {
		return _this.addType(name, { type: 'object' }, {
			properties: properties || {},
			patternProperties: EXTENSION_PATTERN,
			required: required || [],
			additionalProperties: !!allowAdditionalProperties
		});
	};

	this.toJSON = function() {
		var result = {};

		_.each(this.types, function(type) {
			result[type] = _this[type];
		});

		return result;
	}
}

function Resource(structureDefinition, types) {
	var _this = this;

	// log(structureDefinition)

	this.title = structureDefinition.name;

	this.cleanTypeName = function(name) {
		return name.replace(/\b./g, function(m){ return m.toUpperCase(); }).replace(/\./g,'');
	}

	this.groupProperties = function(properties) {
		var result = {};
		_.each(properties, function(property) {
			if(property.path.indexOf('[x]') > -1) {
				_.each(property.type, function(type) {
					var name = type.code;
					name = name.charAt(0).toUpperCase() + name.slice(1);
					_.set(result, property.path.replace('[x]', name), { _definition: _.merge({}, property, { type: [type] }) });
				});
			} else {
				_.set(result, property.path, { _definition: property });
			}
		});
		return result[this.title];
	};

	this.createObjectProperty = function(name, target, properties) {
		var objectType = this.types.addObjectType(name);

		_.each(properties, function(property, propertyName) {
			if(propertyName === '_definition') return;
			if(!property._definition || !property._definition.type) {
				console.log('warning: no type definition for \'' + propertyName + '\' in object ' + name);
				return;
			}
			_this.addProperty(propertyName, objectType, property);
		});

		return this.types.reference[name];
	};

	this.createObjectArrayProperty = function(name, target, properties) {
		this.createObjectProperty(name, target, properties);
		return this.types.reference[name + 'Array'];
	};

	this.addProperty = function(name, target, property) {
		var type = property._definition.type;

		if(!type.length) {
			throw new Error('empty types ' + property);
		}

		if(property._definition.min === 1 && type.length <= 1) target.required.push(name);

		type = type[0].code;

		if(type === 'id') type = '_id';
		if(property._definition.max === '*') type += 'Array';

		if(type === 'BackboneElement') {
			target.properties[name] = this.createObjectProperty(this.cleanTypeName(property._definition.path), target, property);
		} else if(type === 'BackboneElementArray') {
			target.properties[name] = this.createObjectArrayProperty(this.cleanTypeName(property._definition.path), target, property);
		} else if(types.reference[type]) {
			target.properties[name] = types.reference[type];
		} else {
			console.log('missing ' + name + ' with type '+ type);
		}
	};

	var properties = structureDefinition.snapshot.element,
		grouping = this.groupProperties(properties);

	this.properties = {};
	this.patternProperties = EXTENSION_PATTERN;
	this.required = ['resourceType'];
	this.types = new Types();
	this.baseDefinition = structureDefinition.baseDefinition;

	this.properties.resourceType = { enum: [this.title] };

	_.each(grouping, function(propertyGroup, propertyName) {
		if(propertyName === '_definition') {
			return;
		}

		if(!propertyGroup._definition) {
			console.log('no definition for ' + propertyName);
			return;
		}

		_this.addProperty(propertyName, _this, propertyGroup);
	});

	// console.log('base definition:');
	// console.dir(structureDefinition.baseDefinition);

	

	this.toJSON = function() {
		return {
			title: this.title,
			type: 'object',
			additionalProperties: false,
			properties: this.properties,
			patternProperties: this.patternProperties,
			required: this.required,
			types: this.types.toJSON()
		};
	};
}

function Conformance(version) {
	var _this = this;

	// this.resources = [];
	this.resources = {};
	this.types = new Types();
	this.version = version;

	this.addResource = function(structureDefinition) {
		var resource = new Resource(structureDefinition, _this.types);
		_this.resources[resource.title] = resource;
	};

	this.mergeBaseDefinitions = function() {

	};

	this.toJSON = function() {
		return {
			resources: _.mapValues(this.resources, function(resource) { return resource.toJSON(); }),
			types: this.types.toJSON()
		}
	}
}

var conformance = new Conformance('1.0.2'),
	types = conformance.types,
	ref = types.reference;

types.addType('boolean', { type: 'boolean' });
types.addType('string', { type: 'string' });
types.addType('decimal', { type: 'number' });
types.addType('integer', { type: 'integer' });
types.addType('uri', ref.string);
types.addType('unsignedInt', ref.integer, { minimum: 0 });
types.addType('positiveInt', ref.integer, { minimum: 1 });
types.addType('_id', ref.string, { pattern: '[A-Za-z0-9-.]{1,64}' });
types.addType('oid', ref.string, { pattern: 'urn:oid:[0-2](\.[1-9]\d*)+' });
types.addType('markdown', ref.string);
types.addType('xhtml', ref.string);
types.addType('base64Binary', ref.string);
types.addType('instant', ref.string);
types.addType('date', ref.string, { pattern: '-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?' });
types.addType('dateTime', ref.string, { pattern: '-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?' });
types.addType('time', ref.string, { pattern: '([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?' });

types.addType('code', ref.string, { pattern: '[^\s]+([\s]+[^\s]+)*' });
types.Code = function(values) {
	return _.merge({}, ref.code, {
		enum: values
	});
}

types.addObjectType('Reference', {
	reference: ref.string,
	display: ref.string
});

types.addObjectType('Attachment', {
	contentType: ref.code,
	language: ref.code,
	data: ref.base64Binary,
	url: ref.uri,
	size: ref.unsignedInt,
	hash: ref.base64Binary,
	title: ref.string,
	creation: ref.dateTime
});
types.addObjectType('Coding', {
	system: ref.uri,
	version: ref.string,
	code: ref.code,
	display: ref.string,
	userSelected: ref.boolean
});
types.addObjectType('CodeableConcept', {
	coding: ref.CodingArray,
	text: ref.string
});
types.addObjectType('Quantity', {
	value: ref.decimal,
	comparator: types.Code(['<','<=','>=','>']),
	unit: ref.string,
	system: ref.uri,
	code: ref.code
});

types.addType('Age', ref.Quantity);
types.addType('Count', ref.Quantity);
types.addType('Money', ref.Quantity);
types.addType('Distance', ref.Quantity);
types.addType('Duration', ref.Quantity);
types.addType('SimpleQuantity', ref.Quantity);

types.addObjectType('Range', {
	low: ref.SimpleQuantity,
	high: ref.SimpleQuantity
});
types.addObjectType('ReferenceRange', {
	low: ref.SimpleQuantity,
	high: ref.SimpleQuantity,
	meaning: ref.CodeableConcept,
	age: ref.Range,
	text: ref.string
});
types.addObjectType('Ratio', {
	numerator: ref.Quantity,
	denominator: ref.Quantity
});
types.addObjectType('Period', {
	start: ref.dateTime,
	end: ref.dateTime
});
types.addObjectType('SampledData', {
	origin: ref.SimpleQuantity,
	period: ref.decimal,
	factor: ref.decimal,
	lowerLimit: ref.decimal,
	upperLimit: ref.decimal,
	dimensions: ref.positiveInt,
	data: ref.string
});
types.addObjectType('Identifier', {
	use: types.Code(['usual', 'official', 'temp', 'secondary']),
	assigner: ref.Reference,
	type: ref.CodeableConcept,
	system: ref.uri,
	value: ref.string,
	period: ref.Period
});
types.addObjectType('HumanName', {
	use: types.Code(['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden']),
	text: ref.string,
	family: ref.string,
	given: ref.stringArray,
	prefix: ref.stringArray,
	suffix: ref.stringArray,
	period: ref.Period
});
types.addObjectType('Address', {
	use: types.Code(['home', 'work', 'temp', 'old']),
	type: types.Code(['postal', 'physical', 'both']),
	text: ref.string,
	line: ref.stringArray,
	city: ref.string,
	district: ref.string,
	state: ref.string,
	postalCode: ref.string,
	country: ref.string,
	period: ref.Period
});
types.addObjectType('ContactPoint', {
	system: types.Code(['phone', 'fax', 'email', 'pager', 'other']),
	value: ref.string,
	use: types.Code(['home', 'work', 'temp', 'old', 'mobile']),
	rank: ref.positiveInt,
	period: ref.Period
});
types.addObjectType('Repeat', {
	boundsDuration: ref.Duration,
	boundsRange: ref.Range,
	boundsPeriod: ref.Period,
	count: ref.integer,
	countMax: ref.integer,
	duration: ref.decimal,
	durationMax: ref.decimal,
	durationUnit: types.Code(['s', 'min', 'h', 'd', 'wk', 'mo', 'a']),
	frequency: ref.integer,
	frequencyMax: ref.integer,
	period: ref.decimal,
	periodMax: ref.decimal,
	periodUnit: types.Code(['s', 'min', 'h', 'd', 'wk', 'mo', 'a']),
	dayOfWeek: ref.codeArray,
	timeOfDay: ref.time,
	when: types.Code(['HS', 'WAKE', 'C', 'CM', 'CD', 'CV', 'AC', 'ACM', 'ACD', 'ACV', 'PC', 'PCM', 'PCD', 'PCV']),
	offset: ref.CodeableConcept
});
types.addObjectType('Timing', {
	event: ref.dateTimeArray,
	repeat: ref.Repeat,
	code: ref.CodeableConcept
});
types.addObjectType('Signature', {
	type: ref.CodingArray,
	when: ref.instant,
	whoUri: ref.uri,
	whoReference: ref.Reference,
	contentType: ref.code,
	blob: ref.base64Binary
});
types.addObjectType('Annotation', {
	authorReference: ref.Reference,
	authorString: ref.string,
	time: ref.dateTime,
	text: ref.string
});
types.addObjectType('Narrative', {
	status: types.Code(['generated', 'extensions', 'additional', 'empty']),
	div: ref.xhtml
}, ['status']);
types.addObjectType('Element', {});
types.addObjectType('Extension', {
	url: ref.uri,
	valueInteger: ref.integer,
	valueDecimal: ref.decimal,
	valueDateTime: ref.dateTime,
	valueDate: ref.date,
	valueInstant: ref.instant,
	valueString: ref.string,
	valueUri: ref.uri,
	valueBoolean: ref.boolean,
	valueCode: ref.code,
	valueMarkdown: ref.markdown,
	valueBase64Binary: ref.base64Binary,
	valueCoding: ref.Coding,
	valueCodeableConcept: ref.CodeableConcept,
	valueAttachment: ref.Attachment,
	valueIdentifier: ref.Identifier,
	valueQuantity: ref.Quantity,
	valueRange: ref.Range,
	valuePeriod: ref.Period,
	valueRatio: ref.Ratio,
	valueHumanName: ref.HumanName,
	valueAddress: ref.Address,
	valueContactPoint: ref.ContactPoint,
	valueTiming: ref.Timing,
	valueSignature: ref.Signature,
	valueReference: ref.Reference
}, ['url']);
types.addObjectType('Extensions', {
	extension: ref.ExtensionArray
});
types.addObjectType('Meta', {
	versionId: ref._id,
	lastUpdated: ref.instant,
	profile: ref.uriArray,
	security: ref.CodingArray,
	tag: ref.CodingArray
});
types.addObjectType('ContactDetail', {
	name: ref.string,
	telecom: ref.ContactPointArray
});
types.addObjectType('UsageContext', {
	code: ref.Coding,
	valueCodeableConcept: ref.CodeableConcept,
	valueQuantity: ref.Quantity,
	valueRange: ref.Range
}, ['code']); // TODO: requires value
types.addObjectType('RelatedArtifact', {
	type: types.Code(['documentation', 'justification', 'citation', 'predecessor', 'successor', 'derived-from', 'depends-on', 'composed-of']),
	display: ref.string,
	citation: ref.string,
	url: ref.uri,
	document: ref.Attachment,
	resource: ref.Reference
});
types.addObjectType('Contributor', {
	type: types.Code(['author', 'editor', 'reviewer', 'endorser']),
	name: ref.string,
	contact: ref.ContactDetailArray
});
types.addObjectType('Dosage', {
	sequence: ref.integer,
	text: ref.string,
	additionalInstruction: ref.CodeableConceptArray,
	patientInstruction: ref.string,
	timing: ref.Timing,
	asNeededBoolean: ref.boolean,
	asNeededCodeableConcept: ref.CodeableConcept,
	site: ref.CodeableConcept,
	route: ref.CodeableConcept,
	method: ref.CodeableConcept,
	doseRange: ref.Range,
	doseQuantity: ref.SimpleQuantity,
	maxDosePerPeriod: ref.Ratio,
	maxDosePerAdministration: ref.SimpleQuantity,
	maxDosePerLifetime: ref.SimpleQuantity,
	rateRatio: ref.Ratio,
	rateRange: ref.Range,
	rateQuantity: ref.SimpleQuantity
});
types.addObjectType('ElementDefinition', {});
types.addObjectType('DataRequirement', {});
types.addObjectType('ParameterDefinition', {});
types.addObjectType('TriggerDefinition', {});

// TODO: validate contained resources
types.addObjectType('Resource', {}, false, true);

var structureDefinitions = _.map(_.filter(profiles.entry, function(entry) {
	return entry.resource.resourceType === 'StructureDefinition';
}), function(entry) {
	return entry.resource;
});

_.each(structureDefinitions, function(structureDefinition) {
	conformance.addResource(structureDefinition);
});

var fs = require('fs');
fs.writeFile('schema.json', JSON.stringify(conformance.toJSON()), function(err) {
    if(err) {
        return console.log(err);
    }
});

