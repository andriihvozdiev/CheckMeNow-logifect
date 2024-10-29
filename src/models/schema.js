export const schema = {
    "models": {
        "UserDetails": {
            "name": "UserDetails",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "firstName": {
                    "name": "firstName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lastName": {
                    "name": "lastName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "vaccinationDate": {
                    "name": "vaccinationDate",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "postCode": {
                    "name": "postCode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "typeOfDocument": {
                    "name": "typeOfDocument",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "nationality": {
                    "name": "nationality",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "photoUrl": {
                    "name": "photoUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "userStatus": {
                    "name": "userStatus",
                    "isArray": false,
                    "type": {
                        "enum": "UserStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "chatState": {
                    "name": "chatState",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lastChatDate": {
                    "name": "lastChatDate",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "pushNotificationToken": {
                    "name": "pushNotificationToken",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "sideEffects": {
                    "name": "sideEffects",
                    "isArray": true,
                    "type": {
                        "nonModel": "SideEffect"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "sideEffectsDialogState": {
                    "name": "sideEffectsDialogState",
                    "isArray": false,
                    "type": {
                        "nonModel": "SideEffectDialogState"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "isSideEffectScenarioCompleted": {
                    "name": "isSideEffectScenarioCompleted",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "UserDetails",
            "attributes": [
                {
                    "type": "model",
                    "properties": {
                        "subscriptions": null
                    }
                },
                {
                    "type": "versioned",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmail",
                        "fields": [
                            "email"
                        ],
                        "queryField": "userDetailsByEmail"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "identityClaim": "cognito:username",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "SideEffects": {
            "name": "SideEffects",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "symptomType": {
                    "name": "symptomType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "dateTime": {
                    "name": "dateTime",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": true,
                    "attributes": []
                },
                "symptomDetails": {
                    "name": "symptomDetails",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "degreeType": {
                    "name": "degreeType",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "degreeTypeDetails": {
                    "name": "degreeTypeDetails",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "symptomTime": {
                    "name": "symptomTime",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "symptomProgress": {
                    "name": "symptomProgress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "symptomProgressDetails": {
                    "name": "symptomProgressDetails",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "moreDetails": {
                    "name": "moreDetails",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "isCompleted": {
                    "name": "isCompleted",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "SideEffects",
            "attributes": [
                {
                    "type": "model",
                    "properties": {
                        "subscriptions": null
                    }
                },
                {
                    "type": "versioned",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byEmail",
                        "fields": [
                            "email",
                            "dateTime"
                        ],
                        "queryField": "sideEffectsByEmail"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "Operation": {
            "name": "Operation",
            "values": [
                "START",
                "CHECK"
            ]
        },
        "UserStatus": {
            "name": "UserStatus",
            "values": [
                "UNVERIFIED",
                "INITIAL",
                "AWAITING_VACCINATION",
                "VACCINATION_CONFIRMED",
                "IMMUNITY_CONFIRMED"
            ]
        }
    },
    "nonModels": {
        "GPList": {
            "name": "GPList",
            "fields": {
                "StatusCode": {
                    "name": "StatusCode",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "Result": {
                    "name": "Result",
                    "isArray": true,
                    "type": {
                        "nonModel": "Surgery"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                }
            }
        },
        "Surgery": {
            "name": "Surgery",
            "fields": {
                "Name": {
                    "name": "Name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Details": {
                    "name": "Details",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Link": {
                    "name": "Link",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ChatNextOutput": {
            "name": "ChatNextOutput",
            "fields": {
                "inputText": {
                    "name": "inputText",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "outputText": {
                    "name": "outputText",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "intentName": {
                    "name": "intentName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "transitions": {
                    "name": "transitions",
                    "isArray": true,
                    "type": {
                        "nonModel": "TransitionOutput"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "action": {
                    "name": "action",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "modelField": {
                    "name": "modelField",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "TransitionOutput": {
            "name": "TransitionOutput",
            "fields": {
                "input": {
                    "name": "input",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "next": {
                    "name": "next",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "SideEffect": {
            "name": "SideEffect",
            "fields": {
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "outputText": {
                    "name": "outputText",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "user": {
                    "name": "user",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "SideEffectDialogState": {
            "name": "SideEffectDialogState",
            "fields": {
                "inputText": {
                    "name": "inputText",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "intentName": {
                    "name": "intentName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "outputText": {
                    "name": "outputText",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "modelField": {
                    "name": "modelField",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "action": {
                    "name": "action",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "transitions": {
                    "name": "transitions",
                    "isArray": true,
                    "type": {
                        "nonModel": "Transition"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                }
            }
        },
        "Transition": {
            "name": "Transition",
            "fields": {
                "input": {
                    "name": "input",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "next": {
                    "name": "next",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "version": "dc0a94ee07f0f5ae907bfc1876e3afc8"
};