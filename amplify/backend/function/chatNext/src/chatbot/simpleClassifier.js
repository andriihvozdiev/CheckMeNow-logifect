var natural = require('natural');
var classifier = new natural.BayesClassifier();


var trainingData =  require('./training-data');
trainingData.main.forEach(element => {
    classifier.addDocument(element.x, element.y);
});

classifier.train();

module.exports = classifier;