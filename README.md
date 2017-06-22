# Javascript FHIR Validator

A javascript FHIR (www.hl7.org/fhir/) validator for use with json or strings that conform to the FHIR 3 standard.

## Usage

### Node

```javascript
var fhir = require('fhir-validator'),
	resource,
	result;

// Your resource to validate (as json or a string)
resource = {
	resourceType: 'Medication',
	invalidProperty: 'This property is invalid for medications'
};

// Run the validation on the resource
result = fhir.validate(resource);

// Use the validation result
if(result.errors.length > 0) {
	throw { errors: result.errors, message: 'The given resource is invalid. There were ' + result.errors.length + ' errors.' };
}

```
