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
							items: { $ref: '#/types/CodeableConcept' },
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
				items: { $ref: '#/types/Reference' }
			},
			comment: { type: 'string' },
			participant: {
				type: 'array',
				items: {
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
				}
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
				items: { $ref: '#/types/CodeableConcept' }
			},
			actor: { $ref: '#/types/Reference' },
			participantStatus: { $ref: '#/types/code' },
			comment: { type: 'string' }
		},
		required: ['appointment', 'participantStatus']
	},
	AuditEvent: {
		properties: {
			event: {
				type: 'object',
				properties: {
					type: {},
					subtype: {},
					action: {},
					dateTime: {},
					outcome: {},
					outcomeDesc: {},
					purposeOfEvent: {}
				},
				required: ['type', 'dateTime']
			},
			participant: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						role: {},
						reference: {},
						userId: {},
						altId: {},
						name: {},
						requestor: {},
						location: {},
						policy: {},
						media: {},
						network: {
							type: 'object',
							properties: {
								address: {},
								type: {}
							}
						},
						purposeOfUse: {}
					},
					required: ['requestor']
				}
			},
			source: {
				type: 'object',
				properties: {
					site: {},
					identifier: {},
					type: {}
				},
				required: ['identifier']
			},
			object: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: {},
						reference: {},
						type: {},
						role: {},
						lifecycle: {},
						securityLabel: {},
						name: {},
						description: {},
						query: {},
						detail: {
							type: 'object',
							properties: {
								type: {},
								value: {}
							},
							required: ['type', 'value']
						}
					}
				}
			}
		},
		required: []
	},
	Basic: {
		properties: {
			code: {},
			subject: {},
			author: {},
			created: {}
		},
		required: ['code']
	},
	Binary: {
		properties: {
			contentType: {},
			content: {}
		},
		required: ['contentType', 'content']
	},
	BodySite: {
		properties: {
			patient: {},
			code: {},
			modifier: {},
			description: {},
			image: {}
		},
		required: ['patient']
	},
	Bundle: {
		properties: {
			type: {},
			total: {},
			link: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						relation: {},
						url: {}
					},
					required: ['relation', 'url']
				}
			},
			entry: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						link: {},
						fullUrl: {},
						resource: {},
						search: {
							type: 'object',
							properties: {
								mode: {},
								score: {}
							}
						},
						request: {
							type: 'object',
							properties: {
								method: {},
								url: {},
								ifNoneMatch: {},
								ifModifiedSince: {},
								ifMatch: {},
								ifNoneExist: {}
							},
							required: ['method', 'url']
						},
						response: {
							type: 'object',
							properties: {
								status: {},
								location: {},
								etag: {},
								lastModified: {}
							},
							required: ['status']
						}
					}
				}
			},
			signature: {}
		},
		required: ['type']
	},
	CarePlan: {
		properties: {
			subject: {},
			status: {},
			context: {},
			period: {},
			author: {},
			modified: {},
			category: {},
			description: {},
			addresses: {},
			support: {},
			relatedPlan: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						plan: {}
					},
					required: ['plan']
				}
			},
			participant: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						role: {},
						member: {}
					}
				}
			},
			goal: {},
			activity: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						actionResulting: {},
						progress: {},
						reference: {},
						detail: {
							type: 'object',
							properties: {
								category: {},
								code: {},
								reasonCode: {},
								reasonReference: {},
								goal: {},
								status: {},
								statusReason: {},
								prohibited: {},
								scheduledTiming: {},
								scheduledPeriod: {},
								scheduledString: {},
								location: {},
								performer: {},
								productCodeableConcept: {},
								productReference: {},
								dailyAmount: {},
								quantity: {},
								description: {}
							},
							required: ['prohibited']
						}
					}
				}
			},
			note: {}
		},
		required: ['status']
	},
	Claim: {
		properties: {
			type: {},
			ruleset: {},
			originalRuleset: {},
			created: {},
			target: {},
			provider: {},
			organization: {},
			use: {},
			priority: {},
			fundsReserve: {},
			enterer: {},
			facility: {},
			prescription: {},
			originalPrescription: {},
			payee: {
				type: 'object',
				properties: {
					type: {},
					provider: {},
					organization: {},
					person: {}
				}
			},
			referral: {},
			diagnosis: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: {},
						diagnosis: {}
					},
					required: ['sequence', 'diagnosis']
				}
			},
			condition: {},
			patient: {},
			coverage: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: {},
						focal: {},
						coverage: {},
						businessArrangement: {},
						relationship: {},
						preAuthRef: {},
						claimResponse: {},
						originalRuleset: {}
					},
					required: ['sequence', 'focal', 'converage', 'relationship']
				}
			},
			exception: {},
			school: {},
			accident: {},
			accidentType: {},
			interventionException: {},
			item: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: {},
						type: {},
						provider: {},
						diagnosisLinkId: {},
						service: {},
						serviceDate: {},
						quantity: {},
						unitPrice: {},
						factor: {},
						points: {},
						net: {},
						udi: {},
						bodySite: {},
						subSite: {},
						modifier: {},
						detail: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									sequence: {},
									type: {},
									service: {},
									quantity: {},
									unitPrice: {},
									factor: {},
									points: {},
									net: {},
									udi: {},
									subDetail: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												sequence: {},
												type: {},
												service: {},
												quantity: {},
												unitPrice: {},
												factor: {},
												points: {},
												net: {},
												udi: {}
											},
											required: ['sequence', 'type', 'service']
										}
									}
								},
								required: ['sequence', 'type', 'service']
							}
						},
						prosthesis: {
							type: 'object',
							properties: {
								intial: {},
								priorDate: {},
								priorMaterial: {}
							}
						}
					}
				},
				required: ['sequence', 'type', 'service']
			},
			additionalMaterials: {},
			missingTeeth: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						tooth: {},
						reason: {},
						extractionDate: {}
					},
					required: ['tooth']
				}
			}
		},
		required: ['type', 'patient']
	},
	ClaimResponse: {
		properties: {
			request: {},
			ruleset: {},
			originalRuleset: {},
			created: {},
			organization: {},
			requestProvider: {},
			requestOrganization: {},
			outcome: {},
			disposition: {},
			payeeType: {},
			item: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequenceLinkId: {},
						noteNumber: {},
						adjudication: {
							type: 'array',
							properties: {
								code: {},
								amount: {},
								value: {}
							},
							required: ['code']
						},
						detail: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									sequenceLinkId: {},
									adjudication: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												code: {},
												amount: {},
												value: {}
											},
											required: ['code']
										}
									},
									subDetail: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												sequenceLinkId: {},
												adjudication: {
													type: 'array',
													items: {
														type: 'object',
														properties: {
															code: {},
															amount: {},
															value: {}
														},
														required: ['code']
													}
												}
											}
										}
									}
								},
								required: ['sequenceLinkId']
							}
						}
					},
					required: ['sequenceLinkId']
				}
			},
			addItem: {},
			error: {},
			totalCost: {},
			unallocDeductable: {},
			totalBenefit: {},
			paymentAdjustment: {},
			paymentAdjustmentReason: {},
			paymentDate: {},
			paymentAmount: {},
			paymentRef: {},
			reserved: {},
			form: {},
			note: {},
			coverage: {}
		},
		required: []
	},
	ClinicalImpression: {
		properties: {
			patient: {},
			assessor: {},
			status: {},
			date: {},
			description: {},
			previous: {},
			problem: {},
			triggerCodeableConcept: {},
			triggerReference: {},
			investigations: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						item: {}
					},
					required: ['code']
				}
			},
			protocol: {},
			summary: {},
			finding: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item: {},
						cause: {}
					},
					required: ['item']
				}
			},
			resolved: {},
			ruledOut: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item: {},
						reason: {}
					},
					required: ['item']
				}
			},
			prognosis: {},
			plan: {},
			action: {}
		},
		required: ['status', 'patient']
	},
	Communication: {
		properties: {
			category: {},
			sender: {},
			recipient: {},
			payload: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contentString: {},
						contentAttachment: {},
						contentReference: {}
					}
				}
			},
			medium: {},
			status: {},
			encounter: {},
			sent: {},
			received: {},
			reason: {},
			subject: {},
			requestDetail: {}
		},
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
		properties: {
			patient: {},
			informationSource: {},
			dateAsserted: {},
			status: {},
			wasNotTaken: {},
			reasonNotTaken: {},
			reasonForUseCodeableConcept: {},
			reasonForUseReference: {},
			effectiveDateTime: {},
			effectivePeriod: {},
			note: {},
			supportingInformation: {},
			medicationCodeableConcept: {},
			medicationReference: {},
			dosage: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: {},
						timing: {},
						asNeededBoolean: {},
						asNeededCodeableConcept: {},
						siteCodeableConcept: {},
						siteReference: {},
						route: {},
						method: {},
						quantityQuantity: {},
						quantityRange: {},
						rateRatio: {},
						rateRange: {},
						maxDosePerPeriod: {}
					}
				}
			}
		},
		required: ['patient', 'status'],
		oneOf: [
			{ required: ['medicationCodeableConcept'] },
			{ required: ['medicationReference'] }
		]
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
		properties: {
			date: {},
			subject: {},
			source: {},
			target: {},
			reasonCodeableConcept: {},
			reasonReference: {},
			when: {
				type: 'object',
				properties: {
					code: {},
					schedule: {}
				}
			},
			detail: {}
		},
		required: ['detail']
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
		properties: {
			active: {},
			name: {},
			telecom: {},
			gender: {},
			birthDate: {},
			deceasedBoolean: {},
			deceasedDateTime: {},
			address: {},
			maritalStatus: {},
			multipleBirthBoolean: {},
			multipleBirthInteger: {},
			photo: {},
			contact: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						relationship: {},
						name: {},
						telecom: {},
						address: {},
						gender: {},
						organization: {},
						period: {}
					}
				}
			},
			animal: {
				type: 'object',
				properties: {
					species: {},
					breed: {},
					genderStatus: {}
				},
				required: ['species']
			},
			communication: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						language: {},
						preferred: {}
					},
					required: ['language']
				}
			},
			careProvider: {},
			managingOrganization: {},
			link: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						other: {},
						type: {}
					},
					required: ['other', 'type']
				}
			}
		},
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
		properties: {
			name: {},
			telecom: {},
			gender: {},
			birthDate: {},
			address: {},
			photo: {},
			managingOrganization: {},
			active: {},
			link: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						target: {},
						assurance: {}
					},
					required: ['target']
				}
			}
		},
		required: []
	},
	Practitioner: {
		properties: {
			active: {},
			name: {},
			telecom: {},
			address: {},
			gender: {},
			birthDate: {},
			photo: {},
			practitionerRole: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						managingOrganization: {},
						role: {},
						specialty: {},
						period: {},
						location: {},
						healthcareService: {}
					}
				}
			},
			qualification: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: {},
						code: {},
						period: {},
						issuer: {}
					},
					required: ['code']
				}
			},
			communication: {}
		},
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
		properties: {
			patient: {},
			relationship: {},
			name: {},
			telecom: {},
			gender: {},
			birthDate: {},
			address: {},
			photo: {},
			period: {}
		},
		required: ['patient']
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
		properties: {
			status: {},
			type: {},
			parent: {},
			subject: {},
			accessionIdentifier: {},
			receivedTime: {},
			collection: {
				type: 'object',
				properties: {
					collector: {},
					comment: {},
					collectedDateTime: {},
					collectedPeriod: {},
					quantity: {},
					method: {},
					bodySite: {}
				}
			},
			treatment: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						description: {},
						procedure: {},
						additive: {}
					}
				}
			},
			container: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: {},
						description: {},
						type: {},
						capacity: {},
						specimenQuantity: {},
						additiveCodeableConcept: {},
						additiveReference: {}
					}
				}
			}
		},
		required: ['subject']
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
		properties: {
			category: {},
			code: {},
			description: {},
			instance: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: {},
						expiry: {},
						quantity: {}
					}
				}
			},
			ingredient: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						quantity: {},
						substance: {}
					},
					required: ['substance']
				}
			}
		},
		required: ['code']
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

var Resource = {
	properties: {
		id: {},
		meta: {},
		implicitRules: {},
		language: {}
	}
};

var DomainResource = {
	properties: {
		text: {},
		contained: {},
		extension: {},
		modifierExtension: {}
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

	_.merge(resource, Resource);

	// For now assume that all resources are domain resources. This should be fixed.
	_.merge(resource, DomainResource);
});

module.exports = {
	types: types,
	resources: resources
}

