/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSideEffects = /* GraphQL */ `
  mutation CreateSideEffects(
    $input: CreateSideEffectsInput!
    $condition: ModelSideEffectsConditionInput
  ) {
    createSideEffects(input: $input, condition: $condition) {
      id
      email
      symptomType
      dateTime
      symptomDetails
      degreeType
      degreeTypeDetails
      symptomTime
      symptomProgress
      symptomProgressDetails
      moreDetails
      isCompleted
      createdAt
      updatedAt
      version
    }
  }
`;
export const updateSideEffects = /* GraphQL */ `
  mutation UpdateSideEffects(
    $input: UpdateSideEffectsInput!
    $condition: ModelSideEffectsConditionInput
  ) {
    updateSideEffects(input: $input, condition: $condition) {
      id
      email
      symptomType
      dateTime
      symptomDetails
      degreeType
      degreeTypeDetails
      symptomTime
      symptomProgress
      symptomProgressDetails
      moreDetails
      isCompleted
      createdAt
      updatedAt
      version
    }
  }
`;
export const deleteSideEffects = /* GraphQL */ `
  mutation DeleteSideEffects(
    $input: DeleteSideEffectsInput!
    $condition: ModelSideEffectsConditionInput
  ) {
    deleteSideEffects(input: $input, condition: $condition) {
      id
      email
      symptomType
      dateTime
      symptomDetails
      degreeType
      degreeTypeDetails
      symptomTime
      symptomProgress
      symptomProgressDetails
      moreDetails
      isCompleted
      createdAt
      updatedAt
      version
    }
  }
`;
export const createUserDetails = /* GraphQL */ `
  mutation CreateUserDetails(
    $input: CreateUserDetailsInput!
    $condition: ModelUserDetailsConditionInput
  ) {
    createUserDetails(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      dateOfBirth
      vaccinationDate
      vaccinationCenter
      isQrCodeReady
      patientId
      herAccessGranted
      vaccineName
      postCode
      typeOfDocument
      nationality
      userStatus
      statusChangedAt
      chatState
      lastChatDate
      pushNotificationToken
      pushNotificationService
      sideEffects {
        createdAt
        outputText
        user
      }
      sideEffectsDialogState {
        inputText
        intentName
        outputText
        modelField
        action
        restart
        transitions {
          input
          next
        }
      }
      isSideEffectScenarioCompleted
      isLinkageKeySent
      isTester
      certificate {
        name
        dateOfBirth
        vaccineName
        diseaseAgent
        firstDoseDate
        secondDoseDate
        validFrom
        expirationDate
        country
        issuer
        identifier
        state
        messageHash
        signature
      }
      vaccineDetails {
        doseDate
        details
      }
      consents {
        status
        description
      }
      createdAt
      updatedAt
      version
      owner
    }
  }
`;
export const updateUserDetails = /* GraphQL */ `
  mutation UpdateUserDetails(
    $input: UpdateUserDetailsInput!
    $condition: ModelUserDetailsConditionInput
  ) {
    updateUserDetails(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      dateOfBirth
      vaccinationDate
      vaccinationCenter
      isQrCodeReady
      patientId
      herAccessGranted
      vaccineName
      postCode
      typeOfDocument
      nationality
      userStatus
      statusChangedAt
      chatState
      lastChatDate
      pushNotificationToken
      pushNotificationService
      sideEffects {
        createdAt
        outputText
        user
      }
      sideEffectsDialogState {
        inputText
        intentName
        outputText
        modelField
        action
        restart
        transitions {
          input
          next
        }
      }
      isSideEffectScenarioCompleted
      isLinkageKeySent
      isTester
      certificate {
        name
        dateOfBirth
        vaccineName
        diseaseAgent
        firstDoseDate
        secondDoseDate
        validFrom
        expirationDate
        country
        issuer
        identifier
        state
        messageHash
        signature
      }
      vaccineDetails {
        doseDate
        details
      }
      consents {
        status
        description
      }
      createdAt
      updatedAt
      version
      owner
    }
  }
`;
export const deleteUserDetails = /* GraphQL */ `
  mutation DeleteUserDetails(
    $input: DeleteUserDetailsInput!
    $condition: ModelUserDetailsConditionInput
  ) {
    deleteUserDetails(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      dateOfBirth
      vaccinationDate
      vaccinationCenter
      isQrCodeReady
      patientId
      herAccessGranted
      vaccineName
      postCode
      typeOfDocument
      nationality
      userStatus
      statusChangedAt
      chatState
      lastChatDate
      pushNotificationToken
      pushNotificationService
      sideEffects {
        createdAt
        outputText
        user
      }
      sideEffectsDialogState {
        inputText
        intentName
        outputText
        modelField
        action
        restart
        transitions {
          input
          next
        }
      }
      isSideEffectScenarioCompleted
      isLinkageKeySent
      isTester
      certificate {
        name
        dateOfBirth
        vaccineName
        diseaseAgent
        firstDoseDate
        secondDoseDate
        validFrom
        expirationDate
        country
        issuer
        identifier
        state
        messageHash
        signature
      }
      vaccineDetails {
        doseDate
        details
      }
      consents {
        status
        description
      }
      createdAt
      updatedAt
      version
      owner
    }
  }
`;
export const createCertificateHash = /* GraphQL */ `
  mutation CreateCertificateHash(
    $input: CreateCertificateHashInput!
    $condition: ModelCertificateHashConditionInput
  ) {
    createCertificateHash(input: $input, condition: $condition) {
      certificateHash
      userId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateCertificateHash = /* GraphQL */ `
  mutation UpdateCertificateHash(
    $input: UpdateCertificateHashInput!
    $condition: ModelCertificateHashConditionInput
  ) {
    updateCertificateHash(input: $input, condition: $condition) {
      certificateHash
      userId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteCertificateHash = /* GraphQL */ `
  mutation DeleteCertificateHash(
    $input: DeleteCertificateHashInput!
    $condition: ModelCertificateHashConditionInput
  ) {
    deleteCertificateHash(input: $input, condition: $condition) {
      certificateHash
      userId
      createdAt
      updatedAt
      owner
    }
  }
`;
