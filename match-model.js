const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    matchUrl:    String,
    teams:       Array
});

const Match = mongoose.model('match', matchSchema);

module.exports = Match;
