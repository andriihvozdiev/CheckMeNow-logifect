import { userMe, userSystem } from '../constants/chatUsers';

const hello_message = 'Hi Angelina. Have you received COVID19 vaccination?';
const intend_to_be_vaccinated = 'Do you intend to be vaccinated?';
const explain_vaccination_advantage =
  'Here is the explanation advantage of vaccination';
const vaccination_centers =
  'Would you like to see the map with the vaccination centres around you?';
const choose_vaccination_centers = 'Choose a vaccination centre bellow';

export default class initPhase {
  static processMessage(message) {
    if (message.text === hello_message && message.reply === null)
      return {
        text: hello_message,
        createdAt: new Date().getTime(),
        user: userSystem,
        quickReply: ['Yes', 'No'],
        reply: null,
      };
    if (message.text === hello_message && message.reply === 'No')
      return {
        text: intend_to_be_vaccinated,
        createdAt: new Date().getTime(),
        user: userSystem,
        quickReply: ['Yes', 'No'],
        reply: null,
      };
    if (message.text === intend_to_be_vaccinated && message.reply === 'No')
      return {
        text: explain_vaccination_advantage,
        createdAt: new Date().getTime(),
        user: userSystem,
        quickReply: ['Yes', 'No'],
        reply: null,
      };
    if (message.text === intend_to_be_vaccinated && message.reply === 'Yes')
      return {
        text: vaccination_centers,
        createdAt: new Date().getTime(),
        user: userSystem,
        quickReply: ['Yes', 'No'],
        reply: null,
      };
    if (message.text === vaccination_centers && message.reply === 'Yes')
      return {
        text: choose_vaccination_centers,
        createdAt: new Date().getTime(),
        user: userSystem,
        quickReply: ['Yes', 'No'],
        reply: null,
      };

    if (message.reply !== null)
      return {
        text: message.reply,
        createdAt: new Date().getTime(),
        user: userMe,
        quickReply: ['Yes', 'No'],
        reply: null,
      };
    else
      return {
        text: message.text,
        createdAt: new Date().getTime(),
        user: userMe,
        quickReply: ['Yes', 'No'],
        reply: null,
      };
  }
}
