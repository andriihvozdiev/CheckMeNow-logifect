exports.handler = (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  console.log("event")
  console.log(event)
  console.log("context")
  console.log(context)
  //context.fail("Hang on you bustard")
  callback(null, event);
};
