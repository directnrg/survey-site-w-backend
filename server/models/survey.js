//Mohammad Wahiduzzaman

let mongoose = require('mongoose');

//create a model class

let SurveyModel = new mongoose.Schema({
    username: String,
    surveyName: String,
    displayName: String,
    surveyType: String,
    description: String,
    question: [String],
    startDate: Date,
    endDate: Date,
}, {
    collection: "survey"
});

module.exports = mongoose.model('Survey', SurveyModel);