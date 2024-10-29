const chatBotMachine = require('./chatbot');

exports.handler = async (event) => {
  console.log(event);
  const nextState = chatBotMachine.executeTransition(
    event.arguments.chatNextInput,
  );
  console.log('nextState');
  console.log(nextState);
  return nextState;
}; 
