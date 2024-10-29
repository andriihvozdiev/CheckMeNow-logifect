/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const checkIdentity = /* GraphQL */ `
  query CheckIdentity($identityCheckInput: IdentityCheckInput) {
    checkIdentity(identityCheckInput: $identityCheckInput)
  }
`;
export const gpList = /* GraphQL */ `
  query GpList($postCode: String) {
    gpList(postCode: $postCode) {
      StatusCode
      Result {
        Name
        Details
        Link
      }
    }
  }
`;
export const chatNext = /* GraphQL */ `
  query ChatNext($chatNextInput: ChatNextInput) {
    chatNext(chatNextInput: $chatNextInput) {
      inputText
      outputText
      intentName
      transitions {
        input
        next
      }
      action
      modelField
      restart
    }
  }
`;
export const cmnLinkUserToPatient = /* GraphQL */ `
  query CmnLinkUserToPatient($linkUserToPatientInput: LinkUserToPatientInput) {
    cmnLinkUserToPatient(linkUserToPatientInput: $linkUserToPatientInput) {
      statusCode
      patientId
      herAccessGranted
      userStatus
      vaccineName
      error
    }
  }
`;
export const issueCertificate = /* GraphQL */ `
  query IssueCertificate($issueCertificateInput: IssueCertificateInput) {
    issueCertificate(issueCertificateInput: $issueCertificateInput) {
      statusCode
      messageHash
      signature
      identifier
      type
      version
      error
    }
  }
`;
export const getVaccineDetails = /* GraphQL */ `
  query GetVaccineDetails($userId: String) {
    getVaccineDetails(userId: $userId) {
      statusCode
      userStatus
      vaccineDetails {
        doseDate
        details
      }
      vaccineName
      error
    }
  }
`;
export const generateCertificatePassKitIos = /* GraphQL */ `
  query GenerateCertificatePassKitIos($passKitInput: PassKitIOSInput) {
    generateCertificatePassKitIOS(passKitInput: $passKitInput)
  }
`;
export const getSideEffects = /* GraphQL */ `
  query GetSideEffects($id: ID!) {
    getSideEffects(id: $id) {
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
export const listSideEffectss = /* GraphQL */ `
  query ListSideEffectss(
    $filter: ModelSideEffectsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSideEffectss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const sideEffectsByEmail = /* GraphQL */ `
  query SideEffectsByEmail(
    $email: String
    $dateTime: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSideEffectsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sideEffectsByEmail(
      email: $email
      dateTime: $dateTime
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getUserDetails = /* GraphQL */ `
  query GetUserDetails($id: ID!) {
    getUserDetails(id: $id) {
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
export const listUserDetailss = /* GraphQL */ `
  query ListUserDetailss(
    $filter: ModelUserDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserDetailss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const userDetailsByEmail = /* GraphQL */ `
  query UserDetailsByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userDetailsByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const userDetailsByUserStatus = /* GraphQL */ `
  query UserDetailsByUserStatus(
    $userStatus: UserStatus
    $statusChangedAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userDetailsByUserStatus(
      userStatus: $userStatus
      statusChangedAt: $statusChangedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getCertificateHash = /* GraphQL */ `
  query GetCertificateHash($certificateHash: String!) {
    getCertificateHash(certificateHash: $certificateHash) {
      certificateHash
      userId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listCertificateHashs = /* GraphQL */ `
  query ListCertificateHashs(
    $certificateHash: String
    $filter: ModelCertificateHashFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCertificateHashs(
      certificateHash: $certificateHash
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        certificateHash
        userId
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
