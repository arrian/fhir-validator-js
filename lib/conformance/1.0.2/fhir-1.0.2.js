var _ = require('lodash');

var types = {
	unsignedInt: {
		type: 'integer',
		minimum: 0
	},
	code: {
		type: 'string'
	},
	base64Binary: {},
	instant: {
		type: 'number'
	},
	date: {
		pattern: '-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?'
	},
	dateTime: {
		pattern: '-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?'
	},
	time: {
		pattern: '([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?'
	},
	Attachment: {},
	Coding: {},
	CodeableConcept: {},
	Quantity: {},
	Range: {},
	Ratio: {},
	Period: {},
	SampledData: {},
	Identifier: {},
	HumanName: {},
	Address: {},
	ContactPoint: {},
	Timing: {},
	Signature: {},
	Annotation: {},
	Narrative: {},
	Element: {},
	Extension: {},
	Reference: {}
};

var resources = {
	AllergyIntolerance: {
		properties: {
			onset: { $ref: '#/types/dateTime' },
			recordedDate: { $ref: '#/types/dateTime' },
			recorder: { $ref: '#/types/Reference' },
			patient: { $ref: '#/types/Reference' },
			substance: { $ref: '#/types/CodeableConcept' },
			reporter: { $ref: '#/types/Reference' },
			status: { $ref: '#/types/code' },
			criticality: { $ref: '#/types/code' },
			type: { $ref: '#/types/code' },
			category: { $ref: '#/types/code' },
			lastOccurence: { $ref: '#/types/dateTime' },
			note: { $ref: '#/types/Annotation' },
			reaction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						substance: { $ref: '#/types/CodeableConcept' },
						certainty: { $ref: '#/types/code' },
						manifestation: {
							type: 'array',
							items: [{ $ref: '#/types/CodeableConcept' }],
							minItems: 1
						},
						description: { type: 'string' },
						onset: { $ref: '#/types/dateTime' },
						severity: { $ref: '#/types/code' },
						exposureRoute: { $ref: '#/types/CodeableConcept' },
						note: { $ref: '#/types/Annotation' }
					}
				}
			}
		},
		required: ['patient', 'substance']
	},
	Appointment: {
		properties: {
			status: { $ref: '#/types/code' },
			type: { $ref: '#/types/CodeableConcept' },
			reason: { $ref: '#/types/CodeableConcept' },
			priority: { $ref: '#/types/unsignedInt' },
			description: { type: 'string' },
			start: { $ref: '#/types/instant' },
			end: { $ref: '#/types/instant' },
			minutesDuration: { $ref: '#/types/unsignedInt' },
			slot: {
				type: 'array',
				items: [{
					$ref: '#/types/Reference'
				}]
			},
			comment: { type: 'string' },
			participant: {
				type: 'array',
				items: [{
					type: 'object',
					properties: {
						type: {
							type: 'array',
							items: [{
								$ref: '#/types/CodeableConcept'
							}]
						},
						actor: { $ref: '#/types/Reference' },
						required: { $ref: '#/types/code' },
						status: { $ref: '#/types/code' }
					},
					required: [ 'status' ]
				}]
			}
		},
		required: ['status']
	},
	AppointmentResponse: {
		properties: {
			appointment: { $ref: '#/types/Reference' },
			start: { $ref: '#/types/instant' },
			end: { $ref: '#/types/instant' },
			participantType: { 
				type: 'array',
				items: [{
					$ref: '#/types/CodeableConcept'
				}]
			},
			actor: { $ref: '#/types/Reference' },
			participantStatus: { $ref: '#/types/code' },
			comment: { type: 'string' }
		},
		required: ['appointment', 'participantStatus']
	},
	AuditEvent: {
		properties: {},
		required: []
	},
	Basic: {
		properties: {},
		required: []
	},
	Binary: {
		properties: {},
		required: []
	},
	BodySite: {
		properties: {},
		required: []
	},
	Bundle: {
		properties: {},
		required: []
	},
	CarePlan: {
		properties: {},
		required: []
	},
	Claim: {
		properties: {},
		required: []
	},
	ClaimResponse: {
		properties: {},
		required: []
	},
	ClinicalImpression: {
		properties: {},
		required: []
	},
	Communication: {
		properties: {},
		required: []
	},
	CommunicationRequest: {
		properties: {},
		required: []
	},
	Composition: {
		properties: {},
		required: []
	},
	ConceptMap: {
		properties: {},
		required: []
	},
	Condition: {
		properties: {},
		required: []
	},
	Conformance: {
		properties: {},
		required: []
	},
	Contract: {
		properties: {},
		required: []
	},
	Coverage: {
		properties: {},
		required: []
	},
	DataElement: {
		properties: {},
		required: []
	},
	DetectedIssue: {
		properties: {},
		required: []
	},
	Device: {
		properties: {},
		required: []
	},
	DeviceComponent: {
		properties: {},
		required: []
	},
	DeviceMetric: {
		properties: {},
		required: []
	},
	DeviceUseRequest: {
		properties: {},
		required: []
	},
	DeviceUseStatement: {
		properties: {},
		required: []
	},
	DiagnosticOrder: {
		properties: {},
		required: []
	},
	DiagnosticReport: {
		properties: {},
		required: []
	},
	DocumentManifest: {
		properties: {},
		required: []
	},
	DocumentReference: {
		properties: {},
		required: []
	},
	EligibilityRequest: {
		properties: {},
		required: []
	},
	EligibilityResponse: {
		properties: {},
		required: []
	},
	Encounter: {
		properties: {},
		required: []
	},
	EnrollmentRequest: {
		properties: {},
		required: []
	},
	EnrollmentResponse: {
		properties: {},
		required: []
	},
	EpisodeOfCare: {
		properties: {},
		required: []
	},
	ExplanationOfBenefit: {
		properties: {},
		required: []
	},
	FamilyMemberHistory: {
		properties: {},
		required: []
	},
	Flag: {
		properties: {},
		required: []
	},
	Goal: {
		properties: {},
		required: []
	},
	Group: {
		properties: {},
		required: []
	},
	HealthcareService: {
		properties: {},
		required: []
	},
	ImagingObjectSelection: {
		properties: {},
		required: []
	},
	ImagingStudy: {
		properties: {},
		required: []
	},
	Immunization: {
		properties: {},
		required: []
	},
	ImmunizationRecommendation: {
		properties: {},
		required: []
	},
	ImplementationGuide: {
		properties: {},
		required: []
	},
	List: {
		properties: {},
		required: []
	},
	Location: {
		properties: {},
		required: []
	},
	Media: {
		properties: {},
		required: []
	},
	Medication: {
		properties: {
			code: {},
			isBrand: { type: 'boolean' },
			manufacturer: {},
			product: {
				type: 'object',
				properties: {
					form: {},
					ingredient: {
						type: 'array',
						items: {
							item: {},
							amount: {}
						},
						required: ['item']
					},
					batch: {
						type: 'array',
						properties: {
							lotNumber: {},
							expirationDate: {}
						}
					}
				}
			},
			package: {
				type: 'object',
				properties: {
					container: {},
					content: {
						type: 'object',
						properties: {
							item: {},
							amount: {}
						},
						required: ['item']
					}
				}
			}
		},
		required: []
	},
	MedicationAdministration: {
		properties: {},
		required: []
	},
	MedicationDispense: {
		properties: {},
		required: []
	},
	MedicationOrder: {
		properties: {},
		required: []
	},
	MedicationStatement: {
		properties: {},
		required: []
	},
	MessageHeader: {
		properties: {},
		required: []
	},
	NamingSystem: {
		properties: {},
		required: []
	},
	NutritionOrder: {
		properties: {},
		required: []
	},
	Observation: {
		properties: {},
		required: []
	},
	OperationDefinition: {
		properties: {},
		required: []
	},
	OperationOutcome: {
		properties: {},
		required: []
	},
	Order: {
		properties: {},
		required: []
	},
	OrderResponse: {
		properties: {},
		required: []
	},
	Organization: {
		properties: {},
		required: []
	},
	Parameters: {
		properties: {},
		required: []
	},
	Patient: {
		properties: {},
		required: []
	},
	PaymentNotice: {
		properties: {},
		required: []
	},
	PaymentReconciliation: {
		properties: {},
		required: []
	},
	Person: {
		properties: {},
		required: []
	},
	Practitioner: {
		properties: {},
		required: []
	},
	Procedure: {
		properties: {},
		required: []
	},
	ProcedureRequest: {
		properties: {},
		required: []
	},
	ProcessRequest: {
		properties: {},
		required: []
	},
	ProcessResponse: {
		properties: {},
		required: []
	},
	Provenance: {
		properties: {},
		required: []
	},
	Questionnaire: {
		properties: {},
		required: []
	},
	QuestionnaireResponse: {
		properties: {},
		required: []
	},
	ReferralRequest: {
		properties: {},
		required: []
	},
	RelatedPerson: {
		properties: {},
		required: []
	},
	RiskAssessment: {
		properties: {},
		required: []
	},
	Schedule: {
		properties: {},
		required: []
	},
	SearchParameter: {
		properties: {},
		required: []
	},
	Slot: {
		properties: {},
		required: []
	},
	Specimen: {
		properties: {},
		required: []
	},
	StructureDefinition: {
		properties: {},
		required: []
	},
	Subscription: {
		properties: {},
		required: []
	},
	Substance: {
		properties: {},
		required: []
	},
	SupplyDelivery: {
		properties: {},
		required: []
	},
	SupplyRequest: {
		properties: {},
		required: []
	},
	TestScript: {
		properties: {},
		required: []
	},
	ValueSet: {
		properties: {},
		required: []
	},
	VisionPrescription: {
		properties: {},
		required: []
	}
};

// Merge common schema properties with the resources
_.forOwn(resources, function(resource, resourceName) {
	_.merge(resource, {
		title: resourceName,
		type: 'object',
		additionalProperties: false,
		required: ['resourceType'],
		types: types,
		properties: {
			resourceType: {
				enum: [resourceName]
			},
			identifier: { 
				type: 'array',
				items: {
					$ref: '#/types/Identifier'
				}
			}
		}
	});
});

module.exports = {
	types: types,
	resources: resources
}

