const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./api-routes')
const Match = require('./match-model')


mongoose.connect('mongodb://localhost/matches', function(error) {
    if (error) {
        console.error(error);
    } else {
        console.log('Mongoose connected successfully')
    }
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);

app.use(express.static(path.join(__dirname, './www')))

app.get('/', function (req, res) {
    res.sendFile('index.html', {root : './www'})
});

app.listen(3000, function () {
    console.log('Server started at http://localhost:3000')
})

// Match.remove({}, function(err) {
//    console.log('Matches Cleared')
//
//    var lounge = require('csgolounge-api');
//
//    lounge.getMatches(function(matches){
//      let time = matches[0].timestamp;
//      for (match of matches) {
//        let newMatch = new Match(match);
//        // console.log(newMatch.id)
//        Match.find({id: newMatch.id}, function(error, matches) {
//            if (error) { console.error('ERROR FINDING MATCHES!', error); }
//            else {
//                addNewMatch(matches)
//            }
//        });
//
//        function addNewMatch(matches) {
//          // console.log(matches.length)
//          if (matches.length === 0) {
//            newMatch.save(function(error, nmatch) {
//                 if (error) { console.error('ERROR SAVING MATCH!', error); }
//                 else {
//                   console.log('Match Saved');
//                 }
//            });
//          }
//
//        }
//      }
//      console.log(matches.length);
//      // console.log('Matches Saved Successfully')
//      // Match.find({}, function(error, matches) {
//      //     if (error) { console.error('ERROR FINDING MATCHES!', error); }
//      //     else {
//      //         console.log(matches.length);
//      //     }
//      // });
//    });
// });
