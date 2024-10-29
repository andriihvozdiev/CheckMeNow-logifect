(function () {
  var chatbotScenarious = require('./chatbot-scenarious.js');
  var classifier = require('./trainClassifier');

  function getTransition(transitions, input){
      return transitions.find(function(transition){
          return transition.input === input
      })
  }

  function executeTransition(previousState) {
    const classification = classifier.classify(previousState.inputText)
    console.log("classification")
    console.log(classification)
    console.log("previousState.inputText")
    console.log(previousState.inputText)

    console.log("previousState.transitions")
    console.log(previousState.transitions)
    
    let classifierResult =
    previousState.inputText[0] === '@'
        ? previousState.inputText
        : classifier.classify(previousState.inputText);
    if (classifierResult[0] === '@') {
        let intentName = classifierResult.replace("@", "")
        let nextState = chatbotScenarious[intentName].start;
        nextState.intentName = intentName;
        return nextState;
    } else {
        let transition = getTransition(previousState.transitions, classifierResult)
        if(!transition)
          transition = getTransition(previousState.transitions, "default")

        if(!transition){
          classifierResult = classifier.classify(previousState.outputText + " " + previousState.inputText)
          transition = getTransition(previousState.transitions, classifierResult)
        }
        const nextStateName = transition["next"];
        if(nextStateName[0] === '@'){
          let intentName = nextStateName.replace("@", "")
          let nextState = chatbotScenarious[intentName].start;
          nextState.intentName = intentName;
          return nextState;
        } else{
          console.log("nextStateName")
          console.log(nextStateName)
          let nextState = chatbotScenarious[previousState.intentName][nextStateName];
          nextState.intentName = previousState.intentName;
          console.log("previousState.restart && nextState.outputTextRestart");
          console.log(previousState);
          if(previousState.restart && nextState.outputTextRestart){
            nextState.outputText = nextState.outputTextRestart;
          }
          return nextState;
        }
    }
  }

  module.exports = {
    executeTransition: executeTransition,
  };
})();
