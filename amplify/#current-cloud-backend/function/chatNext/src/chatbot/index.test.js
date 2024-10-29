const chatBotMachine = require('./index')

test('test chatbot machine', () => {
    let dialogState = chatBotMachine.executeTransition({inputText:"@InitialStatus"})
    console.log(dialogState)
    dialogState.inputText="Yes"
    dialogState = chatBotMachine.executeTransition(dialogState)
    console.log(dialogState)
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState)
    console.log(dialogState)
    dialogState.inputText="Yes"
    dialogState = chatBotMachine.executeTransition(dialogState)
    console.log(dialogState)
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState)
    console.log(dialogState) 
});


test('CheckSideEffects unusualSymptoms - default', () => {
    let dialogState = chatBotMachine.executeTransition({inputText:"@CheckSideEffects"})
    dialogState.inputText="Yes"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="bla bla bla"
    dialogState = chatBotMachine.executeTransition(dialogState)
    console.log(dialogState)
})

test('from @AwaitingVaccination to @CheckSideEffects', () => {
    let dialogState = chatBotMachine.executeTransition({inputText:"@AwaitingVaccination"})
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="Yes"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="Yes"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="bla bla bla"
    dialogState = chatBotMachine.executeTransition(dialogState)
    console.log(dialogState)
})

test('@Unverified', () => {
    let dialogState = chatBotMachine.executeTransition({inputText:"@Unverified"})
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState)
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState) 
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState) 
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState) 
    dialogState.inputText="default"
    dialogState = chatBotMachine.executeTransition(dialogState) 
    dialogState.inputText="No"
    dialogState = chatBotMachine.executeTransition(dialogState) 
    console.log(dialogState)
})