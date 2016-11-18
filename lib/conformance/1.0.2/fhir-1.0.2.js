var _ = require('lodash');

var types = {
	boolean: {
		type: 'boolean'
	},
	string: {
		type: 'string'
	},
	stringArray: {
		type: 'array',
		items: { $ref: '#/types/string' }
	},
	decimal: {
		type: 'number'
	},
	uri: {
		$ref: '#/types/string'
	},
	integer: {
		type: 'integer'
	},
	unsignedInt: {
		type: 'integer',
		minimum: 0
	},
	positiveInt: {
		type: 'integer',
		minimum: 1
	},
	code: {
		pattern: '[^\s]+([\s]+[^\s]+)*'
	},
	oid: {
		pattern: 'urn:oid:[0-2](\.[1-9]\d*)+'
	},
	markdown: {
		$ref: '#/types/string'
	},
	xhtml: {
		$ref: '#/types/string'
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
	Attachment: {
		type: 'object',
		properties: {
			contentType: { $ref: '#/types/code' },
			language: { $ref: '#/types/code' },
			data: { $ref: '#/types/base64Binary' },
			url: { $ref: '#/types/uri' },
			size: { $ref: '#/types/unsignedInt' },
			hash: { $ref: '#/types/base64Binary' },
			title: { $ref: '#/types/string' },
			creation: { $ref: '#/types/dateTime' }
		},
		additionalProperties: false
	},
	Coding: {
		type: 'object',
		properties: {
			system: { $ref: '#/types/uri' },
			version: { $ref: '#/types/string' },
			code: { $ref: '#/types/code' },
			display: { $ref: '#/types/string' },
			userSelected: { type: 'boolean' }
		},
		additionalProperties: false
	},
	CodeableConcept: {
		type: 'object',
		properties: {
			coding: {
				type: 'array',
				items: { $ref: '#/types/Coding' }
			},
			text: { $ref: '#/types/string' }
		},
		additionalProperties: false
	},
	Quantity: {
		type: 'object',
		properties: {
			value: { $ref: '#/types/decimal' },
			comparator: { $ref: '#/types/code' },
			unit: { $ref: '#/types/string' },
			system: { $ref: '#/types/uri' },
			code: { $ref: '#/types/code' }
		},
		additionalProperties: false
	},
	Age: { $ref: '#/types/Quantity' },
	Count: { $ref: '#/types/Quantity' },
	Money: { $ref: '#/types/Quantity' },
	Distance: { $ref: '#/types/Quantity' },
	Duration: { $ref: '#/types/Quantity' },
	SimpleQuantity: { $ref: '#/types/Quantity' },
	Range: {
		type: 'object',
		properties: {
			low: { $ref: '#/types/SimpleQuantity' },
			high: { $ref: '#/types/SimpleQuantity' }
		},
		additionalProperties: false
	},
	Ratio: {
		type: 'object',
		properties: {
			numerator: { $ref: '#/types/Quantity' },
			denominator: { $ref: '#/types/Quantity' }
		},
		additionalProperties: false
	},
	Period: {
		type: 'object',
		properties: {
			start: { $ref: '#/types/dateTime' },
			end: { $ref: '#/types/dateTime' }
		},
		additionalProperties: false
	},
	SampledData: {
		type: 'object',
		properties: {
			origin: { $ref: '#/types/SimpleQuantity' },
			period: { $ref: '#/types/decimal' },
			factor: { $ref: '#/types/decimal' },
			lowerLimit: { $ref: '#/types/decimal' },
			upperLimit: { $ref: '#/types/decimal' },
			dimensions: { $ref: '#/types/positiveInt' },
			data: { $ref: '#/types/string' }
		},
		additionalProperties: false
	},
	Identifier: {
		type: 'object',
		properties: {
			use: { $ref: '#/types/code' },
			type: { $ref: '#/types/CodeableConcept' },
			system: { $ref: '#/types/uri' },
			value: { $ref: '#/types/string' },
			period: { $ref: '#/types/Period' },
			assigner: { $ref: '#/types/Reference' }
		},
		additionalProperties: false
	},
	HumanName: {
		type: 'object',
		properties: {
			use: { $ref: '#/types/code' },
			text: { $ref: '#/types/string' },
			family: { $ref: '#/types/stringArray' },
			given: { $ref: '#/types/stringArray' },
			prefix: { $ref: '#/types/stringArray' },
			suffix: { $ref: '#/types/stringArray' },
			period: { $ref: '#/types/Period'}
		},
		additionalProperties: false
	},
	Address: {
		type: 'object',
		properties: {
			use: { $ref: '#/types/code' },
			type: { $ref: '#/types/code' },
			text: { $ref: '#/types/string' },
			line: { $ref: '#/types/stringArray' },
			city: { $ref: '#/types/string' },
			district: { $ref: '#/types/string' },
			state: { $ref: '#/types/string' },
			postalCode: { $ref: '#/types/string' },
			country: { $ref: '#/types/string' },
			period: { $ref: '#/types/Period'}
		},
		additionalProperties: false
	},
	ContactPoint: {
		type: 'object',
		properties: {
			system: { $ref: '#/types/code' },
			value: { $ref: '#/types/string' },
			use: { $ref: '#/types/code' },
			rank: { $ref: '#/types/positiveInt' },
			period: { $ref: '#/types/Period' }
		},
		additionalProperties: false
	},
	Timing: {
		type: 'object',
		properties: {
			event: {
				type: 'array',
				items: { $ref: '#/types/dateTime' }
			},
			repeat: { $ref: '#/types/Repeat' },
			code: { $ref: '#/types/CodeableConcept' }
		},
		additionalProperties: false
	},
	Signature: {
		type: 'object',
		properties: {
			type: {
				type: 'array',
				items: { $ref: '#/types/Coding' },
			},
			when: { $ref: '#/types/instant' },
			whoUri: { $ref: '#/types/uri' },
			whoReference: { $ref: '#/types/Reference' },
			contentType: { $ref: '#/types/code' },
			blob: { $ref: '#/types/base64Binary' }
		},
		additionalProperties: false
	},
	Annotation: {
		type: 'object',
		properties: {
			authorReference: { $ref: '#/types/Reference' },
			authorString: { $ref: '#/types/string' },
			time: { $ref: '#/types/dateTime' },
			text: { $ref: '#/types/string' }
		},
		additionalProperties: false
	},
	Narrative: {
		type: 'object',
		properties: {
			status: { $ref: '#/types/code' },
			div: { $ref: '#/types/xhtml' }
		},
		required: ['status'],
		additionalProperties: false
	},
	Element: {},
	Extension: {
		type: 'object',
		properties: {
			url: { $ref: '#/types/uri' },
			valueInteger: { $ref: '#/types/integer' },
			valueDecimal: { $ref: '#/types/decimal' },
			valueDateTime: { $ref: '#/types/dateTime' },
			valueDate: { $ref: '#/types/date' },
			valueInstant: { $ref: '#/types/instant' },
			valueString: { $ref: '#/types/string' },
			valueUri: { $ref: '#/types/uri' },
			valueBoolean: { $ref: '#/types/boolean' },
			valueCode: { $ref: '#/types/code' },
			valueMarkdown: { $ref: '#/types/markdown' },
			valueBase64Binary: { $ref: '#/types/base64Binary' },
			valueCoding: { $ref: '#/types/Coding' },
			valueCodeableConcept: { $ref: '#/types/CodeableConcept' },
			valueAttachment: { $ref: '#/types/Attachment' },
			valueIdentifier: { $ref: '#/types/Identifier' },
			valueQuantity: { $ref: '#/types/Quantity' },
			valueRange: { $ref: '#/types/Range' },
			valuePeriod: { $ref: '#/types/Period' },
			valueRatio: { $ref: '#/types/Ratio' },
			valueHumanName: { $ref: '#/types/HumanName' },
			valueAddress: { $ref: '#/types/Address' },
			valueContactPoint: { $ref: '#/types/ContactPoint' },
			valueTiming: { $ref: '#/types/Timing' },
			valueSignature: { $ref: '#/types/Signature' },
			valueReference: { $ref: '#/types/Reference' }
		},
		required: ['url'],
		additionalProperties: false
	},
	Reference: {
		type: 'object',
		properties: {
			reference: { $ref: '#/types/string' },
			display: { $ref: '#/types/string' }
		},
		additionalProperties: false
	},
	Repeat: {
		type: 'object',
		properties: {
			boundsQuantity: { $ref: '#/types/Duration' },
			boundsRange: { $ref: '#/types/Range' },
			boundsPeriod: { $ref: '#/types/Period' },
			count: { $ref: '#/types/integer' },
			duration: { $ref: '#/types/decimal' },
			durationMax: { $ref: '#/types/decimal' },
			durationUnits: { $ref: '#/types/code' },
			frequency: { $ref: '#/types/integer' },
			frequencyMax: { $ref: '#/types/integer' },
			period: { $ref: '#/types/decimal' },
			periodMax: { $ref: '#/types/decimal' },
			periodUnits: { $ref: '#/types/code' },
			when: { $ref: '#/types/code' }
		},
		additionalProperties: false
	},
	Meta: {
		type: 'object',
		properties: {
			versionId: {
				type: 'object',
				properties: {
					id: {
						pattern: '[A-Za-z0-9-.]{1,64}'
					}
				}
			},
			lastUpdated: { $ref: '#/types/instant' },
			profile: {
				type: 'array',
				items: { $ref: '#/types/uri' }
			},
			security: {
				type: 'array',
				items: { $ref: '#/types/Coding' }
			},
			tag: {
				type: 'array',
				items: { $ref: '#/types/Coding' }
			}
		},
		additionalProperties: false
	}
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
						description: { $ref: '#/types/string' },
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
			description: { $ref: '#/types/string' },
			start: { $ref: '#/types/instant' },
			end: { $ref: '#/types/instant' },
			minutesDuration: { $ref: '#/types/unsignedInt' },
			slot: {
				type: 'array',
				items: { $ref: '#/types/Reference' }
			},
			comment: { $ref: '#/types/string' },
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
			comment: { $ref: '#/types/string' }
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
		properties: {
			category: {},
			sender: {},
			recipient: {
				type: 'array',
				items: {
					$ref: '#/types/Reference'
				}
			},
			payload: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contentString: {},
						contentAttachment: {},
						contentReference: {}
					},
					oneOf: [
						{ required: ['contentString'] },
						{ required: ['contentAttachment'] },
						{ required: ['contentReference'] }]
				}
			},
			medium: {
				type: 'array',
				items: {
					$ref: '#/types/CodeableConcept'
				}
			},
			requester: {},
			status: {},
			encounter: {},
			scheduledDateTime: {},
			scheduledPeriod: {},
			reason: {
				type: 'array',
				items: {
					$ref: '#/types/CodeableConcept'
				}
			},
			requestedOn: {},
			subject: {},
			priority: {}
		},
		required: []
	},
	Composition: {
		properties: {
			date: {},
			type: {},
			class: {},
			title: {},
			status: {},
			confidentiality: {},
			subject: {},
			author: {},
			attester: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						mode: {},
						time: {},
						party: {}
					}
				}
			},
			custodian: {},
			event: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						period: {},
						detail: {}
					}
				}
			},
			encounter: {},
			section: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						title: {},
						code: {},
						text: {},
						mode: {},
						orderedBy: {},
						entry: {},
						emptyReason: {},
						section: {}
					}
				}
			}
		},
		required: ['date','type','title','status','subject','author']
	},
	ConceptMap: {
		properties: {
			url: {},
			identifier: {},
			version: {},
			name: {},
			status: {},
			experimental: {},
			publisher: {},
			contact: {
				type: 'object',
				properties: {
					name: {},
					telecom: {}
				}
			},
			date: {},
			description: {},
			useContext: {},
			requirements: {},
			copyright: {},
			sourceUri: {},
			sourceReference: {},
			targetUri: {},
			targetReference: {},
			element: {
				type: 'object',
				properties: {
					codeSystem: {},
					code: {},
					target: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								codeSystem: {},
								code: {},
								equivalence: {},
								comments: {},
								dependsOn: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											element: {},
											codeSystem: {},
											code: {}
										},
										required: ['element','codeSystem','code']
									}
								},
								product: {}
							},
							required: ['equivalence']
						}
					}
				}
			}
		},
		oneOf: [
			{ required: ['sourceUri','targetUri'] },
			{ required: ['sourceUri','targetReference'] },
			{ required: ['sourceReference','targetUri'] },
			{ required: ['sourceReference','targetReference'] }],
		required: ['status']
	},
	Condition: {
		properties: {
			identifier: {},
			patient: {},
			encounter: {},
			asserter: {},
			dateRecorded: {},
			code: {},
			category: {},
			clinicalStatus: {},
			verificationStatus: {},
			severity: {},
			onsetDateTime: {},
			onsetQuantity: {},
			onsetPeriod: {},
			onsetRange: {},
			onsetString: {},
			abatementDateTime: {},
			abatementQuantity: {},
			abatementBoolean: {},
			abatementPeriod: {},
			abatementRange: {},
			abatementString: {},
			stage: {
				type: 'object',
				properties: {
					summary: {},
					assessment: {}
				}
			},
			evidence: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						detail: {}
					}
				}
			},
			bodySite: {},
			notes: {}
		},
		required: ['patient','code','verificationStatus']
	},
	Conformance: {
		properties: {
			url: {},
			version: {},
			name: {},
			status: {},
			experimental: {},
			publisher: {},
			contact: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {},
						telecom: {}
					}
				}
			},
			date: {},
			description: {},
			requirements: {},
			copyright: {},
			kind: {},
			software: {
				type: 'object',
				properties: {
					name: {},
					version: {},
					releaseDate: {}
				}
			},
			implementation: {
				type: 'object',
				properties: {
					description: {},
					url: {}
				}
			},
			fhirVersion: {},
			acceptUnknown: {},
			format: {},
			profile: {},
			rest: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						mode: {},
						documentation: {},
						security: {
							type: 'object',
							properties: {
								cors: {},
								service: {},
								description: {},
								certificate: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											type: {},
											blob: {}
										}
									}
								}
							}
						},
						resource: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									type: {},
									profile: {},
									interaction: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												code: {},
												documentation: {}
											}
										}
									},
									versioning: {},
									readHistory: {},
									updateCreate: {},
									conditionalCreate: {},
									conditionalUpdate: {},
									conditionalDelete: {},
									searchInclude: {},
									searchRevInclude: {},
									searchParam: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												name: {},
												definition: {},
												type: {},
												documentation: {},
												target: {},
												modifier: {},
												chain: {}
											}
										}
									}
								}
							}
						},
						interaction: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									code: {},
									documentation: {}
								}
							}
						},
						transactionMode: {},
						searchParam: {},
						operation: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									name: {},
									definition: {}
								}
							}
						},
						compartment: {}
					}
				}
			},
			messaging: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						endpoint: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									protocol: {},
									address: {}
								}
							}
						},
						reliableCache: {},
						documentation: {},
						event: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									code: {},
									category: {},
									mode: {},
									focus: {},
									request: {},
									response: {},
									documentation: {}
								}
							}
						}
					}
				}
			},
			document: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						mode: {},
						documentation: {},
						profile: {}
					}
				}
			}
		},
		required: []
	},
	Contract: {
		properties: {
			identifier: {},
			issued: {},
			applies: {},
			subject: {},
			authority: {},
			domain: {},
			type: {},
			subType: {},
			action: {},
			actionReason: {},
			actor: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						entity: {},
						role: {}
					},
					required: ['entity']
				}
			},
			valuedItem: {
				type: 'array',
				items: {
					entityCodeableConcept: {},
					entityReference: {},
					identifier: {},
					effectiveTime: {},
					quantity: {},
					unitPrice: {},
					factor: {},
					points: {},
					net: {}
				}
			},
			signer: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						type: {},
						party: {},
						signature: {}
					},
					required: ['type','party','signature']
				}
			},
			term: {},
			bindingAttachment: {},
			bindingReference: {},
			friendly: {},
			legal: {},
			rule: {}
		},
		required: []
	},
	Coverage: {
		properties: {
			issuer: {},
			bin: {},
			period: {},
			type: {},
			subscriberId: {},
			identifier: {},
			group: {},
			plan: {},
			subPlan: {},
			dependent: {},
			sequence: {},
			subscriber: {},
			network: {},
			contract: {}
		},
		required: []
	},
	DataElement: {
		properties: {
			url: {},
			identifier: {},
			version: {},
			name: {},
			status: {},
			experimental: {},
			publisher: {},
			contact: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: {},
						telecom: {}
					}
				}
			},
			date: {},
			useContext: {},
			copyright: {},
			stringency: {},
			mapping: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identity: {},
						uri: {},
						name: {},
						comments: {}
					},
					required: ['identity']
				}
			},
			element: {}
		},
		required: ['status', 'element']
	},
	DetectedIssue: {
		properties: {
			patient: {},
			category: {},
			severity: {},
			implicated: {},
			detail: {},
			date: {},
			author: {},
			identifier: {},
			reference: {},
			mitigation: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						action: {},
						date: {},
						author: {}
					},
					required: ['action']
				}
			}
		},
		required: []
	},
	Device: {
		properties: {
			identifier: {},
			type: {},
			note: {},
			status: {},
			manufacturer: {},
			model: {},
			version: {},
			manufactureDate: {},
			expiry: {},
			udi: {},
			lotNumber: {},
			owner: {},
			location: {},
			patient: {},
			contact: {},
			url: {}
		},
		required: []
	},
	DeviceComponent: {
		properties: {
			type: {},
			identifier: {},
			lastSystemChange: {},
			source: {},
			parent: {},
			operationalStatus: {},
			parameterGroup: {},
			measurementPrinciple: {},
			productionSpecification: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						specType: {},
						componentId: {},
						productionSpec: {}
					}
				}
			},
			languageCode: {}
		},
		required: []
	},
	DeviceMetric: {
		properties: {
			type: {},
			identifier: {},
			unit: {},
			source: {},
			parent: {},
			operationalStatus: {},
			color: {},
			category: {},
			measurementPeriod: {},
			calibration: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						type: {},
						state: {},
						time: {}
					}
				}
			}
		},
		required: ['type', 'identifier', 'category']
	},
	DeviceUseRequest: {
		properties: {
			bodySiteCodeableConcept: {},
			bodySiteReference: {},
			status: {},
			device: {},
			encounter: {},
			identifier: {},
			indication: {},
			notes: {},
			prnReason: {},
			orderedOn: {},
			recordedOn: {},
			subject: {},
			timingTiming: {},
			timingPeriod: {},
			timingDateTime: {},
			priority: {}
		},
		required: ['device', 'subject']
	},
	DeviceUseStatement: {
		properties: {
			bodySiteCodeableConcept: {},
			bodySiteReference: {},
			whenUsed: {},
			device: {},
			identifier: {},
			indication: {},
			notes: {},
			recordedOn: {},
			subject: {},
			timingTiming: {},
			timingPeriod: {},
			timingDateTime: {}
		},
		required: []
	},
	DiagnosticOrder: {
		properties: {
			subject: {},
			orderer: {},
			identifier: {},
			encounter: {},
			reason: {},
			supportingInformation: {},
			specimen: {},
			status: {},
			priority: {},
			event: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						status: {},
						description: {},
						dateTime: {},
						actor: {}
					}
				}
			},
			item: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						specimen: {},
						bodySite: {},
						status: {},
						event: {}
					}
				}
			},
			note: {}
		},
		required: ['subject']
	},
	DiagnosticReport: {
		properties: {
			identifier: {},
			status: {},
			category: {},
			code: {},
			subject: {},
			encounter: {},
			effectiveDateTime: {},
			effectivePeriod: {},
			issued: {},
			performer: {},
			request: {},
			specimen: {},
			result: {},
			imagingStudy: {},
			image: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						comment: {},
						link: {}
					},
					required: ['link']
				}
			},
			conclusion: {},
			codedDiagnosis: {},
			presentedForm: {}
		},
		required: []
	},
	DocumentManifest: {
		properties: {
			masterIdentifier: {},
			identifier: {},
			subject: {},
			recipient: {},
			type: {},
			author: {},
			created: {},
			source: {},
			status: {},
			description: {},
			content: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						pAttachment: {},
						pReference: {}
					}
				}
			},
			related: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: {},
						ref: {}
					}
				}
			}
		},
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
		properties: {
			identifier: {},
			status: {},
			patient: {},
			practitioner: {},
			encounter: {},
			prescription: {},
			wasNotGiven: {},
			reasonNotGiven: {},
			reasonGiven: {},
			effectiveTimeDateTime: {},
			effecitveTimePeriod: {},
			medicationCodeableConcept: {},
			medicationReference: {},
			device: {},
			note: {},
			dosage: {
				type: 'object',
				properties: {
					text: {},
					siteCodeableConcept: {},
					siteReference: {},
					route: {},
					method: {},
					quantity: {},
					rateRatio: {},
					rateRange: {}
				}
			}
		},
		required: ['status', 'patient'],
		oneOf: [
			{ required: ['medicationCodeableConcept', 'effectiveTimeDateTime'] },
			{ required: ['medicationReference', 'effectiveTimeDateTime'] },
			{ required: ['medicationCodeableConcept', 'effectiveTimePeriod'] },
			{ required: ['medicationReference', 'effectiveTimePeriod'] }
		]
	},
	MedicationDispense: {
		properties: {
			identifier: {},
			status: {},
			patient: {},
			dispenser: {},
			authorizingPrescription: {},
			type: {},
			quantity: {},
			daysSupply: {},
			medicationCodeableConcept: {},
			medicationReference: {},
			whenPrepared: {},
			whenHandedOver: {},
			destination: {},
			receiver: {},
			note: {},
			dosageIntruction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: {},
						additionalInstructions: {},
						timing: {},
						asNeededBoolean: {},
						asNeededCodeableConcept: {},
						siteCodeableConcept: {},
						siteReference: {},
						route: {},
						method: {},
						doseRange: {},
						doseQuantity: {},
						rateRatio: {},
						rateRange: {},
						maxDosePerPeriod: {}
					}
				}
			},
			substitution: {
				type: 'object',
				properties: {
					type: {},
					reason: {},
					responsibleParty: {}
				},
				required: ['type']
			}
		},
		required: [],
		oneOf: [
			{ required: ['medicationCodeableConcept'] },
			{ required: ['medicationReference'] }
		]
	},
	MedicationOrder: {
		properties: {
			identifier: {},
			dateWritten: {},
			status: {},
			dateEnded: {},
			reasonEnded: {},
			patient: {},
			prescriber: {},
			encounter: {},
			reasonCodeableConcept: {},
			reasonReference: {},
			note: {},
			medicationCodeableConcept: {},
			medicationReference: {},
			dosageInstruction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: {},
						additionalInstructions: {},
						timing: {},
						asNeededBoolean: {},
						asNeededCodeableConcept: {},
						siteCodeableConcept: {},
						siteReference: {},
						route: {},
						method: {},
						doseRange: {},
						doseQuantity: {},
						rateRatio: {},
						rateRange: {},
						maxDosePerPeriod: {}
					}
				}
			},
			dispenseRequest: {
				type: 'object',
				properties: {
					medicationCodeableConcept: {},
					medicationReference: {},
					validityPeriod: {},
					numberOfRepeatsAllowed: {},
					quantity: {},
					expectedSupplyDuration: {}
				}
			},
			substitution: {
				type: 'object',
				properties: {
					type: {},
					reason: {}
				},
				required: ['type']
			},
			priorPrescription: {}
		},
		required: [],
		oneOf: [
			{ required: ['medicationCodeableConcept'] },
			{ required: ['medicationReference'] }
		]
	},
	MedicationStatement: {
		properties: {
			patient: { $ref: '#/types/Reference' },
			informationSource: { $ref: '#/types/Reference' },
			dateAsserted: { $ref: '#/types/dateTime' },
			status: { $ref: '#/types/code' },
			wasNotTaken: { $ref: '#/types/boolean' },
			reasonNotTaken: {
				type: 'array',
				items: { $ref: '#/types/CodeableConcept' }
			},
			reasonForUseCodeableConcept: { $ref: '#/types/CodeableConcept' },
			reasonForUseReference: { $ref: '#/types/Reference' },
			effectiveDateTime: { $ref: '#/types/dateTime' },
			effectivePeriod: { $ref: '#/types/Period' },
			note: { $ref: '#/types/string' },
			supportingInformation: {
				type: 'array',
				items: { $ref: '#/types/Reference' }
			},
			medicationCodeableConcept: { $ref: '#/types/CodeableConcept' },
			medicationReference: { $ref: '#/types/Reference' },
			dosage: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: { $ref: '#/types/string' },
						timing: { $ref: '#/types/Timing' },
						asNeededBoolean: { $ref: '#/types/boolean' },
						asNeededCodeableConcept: { $ref: '#/types/CodeableConcept' },
						siteCodeableConcept: { $ref: '#/types/CodeableConcept' },
						siteReference: { $ref: '#/types/Reference' },
						route: { $ref: '#/types/CodeableConcept' },
						method: { $ref: '#/types/CodeableConcept' },
						quantityQuantity: { $ref: '#/types/SimpleQuantity' },
						quantityRange: { $ref: '#/types/Range' },
						rateRatio: { $ref: '#/types/Ratio' },
						rateRange: { $ref: '#/types/Range' },
						maxDosePerPeriod: { $ref: '#/types/Ratio' }
					},
					additionalProperties: false
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

