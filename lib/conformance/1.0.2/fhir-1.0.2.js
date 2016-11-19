var _ = require('lodash');

var DataTypes = [
	'boolean','string','decimal','uri','uriArray','integer','unsignedInt',
	'positiveInt','code','oid','markdown','xhtml','base64Binary','instant',
	'date','dateTime','time','Attachment','Coding','CodingArray','CodeableConcept',
	'Quantity','Age','Count','Money','Distance','Duration','SimpleQuantity','Range',
	'Ratio','Period','SampledData','Identifier','HumanName','Address','ContactPoint',
	'Timing','Signature','Annotation','Narrative','Element','Extension','Reference',
	'Repeat','Meta'
];

var Type = {};
_.each(DataTypes, function(type) {
	Type[type] = { $ref: '#/types/' + type };
	Type[type + 'Array'] = { $ref: '#/types/' + type + 'Array' };
});

var types = {
	boolean: {
		type: 'boolean'
	},
	string: {
		type: 'string'
	},
	decimal: {
		type: 'number'
	},
	uri: Type.string,
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
		type: 'string',
		pattern: '[^\s]+([\s]+[^\s]+)*'
	},
	oid: {
		type: 'string',
		pattern: 'urn:oid:[0-2](\.[1-9]\d*)+'
	},
	markdown: Type.string,
	xhtml: Type.string,
	base64Binary: {},
	instant: {
		type: 'number'
	},
	date: {
		type: 'string',
		pattern: '-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1]))?)?'
	},
	dateTime: {
		type: 'string',
		pattern: '-?[0-9]{4}(-(0[1-9]|1[0-2])(-(0[0-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?'
	},
	time: {
		type: 'string',
		pattern: '([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?'
	},
	Attachment: {
		type: 'object',
		properties: {
			contentType: Type.code,
			language: Type.code,
			data: Type.base64Binary,
			url: Type.uri,
			size: Type.unsignedInt,
			hash: Type.base64Binary,
			title: Type.string,
			creation: Type.dateTime
		}
	},
	Coding: {
		type: 'object',
		properties: {
			system: Type.uri,
			version: Type.string,
			code: Type.code,
			display: Type.string,
			userSelected: Type.boolean
		}
	},
	CodeableConcept: {
		type: 'object',
		properties: {
			coding: {
				type: 'array',
				items: Type.Coding
			},
			text: Type.string
		}
	},
	Quantity: {
		type: 'object',
		properties: {
			value: Type.decimal,
			comparator: Type.code,
			unit: Type.string,
			system: Type.uri,
			code: Type.code
		}
	},
	Age: Type.Quantity,
	Count: Type.Quantity,
	Money: Type.Quantity,
	Distance: Type.Quantity,
	Duration: Type.Quantity,
	SimpleQuantity: Type.Quantity,
	Range: {
		type: 'object',
		properties: {
			low: Type.SimpleQuantity,
			high: Type.SimpleQuantity
		}
	},
	ReferenceRange: {
		type: 'object',
		properties: {
			low: Type.SimpleQuantity,
			high: Type.SimpleQuantity,
			meaning: Type.CodeableConcept,
			age: Type.Range,
			text: Type.string
		}
	},
	Ratio: {
		type: 'object',
		properties: {
			numerator: Type.Quantity,
			denominator: Type.Quantity
		}
	},
	Period: {
		type: 'object',
		properties: {
			start: Type.dateTime,
			end: Type.dateTime
		}
	},
	SampledData: {
		type: 'object',
		properties: {
			origin: Type.SimpleQuantity,
			period: Type.decimal,
			factor: Type.decimal,
			lowerLimit: Type.decimal,
			upperLimit: Type.decimal,
			dimensions: Type.positiveInt,
			data: Type.string
		}
	},
	Identifier: {
		type: 'object',
		properties: {
			use: Type.code,
			type: Type.CodeableConcept,
			system: Type.uri,
			value: Type.string,
			period: Type.Period,
			assigner: Type.Reference
		}
	},
	HumanName: {
		type: 'object',
		properties: {
			use: Type.code,
			text: Type.string,
			family: Type.stringArray,
			given: Type.stringArray,
			prefix: Type.stringArray,
			suffix: Type.stringArray,
			period: Type.Period
		}
	},
	Address: {
		type: 'object',
		properties: {
			use: Type.code,
			type: Type.code,
			text: Type.string,
			line: Type.stringArray,
			city: Type.string,
			district: Type.string,
			state: Type.string,
			postalCode: Type.string,
			country: Type.string,
			period: Type.Period
		}
	},
	ContactPoint: {
		type: 'object',
		properties: {
			system: Type.code,
			value: Type.string,
			use: Type.code,
			rank: Type.positiveInt,
			period: Type.Period
		}
	},
	Timing: {
		type: 'object',
		properties: {
			event: {
				type: 'array',
				items: Type.dateTime
			},
			repeat: Type.Repeat,
			code: Type.CodeableConcept
		}
	},
	Signature: {
		type: 'object',
		properties: {
			type: {
				type: 'array',
				items: Type.Coding,
			},
			when: Type.instant,
			whoUri: Type.uri,
			whoReference: Type.Reference,
			contentType: Type.code,
			blob: Type.base64Binary
		}
	},
	Annotation: {
		type: 'object',
		properties: {
			authorReference: Type.Reference,
			authorString: Type.string,
			time: Type.dateTime,
			text: Type.string
		}
	},
	Narrative: {
		type: 'object',
		properties: {
			status: Type.code,
			div: Type.xhtml
		},
		required: ['status']
	},
	Element: {},
	Extension: {
		type: 'object',
		properties: {
			url: Type.uri,
			valueInteger: Type.integer,
			valueDecimal: Type.decimal,
			valueDateTime: Type.dateTime,
			valueDate: Type.date,
			valueInstant: Type.instant,
			valueString: Type.string,
			valueUri: Type.uri,
			valueBoolean: Type.boolean,
			valueCode: Type.code,
			valueMarkdown: Type.markdown,
			valueBase64Binary: Type.base64Binary,
			valueCoding: Type.Coding,
			valueCodeableConcept: Type.CodeableConcept,
			valueAttachment: Type.Attachment,
			valueIdentifier: Type.Identifier,
			valueQuantity: Type.Quantity,
			valueRange: Type.Range,
			valuePeriod: Type.Period,
			valueRatio: Type.Ratio,
			valueHumanName: Type.HumanName,
			valueAddress: Type.Address,
			valueContactPoint: Type.ContactPoint,
			valueTiming: Type.Timing,
			valueSignature: Type.Signature,
			valueReference: Type.Reference
		},
		required: ['url']
	},
	Reference: {
		type: 'object',
		properties: {
			reference: Type.string,
			display: Type.string
		}
	},
	Repeat: {
		type: 'object',
		properties: {
			boundsQuantity: Type.Duration,
			boundsRange: Type.Range,
			boundsPeriod: Type.Period,
			count: Type.integer,
			duration: Type.decimal,
			durationMax: Type.decimal,
			durationUnits: Type.code,
			frequency: Type.integer,
			frequencyMax: Type.integer,
			period: Type.decimal,
			periodMax: Type.decimal,
			periodUnits: Type.code,
			when: Type.code
		}
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
			lastUpdated: Type.instant,
			profile: Type.uriArray,
			security: Type.CodingArray,
			tag: Type.CodingArray
		}
	}
};

_.each(types, function(type, name) {
	if(type.type === 'object') {
		type.additionalProperties = false;
	}

	types[name + 'Array'] = {
		type: 'array',
		items: Type[name]
	};
});

var resources = {
	AllergyIntolerance: {
		properties: {
			onset: Type.dateTime,
			recordedDate: Type.dateTime,
			recorder: Type.Reference,
			patient: Type.Reference,
			substance: Type.CodeableConcept,
			reporter: Type.Reference,
			status: Type.code,
			criticality: Type.code,
			type: Type.code,
			category: Type.code,
			lastOccurence: Type.dateTime,
			note: Type.Annotation,
			reaction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						substance: Type.CodeableConcept,
						certainty: Type.code,
						manifestation: {
							type: 'array',
							items: Type.CodeableConcept,
							minItems: 1
						},
						description: Type.string,
						onset: Type.dateTime,
						severity: Type.code,
						exposureRoute: Type.CodeableConcept,
						note: Type.Annotation
					}
				}
			}
		},
		required: ['patient', 'substance']
	},
	Appointment: {
		properties: {
			status: Type.code,
			type: Type.CodeableConcept,
			reason: Type.CodeableConcept,
			priority: Type.unsignedInt,
			description: Type.string,
			start: Type.instant,
			end: Type.instant,
			minutesDuration: Type.unsignedInt,
			slot: Type.ReferenceArray,
			comment: Type.string,
			participant: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						type: Type.CodeableConceptArray,
						actor: Type.Reference,
						required: Type.code,
						status: Type.code
					},
					required: [ 'status' ]
				}
			}
		},
		required: ['status']
	},
	AppointmentResponse: {
		properties: {
			appointment: Type.Reference,
			start: Type.instant,
			end: Type.instant,
			participantType: Type.CodeableConceptArray,
			actor: Type.Reference,
			participantStatus: Type.code,
			comment: Type.string
		},
		required: ['appointment', 'participantStatus']
	},
	AuditEvent: {
		properties: {
			event: {
				type: 'object',
				properties: {
					type: Type.Coding,
					subtype: Type.CodingArray,
					action: Type.code,
					dateTime: Type.instant,
					outcome: Type.code,
					outcomeDesc: Type.string,
					purposeOfEvent: Type.CodingArray
				},
				required: ['type', 'dateTime']
			},
			participant: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						role: Type.CodeableConceptArray,
						reference: Type.Reference,
						userId: Type.Identifier,
						altId: Type.string,
						name: Type.string,
						requestor: Type.boolean,
						location: Type.Reference,
						policy: Type.uriArray,
						media: Type.Coding,
						network: {
							type: 'object',
							properties: {
								address: Type.string,
								type: Type.code
							}
						},
						purposeOfUse: Type.CodingArray
					},
					required: ['requestor']
				}
			},
			source: {
				type: 'object',
				properties: {
					site: Type.string,
					identifier: Type.Identifier,
					type: Type.CodingArray
				},
				required: ['identifier']
			},
			object: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: Type.Identifier,
						reference: Type.Reference,
						type: Type.Coding,
						role: Type.Coding,
						lifecycle: Type.Coding,
						securityLabel: Type.CodingArray,
						name: Type.string,
						description: Type.string,
						query: Type.base64Binary,
						detail: {
							type: 'object',
							properties: {
								type: Type.string,
								value: Type.base64Binary
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
			code: Type.CodeableConcept,
			subject: Type.Reference,
			author: Type.Reference,
			created: Type.date
		},
		required: ['code']
	},
	Binary: {
		properties: {
			contentType: Type.code,
			content: Type.base64Binary
		},
		required: ['contentType', 'content']
	},
	BodySite: {
		properties: {
			patient: Type.Reference,
			code: Type.CodeableConcept,
			modifier: Type.CodeableConceptArray,
			description: Type.string,
			image: Type.AttachmentArray
		},
		required: ['patient']
	},
	Bundle: {
		properties: {
			type: Type.code,
			total: Type.unsignedInt,
			link: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						relation: Type.string,
						url: Type.uri
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
						fullUrl: Type.uri,
						resource: {},
						search: {
							type: 'object',
							properties: {
								mode: Type.code,
								score: Type.decimal
							}
						},
						request: {
							type: 'object',
							properties: {
								method: Type.code,
								url: Type.uri,
								ifNoneMatch: Type.string,
								ifModifiedSince: Type.instant,
								ifMatch: Type.string,
								ifNoneExist: Type.string
							},
							required: ['method', 'url']
						},
						response: {
							type: 'object',
							properties: {
								status: Type.string,
								location: Type.uri,
								etag: Type.string,
								lastModified: Type.instant
							},
							required: ['status']
						}
					}
				}
			},
			signature: Type.Signature
		},
		required: ['type']
	},
	CarePlan: {
		properties: {
			subject: Type.Reference,
			status: Type.code,
			context: Type.Reference,
			period: Type.Period,
			author: Type.ReferenceArray,
			modified: Type.dateTime,
			category: Type.CodeableConceptArray,
			description: Type.string,
			addresses: Type.ReferenceArray,
			support: Type.ReferenceArray,
			relatedPlan: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: Type.code,
						plan: Type.Reference
					},
					required: ['plan']
				}
			},
			participant: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						role: Type.CodeableConcept,
						member: Type.Reference
					}
				}
			},
			goal: Type.ReferenceArray,
			activity: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						actionResulting: Type.ReferenceArray,
						progress: Type.AnnotationArray,
						reference: Type.Reference,
						detail: {
							type: 'object',
							properties: {
								category: Type.CodeableConcept,
								code: Type.CodeableConcept,
								reasonCode: Type.CodeableConceptArray,
								reasonReference: Type.ReferenceArray,
								goal: Type.ReferenceArray,
								status: Type.code,
								statusReason: Type.CodeableConcept,
								prohibited: Type.boolean,
								scheduledTiming: Type.Timing,
								scheduledPeriod: Type.Period,
								scheduledString: Type.string,
								location: Type.Reference,
								performer: Type.ReferenceArray,
								productCodeableConcept: Type.CodeableConcept,
								productReference: Type.Reference,
								dailyAmount: Type.SimpleQuantity,
								quantity: Type.SimpleQuantity,
								description: Type.string
							},
							required: ['prohibited']
						}
					}
				}
			},
			note: Type.Annotation
		},
		required: ['status']
	},
	Claim: {
		properties: {
			type: Type.code,
			ruleset: Type.Coding,
			originalRuleset: Type.Coding,
			created: Type.dateTime,
			target: Type.Reference,
			provider: Type.Reference,
			organization: Type.Reference,
			use: Type.code,
			priority: Type.Coding,
			fundsReserve: Type.Coding,
			enterer: Type.Reference,
			facility: Type.Reference,
			prescription: Type.Reference,
			originalPrescription: Type.Reference,
			payee: {
				type: 'object',
				properties: {
					type: Type.Coding,
					provider: Type.Reference,
					organization: Type.Reference,
					person: Type.Reference
				}
			},
			referral: Type.Reference,
			diagnosis: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: Type.positiveInt,
						diagnosis: Type.Coding
					},
					required: ['sequence', 'diagnosis']
				}
			},
			condition: Type.CodingArray,
			patient: Type.Reference,
			coverage: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: Type.positiveInt,
						focal: Type.boolean,
						coverage: Type.Reference,
						businessArrangement: Type.string,
						relationship: Type.Coding,
						preAuthRef: Type.stringArray,
						claimResponse: Type.Reference,
						originalRuleset: Type.Coding
					},
					required: ['sequence', 'focal', 'converage', 'relationship']
				}
			},
			exception: Type.CodingArray,
			school: Type.string,
			accident: Type.date,
			accidentType: Type.Coding,
			interventionException: Type.CodingArray,
			item: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: Type.positiveInt,
						type: Type.Coding,
						provider: Type.Reference,
						diagnosisLinkId: Type.positiveIntArray,
						service: Type.Coding,
						serviceDate: Type.date,
						quantity: Type.SimpleQuantity,
						unitPrice: Type.Money,
						factor: Type.decimal,
						points: Type.decimal,
						net: Type.Money,
						udi: Type.Coding,
						bodySite: Type.Coding,
						subSite: Type.CodingArray,
						modifier: Type.CodingArray,
						detail: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									sequence: Type.positiveInt,
									type: Type.Coding,
									service: Type.Coding,
									quantity: Type.SimpleQuantity,
									unitPrice: Type.Money,
									factor: Type.decimal,
									points: Type.decimal,
									net: Type.Money,
									udi: Type.Coding,
									subDetail: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												sequence: Type.positiveInt,
												type: Type.Coding,
												service: Type.Coding,
												quantity: Type.SimpleQuantity,
												unitPrice: Type.Money,
												factor: Type.decimal,
												points: Type.decimal,
												net: Type.Money,
												udi: Type.Coding
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
								intial: Type.boolean,
								priorDate: Type.date,
								priorMaterial: Type.Coding
							}
						}
					}
				},
				required: ['sequence', 'type', 'service']
			},
			additionalMaterials: Type.CodingArray,
			missingTeeth: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						tooth: Type.Coding,
						reason: Type.Coding,
						extractionDate: Type.date
					},
					required: ['tooth']
				}
			}
		},
		required: ['type', 'patient']
	},
	ClaimResponse: {
		properties: {
			request: Type.Reference,
			ruleset: Type.Coding,
			originalRuleset: Type.Coding,
			created: Type.dateTime,
			organization: Type.Reference,
			requestProvider: Type.Reference,
			requestOrganization: Type.Reference,
			outcome: Type.code,
			disposition: Type.string,
			payeeType: Type.Coding,
			item: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequenceLinkId: Type.positiveInt,
						noteNumber: Type.positiveIntArray,
						adjudication: {
							type: 'array',
							properties: {
								code: Type.Coding,
								amount: Type.Money,
								value: Type.decimal
							},
							required: ['code']
						},
						detail: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									sequenceLinkId: Type.positiveInt,
									adjudication: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												code: Type.Coding,
												amount: Type.Money,
												value: Type.decimal
											},
											required: ['code']
										}
									},
									subDetail: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												sequenceLinkId: Type.positiveInt,
												adjudication: {
													type: 'array',
													items: {
														type: 'object',
														properties: {
															code: Type.Coding,
															amount: Type.Money,
															value: Type.decimal
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
			addItem: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequenceLinkId: Type.positiveIntArray,
						service: Type.Coding,
						fee: Type.Money,
						noteNumberLinkId: Type.positiveIntArray,
						adjudication: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									code: Type.Coding,
									amount: Type.Money,
									value: Type.decimal
								}
							}
						},
						detail: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									service: Type.Coding,
									fee: Type.Money,
									adjudication: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												code: Type.Coding,
												amount: Type.Money,
												value: Type.decimal
											}
										}
									}
								}
							}
						}
					}
				}
			},
			error: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequenceLinkId: Type.positiveInt,
						detailSequenceLinkId: Type.positiveInt,
						subdetailSequenceLinkId: Type.positiveInt,
						code: Type.Coding
					}
				}
			},
			totalCost: Type.Money,
			unallocDeductable: Type.Money,
			totalBenefit: Type.Money,
			paymentAdjustment: Type.Money,
			paymentAdjustmentReason: Type.Coding,
			paymentDate: Type.date,
			paymentAmount: Type.Money,
			paymentRef: Type.Identifier,
			reserved: Type.Coding,
			form: Type.Coding,
			note: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						number: Type.positiveInt,
						type: Type.Coding,
						text: Type.string
					}
				}
			},
			coverage: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sequence: Type.positiveInt,
						focal: Type.boolean,
						coverage: Type.Reference,
						businessArrangement: Type.string,
						relationship: Type.Coding,
						preAuthRef: Type.stringArray,
						claimResponse: Type.Reference,
						originalRuleset: Type.Coding
					}
				}
			}
		},
		required: []
	},
	ClinicalImpression: {
		properties: {
			patient: Type.Reference,
			assessor: Type.Reference,
			status: Type.code,
			date: Type.dateTime,
			description: Type.string,
			previous: Type.Reference,
			problem: Type.ReferenceArray,
			triggerCodeableConcept: Type.CodeableConcept,
			triggerReference: Type.Reference,
			investigations: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: Type.CodeableConcept,
						item: Type.ReferenceArray
					},
					required: ['code']
				}
			},
			protocol: Type.uri,
			summary: Type.string,
			finding: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item: Type.CodeableConcept,
						cause: Type.string
					},
					required: ['item']
				}
			},
			resolved: Type.CodeableConceptArray,
			ruledOut: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item: Type.CodeableConcept,
						reason: Type.string
					},
					required: ['item']
				}
			},
			prognosis: Type.string,
			plan: Type.ReferenceArray,
			action: Type.ReferenceArray
		},
		required: ['status', 'patient']
	},
	Communication: {
		properties: {
			category: Type.CodeableConcept,
			sender: Type.Reference,
			recipient: Type.ReferenceArray,
			payload: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contentString: Type.string,
						contentAttachment: Type.Attachment,
						contentReference: Type.Reference
					}
				}
			},
			medium: Type.CodeableConceptArray,
			status: Type.code,
			encounter: Type.Reference,
			sent: Type.dateTime,
			received: Type.dateTime,
			reason: Type.CodeableConceptArray,
			subject: Type.Reference,
			requestDetail: Type.Reference
		},
		required: []
	},
	CommunicationRequest: {
		properties: {
			category: Type.CodeableConcept,
			sender: Type.Reference,
			recipient: Type.ReferenceArray,
			payload: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contentString: Type.string,
						contentAttachment: Type.Attachment,
						contentReference: Type.Reference
					},
					oneOf: [
						{ required: ['contentString'] },
						{ required: ['contentAttachment'] },
						{ required: ['contentReference'] }]
				}
			},
			medium: Type.CodeableConceptArray,
			requester: Type.Reference,
			status: Type.code,
			encounter: Type.Reference,
			scheduledDateTime: Type.dateTime,
			scheduledPeriod: Type.Period,
			reason: Type.CodeableConceptArray,
			requestedOn: Type.dateTime,
			subject: Type.Reference,
			priority: Type.CodeableConcept
		},
		required: []
	},
	Composition: {
		properties: {
			date: Type.dateTime,
			type: Type.CodeableConcept,
			class: Type.CodeableConcept,
			title: Type.string,
			status: Type.code,
			confidentiality: Type.code,
			subject: Type.Reference,
			author: {
				$ref: '#/types/ReferenceArray',
				minItems: 1
			},
			attester: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						mode: {
							$ref: '#/types/codeArray',
							minItems: 1
						},
						time: Type.dateTime,
						party: Type.Reference
					}
				}
			},
			custodian: Type.Reference,
			event: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: Type.CodeableConceptArray,
						period: Type.Period,
						detail: Type.ReferenceArray
					}
				}
			},
			encounter: Type.Reference,
			section: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						title: Type.string,
						code: Type.CodeableConcept,
						text: Type.Narrative,
						mode: Type.code,
						orderedBy: Type.CodeableConcept,
						entry: Type.ReferenceArray,
						emptyReason: Type.CodeableConcept,
						section: {} // nested
					}
				}
			}
		},
		required: ['date','type','title','status','subject','author']
	},
	ConceptMap: {
		properties: {
			url: Type.uri,
			identifier: Type.Identifier,
			version: Type.string,
			name: Type.string,
			status: Type.code,
			experimental: Type.boolean,
			publisher: Type.string,
			contact: {
				type: 'object',
				properties: {
					name: Type.string,
					telecom: Type.ContactPointArray
				}
			},
			date: Type.dateTime,
			description: Type.string,
			useContext: Type.CodeableConceptArray,
			requirements: Type.string,
			copyright: Type.string,
			sourceUri: Type.uri,
			sourceReference: Type.Reference,
			targetUri: Type.uri,
			targetReference: Type.Reference,
			element: {
				type: 'object',
				properties: {
					codeSystem: Type.uri,
					code: Type.code,
					target: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								codeSystem: Type.uri,
								code: Type.code,
								equivalence: Type.code,
								comments: Type.string,
								dependsOn: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											element: Type.uri,
											codeSystem: Type.uri,
											code: Type.string
										},
										required: ['element','codeSystem','code']
									}
								},
								product: {}// dependsOn array
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
			identifier: Type.IdentifierArray,
			patient: Type.Reference,
			encounter: Type.Reference,
			asserter: Type.Reference,
			dateRecorded: Type.date,
			code: Type.CodeableConcept,
			category: Type.CodeableConcept,
			clinicalStatus: Type.code,
			verificationStatus: Type.code,
			severity: Type.CodeableConcept,
			onsetDateTime: Type.dateTime,
			onsetQuantity: Type.Age,
			onsetPeriod: Type.Period,
			onsetRange: Type.Range,
			onsetString: Type.string,
			abatementDateTime: Type.dateTime,
			abatementQuantity: Type.Age,
			abatementBoolean: Type.boolean,
			abatementPeriod: Type.Period,
			abatementRange: Type.Range,
			abatementString: Type.string,
			stage: {
				type: 'object',
				properties: {
					summary: Type.CodeableConcept,
					assessment: Type.ReferenceArray
				}
			},
			evidence: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: Type.CodeableConcept,
						detail: Type.ReferenceArray
					}
				}
			},
			bodySite: Type.CodeableConceptArray,
			notes: Type.string
		},
		required: ['patient','code','verificationStatus']
	},
	Conformance: {
		properties: {
			url: Type.uri,
			version: Type.string,
			name: Type.string,
			status: Type.code,
			experimental: Type.boolean,
			publisher: Type.string,
			contact: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: Type.string,
						telecom: Type.ContactPointArray
					}
				}
			},
			date: Type.dateTime,
			description: Type.string,
			requirements: Type.string,
			copyright: Type.string,
			kind: Type.code,
			software: {
				type: 'object',
				properties: {
					name: Type.string,
					version: Type.string,
					releaseDate: Type.dateTime
				}
			},
			implementation: {
				type: 'object',
				properties: {
					description: Type.string,
					url: Type.uri
				}
			},
			fhirVersion: {}, // id
			acceptUnknown: Type.code,
			format: {
				$ref: '#/types/codeArray',
				minItems: 1
			},
			profile: Type.ReferenceArray,
			rest: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						mode: Type.code,
						documentation: Type.string,
						security: {
							type: 'object',
							properties: {
								cors: Type.boolean,
								service: Type.CodeableConceptArray,
								description: Type.string,
								certificate: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											type: Type.code,
											blob: Type.base64Binary
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
									type: Type.code,
									profile: Type.Reference,
									interaction: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												code: Type.code,
												documentation: Type.string
											},
											required: ['code']
										}
									},
									versioning: Type.code,
									readHistory: Type.boolean,
									updateCreate: Type.boolean,
									conditionalCreate: Type.boolean,
									conditionalUpdate: Type.boolean,
									conditionalDelete: Type.code,
									searchInclude: Type.stringArray,
									searchRevInclude: Type.stringArray,
									searchParam: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												name: Type.string,
												definition: Type.uri,
												type: Type.code,
												documentation: Type.string,
												target: Type.codeArray,
												modifier: Type.codeArray,
												chain: Type.stringArray
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
									code: Type.code,
									documentation: Type.string
								},
								required: ['code']
							}
						},
						transactionMode: Type.code,
						searchParam: {}, // searchParam array
						operation: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									name: Type.string,
									definition: Type.Reference
								}
							}
						},
						compartment: Type.uriArray
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
									protocol: Type.Coding,
									address: Type.uri
								}
							}
						},
						reliableCache: Type.unsignedInt,
						documentation: Type.string,
						event: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									code: Type.Coding,
									category: Type.code,
									mode: Type.code,
									focus: Type.code,
									request: Type.Reference,
									response: Type.Reference,
									documentation: Type.string
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
						mode: Type.code,
						documentation: Type.string,
						profile: Type.Reference
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
			issuer: Type.Reference,
			bin: Type.Identifier,
			period: Type.Period,
			type: Type.Coding,
			subscriberId: Type.Identifier,
			identifier: Type.IdentifierArray,
			group: Type.string,
			plan: Type.string,
			subPlan: Type.string,
			dependent: Type.positiveInt,
			sequence: Type.positiveInt,
			subscriber: Type.Reference,
			network: Type.Identifier,
			contract: Type.ReferenceArray
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
			identifier: Type.IdentifierArray,
			type: Type.CodeableConcept,
			note: Type.AnnotationArray,
			status: Type.code,
			manufacturer: Type.string,
			model: Type.string,
			version: Type.string,
			manufactureDate: Type.dateTime,
			expiry: Type.dateTime,
			udi: Type.string,
			lotNumber: Type.string,
			owner: Type.Reference,
			location: Type.Reference,
			patient: Type.Reference,
			contact: Type.ContactPointArray,
			url: Type.uri
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
		properties: {
			masterIdentifier: {},
			identifier: {},
			subject: {},
			type: {},
			class: {},
			author: {},
			custodian: {},
			authenticator: {},
			created: {},
			indexed: {},
			status: {},
			docStatus: {},
			relatesTo: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						target: {}
					},
					required: ['code', 'target']
				}
			},
			description: {},
			securityLabel: {},
			content: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						attachment: {},
						format: {}
					},
					required: ['attachment']
				}
			},
			context: {
				type: 'object',
				properties: {
					encounter: {},
					event: {},
					period: {},
					facilityType: {},
					practiceSetting: {},
					sourcePatientInfo: {},
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
				}
			}
		},
		required: []
	},
	EligibilityRequest: {
		properties: {
			identifier: {},
			ruleset: {},
			originalRuleset: {},
			created: {},
			target: {},
			provider: {},
			organization: {}
		},
		required: []
	},
	EligibilityResponse: {
		properties: {
			identifier: {},
			request: {},
			outcome: {},
			disposition: {},
			ruleset: {},
			originalRuleset: {},
			created: {},
			organization: {},
			requestProvider: {},
			requestOrganization: {}
		},
		required: []
	},
	Encounter: {
		properties: {
			identifier: Type.IdentifierArray,
			status: Type.code,
			statusHistory: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						status: Type.code,
						period: Type.Period
					},
					required: ['status', 'period']
				}
			},
			'class': Type.code,
			type: Type.CodeableConceptArray,
			priority: Type.CodeableConcept,
			patient: Type.Reference,
			episodeOfCare: Type.ReferenceArray,
			incomingReferral: Type.ReferenceArray,
			participant: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						type: Type.CodeableConceptArray,
						period: Type.Period,
						individual: Type.Reference
					}
				}
			},
			appointment: Type.Reference,
			period: Type.Period,
			length: Type.Duration,
			reason: Type.CodeableConceptArray,
			indication: Type.ReferenceArray,
			hospitalization: {
				type: 'object',
				properties: {
					preAdmissionIdentifier: Type.Identifier,
					origin: Type.Reference,
					admitSource: Type.CodeableConcept,
					admittingDiagnosis: Type.ReferenceArray,
					reAdmission: Type.CodeableConcept,
					dietPreference: Type.CodeableConceptArray,
					specialCourtesy: Type.CodeableConceptArray,
					specialArrangement: Type.CodeableConceptArray,
					destination: Type.Reference,
					dischargeDisposition: Type.CodeableConcept,
					dischargeDiagnosis: Type.ReferenceArray
				}
			},
			location: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						location: Type.Reference,
						status: Type.code,
						period: Type.Period
					},
					required: ['location']
				}
			},
			serviceProvider: Type.Reference,
			partOf: Type.Reference
		},
		required: []
	},
	EnrollmentRequest: {
		properties: {
			identifier: {},
			ruleset: {},
			originalRuleset: {},
			created: {},
			target: {},
			provider: {},
			organization: {},
			subject: {},
			coverage: {},
			relationship: {}
		},
		required: ['subject', 'coverage', 'relationship']
	},
	EnrollmentResponse: {
		properties: {
			identifier: {},
			request: {},
			outcome: {},
			disposition: {},
			ruleset: {},
			originalRuleset: {},
			created: {},
			organization: {},
			requestProvider: {},
			requestOrganization: {}
		},
		required: []
	},
	EpisodeOfCare: {
		properties: {
			identifier: {},
			status: {},
			statusHistory: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						status: {},
						period: {}
					},
					required: ['status', 'period']
				}
			},
			type: {},
			condition: {},
			patient: {},
			managingOrganization: {},
			period: {},
			referralRequest: {},
			careManager: {},
			careTeam: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						role: {},
						period: {},
						member: {}
					}
				}
			}
		},
		required: ['status', 'patient']
	},
	ExplanationOfBenefit: {
		properties: {
			identifier: Type.IndentifierArray,
			request: Type.Reference,
			outcome: Type.code,
			disposition: Type.string,
			ruleset: Type.Coding,
			originalRuleset: Type.Coding,
			created: Type.dateTime,
			organization: Type.Reference,
			requestProvider: Type.Reference,
			requestOrganization: Type.Reference
		},
		required: []
	},
	FamilyMemberHistory: {
		properties: {
			identifier: Type.IdentifierArray,
			patient: Type.Reference,
			date: Type.dateTime,
			status: Type.code,
			name: Type.string,
			relationship: Type.CodeableConcept,
			gender: Type.code,
			bornPeriod: Type.Period,
			bornDate: Type.date,
			bornString: Type.string,
			ageQuantity: Type.Age,
			ageRange: Type.Range,
			ageString: Type.string,
			deceasedBoolean: Type.boolean,
			deceasedQuantity: Type.Age,
			deceasedRange: Type.Range,
			deceasedDate: Type.date,
			deceasedString: Type.string,
			note: Type.Annotation,
			condition: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: Type.CodeableConcept,
						outcome: Type.CodeableConcept,
						onsetQuantity: Type.Age,
						onsetRange: Type.Range,
						onsetPeriod: Type.Period,
						onsetString: Type.string,
						note: Type.Annotation
					},
					required: ['code']
				}
			}
		},
		required: ['patient', 'status', 'relationship']
	},
	Flag: {
		properties: {
			identifier: Type.IdentifierArray,
			category: Type.CodeableConcept,
			status: Type.code,
			period: Type.Period,
			subject: Type.Reference,
			encounter: Type.Reference,
			author: Type.Reference,
			code: Type.CodeableConcept
		},
		required: ['status', 'subject', 'code']
	},
	Goal: {
		properties: {
			identifier: Type.IdentifierArray,
			subject: Type.Reference,
			startDate: Type.date,
			startCodeableConcept: Type.CodeableConcept,
			targetDate: Type.date,
			targetQuantity: Type.Duration,
			category: Type.CodeableConceptArray,
			description: Type.string,
			status: Type.code,
			statusDate: Type.date,
			statusReason: Type.CodeableConcept,
			author: Type.Reference,
			priority: Type.CodeableConcept,
			addresses: Type.ReferenceArray,
			note: Type.AnnotationArray,
			outcome: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						resultCodeableConcept: Type.CodeableConcept,
						resultReference: Type.Reference
					}
				}
			}
		},
		required: ['description', 'status']
	},
	Group: {
		properties: {
			identifier: {},
			type: {},
			actual: {},
			code: {},
			name: {},
			quantity: {},
			characteristic: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {},
						valueCodeableConcept: {},
						valueBoolean: {},
						valueQuantity: {},
						valueRange: {},
						exclude: {},
						period: {}
					},
					required: ['code', 'exclude'],
					oneOf: [
						{ required: ['valueCodeableConcept'] },
						{ required: ['valueBoolean'] },
						{ required: ['valueQuantity'] },
						{ required: ['valueRange'] }
					]
				}
			},
			member: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						entity: {},
						period: {},
						inactive: {}
					},
					required: ['entity']
				}
			}
		},
		required: ['actual', 'type']
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
		properties: {
			identifier: Type.IdentifierArray,
			status: Type.code,
			date: Type.dateTime,
			vaccineCode: Type.CodeableConcept,
			patient: Type.Reference,
			wasNotGiven: Type.boolean,
			reported: Type.boolean,
			performer: Type.Reference,
			requester: Type.Reference,
			encounter: Type.Reference,
			manufacturer: Type.Reference,
			location: Type.Reference,
			lotNumber: Type.string,
			expirationDate: Type.date,
			site: Type.CodeableConcept,
			route: Type.CodeableConcept,
			doseQuantity: Type.SimpleQuantity,
			note: Type.AnnotationArray,
			explanation: {
				type: 'object',
				properties: {
					reason: Type.CodeableConceptArray,
					reasonNotGiven: Type.CodeableConceptArray
				}
			},
			reaction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						date: Type.dateTime,
						detail: Type.Reference,
						reported: Type.boolean
					}
				}
			},
			vaccinationProtocol: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						doseSequence: Type.positiveInt,
						description: Type.string,
						authority: Type.Reference,
						series: Type.string,
						seriesDoses: Type.positiveInt,
						targetDisease: Type.CodeableConceptArray,
						doseStatus: Type.CodeableConcept,
						doseStatusReason: Type.CodeableConcept
					}
				}
			}
		},
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
		properties: {
			identifier: Type.IdentifierArray,
			title: Type.string,
			code: Type.CodeableConcept,
			subject: Type.Reference,
			source: Type.Reference,
			encounter: Type.Reference,
			status: Type.code,
			date: Type.dateTime,
			orderedBy: Type.CodeableConcept,
			mode: Type.code,
			note: Type.string,
			entry: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						flag: Type.CodeableConcept,
						deleted: Type.boolean,
						date: Type.dateTime,
						item: Type.Reference
					}
				}
			},
			emptyReason: Type.CodeableConcept
		},
		required: []
	},
	Location: {
		properties: {
			identifier: Type.IdentifierArray,
			status: Type.code,
			name: Type.string,
			description: Type.string,
			mode: Type.code,
			type: Type.CodeableConcept,
			telecom: Type.ContactPointArray,
			address: Type.Address,
			physicalType: Type.CodeableConcept,
			position: {
				type: 'object',
				properties: {
					longitude: Type.decimal,
					latitude: Type.decimal,
					altitude: Type.decimal
				},
				required: ['longitude', 'latitude']
			},
			managingOrganization: Type.Reference,
			partOf: Type.Reference
		},
		required: []
	},
	Media: {
		properties: {
			type: Type.code,
			subtype: Type.CodeableConcept,
			identifier: Type.IdentifierArray,
			subject: Type.Reference,
			operator: Type.Reference,
			view: Type.CodeableConcept,
			deviceName: Type.string,
			height: Type.positiveInt,
			width: Type.positiveInt,
			frames: Type.positiveInt,
			duration: Type.unsignedInt,
			content: Type.Attachment
		},
		required: ['content']
	},
	Medication: {
		properties: {
			code: Type.CodeableConcept,
			isBrand: Type.boolean,
			manufacturer: Type.Reference,
			product: {
				type: 'object',
				properties: {
					form: Type.CodeableConcept,
					ingredient: {
						type: 'array',
						items: {
							item: Type.Reference,
							amount: Type.Ratio
						},
						required: ['item']
					},
					batch: {
						type: 'array',
						properties: {
							lotNumber: Type.string,
							expirationDate: Type.dateTime
						}
					}
				}
			},
			package: {
				type: 'object',
				properties: {
					container: Type.CodeableConcept,
					content: {
						type: 'object',
						properties: {
							item: Type.Reference,
							amount: Type.SimpleQuantity
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
			identifier: Type.IdentifierArray,
			status: Type.code,
			patient: Type.Reference,
			practitioner: Type.Reference,
			encounter: Type.Reference,
			prescription: Type.Reference,
			wasNotGiven: Type.boolean,
			reasonNotGiven: Type.CodeableConceptArray,
			reasonGiven: Type.CodeableConceptArray,
			effectiveTimeDateTime: Type.dateTime,
			effecitveTimePeriod: Type.Period,
			medicationCodeableConcept: Type.CodeableConcept,
			medicationReference: Type.Reference,
			device: Type.ReferenceArray,
			note: Type.string,
			dosage: {
				type: 'object',
				properties: {
					text: Type.string,
					siteCodeableConcept: Type.CodeableConcept,
					siteReference: Type.Reference,
					route: Type.CodeableConcept,
					method: Type.CodeableConcept,
					quantity: Type.SimpleQuantity,
					rateRatio: Type.Ratio,
					rateRange: Type.Range
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
			identifier: Type.Identifier,
			status: Type.code,
			patient: Type.Reference,
			dispenser: Type.Reference,
			authorizingPrescription: Type.ReferenceArray,
			type: Type.CodeableConcept,
			quantity: Type.SimpleQuantity,
			daysSupply: Type.SimpleQuantity,
			medicationCodeableConcept: Type.CodeableConcept,
			medicationReference: Type.Reference,
			whenPrepared: Type.dateTime,
			whenHandedOver: Type.dateTime,
			destination: Type.Reference,
			receiver: Type.ReferenceArray,
			note: Type.string,
			dosageIntruction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: Type.string,
						additionalInstructions: Type.CodeableConcept,
						timing: Type.Timing,
						asNeededBoolean: Type.boolean,
						asNeededCodeableConcept: Type.CodeableConcept,
						siteCodeableConcept: Type.CodeableConcept,
						siteReference: Type.Reference,
						route: Type.CodeableConcept,
						method: Type.CodeableConcept,
						doseRange: Type.Range,
						doseQuantity: Type.SimpleQuantity,
						rateRatio: Type.Ratio,
						rateRange: Type.Range,
						maxDosePerPeriod: Type.Ratio
					}
				}
			},
			substitution: {
				type: 'object',
				properties: {
					type: Type.CodeableConcept,
					reason: Type.CodeableConceptArray,
					responsibleParty: Type.ReferenceArray
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
			identifier: Type.IdentifierArray,
			dateWritten: Type.dateTime,
			status: Type.code,
			dateEnded: Type.dateTime,
			reasonEnded: Type.CodeableConcept,
			patient: Type.Reference,
			prescriber: Type.Reference,
			encounter: Type.Reference,
			reasonCodeableConcept: Type.CodeableConcept,
			reasonReference: Type.Reference,
			note: Type.string,
			medicationCodeableConcept: Type.CodeableConcept,
			medicationReference: Type.Reference,
			dosageInstruction: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: Type.string,
						additionalInstructions: Type.CodeableConcept,
						timing: Type.Timing,
						asNeededBoolean: Type.boolean,
						asNeededCodeableConcept: Type.CodeableConcept,
						siteCodeableConcept: Type.CodeableConcept,
						siteReference: Type.Reference,
						route: Type.CodeableConcept,
						method: Type.CodeableConcept,
						doseRange: Type.Range,
						doseQuantity: Type.Quantity,
						rateRatio: Type.Ratio,
						rateRange: Type.Range,
						maxDosePerPeriod: Type.Ratio
					}
				}
			},
			dispenseRequest: {
				type: 'object',
				properties: {
					medicationCodeableConcept: Type.CodeableConcept,
					medicationReference: Type.Reference,
					validityPeriod: Type.Period,
					numberOfRepeatsAllowed: Type.positiveInt,
					quantity: Type.SimpleQuantity,
					expectedSupplyDuration: Type.Duration
				}
			},
			substitution: {
				type: 'object',
				properties: {
					type: Type.CodeableConcept,
					reason: Type.CodeableConcept
				},
				required: ['type']
			},
			priorPrescription: Type.Reference
		},
		required: [],
		oneOf: [
			{ required: ['medicationCodeableConcept'] },
			{ required: ['medicationReference'] }
		]
	},
	MedicationStatement: {
		properties: {
			patient: Type.Reference,
			informationSource: Type.Reference,
			dateAsserted: Type.dateTime,
			status: Type.code,
			wasNotTaken: Type.boolean,
			reasonNotTaken: {
				type: 'array',
				items: Type.CodeableConcept
			},
			reasonForUseCodeableConcept: Type.CodeableConcept,
			reasonForUseReference: Type.Reference,
			effectiveDateTime: Type.dateTime,
			effectivePeriod: Type.Period,
			note: Type.string,
			supportingInformation: {
				type: 'array',
				items: Type.Reference
			},
			medicationCodeableConcept: Type.CodeableConcept,
			medicationReference: Type.Reference,
			dosage: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						text: Type.string,
						timing: Type.Timing,
						asNeededBoolean: Type.boolean,
						asNeededCodeableConcept: Type.CodeableConcept,
						siteCodeableConcept: Type.CodeableConcept,
						siteReference: Type.Reference,
						route: Type.CodeableConcept,
						method: Type.CodeableConcept,
						quantityQuantity: Type.SimpleQuantity,
						quantityRange: Type.Range,
						rateRatio: Type.Ratio,
						rateRange: Type.Range,
						maxDosePerPeriod: Type.Ratio
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
		properties: {
			status: Type.code,
			category: Type.CodeableConcept,
			code: Type.CodeableConcept,
			subject: Type.Reference,
			encounter: Type.Reference,
			effectiveDateTime: Type.dateTime,
			effectivePeriod: Type.Period,
			issued: Type.instant,
			performer: Type.ReferenceArray,
			valueQuantity: Type.Quantity,
			valueCodeableConcept: Type.CodeableConcept,
			valueString: Type.string,
			valueRange: Type.Range,
			valueRatio: Type.Ratio,
			valueSampledData: Type.SampledData,
			valueAttachment: Type.Attachment,
			valueTime: Type.time,
			valueDateTime: Type.dateTime,
			valuePeriod: Type.Period,
			dataAbsentReason: Type.CodeableConcept,
			interpretation: Type.CodeableConcept,
			comments: Type.string,
			bodySite: Type.CodeableConcept,
			method: Type.CodeableConcept,
			specimen: Type.Reference,
			device: Type.Reference,
			referenceRange: { $ref: '#/types/ReferenceRangeArray' },
			related: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						type: Type.code,
						target: Type.Reference
					}
				}
			},
			component: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: Type.CodeableConcept,
						valueQuantity: Type.Quantity,
						valueCodeableConcept: Type.CodeableConcept,
						valueString: Type.string,
						valueRange: Type.Range,
						valueRatio: Type.Ratio,
						valueSampledData: Type.SampledData,
						valueAttachment: Type.Attachment,
						valueTime: Type.time,
						valueDateTime: Type.dateTime,
						valuePeriod: Type.Period,
						dataAbsentReason: Type.CodeableConcept,
						referenceRange: { $ref: '#/types/ReferenceRangeArray' }
					}
				}
			}

		},
		required: ['status', 'code']
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
			date: Type.dateTime,
			subject: Type.Reference,
			source: Type.Reference,
			target: Type.Reference,
			reasonCodeableConcept: Type.CodeableConcept,
			reasonReference: Type.Reference,
			when: {
				type: 'object',
				properties: {
					code: Type.CodeableConcept,
					schedule: Type.Timing
				}
			},
			detail: {
				$ref: '#/types/ReferenceArray',
				minItems: 1
			}
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
			identifier: Type.IdentifierArray,
			active: Type.boolean,
			name: Type.HumanNameArray,
			telecom: Type.ContactPointArray,
			gender: Type.code,
			birthDate: Type.date,
			deceasedBoolean: Type.boolean,
			deceasedDateTime: Type.dateTime,
			address: Type.AddressArray,
			maritalStatus: Type.CodeableConcept,
			multipleBirthBoolean: Type.boolean,
			multipleBirthInteger: Type.integer,
			photo: Type.AttachmentArray,
			contact: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						relationship: Type.CodeableConceptArray,
						name: Type.HumanName,
						telecom: Type.ContactPointArray,
						address: Type.Address,
						gender: Type.code,
						organization: Type.Reference,
						period: Type.Period
					}
				}
			},
			animal: {
				type: 'object',
				properties: {
					species: Type.CodeableConcept,
					breed: Type.CodeableConcept,
					genderStatus: Type.CodeableConcept
				},
				required: ['species']
			},
			communication: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						language: Type.CodeableConcept,
						preferred: Type.boolean
					},
					required: ['language']
				}
			},
			careProvider: Type.ReferenceArray,
			managingOrganization: Type.Reference,
			link: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						other: Type.Reference,
						type: Type.code
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
			name: Type.IdentifierArray,
			telecom: Type.HumanNameArray,
			gender: Type.code,
			birthDate: Type.date,
			address: Type.AddressArray,
			photo: Type.Attachment,
			managingOrganization: Type.Reference,
			active: Type.boolean,
			link: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						target: Type.Reference,
						assurance: Type.code
					},
					required: ['target']
				}
			}
		},
		required: []
	},
	Practitioner: {
		properties: {
			identifier: Type.IdentifierArray,
			active: Type.boolean,
			name: Type.HumanName,
			telecom: Type.ContactPointArray,
			address: Type.AddressArray,
			gender: Type.code,
			birthDate: Type.date,
			photo: Type.AttachmentArray,
			practitionerRole: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						managingOrganization: Type.Reference,
						role: Type.CodeableConcept,
						specialty: Type.CodeableConceptArray,
						period: Type.Period,
						location: Type.ReferenceArray,
						healthcareService: Type.ReferenceArray
					}
				}
			},
			qualification: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: Type.IdentifierArray,
						code: Type.code,
						period: Type.Period,
						issuer: Type.Reference
					},
					required: ['code']
				}
			},
			communication: Type.CodeableConceptArray
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
			identifier: Type.IdentifierArray,
			patient: Type.Reference,
			relationship: Type.CodeableConcept,
			name: Type.HumanName,
			telecom: Type.ContactPointArray,
			gender: Type.code,
			birthDate: Type.date,
			address: Type.AddressArray,
			photo: Type.AttachmentArray,
			period: Type.Period
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
			identifier: Type.IdentifierArray,
			status: Type.code,
			type: Type.CodeableConcept,
			parent: Type.ReferenceArray,
			subject: Type.Reference,
			accessionIdentifier: Type.Identifier,
			receivedTime: Type.dateTime,
			collection: {
				type: 'object',
				properties: {
					collector: Type.Reference,
					comment: Type.stringArray,
					collectedDateTime: Type.dateTime,
					collectedPeriod: Type.Period,
					quantity: Type.SimpleQuantity,
					method: Type.CodeableConcept,
					bodySite: Type.CodeableConcept
				}
			},
			treatment: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						description: Type.string,
						procedure: Type.CodeableConcept,
						additive: Type.ReferenceArray
					}
				}
			},
			container: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: Type.IdentifierArray,
						description: Type.string,
						type: Type.CodeableConcept,
						capacity: Type.SimpleQuantity,
						specimenQuantity: Type.SimpleQuantity,
						additiveCodeableConcept: Type.CodeableConcept,
						additiveReference: Type.Reference
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
			identifier: Type.IdentifierArray,
			category: Type.CodeableConceptArray,
			code: Type.CodeableConcept,
			description: Type.string,
			instance: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						identifier: Type.Identifier,
						expiry: Type.dateTime,
						quantity: Type.SimpleQuantity
					}
				}
			},
			ingredient: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						quantity: Type.Ratio,
						substance: Type.Reference
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
		id: {
			type: 'string',
			pattern: '[A-Za-z0-9\-\.]{1,64}'
		},
		meta: { $ref: '#/types/Meta' },
		implicitRules: Type.uri,
		language: Type.code
	}
};

var DomainResource = {
	properties: {
		text: Type.Narrative,
		contained: {},// resource array
		extension: { $ref: '#/types/ExtensionArray' },
		modifierExtension: { $ref: '#/types/ExtensionArray' }
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
