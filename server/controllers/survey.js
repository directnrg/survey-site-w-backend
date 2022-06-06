
//Mohammad Wahiduzzaman
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// reference to the model
let Survey = require('../models/survey');
let userModel = require('../models/user');
let User = userModel.User;

// create a reference to the survey Answers model
let UserAnswersSurvey = require('../models/answeredSurveys');

module.exports.displaySurveyList = (req, res, next) => {
    
    Survey.find((err, surveyList) => {
        if (err) {
            
            return console.error(err);
        } else {
            // Get current day
            let currentDate = new Date()
            res.render('index', {
                title: 'My Surveys',
                page: 'survey/survey-list',
                SurveyList: surveyList,
                displayName: req.user ? req.user.displayName : '',
                today: currentDate
            });
        }
    });
}

module.exports.displayAddPage = (req, res, next) => {
    res.render('index', {
        title: 'Add Survey',
        page: 'survey/survey-add',
        survey: "",
        displayName: req.user ? req.user.displayName : ''
    });
}

module.exports.processAddPage = (req, res, next) => { //TODO
    //debugging part
    //console.log('recieved the request....');
    //console.log(req.body.title);
    //console.log(req.body.subtitle);

    let question = [];
    question.push(req.body.q1);
    question.push(req.body.q2);
    question.push(req.body.q3);
    question.push(req.body.q4);
    question.push(req.body.q5);

    let newSurvey = Survey({
        "displayName": req.body.displayName,
        "surveyName": req.body.surveyName,
        "surveyType": req.body.surveytype,
        "description": req.body.description,
        "startDate": req.body.startdate,
        "endDate": req.body.enddate,
        "question": question
    });

    Survey.create(newSurvey, (err, survey) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            console.log(survey);
            // refresh the survey list page
            res.redirect('/surveys');
        }
    });
}

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, surveyToEdit) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            
            res.render('index', {
                title: 'Edit Survey',
                page: 'survey/survey-edit',
                survey: surveyToEdit,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
}

module.exports.processEditPage = (req, res, next) => { //TODO
    let id = req.params.id

    
    let question = [];
    question.push(req.body.q1, req.body.q2, req.body.q3, req.body.q4, req.body.q5);

    let updatedSurvey = Survey({
        "_id": id,
        "username": req.body.username,
        "surveyName": req.body.surveyName,
        "surveyType": req.body.surveytype,
        "description": req.body.description, //TODO possible future feature
        "startDate": req.body.startdate,
        "endDate": req.body.enddate,
        "question" : question
    });

    console.log(updatedSurvey);

    Survey.updateOne({_id: id}, updatedSurvey, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the survey list page
            res.redirect('/surveys');
        }
    });
}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    Survey.deleteOne({
        _id: id
    }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {

            // refresh the survey list
            res.redirect('/surveys');
        }
    });
}

//
module.exports.displayExistingSurveyPage = (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, existingSurvey) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            //show the view page
            res.render('index', {
                title: existingSurvey.surveyName,
                page: 'survey/av-survey',
                survey: existingSurvey,
                displayName: req.user ? req.user.displayName : ''
            })
        }
    });
}

module.exports.processExistingSurveyPage = (req, res, next) => {
    let id = req.params.id

    let answer = [];
    answer.push(req.body.a0,req.body.a1,req.body.a2,req.body.a3,req.body.a4);
    
    let newSurveyAnswer = UserAnswersSurvey({
        "surveyId": id,
        "answer": answer
    });

    UserAnswersSurvey.create(newSurveyAnswer, (err, UserAnswersSurvey) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/home');
        }
    });
}

module.exports.displayReportViewPage = (req, res, next) => {

    let id = req.params.id;

    Survey.findById(id, (err, survey) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            
            UserAnswersSurvey.find({ "surveyId": id }, (err, docs) => {

                let trueAnswer = [0, 0, 0, 0, 0];
                let falseAnswer = [0, 0, 0, 0, 0];
                let veryBad = [0, 0, 0, 0, 0];
                let bad = [0, 0, 0, 0, 0];
                let good = [0, 0, 0, 0, 0];
                let veryGood = [0, 0, 0, 0, 0];
                let excellent = [0, 0, 0, 0, 0];

                for (j = 0; j < docs.length; j++) {
                    //console.log("docs[" + j + "] = > " + docs[j] );
                    for (i = 0; i < docs[j].answer.length; i++) {
                        if (survey.surveyType == "True/False") {
                            if (docs[j].answer[i] == "true") {
                                trueAnswer[i]++;
                            } else {
                                falseAnswer[i]++;
                            }
                        }
                        if (survey.surveyType == "Scale") {
                            switch (docs[j].answer[i]) {
                                case '0':
                                    veryBad[i]++;
                                    break;
                                case '1':
                                    bad[i]++;
                                    break;
                                case "2":
                                    good[i]++;
                                    break;
                                case "3":
                                    veryGood[i]++;
                                    break;
                                case "4":
                                    excellent[i]++;
                                    break;
                                default:
                                    break;
                            }

                        }
                    }
                }
                if (survey.surveyType == "True/False") {
                    res.render('index', {
                        title: survey.surveyName,
                        page: 'survey/report',
                        survey: survey,
                        votes: docs.length,
                        trueAnswer: trueAnswer,
                        falseAnswer: falseAnswer,
                        displayName: req.user ? req.user.displayName : ''
                    });
                }
                if (survey.surveyType == "Scale") {
                    //console.log(veryBad);
                    //console.log(excellent);
                    res.render('index', {
                        title: survey.surveyName,
                        page: 'survey/report',
                        survey: survey,
                        votes: docs.length,
                        veryBad: veryBad,
                        bad: bad,
                        good: good,
                        veryGood: veryGood,
                        excellent: excellent,
                        displayName: req.user ? req.user.displayName : ''
                    });
                }
            });
        }
    });
}


