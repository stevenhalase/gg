const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    id:           String,
    time:         String,
    winner:       String,
    timestamp:    String,
    type:         String,
    matchLogo:    String,
    matchname:    String,
    teams:        Array,
    teamLogos:    Array
});

const Match = mongoose.model('match', matchSchema);

module.exports = Match;
