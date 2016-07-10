var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var apiRouter = require('./api-routes')
var userRouter = require('./user-routes')
var csgoMatch = require('./csgo-match-model')
var scraper = require('./scraper')


mongoose.connect('mongodb://localhost/gg', function(error) {
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
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, './www')))

app.get('/', function (req, res) {
    res.sendFile('index.html', {root : './www'})
});

app.listen(3000, function () {
    console.log('Server started at http://localhost:3000')
})

//// Used to scrape data when needed
scraper.scrape();
