const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./api-routes')
const User = require('./user-model')
const csgoMatch = require('./csgo-match-model')
const scraper = require('./scraper')


mongoose.connect('mongodb://localhost/csgoMatches', function(error) {
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

//// Used to scrape data when needed
scraper.scrape();
