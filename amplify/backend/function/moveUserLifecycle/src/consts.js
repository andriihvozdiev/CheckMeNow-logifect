const gql = require('graphql-tag');

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
      photoUrl
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
      linkageKey
      accountID
      gpOdsCode
      isLinkageKeySent
      isTester
      createdAt
      updatedAt
      version
      owner
    }
  }
`;

const userDetailsByUserStatus = gql`
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
        photoUrl
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
        linkageKey
        accountID
        gpOdsCode
        isLinkageKeySent
        isTester
        createdAt
        updatedAt
        version
        owner
      }
      nextToken
    }
  }
`;

module.exports = {
  updateUserDetails: updateUserDetails,
  userDetailsByUserStatus: userDetailsByUserStatus
};