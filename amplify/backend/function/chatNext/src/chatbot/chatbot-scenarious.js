module.exports = {
    "Unverified": {
        "start": {
            "outputText": "Hello, this app will allow you to show that you have been vaccinated against COVID19.",
            "transitions": [
                { "input": "default", "next": "benefit1" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "startPending": {
            "outputText": "Hi, like I said earlier, this app will allow you to show that you have been vaccinated against COVID19.",
            "transitions": [
                { "input": "default", "next": "benefit1" }
            ],
            "action": "wait::TYPING::5000"
        },
        "benefit1": {
            "outputText": "You may be able to access places or attend events that would not be possible otherwise, you may be exempt from certain social distancing or other protective requirements, however you must continue to follow local rules.",
            "transitions": [
                { "input": "default", "next": "benefit2" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "benefit2": {
            "outputText": "Having proven COVID19 immunity, venues will allow you to enter. There may still be social distancing requirements.",
            "transitions": [
                { "input": "default", "next": "receiveVaccination" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "receiveVaccination": {
            "outputText": "In order to gain the digital immunity passport, you will have to receive 2 doses of COVID19 vaccine.",
            "transitions": [
                { "input": "default", "next": "whenReceiveVaccination" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "whenReceiveVaccination": {
            "outputText": "When you have been vaccinated, the vaccination code will appear in your electronic health record.",
            "transitions": [
                { "input": "default", "next": "retrieveVaccination" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "retrieveVaccination": {
            "outputText": "We will retrieve the vaccination codes from your electronic health record and will generate a recognisable digital immunity passport.",
            "transitions": [
                { "input": "default", "next": "identityVerification" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "identityVerification": {
            "outputText": "To be able to access your electronic health records, we need to verify your identity. In order to do that, you will need to follow a very simple process.",
            "transitions": [
                { "input": "default", "next": "areYouReady" },
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ],
            "action": "wait::TYPING::5000"
        },
        "areYouReady": {
            "outputText": "If you want to do it now, you will need to have a document that will prove your identity. Are you ready to do it now?",
            "transitions": [
                { "input": "Yes", "next": "checkMyIdentity" },
                { "input": "No", "next": "comeLater" }
            ]
        },
        "checkMyIdentity": {
            "outputText": "Starting the process now...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::IdentityNavigation::workflow"
        },
        "comeLater": {
            "outputText": "No problem, you can do it anytime later.",
            "transitions": [
                { "input": "Check my identity", "next": "checkMyIdentity" }
            ]
        }
    },
    "NoNhsLinkage": {
        "start": {
            "outputText": "Dear Friend,\n To get access to your electronic health record where the COVID19 vaccination details are located, you will need to contact your GP surgery and ask them to provide you with the Linkage Key and the Account ID.",
            "transitions": [
                { "input": "default", "next": "sendLinkageKey" }
            ],
            "action": "wait::TYPING::5000"
        },
        "sendLinkageKey": {
            "outputText": "They will send the Linkage Key and the Account ID to you either as a letter or an email.",
            "transitions": [
                { "input": "default", "next": "haveReceivedLinkageKey" }
            ],
            "action": "wait::TYPING::5000"
        },
        "haveReceivedLinkageKey": {
            "outputText": "Have you received the Linkage Key and the Account ID from your GP surgery?",
            "transitions": [
                { "input": "Yes", "next": "yesReceivedLinkageKey" },
                { "input": "No", "next": "noReceivedLinkageKey" }
            ]
        },
        "yesReceivedLinkageKey": {
            "outputText": "Would you like to input the Linkage Key and the Account ID?",
            "transitions": [
                { "input": "Yes", "next": "yesInputLinkageKey" },
                { "input": "No", "next": "noInputLinkageKey" }
            ]
        },
        "yesInputLinkageKey": {
            "outputText": "Navigating to Linkage Key and Account ID screen...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::WizardNoNhsLinkage::workflow"
        },
        "noInputLinkageKey": {
            "outputText": "You can come back any time later to input the Linkage Key and Account ID in order to get your immunity passport.",
            "transitions": [
                { "input": "Input Linkage Key", "next": "yesInputLinkageKey" }
            ]
        },
        "noReceivedLinkageKey": {
            "outputText": "Please come back to the application as soon as you receive the Linkage Key and the Account ID.",
            "transitions": [
                { "input": "Input Linkage Key", "next": "yesInputLinkageKey" }
            ]
        }
    },
    "InitialStatus": {
        "start": {
            "outputText": "Hi {firstName}, the COVID19 vaccine will be administered in two doses. You will have to book the first appointment.",
            "transitions": [
                { "input": "default", "next": "askBookAppointment" }
            ],
            "action": "wait::TYPING::5000"
        },
        "askBookAppointment": {
            "outputText": "Would you like to book the first appointment now?",
            "transitions": [
                { "input": "Yes", "next": "bookAppoinment" },
                { "input": "No", "next": "bookAppoinmentLater" }
            ]
        },
        "bookAppoinment": {
            "outputText": "Starting the process now...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::WizardNoVaccine::workflow"
        },
        "bookAppoinmentLater": {
            "outputText": "You can do it anytime later from the home tab.",
            "transitions": [
                { "input": "Book first appoinment", "next": "bookAppoinment" },
            ]
        }
    },
    "InitialStatusOld": {
        "start": {
            "outputText": "Hi {firstName}, have you received COVID19 vaccine?",
            "transitions": [
                { "input": "Yes", "next": "haveVaccination" },
                { "input": "No", "next": "noVaccination" }
            ]
        },
        "startPending": {
            "outputText": "Hi {firstName}, We still do not know if you received COVID19 vaccine. Would you like to continue to see if you are eligible for the immunity passport?",
            "transitions": [
                { "input": "Yes", "next": "intendVaccination" },
                { "input": "No", "next": "explainVaccination" }
            ]
        },
        "noVaccination": {
            "outputText": "Do you intend to be vaccinated?",
            "transitions": [
                { "input": "Yes", "next": "intendVaccination" },
                { "input": "No", "next": "explainVaccination" }
            ]
        },
        "haveVaccination": {
            "outputText": "In order to check your vaccination record, we will need to know the GP surgery where you are registered. Please choose the GP surgery below.",
            "transitions": [
                { "input": "default", "next": "confirmGP" },
            ],
            "action": "select::GP_SURGERIES::map"
        },
        "confirmGP": {
            "outputText": "Can you please confirm that this is your GP surgery?\n{gpSurgery}",
            "transitions": [
                { "input": "Yes", "next": "vaccinationDate" },
                { "input": "No", "next": "selectGP" }
            ]
        },
        "selectGP": {
            "outputText": "Please choose the GP surgery where you are registered.",
            "transitions": [
                { "input": "default", "next": "confirmGP" }
            ],
            "action": "select::GP_SURGERIES::map"
        },
        "intendVaccination": {
            "outputText": "Below is the map of centres where you can book and receive the vaccine. Tap on the centre that suits you best and we will redirect to its web site. Book an appointment then come back to the application and let us know when you have received the vaccine.",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "select::VACCINATION_CENTRES::map"
        },
        "explainVaccination": {
            "outputText": "Vaccines are the most effective way to prevent infectious diseases. They're designed so they do not give people the infection they're protecting against. As more people receive the vaccination and gain immunity the restrictions around travel will reduce and more venues will be able to open. You may be able to access venues or travel sooner when you can show your immunity passport, social distancing restrictions may be reduced. Come back and let us know if you change you mind.",
            "transitions": [
                { "input": "Yes", "next": "intendVaccination" },
                { "input": "No", "next": "explainVaccination1" }

            ]
        },
        "explainVaccination1": {
            "outputText": "Vaccines save millions of lives each year. Vaccines work by training and preparing the body’s natural defences --- the immune system--- to recognise and fight off the microbes they target.  If the body is exposed to those disease-causing microbes later, the body is ready to fight them, preventing illness. Would you like to receive COVID19 vaccine?",
            "transitions": [
                { "input": "Yes", "next": "intendVaccination" },
                { "input": "No", "next": "explainVaccination2" }
            ]
        },
        "explainVaccination2": {
            "outputText": "Immunisation currently prevents 2-3 million deaths every year from diseases like diphtheria, tetanus, pertussis, influenza and measles. There are now vaccines to prevent more than 20 life-threatening diseases, and work is ongoing at unprecedented speed to also make COVID-19 a vaccine-preventable disease. Would you like to receive COVID19 vaccine?",
            "transitions": [
                { "input": "Yes", "next": "intendVaccination" },
                { "input": "No", "next": "explainVaccination" }
            ]
        },
        "vaccinationDate": {
            "outputText": "Could you specify the date when you received the vaccine? We will generate a digital immunity passport.",
            "transitions": [
                { "input": "default", "next": "thanksEnd" },
            ],
            "action": "input::VACCINATION_DATE::DATE"
        },
        "thanksEnd": {
            "outputText": "Many thanks for providing us the required information. We will let you know when we receive your vaccination record.",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "setStatus::AwaitingVaccination"
        }
    },
    "SecondDose": {
        "start": {
            "outputText": "Hi {firstName}, you will have to book an appointment to receive you second dose of the COVID19 vaccine.",
            "transitions": [
                { "input": "default", "next": "askBookAppointment" }
            ],
            "action": "wait::TYPING::5000"
        },
        "askBookAppointment": {
            "outputText": "Would you like to book the first appoinment now?",
            "transitions": [
                { "input": "Yes", "next": "bookAppoinment" },
                { "input": "No", "next": "bookAppoinmentLater" }
            ]
        },
        "bookAppoinment": {
            "outputText": "Starting the process now...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::WizardSecondVaccine::workflow"
        },
        "bookAppoinmentLater": {
            "outputText": "You can do it anytime later from the home tab.",
            "transitions": [
                { "input": "Book first appoinment", "next": "bookAppoinment" },
            ]
        }
    },
    "AwaitingVaccination": {
        "start": {
            "outputText": "Hi {firstName}, we are waiting for your vaccination data from your health record. As soon as we will receive the information we will notify you.",
            "transitions": [
                { "input": "default", "next": "wantVaccinationInformation" }
            ],
            "action": "wait::TYPING::5000"
        },
        "wantVaccinationInformation": {
            "outputText": "Before receiving a COVID19 vaccine there is some important information. Would you like to read this information now?",
            "transitions": [
                { "input": "Yes", "next": "@VaccineInformation" },
                { "input": "No", "next": "whatShouldIDoNext" },
            ]
        },
        "checkSideEffects": {
            "outputText": "If you have received the vaccine already, you may have noticed some side effects. Would you like to share any information about them?",
            "transitions": [
                { "input": "Yes", "next": "goingCheckSideEffects" },
                { "input": "No", "next": "comeLater" },
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ]
        },
        "goingCheckSideEffects": {
            "outputText": "Navigating to side effects tab...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::Main/Side effects::workflow"
        },
        "comeLater": {
            "outputText": "Use side effects tab and let us know if you have had any side effects. By sharing that information with us, you will help us to understand more about how the vaccine affects people.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
                { "input": "What should I do next", "next": "whatShouldIDoNext" },
            ]
        },
        "whatShouldIDoNext": {
            "outputText": "You don't need to do anything at the moment. As soon as we will receive the vaccination data from your medical records, we will notify you and we will let you know the next steps in order to issue the vaccination passport.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ]
        },
    },
    "FirstDoseConfirmed": {
        "start": {
            "outputText": "Hi {firstName}, we have received the first dose vaccination data from your electronic health records.",
            "transitions": [
                { "input": "default", "next": "notMaximallyProtected" }
            ],
            "action": "wait::TYPING::5000"
        },
        "notMaximallyProtected": {
            "outputText": "First dose may not be maximally effective protection against COVID-19 disease.",
            "transitions": [
                { "input": "default", "next": "effectiveAfterSecondDose" }
            ],
            "action": "wait::TYPING::5000"
        },
        "effectiveAfterSecondDose": {
            "outputText": "Protection against COVID-19 disease may be maximally effective only until at least 7 days after the second dose.",
            "transitions": [
                { "input": "default", "next": "afterImunnityPassport" }
            ],
            "action": "wait::TYPING::5000"
        },
        "afterImunnityPassport": {
            "outputText": "At that time we will be able to issue your immunity passport.",
            "transitions": [
                { "input": "default", "next": "bookSecondDose" }
            ],
            "action": "wait::TYPING::5000"
        },
        "bookSecondDose": {
            "outputText": "Based on NHS schedule you will be called to book another appointment in order to receive the second dose.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ],
        },
        "reportSymptoms": {
            "outputText": "Please let us know if you develop any symptoms. By sharing information with us, you will help us to understand more about how the vaccine affects people.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ],
        },
        "goingCheckSideEffects": {
            "outputText": "Navigating to side effects tab...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::Main/Side effects::workflow"
        },
        "findMoreAboutCovid": {
            "outputText": "Would you like to find out more about COVID-19 vaccines? Input your question bellow.",
            "transitions": [
                { "input": "default", "next": "" },
            ],
            "action": "input::ABOUT_VACCINE::TEXT",
            "modelField": "findAboutVaccines"
        },
        "whatShouldIDoNext": {
            "outputText": "You don't need to do anything at the moment. You just need to wait for the second dose of the vaccine to be given.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ]
        }
    },
    "CheckSideEffects": {
        "start": {
            "outputText": "Would you like to share any information about side effects from the COVID19 vaccine?",
            "transitions": [
                { "input": "Yes", "next": "receivedVaccine" },
                { "input": "No", "next": "noShare" }
            ],
        },
        "noShare": {
            "outputText": "Thank you. If you notice any side effects, please use the Side effects tab to let us know.",
            "transitions": [
                { "input": "Report side effects", "next": "start" },
            ],
        },
        "receivedVaccine": {
            "outputText": "Which vaccine you have received?",
            "outputTextRestart": "Which vaccine you have received?",
            "transitions": [
                { "input": "Pfizer-BioNTech", "next": "treatmentMedicine" },
                { "input": "AstraZeneca", "next": "treatmentMedicine" },
                { "input": "Do not know", "next": "treatmentMedicine" },
            ],
            "modelField": "vaccineType"
        },
        "treatmentMedicine": {
            "outputText": "We would like to know if you have any illnesses, or are taking any medicines, that might affect your immune response. Please can you review the below list and select any that apply to you",
            "outputTextRestart": "We would like to know if you have any illnesses, or are taking any medicines, that might affect your immune response. Please can you review the below list and select any that apply to you",
            "transitions": [
                { "input": "Back", "next": "receivedVaccine" },
                { "input": "No illnesses or medicines", "next": "unusualSymptoms" },
                { "input": "Taking regular steroid treatment", "next": "unusualSymptoms" },
                { "input": "Recently had treatment for cancer, leukaemia or lymphoma (radiotherapy or chemotherapy)", "next": "unusualSymptoms" },
                { "input": "Recently had a bone marrow transplant or taking medicines following a transplant (e.g. kidney, lung, heart, liver", "next": "unusualSymptoms" },
                { "input": "Taking regular medicines for rheumatoid arthritis (or other types of arthritis except osteoarthritis)", "next": "unusualSymptoms" },
                { "input": "Taking medicines for inflammatory bowel disease (Crohn's disease, ulcerative colitis)", "next": "unusualSymptoms" },
                { "input": "Taking medicines for multiple sclerosis", "next": "unusualSymptoms" },
                { "input": "Spleen has been removed", "next": "unusualSymptoms" },
                { "input": "HIV-positive with symptoms or reduction in immune response", "next": "unusualSymptoms" },
                { "input": "Taking other tratments or medicines, not listed above, known to lower the immune response and increase the risk of infections", "next": "unusualSymptoms" },
                { "input": "Has an illness or condition, not listed above, which reduces the immune response (e.g. immunodeficiency)", "next": "unusualSymptoms" },
            ],
            "modelField": "treatmentMedicines"
        },
        "moreTreatmentMedicinesDetails": {
            "outputText": "Would you like to provide more details in free text?",
            "outputTextRestart": "Would you like to provide more details in free text?",
            "transitions": [
                { "input": "Yes", "next": "inputTreatmentMedicinesDetails" },
                { "input": "No", "next": "unusualSymptoms" },
            ],
        },
        "inputTreatmentMedicinesDetails": {
            "outputText": "Please provide any relevant medical history details. Please do not include identifiable personal information.",
            "outputTextRestart": "Please provide any relevant medical history details. Please do not include identifiable personal information.",
            "transitions": [
                { "input": "default", "next": "unusualSymptoms" },
            ],
            "action": "input::ABOUT_TREATMENT::TEXT",
            "modelField": "treatmentMedicinesDetails"
        },
        "unusualSymptoms": {
            "outputText": "Please choose the reaction that you think were caused by the vaccine",
            "outputTextRestart": "Please choose the reaction, or reactions, that you think were caused by the vaccine",
            "transitions": [
                { "input": "Back", "next": "treatmentMedicine" },
                { "input": "Headache", "next": "moreUnusualSymptomsDetails" },
                { "input": "Muscular pain", "next": "moreUnusualSymptomsDetails" },
                { "input": "Tenderness", "next": "moreUnusualSymptomsDetails" },
                { "input": "Pain at injection site", "next": "moreUnusualSymptomsDetails" },
                { "input": "Fatigue", "next": "moreUnusualSymptomsDetails" },
                { "input": "Nausea, diarrhoea, vomiting", "next": "moreUnusualSymptomsDetails" },
                { "input": "Sweating", "next": "moreUnusualSymptomsDetails" },
                { "input": "Joint pain", "next": "moreUnusualSymptomsDetails" },
                { "input": "Fever, generally feeling unwell (malaise), shivering", "next": "moreUnusualSymptomsDetails" },
                { "input": "Local reactions: redness, swelling, bruising, hardness around the area where the vaccine is injected", "next": "moreUnusualSymptomsDetails" },
                { "input": "Rash", "next": "moreUnusualSymptomsDetails" },
                { "input": "Other", "next": "moreUnusualSymptomsDetails" }
            ],
            "modelField": "symptomType"
        },
        "moreUnusualSymptomsDetails": {
            "outputText": "Would you like to add more reactions?",
            "outputTextRestart": "Would you like to add more reactions?",
            "transitions": [
                { "input": "Yes", "next": "unusualSymptoms" },
                { "input": "No", "next": "inputStartReaction" },
            ],
        },
        "inputStartReaction": {
            "outputText": "When did the reaction start?",
            "outputTextRestart": "When did the reaction start?",
            "transitions": [
                { "input": "Back", "next": "unusualSymptoms" },
                { "input": "default", "next": "reactionOccuring" },
            ],
            "action": "input::START_REACTION::DATE",
            "modelField": "startReaction"
        },
        "reactionOccuring": {
            "outputText": "Is the reaction still occurring, or has it resolved?",
            "outputTextRestart": "Is the reaction still occurring, or has it resolved?",
            "transitions": [
                { "input": "Back", "next": "inputStartReaction" },
                { "input": "Recovered/resolved", "next": "inputReactionResolved" },
                { "input": "Recovering/resolving", "next": "testedPositiveAfterVaccine" },
                { "input": "Not recovered/not resolved", "next": "testedPositiveAfterVaccine" },
                { "input": "Recovered with some lasting effects", "next": "inputReactionResolved" },
                { "input": "Unknown", "next": "testedPositiveAfterVaccine" },
            ],
            "modelField": "reactionOccuring",
        },
        "inputReactionResolved": {
            "outputText": "If the reaction has resolved, when did the reaction stop?",
            "outputTextRestart": "If the reaction has resolved, when did the reaction stop?",
            "transitions": [
                { "input": "Back", "next": "reactionOccuring" },
                { "input": "default", "next": "testedPositiveAfterVaccine" },
            ],
            "action": "input::REACTION_RESOLVED::DATE",
            "modelField": "reactionResolved"
        },
        "testedPositiveAfterVaccine": {
            "outputText": "Since having the vaccine have you tested positive for COVID-19?",
            "outputTextRestart": "Since having the vaccine have you tested positive for COVID-19?",
            "transitions": [
                { "input": "Back", "next": "inputReactionResolved" },
                { "input": "Yes", "next": "dateTestedPositiveAfterVaccine" },
                { "input": "No", "next": "describeReaction" }
            ],
            "modelField": "testedPositiveAfterVaccine"
        },
        "dateTestedPositiveAfterVaccine": {
            "outputText": "Please provide the date of COVID-19 test after having the vaccine",
            "outputTextRestart": "Please provide the date of COVID-19 test after having the vaccine",
            "transitions": [
                { "input": "Back", "next": "testedPositiveAfterVaccine" },
                { "input": "default", "next": "reportingReaction" }
            ],
            "action": "input::DATE_TESTED_POSITIVE_AFTER_VACCINE::DATE",
            "modelField": "dateTestedPositiveAfterVaccine",
        },
        "describeReaction": {
            "outputText": "Would you like to provide more detail about any side effects?  For example sequence of events, any treatment received or any other relevant information",
            "outputTextRestart": "Would you like to provide more detail about any side effects?  For example sequence of events, any treatment received or any other relevant information",
            "transitions": [
                { "input": "Yes", "next": "inputDescribeReaction" },
                { "input": "No", "next": "relevantInvestigations" }
            ],
        },
        "inputDescribeReaction": {
            "outputText": "Please type below",
            "outputTextRestart": "Please type below",
            "transitions": [
                { "input": "default", "next": "relevantInvestigations" },
            ],
            "action": "input::DESCRIBE_REACTION::TEXT",
            "modelField": "describeReaction"
        },
        "relevantInvestigations": {
            "outputText": "Would you like to provide details of any relevant investigations or tests conducted?",
            "outputTextRestart": "Would you like to provide details of any relevant investigations or tests conducted?",
            "transitions": [
                { "input": "Yes", "next": "inputRelevantInvestigations" },
                { "input": "No", "next": "reportingReaction" }
            ],
        },
        "inputRelevantInvestigations": {
            "outputText": "Please type below",
            "outputTextRestart": "Please type below",
            "transitions": [
                { "input": "default", "next": "reportingReaction" },
            ],
            "action": "input::RELEVANT_INVESTIGATIONS::TEXT",
            "modelField": "relevantInvestigations"
        },
        "reportingReaction": {
            "outputText": "Please let us know how severely you were affected by the reaction",
            "outputTextRestart": "Please let us know how severely you were affected by the reaction",
            "transitions": [
                { "input": "Back", "next": "dateTestedPositiveAfterVaccine" },
                { "input": "Not considered serious", "next": "covidSymptoms" },
                { "input": "Mild or slightly uncomfortable", "next": "covidSymptoms" },
                { "input": "Uncomfortable, a nuisance or irritation, but able to carry on with everyday activities", "next": "covidSymptoms" },
                { "input": "Had short term effect that was bad enough to affect everyday activities", "next": "covidSymptoms" },
                { "input": "Caused significant or long term incapacity", "next": "covidSymptoms" },
                { "input": "Significant enough to lead you to seek advice from a healthcare professional", "next": "covidSymptoms" },
                { "input": "Caused an abnormality in an unborn child", "next": "covidSymptoms" },
                { "input": "Life threatening", "next": "covidSymptoms" },
            ],
            "modelField": "reportingReaction",
        },
        "covidSymptoms": {
            "outputText": "Have you had symptoms associated with COVID-19?",
            "outputTextRestart": "Have you had symptoms associated with COVID-19?",
            "transitions": [
                { "input": "Back", "next": "reportingReaction" },
                { "input": "Yes", "next": "testedPositive" },
                { "input": "No", "next": "testedPositive" },
                { "input": "Unsure", "next": "testedPositive" },
            ],
            "modelField": "covidSymptoms",
        },
        "testedPositive": {
            "outputText": "Have you tested positive for COVID-19?",
            "outputTextRestart": "Have you tested positive for COVID-19?",
            "transitions": [
                { "input": "Back", "next": "covidSymptoms" },
                { "input": "Yes", "next": "dateTestedPositive" },
                { "input": "No", "next": "studyEnrolled" },

            ],
            "modelField": "testedPositive",
        },
        "dateTestedPositive": {
            "outputText": "Please provide the date of COVID-19 test",
            "outputTextRestart": "Please provide the date of COVID-19 test",
            "transitions": [
                { "input": "Back", "next": "testedPositive" },
                { "input": "default", "next": "studyEnrolled" },
            ],
            "action": "input::DATE_TESTED_POSITIVE::DATE",
            "modelField": "dateTestedPositive",
        },
        "studyEnrolled": {
            "outputText": "Are you currently enrolled in a study or clinical trial?",
            "outputTextRestart": "Are you currently enrolled in a study or clinical trial?",
            "transitions": [
                { "input": "Back", "next": "dateTestedPositive" },
                { "input": "Yes", "next": "thanksEnd" },
                { "input": "No", "next": "thanksEnd" },
                { "input": "Unsure", "next": "thanksEnd" },
            ],
            "modelField": "studyEnrolled",
        },
        "inputStudyEnrolled": {
            "outputText": "Please provide any details, such as the EudraCT number and/or the study name, if known, and the investigational drug",
            "outputTextRestart": "Please provide any details, such as the EudraCT number and/or the study name, if known, and the investigational drug",
            "transitions": [
                { "input": "default", "next": "thanksEnd" },
            ],
            "action": "input::STUDY_ENROLLED::TEXT",
            "modelField": "studyEnrolledDetails",
        },
        "thanksEnd": {
            "outputText": "Thanks for providing us the side effect information.",
            "transitions": [
                { "input": "Back", "next": "studyEnrolled" },
                { "input": "Report side effects", "next": "start" },
            ],
            "modelField": "isCompleted",
        },
    },
    "CheckSideEffectsProgress": {
        "start": {
            "outputText": "Are there any other details about side effects you would like to share with us today?",
            "transitions": [
                { "input": "Yes", "next": "howFeelingNow" },
                { "input": "No", "next": "noSymptoms" }
            ]
        },
        "inputMoreSymptomDetails": {
            "outputText": "Please type any details below.",
            "transitions": [
                { "input": "default", "next": "howFeelingNow" },
            ],
            "action": "input::SIDE_EFFECT::TEXT",
            "modelField": "symptomDetails"
        },
        "howFeelingNow": {
            "outputText": "How are you feeling now?",
            "transitions": [
                { "input": "Better (no more symptoms)", "next": "thanksEnd" },
                { "input": "Getting better", "next": "thanksEnd" },
                { "input": "Still have symptoms", "next": "thanksEnd" },
                { "input": "More seriously ill", "next": "thanksEnd" },
                { "input": "Other", "next": "thanksEnd" },
                { "input": "default", "next": "thanksEnd" },
            ],
            "modelField": "symptomProgress",
        },
        "moreHowFeelingNowDetails": {
            "outputText": "Would you like to add more details?",
            "transitions": [
                { "input": "Yes", "next": "inputMoreHowFeelingNowDetails" },
                { "input": "No", "next": "thanksEnd" },
            ]
        },
        "inputMoreHowFeelingNowDetails": {
            "outputText": "Please type any details below.",
            "transitions": [
                { "input": "default", "next": "thanksEnd" },
            ],
            "action": "input::FEELING_NOW::TEXT",
            "modelField": "symptomProgressDetails",
        },
        "noSymptoms": {
            "outputText": "If you notice any side effects, please use the Symptoms tab to let us know.",
            "transitions": [
                { "input": "Report side effects", "next": "start" },
            ]
        },
        "thanksEnd": {
            "outputText": "Thanks for providing us the side effect information.",
            "transitions": [
                { "input": "Report side effects", "next": "start" },
            ],
            "modelField": "isCompleted",
        }
    },
    "VaccineInformation": {
        "start": {
            "outputText": "There are two vaccines currently used in the UK. One is \"COVID-19 Vaccine AstraZeneca\" and another is \"COVID-19 mRNA Vaccine BNT162b2 Pfizer\". \nWe will refer further to these two vaccines as AstraZeneca and Pfizer\nWhich one are you interested in knowing more about?",
            "transitions": [
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" }
            ]
        },
        "noMoreAboutVaccines": {
            "outputText": "You can come back later to find out more about other vaccines",
            "transitions": [
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" }
            ]
        },
        "astraZenecaStart": {
            "outputText": "The  AstraZeneca vaccine is used to protect people aged 18 years and older against COVID-19.\nCOVID-19 is caused by a virus called coronavirus (SARS-CoV-2).",
            "transitions": [
                { "input": "More info", "next": "astraZenecaHowItWorks" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaHowItWorks": {
            "outputText": "The AstraZeneca vaccine stimulates the body’s natural defences (immune system). It causes the body to produce its own protection (antibodies) against the virus. This will help to protect you against COVID-19 in the future. None of the ingredients in this vaccine can cause COVID-19.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaWhatDoYouNeedToKnow": {
            "outputText": "What you need to know before you receive the AstraZeneca COVID-19 Vaccine ",
            "transitions": [
                { "input": "More info", "next": "astraZenecaDoNotHave" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaDoNotHave": {
            "outputText": "Do not have the vaccine if you have ever had a severe allergic reaction to any of the following substances\nL-histidine, L-histidine hydrochloride monohydrate, magnesium chloride hexahydrate, polysorbate 80, ethanol, sucrose, sodium chloride, disodium edetate dihydrate",
            "transitions": [
                { "input": "More info", "next": "astraZenecaTellYourDoctorNotSure" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaTellYourDoctorNotSure": {
            "outputText": "If you are not sure, talk to your doctor, pharmacist or nurse.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaTellYourDoctorBeforeVaccination1" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaTellYourDoctorBeforeVaccination1": {
            "outputText": "Tell your doctor, pharmacist or nurse before vaccination, if you have ever had a severe allergic reaction (anaphylaxis) after any other vaccine injection",
            "transitions": [
                { "input": "More info", "next": "astraZenecaTellYourDoctorBeforeVaccination2" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaTellYourDoctorBeforeVaccination2": {
            "outputText": "If you currently have a severe infection with a high temperature (over 38°C).\nHowever, a mild fever or infection, like a cold, are not reasons to delay vaccination.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaTellYourDoctorBeforeVaccination3" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaTellYourDoctorBeforeVaccination3": {
            "outputText": "If you have a problem with bleeding or bruising, or if you are taking a blood thinning medicine(anticoagulant)",
            "transitions": [
                { "input": "More info", "next": "astraZenecaTellYourDoctorBeforeVaccination4" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaTellYourDoctorBeforeVaccination4": {
            "outputText": "If your immune system does not work properly (immunodeficiency) or you are taking medicines that weaken the immune system (such as high-dose corticosteroids, immunosuppressants or cancer medicines)",
            "transitions": [
                { "input": "More info", "next": "astraZenecaNotSureAbove" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaNotSureAbove": {
            "outputText": "If you are not sure if any of the above applies to you, talk to your doctor, pharmacist or nurse before you are given the vaccine.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaNotProtectEveryone" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaNotProtectEveryone": {
            "outputText": "As with any vaccine, the AstraZeneca vaccine may not protect everyone who is vaccinated from COVID-19.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaNotYetKnown" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaNotYetKnown": {
            "outputText": "It is not yet known how long people who receive the vaccine will be protected for.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaNoData" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaNoData": {
            "outputText": "No data are currently available in individuals with a weakened immune system or who are taking chronic treatment that suppresses or prevents immune responses",
            "transitions": [
                { "input": "More info", "next": "astraZenecaChildrenAdolescents" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaChildrenAdolescents": {
            "outputText": "No data are currently available on the use of the AstraZeneca vaccine in children and adolescents younger than 18 years of age",
            "transitions": [
                { "input": "More info", "next": "astraZenecaOtherMedicines" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaOtherMedicines": {
            "outputText": "Tell your doctor, pharmacist or nurse if you are taking, have recently taken or might take, any other medicines or vaccines",
            "transitions": [
                { "input": "More info", "next": "astraZenecaPregnantBreastfeeding" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaPregnantBreastfeeding": {
            "outputText": "If you are pregnant or breastfeeding, think you may be pregnant, or are planning to have a baby, tell your doctor, pharmacist or nurse.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaDriving" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaDriving": {
            "outputText": "The AstraZeneca vaccine has no known effect on the ability to drive and use machines.\nHowever, vaccine side effects may impact your ability to drive and use machines. If you feel unwell, do not drive or use machines.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaSodium" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaSodium": {
            "outputText": "This medicine contains less than 1 mmol sodium (23 mg) per dose of 0.5 ml. This means that it is essentially ‘sodium-free’.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaAlcohol" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaAlcohol": {
            "outputText": "This medicine contains a very small amount of alcohol (0.002 mg of alcohol (ethanol) per dose of 0.5 ml). This is not enough to cause any noticeable effects",
            "transitions": [
                { "input": "More info", "next": "astraZenecaHowIsGiven" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaHowIsGiven": {
            "outputText": "How the AstraZeneca vaccine is given",
            "transitions": [
                { "input": "More info", "next": "astraZenecaInjected" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaInjected": {
            "outputText": "The AstraZeneca vaccine is injected into a muscle (usually in the upper arm)",
            "transitions": [
                { "input": "More info", "next": "astraZenecaTwoDoses" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaTwoDoses": {
            "outputText": "You will receive 2 injections. You will be told when you need to return for your second injection of the AstraZeneca vaccine",
            "transitions": [
                { "input": "More info", "next": "astraZenecaDosesInterval" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaDosesInterval": {
            "outputText": "The second injection can be given between 4 and 12 weeks after the first injection",
            "transitions": [
                { "input": "More info", "next": "astraZenecaSecondDose" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaSecondDose": {
            "outputText": "When the  AstraZeneca vaccine is given as the first injection, the AstraZeneca vaccine (and not another vaccine against COVID-19) should be given as the second injection to complete the vaccination course",
            "transitions": [
                { "input": "More info", "next": "astraZenecaMissSecondDose" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaMissSecondDose": {
            "outputText": "What if you miss your second injection",
            "transitions": [
                { "input": "More info", "next": "astraZenecaMissSecondDose2" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaMissSecondDose2": {
            "outputText": "If you forget to go back at the scheduled time, ask your doctor, pharmacist or nurse for advice. It is important that you return for your second injection of the AstraZeneca vaccine.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaPossibleSideEffects" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "astraZenecaLikeAll" },
            ]
        },
        "astraZenecaPossibleSideEffects": {
            "outputText": "What are possible side effects",
            "transitions": [
                { "input": "More info", "next": "astraZenecaLikeAll" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaLikeAll": {
            "outputText": "Like all medicines, this vaccine may cause side effects ",
            "transitions": [
                { "input": "More info", "next": "astraZenecaMildSideEffects" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaMildSideEffects": {
            "outputText": "In clinical studies with the vaccine, most side effects were mild to moderate in nature and resolved within a few days with some still present a week after vaccination",
            "transitions": [
                { "input": "More info", "next": "astraZenecaParacetamol" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaParacetamol": {
            "outputText": "If side effects such as pain and/or fever are troublesome, medicines containing paracetamol can be taken",
            "transitions": [
                { "input": "More info", "next": "astraZenecaVeryCommonSideEffects" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaVeryCommonSideEffects": {
            "outputText": "Very common side effects that occurred during clinical trials with the  AstraZeneca vaccine were as follows",
            "transitions": [
                { "input": "More info", "next": "astraZenecaVeryCommonSideEffects1" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaVeryCommonSideEffects1": {
            "outputText": "Tenderness, pain, warmth, redness, itching, swelling or bruising at the injection site",
            "transitions": [
                { "input": "More info", "next": "astraZenecaVeryCommonSideEffects2" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaVeryCommonSideEffects2": {
            "outputText": "generally feeling unwell\nfeeling tired (fatigue)\nchills or feeling feverish\nheadache\nfeeling sick (nausea)\njoint pain or muscle ache",
            "transitions": [
                { "input": "More info", "next": "astraZenecaCommonSideEffects" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaCommonSideEffects": {
            "outputText": "Common side effects are as follows",
            "transitions": [
                { "input": "More info", "next": "astraZenecaCommonSideEffects1" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaCommonSideEffects1": {
            "outputText": "a lump at the injection site\nfever\nbeing sick (vomiting)",
            "transitions": [
                { "input": "More info", "next": "astraZenecaCommonSideEffects2" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaCommonSideEffects2": {
            "outputText": "Flu-like symptoms, such as high temperature, sore throat, runny nose, cough and chills",
            "transitions": [
                { "input": "More info", "next": "astraZenecaUncommonSideEffects" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaUncommonSideEffects": {
            "outputText": "Uncommon side effects are as follows",
            "transitions": [
                { "input": "More info", "next": "astraZenecaUncommonSideEffects1" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaUncommonSideEffects1": {
            "outputText": "feeling dizzy\ndecreased appetite\nabdominal pain\nenlarged lymph nodes\nexcessive sweating, itchy skin or rash",
            "transitions": [
                { "input": "More info", "next": "astraZenecaRareReports" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaRareReports": {
            "outputText": "In clinical trials there were very rare reports of events associated with inflammation of the nervous system, which may cause numbness, pins and needles, and/or loss of feeling.",
            "transitions": [
                { "input": "More info", "next": "astraZenecaRareReportsNotClear" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaRareReportsNotClear": {
            "outputText": "It is not confirmed whether these events were due to the vaccine",
            "transitions": [
                { "input": "More info", "next": "astraZenecaNotMentionedEffects" },
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
            ]
        },
        "astraZenecaNotMentionedEffects": {
            "outputText": "If you notice any side effects not mentioned in this leaflet, please inform your doctor, pharmacist or nurse",
            "transitions": [
                { "input": "What is AstraZeneca vaccine?", "next": "astraZenecaStart" },
                { "input": "What do you need to know?", "next": "astraZenecaWhatDoYouNeedToKnow" },
                { "input": "How AstraZeneca is given?", "next": "astraZenecaInjected" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
            ]
        },
        "pfizerStart": {
            "outputText": "The Pfizer vaccine is used for active immunisation to prevent COVID-19 disease.\nCOVID-19 is caused by a virus called coronavirus (SARS-CoV-2).",
            "transitions": [
                { "input": "More info", "next": "pfizerWhichAge" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerWhichAge": {
            "outputText": "The Pfizer vaccine is given to adults and adolescents from 16 years",
            "transitions": [
                { "input": "More info", "next": "pfizerHowItWorks" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerHowItWorks": {
            "outputText": "The vaccine triggers the body’s natural production of antibodies and stimulates immune cells to protect against COVID-19 disease",
            "transitions": [
                { "input": "More info", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerWhatDoYouNeedToKnow": {
            "outputText": "What you need to know before you receive the Pfizer vaccine",
            "transitions": [
                { "input": "More info", "next": "pfizerDoNotHave" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerDoNotHave": {
            "outputText": "The Pfizer vaccine should not be given if you are allergic to the active substance or any of the other ingredients of this medicine.",
            "transitions": [
                { "input": "More info", "next": "pfizerAllergicSigns" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerAllergicSigns": {
            "outputText": "Signs of an allergic reaction may include itchy skin rash, shortness of breath and swelling of the face or tongue.",
            "transitions": [
                { "input": "More info", "next": "pfizerTellYourDoctorNotSure" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTellYourDoctorNotSure": {
            "outputText": "Contact your doctor or healthcare professional immediately or go to the nearest hospital emergency room right away if you have an allergic reaction. It can belife-threatening.",
            "transitions": [
                { "input": "More info", "next": "pfizerTellYourDoctorBeforeVaccination" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTellYourDoctorBeforeVaccination": {
            "outputText": "Talk to your doctor, pharmacist or nurse before you are given the vaccine",
            "transitions": [
                { "input": "More info", "next": "pfizerTellYourDoctorBeforeVaccination1" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTellYourDoctorBeforeVaccination1": {
            "outputText": "If you ever had a severe allergic reaction or breathing problems after any other vaccine injection or after you were given the Pfizer vaccine in the past",
            "transitions": [
                { "input": "More info", "next": "pfizerTellYourDoctorBeforeVaccination2" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTellYourDoctorBeforeVaccination2": {
            "outputText": "If you ever had a severe illness with high fever\nHowever, a mild fever or upper airway infection, like a cold, are not reasons to delay vaccination.",
            "transitions": [
                { "input": "More info", "next": "pfizerTellYourDoctorBeforeVaccination3" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTellYourDoctorBeforeVaccination3": {
            "outputText": "If you have a weakened immune system, such as due to HIV infection, or are on a medicine that affects your immune system",
            "transitions": [
                { "input": "More info", "next": "pfizerTellYourDoctorBeforeVaccination4" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTellYourDoctorBeforeVaccination4": {
            "outputText": "If you have a bleeding problem, bruise easily or use a medicine to inhibit blood clotting",
            "transitions": [
                { "input": "More info", "next": "pfizerNotSureAbove" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerNotSureAbove": {
            "outputText": "If you are not sure if any of the above applies to you, talk to your doctor, pharmacist or nurse before you are given the vaccine.",
            "transitions": [
                { "input": "More info", "next": "pfizerNotProtectEveryone" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerNotProtectEveryone": {
            "outputText": "As with any vaccine, the Pfizer vaccine may not fully protect all those who receive it. ",
            "transitions": [
                { "input": "More info", "next": "pfizerNoData" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerNoData": {
            "outputText": "No data are currently available in individuals with a weakened immune system or who are taking chronic treatment that suppresses or prevents immune responses",
            "transitions": [
                { "input": "More info", "next": "pfizerChildrenAdolescents" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerChildrenAdolescents": {
            "outputText": "The Pfizer vaccine is not recommended for children under 16 years.",
            "transitions": [
                { "input": "More info", "next": "pfizerOtherMedicines" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerOtherMedicines": {
            "outputText": "Tell your doctor or pharmacist if you are using, have recently used or might use any other medicines or have recently received any other vaccine",
            "transitions": [
                { "input": "More info", "next": "pfizerPregnantBreastfeeding" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerPregnantBreastfeeding": {
            "outputText": "If you are pregnant or breast-feeding, think you may be pregnant or are planning to have a baby, ask your doctor or pharmacist for advice before you receive this vaccine.",
            "transitions": [
                { "input": "More info", "next": "pfizerDriving" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerDriving": {
            "outputText": "The Pfizer vaccine has no or negligible influence on the ability to drive and use machines. However, some of the effects may temporarily affect the ability to drive or use machines. Do not drive or operate machinery until you are sure that you are not affected",
            "transitions": [
                { "input": "More info", "next": "pfizerPotasium" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerPotasium": {
            "outputText": "The Pfizer vaccine contains potassium, less than 1 mmol (39 mg) per dose, i.e. essentially ‘potassium-free’.",
            "transitions": [
                { "input": "More info", "next": "pfizerSodium" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerSodium": {
            "outputText": "The Pfizer vaccine contains less than 1 mmol sodium (23 mg) per dose, that is to say essentially ‘sodium-free’.",
            "transitions": [
                { "input": "More info", "next": "pfizerHowIsGiven" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerHowIsGiven": {
            "outputText": "How the Pfizer vaccine is given",
            "transitions": [
                { "input": "More info", "next": "pfizerInjected" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerInjected": {
            "outputText": "The Pfizer vaccine is given after dilution as an injection of 0.3 mL into a muscle of your upper arm.",
            "transitions": [
                { "input": "More info", "next": "pfizerTwoDoses" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerTwoDoses": {
            "outputText": "You will receive 2 injections, given at least 21 days apart.",
            "transitions": [
                { "input": "More info", "next": "pfizerDosesInterval" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerDosesInterval": {
            "outputText": "If you receive one dose of the Pfizer vaccine you should receive a second dose of the same vaccine at least 21 days later to complete the vaccination series.",
            "transitions": [
                { "input": "More info", "next": "pfizerProtection" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerProtection": {
            "outputText": "Protection against COVID-19 disease may not be maximally effective until at least 7 days after the second dose.",
            "transitions": [
                { "input": "More info", "next": "pfizerPossibleSideEffects" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "Possible side effects", "next": "pfizerLikeAll" },
            ]
        },
        "pfizerPossibleSideEffects": {
            "outputText": "What are possible side effects",
            "transitions": [
                { "input": "More info", "next": "pfizerLikeAll" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerLikeAll": {
            "outputText": "Like all vaccines, the Pfizer vaccine may cause side effects",
            "transitions": [
                { "input": "More info", "next": "pfizerMildSideEffects" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerMildSideEffects": {
            "outputText": "Most side effects are mild or moderate and go away within a few days",
            "transitions": [
                { "input": "More info", "next": "pfizerParacetamol" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerParacetamol": {
            "outputText": "If side effects such as pain and/or fever are troublesome, they can be treated by medicines for pain and fever such as paracetamol.",
            "transitions": [
                { "input": "More info", "next": "pfizerVeryCommonSideEffects" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerVeryCommonSideEffects": {
            "outputText": "Very common side effects may affect more than 1 in 10 people",
            "transitions": [
                { "input": "More info", "next": "pfizerVeryCommonSideEffects1" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerVeryCommonSideEffects1": {
            "outputText": "Very common side effects are \npain at injection site \ntiredness \nheadache \nmuscle pain \nchills \njoint pain \nfever",
            "transitions": [
                { "input": "More info", "next": "pfizerCommonSideEffects" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerCommonSideEffects": {
            "outputText": "Common side effects may affect up to 1 in 10 people",
            "transitions": [
                { "input": "More info", "next": "pfizerCommonSideEffects1" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerCommonSideEffects1": {
            "outputText": "Common side effects are \ninjection site swelling \nredness at injection site \nnausea",
            "transitions": [
                { "input": "More info", "next": "pfizerUncommonSideEffects" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerUncommonSideEffects": {
            "outputText": "Uncommon side effects may affect up to 1 in 100 people",
            "transitions": [
                { "input": "More info", "next": "pfizerUncommonSideEffects1" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerUncommonSideEffects1": {
            "outputText": "Uncommon side effects are\nenlarged lymph nodes\nfeeling unwell",
            "transitions": [
                { "input": "More info", "next": "pfizerRareReports" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerRareReports": {
            "outputText": "Rare side effects may affect up to 1 in 1,000 people. A rare side effect is temporary facial drooping on one side",
            "transitions": [
                { "input": "More info", "next": "pfizerSideEffectNotknown" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerSideEffectNotknown": {
            "outputText": "It was not possible to be estimate from the available data if severe allergic reaction is a side effect",
            "transitions": [
                { "input": "More info", "next": "pfizerNotMentionedEffects" },
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
            ]
        },
        "pfizerNotMentionedEffects": {
            "outputText": "If you notice any side effects not mentioned in this app, please inform your doctor, pharmacist or nurse",
            "transitions": [
                { "input": "What is Pfizer vaccine?", "next": "pfizerStart" },
                { "input": "What do you need to know?", "next": "pfizerWhatDoYouNeedToKnow" },
                { "input": "How BNT162b2(Pfizer) is given?", "next": "pfizerInjected" },
                { "input": "", "next": "astraZenecaStart" },
            ]
        },
    },
    "VaccinationConfirmed": {
        "start": {
            "outputText": "Hi {firstName}, Good news! We have received your vaccination codes from the NHS.",
            "transitions": [
                { "input": "default", "next": "notImmuneYet" },
            ],
            "action": "wait::TYPING::5000"
        },
        "notImmuneYet": {
            "outputText": "However you do not have immunity yet because 12 days need to pass after vaccination for the body to generate an immune response.",
            "transitions": [
                { "input": "default", "next": "waitImmunity" },
            ],
            "action": "wait::TYPING::5000"
        },
        "waitImmunity": {
            "outputText": "We will notify you when you are likely to be immune and will generate the immunity passport for you.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
                { "input": "What should I do next", "next": "whatShouldIDoNext" },
            ],
        },
        "goingCheckSideEffects": {
            "outputText": "Navigating to side effects tab...",
            "transitions": [
                { "input": "default", "next": "none" }
            ],
            "action": "navigate::Main/Side effects::workflow"
        },
        "reportSymptoms": {
            "outputText": "Please let us know if you develop any symptoms. By sharing information with us, you will help us to understand more about how the vaccine affects people.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
                { "input": "What should I do next", "next": "whatShouldIDoNext" },
            ],
        },
        "whatShouldIDoNext": {
            "outputText": "You don't need to do anything at the moment. 12 days need to pass and then we will let you know what to do in order to issue the vaccination passport.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ]
        }
    },
    "ImmunityConfirmed": {
        "start": {
            "outputText": "Hi {firstName}, Good news! We can confirm now that it is likely that you are immune to COVID19.",
            "transitions": [
                { "input": "default", "next": "immunityPassport" },
            ],
            "action": "wait::TYPING::5000"
        },
        "immunityPassport": {
            "outputText": "We have generated your immunity passport that is the QR code on the home screen. It can be scanned when entering in a public venue or in order to travel.",
            "transitions": [
                { "input": "default", "next": "noDistancingRestrictions" },
            ],
            "action": "wait::TYPING::5000"
        },
        "noDistancingRestrictions": {
            "outputText": "Social distancing restrictions may be relaxed.",
            "transitions": [
                { "input": "See information about vaccines", "next": "@VaccineInformation" },
            ]
        }
    },
}