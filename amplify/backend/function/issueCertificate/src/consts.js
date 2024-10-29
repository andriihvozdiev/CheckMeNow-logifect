const gql = require('graphql-tag');

const createCertificateHash = gql`
  mutation CreateCertificateHash(
    $input: CreateCertificateHashInput!
    $condition: ModelCertificateHashConditionInput
  ) {
    createCertificateHash(input: $input, condition: $condition) {
      certificateHash
      userId
      createdAt
      updatedAt
    }
  }
`;
const updateUserDetails = gql`
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
      createdAt
      updatedAt
      version
      owner
    }
  }
`;

const getUserDetails = gql`
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
      createdAt
      updatedAt
      version
      owner
    }
  }
`;

module.exports = {
  updateUserDetails: updateUserDetails,
  getUserDetails: getUserDetails,
  createCertificateHash: createCertificateHash
};