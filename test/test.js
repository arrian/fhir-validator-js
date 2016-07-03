var assert = require('chai').assert,
	fhir = require('../lib/fhir-validator'),
	_ = require('lodash');

// Sample Resources
var validMedicationStatements = ['./examples/medicationstatementexample1.json',
								'./examples/medicationstatementexample2.json',
								'./examples/medicationstatementexample4.json',
								'./examples/medicationstatementexample5.json',
								'./examples/medicationstatementexample6.json',
								'./examples/medicationstatementexample7.json'];


describe('FHIR Validator', function() {
  
  describe('Medication statement validation', function () {
    it('should not give any errors for valid medication statements', function () {
    	var medicationStatement,
    		result;

    	_.forEach(validMedicationStatements, function(medicationStatementFile) {
    		medicationStatement = require(medicationStatementFile);
    		result = fhir.validate(medicationStatement, 'MedicationStatement');
    		console.log(result);
    		assert.equal(0, result.errors.length, result.errors);
    	});
    });
  });


});