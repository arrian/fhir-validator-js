(function(fhir){

/**
FHIR module.

This is a FHIR definition implementation and resource validator written in javascript.

To validate a json string or object resource:
	fhir.validate(stringOrObject);

To validate a resource:
	new fhir.Medication(data);
**/


// Name for any resource
var ANY = 'Any';

var URI = { _type: 'URI'};
var DATE = { _type: 'Date', _valid: function(value) { return typeof value === 'string' && /^-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?$/.test(value); } };
var STRING = { _type: 'String', _valid: function(value) { return typeof value === 'string'; } };
var DOUBLE = { _type: 'Double'};
var INTEGER = { _type: 'Integer', _valid: function(value) { return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)); } };
var BOOLEAN = { _type: 'Boolean', _valid: function(value) { return typeof value === 'boolean'; } };
var INSTANT = { _type: 'Instant'};
var DECIMAL = { _type: 'Decimal'};
var MIME_TYPE = { _type: 'MimeType'};
var DATE_TIME = { _type: 'DateTime'};
var BASE_64_BINARY = { _type: 'Base64Binary'};
var UNSIGNED_INTEGER = { _type: 'UnsignedInteger'};
var POSITIVE_INTEGER = { _type: 'PositiveInteger'};
var LINK = { _type: 'Link' };
var META = { _type: 'Meta' };
var RATIO = { _type: 'Ratio' };
var RANGE = { _type: 'Range' };
var TIMING = { _type: 'Timing' };
var PERIOD = { _type: 'Period' };
var CODING = { _type: 'Coding' };
var DURATION = { _type: 'Duration' };
var ADDRESS = { _type: 'Address' };
var QUANTITY = { _type: 'Quantity' };
var NARRATIVE = { _type: 'Narrative' };
var EXTENSION = { _type: 'Extension' };
var SIGNATURE = { _type: 'Signature' };
var HUMAN_NAME = { _type: 'HumanName' };
var IDENTIFIER = { _type: 'Identifier' };
var ATTACHMENT = { _type: 'Attachment' };
var ANNOTATION = { _type: 'Annotation' };
var CONTACT_POINT = { _type: 'ContactPoint' };
var SIMPLE_QUANTITY = { _type: 'SimpleQuantity' };
var CODEABLE_CONCEPT = { _type: 'CodeableConcept' };
var CODEABLE_CONCEPT_RESOURCE_TYPE = { _type: 'CodeableConceptResourceType' };

var CODE = function(type) { return { _type: type }; };
var RESOURCE = function(targets) { return { _type: 'Resource', _targets: targets }; };
var REFERENCE = function(targets) { return { _type: 'Reference', _targets: targets }; };
var ARRAY = function(subdefinition) {
	return {
		_type: 'Array',
		definition: subdefinition,
		_valid: function(value){
			return Object.prototype.toString.call(value) === '[object Array]';
		}
	};
};
var OBJECT = function(subdefinition) {
	return {
		_type: 'Object',
		definition: subdefinition,
		_valid: function(value){
			return typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]';
		}
	};
};
var ELEMENT = function(subdefinition) {
	return {
		_type: 'BackboneElement',
		definition: subdefinition,
		_valid: function(value){
			return typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]';
		}
	};
};

var REQUIRED = function(propertyDef) {
	var newPropertyDef = JSON.parse(JSON.stringify(propertyDef));
	newPropertyDef._required = true;
	return newPropertyDef;
};

var OPTION = function(group, subdefinition) {
	return { _type: 'Option', _group: group, definition: subdefinition };
};

var AS_FOR = function(path) {
	return { _type: 'AsFor', _path: path };
}



/**
Code definitions. This is merged with the Definitions as static properties
of the resources.
**/
var Codes = {
	AllergyIntolerance: {
		Status: {
			ACTIVE: 'active',
			UNCONFIRMED: 'unconfirmed',
			CONFIRMED: 'confirmed',
			INACTIVE: 'inactive',
			RESOLVED: 'resolved',
			REFUTED: 'refuted',
			ENTERED_IN_ERROR: 'entered-in-error'
		},
		Criticality: {
			CRITL: 'CRITL', //low risk
			CRITH: 'CRITH', //high risk
			CRITU: 'CRITU' //undetermined
		},
		Type: {
			ALLERGY: 'allergy',
			INTOLERANCE: 'intolerance'
		},
		Category: {
			FOOD: 'food',
			MEDICATION: 'medication',
			ENVIRONMENT: 'environment',
			OTHER: 'other'
		},
		Reaction: {
			Certainty: {
				UNLIKELY: 'unlikely',
				LIKELY: 'likely',
				CONFIRMED: 'confirmed'
			},
			Severity: {
				MILD: 'mild',
				MODERATE: 'moderate',
				SEVERE: 'severe'
			}
		}
	},
	Appointment: {
		Status: {
			PROPOSED: 'proposed',
			PENDING: 'pending',
			BOOKED: 'booked',
			ARRIVED: 'arrived',
			FULFILLED: 'fulfilled',
			CANCELLED: 'cancelled',
			NOSHOW: 'noshow'
		},
		Participant: {
			Required: {
				REQUIRED: 'required',
				OPTIONAL: 'optional',
				INFORMATION_ONLY: 'information-only'
			},
			Status: {
				ACCEPTED: 'accepted',
				DECLINED: 'declined',
				TENTATIVE: 'tentative',
				NEEDS_ACTION: 'needs-action'
			}
		}
	},
	AppointmentResponse: {
		ParticipantStatus: {
			ACCEPTED: 'accepted',
			DECLINED: 'declined',
			TENTATIVE: 'tentative',
			IN_PROCESS: 'in-process',
			COMPLETED: 'completed',
			NEEDS_ACTION: 'needs-action'
		}
	},
	AuditEvent: {
		Event: {
			Action: {
				// Type of action performed during the event
			},
			Outcome: {
				SUCCESS: 'success',
				FAILURE: 'failure'
			}
		},
		AuditEvent: {
			Participant: {
				Network: {
					Type: {
						// The type of network access point
					}
				}
			}
		}
	},
	// Bundle.Type
	// Bundle.Entry.Search.Mode
	// Bundle.Entry.Request.Method
	// CarePlan.Status
	// CarePlan.RelatedPlan.Code
	// CarePlan.Activity.Detail.Status
	MedicationOrder: {
		Status: {
			ACTIVE: 'active',
			ON_HOLD: 'on-hold',
			COMPLETED: 'completed',
			ENTERED_IN_ERROR: 'entered-in-error'
		}
	},
	MedicationStatement: {
		Status: {
			ACTIVE: 'active',
			COMPLETED: 'completed',
			ENTERED_IN_ERROR: 'entered-in-error',
			INTENDED: 'intended'
		}
	}
	// Patient.Gender
	// Patient.Contact.Gender
	// Patient.Link.Type
};


/**
A set of javascript definitions for the FHIR specification.
Each element in the object defines a resource.
**/
var Definitions = {
	AllergyIntolerance: {
		identifier: ARRAY(IDENTIFIER),
		onset: DATE_TIME,
		recordedDate: DATE_TIME,
		recorder: REFERENCE(['Practitioner', 'Patient']),
		patient: REQUIRED(REFERENCE('Patient')),
		reporter: REFERENCE(['Practitioner', 'Patient', 'RelatedPerson']),
		substance: REQUIRED(CODEABLE_CONCEPT),
		status: CODE('AllergyIntolerance.Status'),
		criticality: CODE('AllergyIntolerance.Criticality'),
		type: CODE('AllergyIntolerance.TYPE'),
		category: CODE('AllergyIntolerance.Category'),
		lastOccurence: DATE_TIME,
		note: ANNOTATION,
		reaction: ARRAY(ELEMENT({
			substance: CODEABLE_CONCEPT,
			certainty: CODE('AllergyIntolerance.Reaction.Certainty'),
			manifestation: ARRAY(CODEABLE_CONCEPT),
			description: STRING,
			onset: DATE_TIME,
			severity: CODE('AllergyIntolerance.Reaction.Severity'),
			exposureRoute: CODEABLE_CONCEPT,
			note: ANNOTATION
		}))
	},
	Appointment: {
		identifier: ARRAY(IDENTIFIER),
		status: REQUIRED(CODE('Appointment.Status')),
		type: CODEABLE_CONCEPT,
		reason: CODEABLE_CONCEPT,
		priority: UNSIGNED_INTEGER,
		description: STRING,
		start: INSTANT,
		end: INSTANT,
		minutesDuration: POSITIVE_INTEGER,
		slot: ARRAY(REFERENCE('Slot')),
		comment: STRING,
		participant: REQUIRED(ARRAY(ELEMENT({
			type: ARRAY(CODEABLE_CONCEPT),
			actor: REFERENCE(['Patient','Practitioner','RelatedPerson','Device','HealthcareService','Location']),
			required: CODE('Appointment.Participant.Required'),
			status: REQUIRED(CODE('Appointment.Participant.Status'))
		})))
	},
	AppointmentResponse: {
		identifier: ARRAY(IDENTIFIER),
		appointment: REQUIRED(REFERENCE('Appointment')),
		start: INSTANT,
		end: INSTANT,
		participantType: CODEABLE_CONCEPT,
		actor: REFERENCE(['Patient','Practitioner','RelatedPerson','Device','HealthcareService','Location']),
		participantStatus: REQUIRED(CODE('AppointmentResponse.ParticipantStatus')),
		comment: STRING
	},
	AuditEvent: {
		event: REQUIRED(ELEMENT({
			type: REQUIRED(CODING),
			subtype: ARRAY(CODING),
			action: CODE('AuditEvent.Event.Action'),
			dateTime: REQUIRED(INSTANT),
			outcome: CODE('AuditEvent.Event.Outcome'),
			outcomeDesc: STRING,
			purposeOfEvent: ARRAY(CODING)
		})),
		participant: REQUIRED(ARRAY(ELEMENT({
			role: ARRAY(CODEABLE_CONCEPT),
			reference: REFERENCE(['Practitioner', 'Organization', 'Device', 'Patient', 'RelatedPerson']),
			userId: IDENTIFIER,
			altId: STRING,
			name: STRING,
			requestor: BOOLEAN,
			location: REFERENCE('Location'),
			policy: ARRAY(URI),
			media: CODING,
			network: ELEMENT({
				address: STRING,
				type: CODE('AuditEvent.Participant.Network.Type')
			}),
			purposeOfUse: CODING
		}))),
		source: REQUIRED(ELEMENT({
			site: STRING,
			identifier: REQUIRED(IDENTIFIER),
			type: ARRAY(CODING)
		})),
		object: ARRAY(ELEMENT({
			identifier: IDENTIFIER,
			reference: REFERENCE(ANY),
			type: CODING,
			role: CODING,
			lifecycle: CODING,
			securityLabel: ARRAY(CODING),
			name: STRING,
			description: STRING,
			query: BASE_64_BINARY,
			detail: ARRAY(ELEMENT({
				type: REQUIRED(STRING),
				value: REQUIRED(BASE_64_BINARY)
			}))
		}))
	},
	Basic: {
		identifier: ARRAY(IDENTIFIER),
		code: REQUIRED(CODEABLE_CONCEPT_RESOURCE_TYPE),
		subject: REFERENCE(ANY),
		author: REFERENCE(['Practitioner', 'Patient', 'RelatedPerson']),
		created: DATE
	},
	Binary: {
		contentType: REQUIRED(MIME_TYPE),
		content: REQUIRED(BASE_64_BINARY)
	},
	BodySite: {
		patient: REQUIRED(REFERENCE('Patient')),
		identifier: ARRAY(IDENTIFIER),
		code: CODEABLE_CONCEPT,
		modifier: ARRAY(CODEABLE_CONCEPT),
		description: STRING,
		image: ARRAY(ATTACHMENT)
	},
	Bundle : {
		type: REQUIRED(CODE('Bundle.TYPE')),//document | message | transaction | transaction-response | batch | batch-response | history | searchset | collection
		total: UNSIGNED_INTEGER,
		link: ARRAY(ELEMENT({
			relation: STRING,
			url: URI
		})),
		entry: ARRAY(ELEMENT({
			link: ARRAY(LINK),
			fullUrl: URI,
			resource: RESOURCE(ANY),
			search: ELEMENT({
				mode: CODE('Bundle.Entry.Search.Mode'),
				score: DECIMAL
			}),
			request: ELEMENT({
				method: REQUIRED(CODE('Bundle.Entry.Request.Method')),
				url: REQUIRED(URI),
				ifNoneMatch: STRING,
				ifModifiedSince: INSTANT,
				ifMatch: STRING,
				ifNoneExist: STRING
			}),
			response: ELEMENT({
				status: REQUIRED(STRING),
				location: URI,
				etag: STRING,
				lastModified: INSTANT
			})
		})),
		signature: SIGNATURE
	},
	CarePlan : {
		identifier: ARRAY(IDENTIFIER),
		subject: REFERENCE(['Patient', 'Group']),
		status: REQUIRED(CODE('CarePlan.Status')),
		context: REFERENCE(['Encounter', 'EpisodeOfCare']),
		period: PERIOD,
		author: ARRAY(REFERENCE(['Patient','Practitioner','RelatedPerson','Organization'])),
		modified: DATE_TIME,
		category: ARRAY(CODEABLE_CONCEPT),
		description: STRING,
		addresses: ARRAY(REFERENCE('Condition')),
		support: ARRAY(REFERENCE(ANY)),
		relatedPlan: ARRAY(ELEMENT({
			code: CODE('CarePlan.RelatedPlan.Code'),
			plan: REQUIRED(REFERENCE('CarePlan'))
		})),
		participant: ARRAY(ELEMENT({
			role: CODEABLE_CONCEPT,
			member: REFERENCE(['Practitioner','RelatedPerson','Patient','Organization'])
		})),
		goal: ARRAY(REFERENCE('Goal')),
		activity: ARRAY(ELEMENT({
			actionResulting: ARRAY(REFERENCE(ANY)),
			progress: ARRAY(ANNOTATION),
			reference: REFERENCE(['Appointment','CommunicationRequest','DeviceUseRequest','DiagnosticOrder','MedicationOrder','NutritionOrder','Order','ProcessRequest','ProcessRequest','ReferralRequest','SupplyRequest','VisionPrescription']),
			detail: ELEMENT({
				category: CODEABLE_CONCEPT,
				code: CODEABLE_CONCEPT,
				reasonCode: ARRAY(CODEABLE_CONCEPT),
				reasonReference: ARRAY(REFERENCE('Condition')),
				goal: ARRAY(REFERENCE('Goal')),
				status: CODE('CarePlan.Activity.Detail.Status'),//not-started | scheduled | in-progress | on-hold | completed | cancelled
				statusReason: CODEABLE_CONCEPT,
				prohibited: REQUIRED(BOOLEAN),
				scheduledTiming: OPTION('scheduled', TIMING),
				scheduledPeriod: OPTION('scheduled', PERIOD),
				scheduledString: OPTION('scheduled', STRING),
				location: REFERENCE('Location'),
				performer: ARRAY(REFERENCE(['Practitioner','Organization','RelatedPerson','Patient'])),
				productCodeableConcept: OPTION('product', CODEABLE_CONCEPT),
				productReference: OPTION('product', REFERENCE(['Medication','Substance'])),
				dailyAmount: SIMPLE_QUANTITY,
				quantity: SIMPLE_QUANTITY,
				description: STRING
			})
		})),
		note: ANNOTATION
	},
	Claim: {

	},
	ClaimResponse: {

	},
	ClinicalImpression: {

	},
	Communication: {

	},
	CommunicationRequest: {

	},
	Composition: {

	},
	ConceptMap: {

	},
	Condition: {

	},
	Conformance: {

	},
	Contract: {

	},
	DetectedIssue: {

	},
	Coverage: {

	},
	DataElement: {

	},
	Device: {

	},
	DeviceComponent: {

	},
	DeviceMetric: {

	},
	DeviceUseRequest: {

	},
	DeviceUseStatement: {

	},
	DiagnosticOrder: {

	},
	DiagnosticReport: {

	},
	DocumentManifest: {

	},
	DocumentReference: {

	},
	EligibilityRequest: {

	},
	EligibilityResponse: {

	},
	Encounter: {

	},
	EnrollmentRequest: {

	},
	EnrollmentResponse: {

	},
	EpisodeOfCare: {

	},
	ExplanationOfBenefit: {

	},
	FamilyMemberHistory: {

	},
	Flag: {

	},
	Goal: {

	},
	Group: {

	},
	HealthcareService: {

	},
	ImagingObjectSelection: {

	},
	ImagingStudy: {

	},
	Immunization: {

	},
	ImmunizationRecommendation: {

	},
	ImplementationGuide: {

	},
	List: {
		identifier: ARRAY(IDENTIFIER),
		title: STRING,
		code: CODEABLE_CONCEPT,
		subject: REFERENCE(['Patient','Group','Device','Location']),
		source: REFERENCE(['Practitioner','Patient','Device']),
		encounter: REFERENCE('Encounter'),
		status: REQUIRED(CODE('List.Status')),//current | retired | entered-in-error
		date: DATE_TIME,
		orderedBy: CODEABLE_CONCEPT,
		mode: REQUIRED(CODE('List.Mode')),//working | snapshot | changes
		note: STRING,
		entry: ARRAY(ELEMENT({
			flag: CODEABLE_CONCEPT,
			deleted: BOOLEAN,
			date: DATE_TIME,
			item: REFERENCE(ANY)
		})),
		emptyReason: CODEABLE_CONCEPT
	},
	Location: {
		identifier: ARRAY(IDENTIFIER),
		status: CODE('Location.Status'),//active | suspended | inactive
		name: STRING,
		description: STRING,
		mode: CODE('Location.Mode'),//instance | kind
		type: CODEABLE_CONCEPT,
		telecom: ARRAY(CONTACT_POINT),
		address: ADDRESS,
		physicalType: CODEABLE_CONCEPT,
		position: ELEMENT({
			longitude: REQUIRED(DECIMAL),
			latitude: REQUIRED(DECIMAL),
			altitude: DECIMAL
		}),
		managingOrganization: REFERENCE('Organization'),
		partOf: REFERENCE('Location')
	},
	Media: {
		type: REQUIRED(CODE('Media.Type')),// photo | video | audio
		subtype: CODEABLE_CONCEPT,
		identifier: ARRAY(IDENTIFIER),
		subject: REFERENCE(['Patient','Practitioner','Group','Device','Specimen']),
		operator: REFERENCE('Practitioner'),
		view: CODEABLE_CONCEPT,
		deviceName: STRING,
		height: POSITIVE_INTEGER,
		width: POSITIVE_INTEGER,
		frames: POSITIVE_INTEGER,
		duration: UNSIGNED_INTEGER,
		content: REQUIRED(ATTACHMENT)
	},
	Medication: {
		code: CODEABLE_CONCEPT,
		isBrand: BOOLEAN,
		manufacturer: REFERENCE('Organization'),
		product: ELEMENT({
			form: CODEABLE_CONCEPT,
			ingredient: ARRAY(ELEMENT({
				item: REQUIRED(REFERENCE(['Substance', 'Medication'])),
				amount: RATIO
			})),
			batch: ARRAY(ELEMENT({
				lotNumber: STRING,
				expirationDate: DATE_TIME
			}))
		}),
		package: ELEMENT({
			container: CODEABLE_CONCEPT,
			content: ARRAY(ELEMENT({
				item: REQUIRED(REFERENCE('Medication')),
				amount: SIMPLE_QUANTITY
			}))
		})
	},
	MedicationAdministration: {
		identifier: ARRAY(IDENTIFIER),
		status: REQUIRED(CODE('MedicationAdministration.Status')),// in-progress | on-hold | completed | entered-in-error | stopped
		patient: REQUIRED(REFERENCE('Patient')),
		practitioner: REFERENCE(['Practitioner','Patient','RelatedPerson']),
		encounter: REFERENCE('Encounter'),
		prescription: REFERENCE('MedicationOrder'),
		wasNotGiven: BOOLEAN,
		reasonNotGiven: ARRAY(CODEABLE_CONCEPT),
		reasonGiven: ARRAY(CODEABLE_CONCEPT),
		effectiveTimeDateTime: OPTION('effectiveTime', DATE_TIME),
		effectiveTimePeriod: OPTION('effectiveTime', PERIOD),
		medicationCodeableConcept: OPTION('medication', CODEABLE_CONCEPT),
		medicationReference: OPTION('medication', REFERENCE('Medication')),
		device: ARRAY(REFERENCE('Device')),
		note: STRING,
		dosage: ELEMENT({
			text: STRING,
			siteCodeableConcept: OPTION('site', CODEABLE_CONCEPT),
			siteReference: OPTION('site', REFERENCE('BodySite')),
			route: CODEABLE_CONCEPT,
			method: CODEABLE_CONCEPT,
			quantity: SIMPLE_QUANTITY,
			rateRatio: OPTION('rate', RATIO),
			rateRange: OPTION('rate', RANGE)
		})
	},
	MedicationDispense: {
		identifier: IDENTIFIER,
		status: CODE('MedicationDispense.Status'),// in-progress | on-hold | completed | entered-in-error | stopped
		patient: REFERENCE('Patient'),
		dispenser: REFERENCE('Practitioner'),
		authorizingPrescription: REFERENCE('MedicationOrder'),
		type: CODEABLE_CONCEPT,
		quantity: SIMPLE_QUANTITY,
		daysSupply: SIMPLE_QUANTITY,
		medicationCodeableConcept: OPTION('medication', CODEABLE_CONCEPT),
		medicationReference: OPTION('medication', REFERENCE('Medication')),
		whenPrepared: DATE_TIME,
		whenHandedOver: DATE_TIME,
		destination: REFERENCE('Location'),
		receiver: ARRAY(REFERENCE(['Patient','Practitioner'])),
		note: STRING,
		dosageInstruction: ARRAY(ELEMENT({
			text: STRING,
			additionalInstructions: CODEABLE_CONCEPT,
			timing: TIMING,
			asNeededBoolean: OPTION('asNeeded', BOOLEAN),
			asNeededCodeableConcept: OPTION('asNeeded', CODEABLE_CONCEPT),
			siteCodeableConcept: OPTION('site', CODEABLE_CONCEPT),
			siteReference: OPTION('site', REFERENCE('BodySite')),
			route: CODEABLE_CONCEPT,
			method: CODEABLE_CONCEPT,
			doseRange: OPTION('dose', RANGE),
			doseQuantity: OPTION('dose', SIMPLE_QUANTITY),
			rateRatio: OPTION('rate', RATIO),
			rateRange: OPTION('rate', RANGE),
			maxDosePerPeriod: RATIO
		})),
		substitution: ELEMENT({
			type: REQUIRED(CODEABLE_CONCEPT),
			reason: ARRAY(CODEABLE_CONCEPT),
			responsibleParty: ARRAY(REFERENCE('Practitioner'))
		})
	},
	MedicationOrder: {
		identifier: ARRAY(IDENTIFIER),
		dateWritten: DATE_TIME,
		status: CODE('MedicationOrder.Status'),
		dateEnded: DATE_TIME,
		reasonEnded: CODEABLE_CONCEPT,
		patient: REFERENCE('Patient'),
		prescriber: REFERENCE('Practitioner'),
		encounter: REFERENCE('Encounter'),
		reasonCodeableConcept: OPTION('reason', CODEABLE_CONCEPT),
		reasonReference: OPTION('reason', REFERENCE('Condition')),
		note: STRING,
		medicationCodeableConcept: REQUIRED(OPTION('medication', CODEABLE_CONCEPT)),
		medicationReference: REQUIRED(OPTION('medication', REFERENCE('Medication'))),
		dosageInstruction: ARRAY(ELEMENT({
			text: STRING,
			additionalInstructions: CODEABLE_CONCEPT,
			timing: TIMING,
			asNeededBoolean: OPTION('asNeeded', BOOLEAN),
			asNeededCodeableConcept: OPTION('asNeeded', CODEABLE_CONCEPT),
			siteCodeableConcept: OPTION('site', CODEABLE_CONCEPT),
			siteReference: OPTION('site', REFERENCE('BodySite')),
			route: CODEABLE_CONCEPT,
			method: CODEABLE_CONCEPT,
			doseRange: OPTION('dose', RANGE),
			doseQuantity: OPTION('dose', SIMPLE_QUANTITY),
			rateRatio: OPTION('rate', RATIO),
			rateRange: OPTION('rate', RANGE),
			maxDosePerPeriod: RATIO
		})),
		dispenseRequest: ELEMENT({
			medicationCodeableConcept: OPTION('medication', CODEABLE_CONCEPT),
			medicationReference: OPTION('medication', REFERENCE('Medication')),
			validityPeriod: PERIOD,
			numberOfRepeatsAllowed: POSITIVE_INTEGER,
			quantity: SIMPLE_QUANTITY,
			expectedSupplyDuration: DURATION
		}),
		substitution: ELEMENT({
			type: REQUIRED(CODEABLE_CONCEPT),
			reason: CODEABLE_CONCEPT
		}),
		priorPrescription: REFERENCE('MedicationOrder')
	},
	MedicationStatement: {
		identifier: ARRAY(IDENTIFIER),
		patient: REFERENCE('Patient'),
		informationSource: REFERENCE(['Patient', 'Practitioner', 'RelatedPerson']),
		dateAsserted: DATE_TIME,
		status: REQUIRED(CODE('MedicationStatement.Status')),
		wasNotTaken: BOOLEAN,
		reasonNotTaken: CODEABLE_CONCEPT,
		reasonForUseCodeableConcept: OPTION('reasonForUse', CODEABLE_CONCEPT),
		reasonForUseReference: OPTION('reasonForUse', REFERENCE('Condition')),
		effectiveDateTime: OPTION('effective', DATE_TIME),
		effectivePeriod: OPTION('effective', PERIOD),
		note: STRING,
		supportingInformation: ARRAY(REFERENCE(ANY)),
		medicationCodeableConcept: REQUIRED(OPTION('medication', CODEABLE_CONCEPT)),
		medicationReference: REQUIRED(OPTION('medication', REFERENCE('Medication'))),
		dosage: ELEMENT({
			text: STRING,
			timing: TIMING,
			asNeededBoolean: OPTION('asNeeded', BOOLEAN),
			asNeededCodeableConcept: OPTION('asNeeded', CODEABLE_CONCEPT),
			siteCodeableConcept: OPTION('site', CODEABLE_CONCEPT),
			siteReference: OPTION('site', REFERENCE('BodySite')),
			route: CODEABLE_CONCEPT,
			method: CODEABLE_CONCEPT,
			quantityQuantity: OPTION('quantity', QUANTITY),
			quantityRange: OPTION('quantity', RANGE),
			rateRatio: OPTION('rate', RATIO),
			rateRange: OPTION('rate', RANGE),
			maxDosePerPeriod: RATIO
		})
	},
	MessageHeader: {

	},
	NamingSystem: {

	},
	NutritionOrder: {

	},
	Observation: {

	},
	OperationDefinition: {

	},
	OperationOutcome: {

	},
	Order: {

	},
	OrderResponse: {

	},
	Organization: {

	},
	Parameters: {

	},
	Patient: {
		identifier: ARRAY(IDENTIFIER),
		active: BOOLEAN,
		name: ARRAY(HUMAN_NAME),
		telecom: ARRAY(CONTACT_POINT),
		gender: CODE('Patient.Gender'),
		birthDate: DATE,
		deceasedBoolean: OPTION('deceased', BOOLEAN),
		deceasedDateTime: OPTION('deceased', DATE_TIME),
		address: ARRAY(ADDRESS),
		maritalStatus: CODEABLE_CONCEPT,
		multipleBirthBoolean: OPTION('multipleBirth', BOOLEAN),
		multipleBirthInteger: OPTION('multipleBirth', INTEGER),
		photo: ARRAY(ATTACHMENT),
		contact: ARRAY(ELEMENT({
			relationship: ARRAY(CODEABLE_CONCEPT),
			name: HUMAN_NAME,
			telecom: ARRAY(CONTACT_POINT),
			address: ADDRESS,
			gender: CODE('Patient.Contact.Gender'),
			organization: REFERENCE('Organization'),
			period: PERIOD
		})),
		animal: ELEMENT({
			species: REQUIRED(CODEABLE_CONCEPT),
			breed: CODEABLE_CONCEPT,
			genderStatus: CODEABLE_CONCEPT
		}),
		communication: ARRAY(ELEMENT({
			language: REQUIRED(CODEABLE_CONCEPT),
			preferred: BOOLEAN
		})),
		careProvider: ARRAY(REFERENCE(['Organization','Practitioner'])),
		managingOrganization: REFERENCE('Organization'),
		link: ARRAY(ELEMENT({
			other: REQUIRED(REFERENCE('Patient')),
			type: REQUIRED(CODE('Patient.Link.Type'))
		}))
	},
	PaymentNotice: {

	},
	PaymentReconciliation: {

	},
	Person: {

	},
	Practitioner: {
		identifier: ARRAY(IDENTIFIER),
		active: BOOLEAN,
		name: HUMAN_NAME,
		telecom: ARRAY(CONTACT_POINT),
		address: ARRAY(ADDRESS),
		gender: CODE('Practitioner.Gender'),
		birthDate: DATE,
		photo: ARRAY(ATTACHMENT),
		practitionerRole: ARRAY(ELEMENT({
			managingOrganization: REFERENCE('Organization'),
			role: CODEABLE_CONCEPT,
			specialty: ARRAY(CODEABLE_CONCEPT),
			period: PERIOD,
			location: ARRAY(REFERENCE('Location')),
			healthcareService: ARRAY(REFERENCE('HealthcareService'))
		})),
		qualification: ARRAY(ELEMENT({
			identifier: ARRAY(IDENTIFIER),
			code: REQUIRED(CODEABLE_CONCEPT),
			period: PERIOD,
			issuer: REFERENCE('Organization')
		})),
		communication: ARRAY(CODEABLE_CONCEPT)
	},
	Procedure: {

	},
	ProcessRequest: {

	},
	ProcessResponse: {

	},
	ProcedureRequest: {

	},
	Provenance: {

	},
	Questionnaire: {

	},
	QuestionnaireResponse: {

	},
	ReferralRequest: {

	},
	RelatedPerson: {

	},
	RiskAssessment: {

	},
	Schedule: {

	},
	SearchParameter: {

	},
	Slot: {

	},
	Specimen: {

	},
	StructureDefinition: {

	},
	Subscription: {

	},
	Substance: {

	},
	SupplyRequest: {

	},
	SupplyDelivery: {

	},
	TestScript: {

	},
	ValueSet: {
		url: URI,
		identifier: IDENTIFIER,
		version: STRING,
		name: STRING,
		status: REQUIRED(CODE('ValueSet.Status')),
		experimental: BOOLEAN,
		publisher: STRING,
		contact: ARRAY(ELEMENT({
			name: STRING,
			telecom: ARRAY(CONTACT_POINT)
		})),
		date: DATE_TIME,
		lockedDate: DATE,
		description: STRING,
		useContext: ARRAY(CODEABLE_CONCEPT),
		immutable: BOOLEAN,
		requirements: STRING,
		copyright: STRING,
		extensible: BOOLEAN,
		codeSystem: ELEMENT({
			system: URI,
			version: STRING,
			caseSensitive: BOOLEAN,
			concept: REQUIRED(ARRAY(ELEMENT({
				code: REQUIRED(CODE('ValueSet.CodeSystem.Concept.Code')),
				abstract: BOOLEAN,
				display: STRING,
				definition: STRING,
				designation: ARRAY(ELEMENT({
					language: CODE('ValueSet.CodeSystem.Concept.Designation.Language'),
					use: CODING,
					value: REQUIRED(STRING)
				})),
				concept: AS_FOR('ValueSet.codeSystem.concept')
			})))
		}),
		compose: ELEMENT({
			import: ARRAY(URI),
			include: ARRAY(ELEMENT({
				system: REQUIRED(URI),
				version: STRING,
				concept: ARRAY(ELEMENT({
					code: REQUIRED(CODE('ValueSet.Compose.Include.Concept.Code')),
					display: STRING,
					designation: ARRAY(ELEMENT({
						language: CODE('ValueSet.Compose.Include.Concept.Designation.Language'),
						use: CODING,
						value: REQUIRED(STRING)
					}))
				})),
				filter: ARRAY(ELEMENT({
					property: REQUIRED(CODE('TODO')),
					op: REQUIRED(CODE('TODO')),
					value: REQUIRED(CODE('TODO'))
				}))
			})),
			exclude: AS_FOR('ValueSet.compose.include')
		}),
		expansion: ELEMENT({
			identifier: REQUIRED(URI),
			timestamp: REQUIRED(DATE_TIME),
			total: INTEGER,
			offset: INTEGER,
			parameter: ARRAY(ELEMENT({
				name: REQUIRED(STRING),
				valueString: OPTION('value', STRING),
				valueBoolean: OPTION('value', BOOLEAN),
				valueInteger: OPTION('value', INTEGER),
				valueDecimal: OPTION('value', DECIMAL),
				valueUri: OPTION('value', URI),
				valueCode: OPTION('value', CODE('TODO'))
			})),
			contains: ARRAY(ELEMENT({
				system: URI,
				abstract: BOOLEAN,
				version: STRING,
				code: CODE('TODO'),
				display: STRING,
				contains: AS_FOR('ValueSet.expansion.contains')
			}))
		})
	},
	VisionPrescription: {

	}
};

var validateDefinition = function(resourceName, propertyName, data, definition) {
	var errors = [],
		property,
		value,
		group;

	// Ensure a definition exists for this property
	if(!definition || typeof definition !== 'object') {
		errors.push(new Error('"' + propertyName + '" is an invalid property for the ' + resourceName + ' resource'));
		return errors;
	}

	// Check the data against the definition type
	if(definition._type) {
		if(definition._valid && !definition._valid(data)) {
			errors = errors.push(new Error('"' + propertyName + '" is not a valid ' + definition._type));
		}

		if(definition._type === 'Array') {
			if(definition._required && data.length === 0) {
				errors.push(new Error('"' + propertyName + '" expected at least one item in its array but was empty'));
				return errors;
			}
			for(index in data) {
				errors = errors.concat(validateDefinition(resourceName, propertyName, data[index], definition.definition));
			}
		} else if(definition._type === 'BackboneElement' || definition._type === 'Option') {
			errors = errors.concat(validateDefinition(resourceName, propertyName, data, definition.definition));
		} else if(definition._type === 'Resource') {
			if(definition._targets === ANY) {
				errors = errors.concat(fhir.validate(data).errors);
				// loop through data getting resource types to validate
			} else {
				// TODO: check that the resources are of the correct type
			}
		}
		return errors;
	}


	var dataKeys = Object.keys(data);
	var definitionKeys = Object.keys(definition);

	// Collect all option groups
	var options = {};
	for(index in definitionKeys) {
		property = definitionKeys[index];
		propertyDefinition = definition[property];
		if(propertyDefinition._type && propertyDefinition._type === 'Option') {
			group = propertyDefinition._group;
			if(!options.hasOwnProperty(group)) {
				options[group] = {
					required: propertyDefinition._required,
					propertiesFound: [],
					propertiesNotFound: []
				};
			}
			if(data.hasOwnProperty(property)) {
				options[group].propertiesFound.push(property);
			} else {
				options[group].propertiesNotFound.push(property);
			}
		}
	}

	// Validate that no more than one property from each option group exists and 
	// that at least one property exists for required option groups
	for(group in options) {
		if(options.hasOwnProperty(group)) {
			if(options[group].required && options[group].propertiesFound.length === 0) {
				errors.push(new Error('The property "' + options[group].propertiesNotFound.join('" or "') + '" is required'));
			}
			if(options[group].propertiesFound.length > 1) {
				errors.push(new Error('The properties "' + options[group].propertiesFound.join('" and "') + '" were found but only one is permitted'));
			}
		}
	}

	// Validate required properties
	var definitionDiff = definitionKeys.filter(function(i) {return dataKeys.indexOf(i) < 0;});
	for(index in definitionDiff) {
		property = definitionDiff[index];
		propertyDefinition = definition[property];
		//TODO: I think this might miss arrays
		if(propertyDefinition._type && propertyDefinition._required && propertyDefinition._type !== 'Option') {
			errors.push(new Error('The property "' + property + '" is required but was not found'));
		}
	}

	// Validate all sub properties
	for(property in data) {
		if (data.hasOwnProperty(property)) {
			if(property.lastIndexOf('_', 0) === 0) {
				//TODO: handle underscore properties + extensions. eg. _gender
			} else {
				errors = errors.concat(validateDefinition(resourceName, property, data[property], definition[property]));
			}
		}
	}
	return errors;
};

var ResourceDefinitionFactory = function(resourceType, definition) {

	//temporary properties. TODO: move to base resource type
	definition.resourceType = STRING;
	definition.id = STRING;
	definition.meta = META;
	definition.implicitRules = URI;
	definition.language = CODE('language');
	definition.text = NARRATIVE;
	definition.contained = ARRAY(RESOURCE(ANY));
	definition.extension = ARRAY(EXTENSION);
	definition.modifierExtension = ARRAY(EXTENSION);

	var ResourceDefinition = function(data) {
		var _this = this;

		// Add all data properties to this object
		for (var prop in data) {
			if (data.hasOwnProperty(prop)) {
				this[prop] = data[prop];
			}
		}

		// don't allow the validate property as this is a utility function...
		if(this.hasOwnProperty('validate')) {
			throw new Error('"validate" is an invalid property for the ' + this.resourceType + ' resource');
		}

		// Validate this resource against the definition
		this.validate = function() {
			// validate against the stringified parsed object to remove utility function properties
			var json = JSON.parse(JSON.stringify(_this));

			if(!json.resourceType) {
				return [new Error('No resource type was found')];
			}
			if(json.resourceType !== resourceType) {
				return [new Error('Expected resource type "' + resourceType + '" but was given "' + json.resourceType + '"')];
			}
			return validateDefinition(resourceType, resourceType, json, definition);
		}
	};

	ResourceDefinition.NAME = resourceType;
	ResourceDefinition.NAME_LOWER = resourceType.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	ResourceDefinition.NAME_DISPLAY = resourceType.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3').replace(/^./, function(resourceType){ return resourceType.toUpperCase(); });

	return ResourceDefinition;
};



var resourceType,
	resourceDefinition,
	resourceCodes,
	code;

// Populate fhir resources
for(resourceType in Definitions) { 
	if (Definitions.hasOwnProperty(resourceType)) {
		resourceDefinition = Definitions[resourceType];
		fhir[resourceType] = ResourceDefinitionFactory(resourceType, resourceDefinition);
	}
}

//Populate fhir resource codes
for(resourceType in Codes) { 
	if (Codes.hasOwnProperty(resourceType)) {
		resourceCodes = Codes[resourceType];

		for(code in resourceCodes) {
			if(resourceCodes.hasOwnProperty(code)) {
				fhir[resourceType][code] = resourceCodes[code];
			}
		}
	}
}

/**
Validates a json string or object. The parsed resource and a list of errors is returned.
**/
fhir.validate = function(data, expectedType) {
	var result = {
			resource: null,
			errors: []
		},
		json;

	try {
		if(typeof data === 'string') json = JSON.parse(data);
		else json = data;
	} catch(e) {
		result.errors.push(new Error('Invalid JSON'));
		return result;
	}

	try {
		if(!json.resourceType) {
			result.errors.push(new Error('No resource type specified'));
			return result;
		}

		if(!Definitions.hasOwnProperty(json.resourceType)) {
			result.errors.push(new Error('The resource type "' + json.resourceType + '" is not defined in FHIR'));
			return result;
		}

		result.resource = new fhir[expectedType ? expectedType : json.resourceType](json);
		result.errors = result.resource.validate();
		return result;

	} catch(e) {
		result.errors.push(e);
		return result;
	}

	return result;
};

fhir.getInfo = function() {
	return {
		description: 'FHIR DTSU 2',
		version: '1.0.1',
		versionDate: '2015-10-24',
		url: 'http://hl7.org/fhir'
	};
}

fhir.getResources = function() {
	return Definitions.keys();
}

})(typeof module !== 'undefined' && module.exports ? module.exports : this['fhir'] = {});