const mongoose = require('mongoose');

const csgoMatchSchema = mongoose.Schema({
    matchUrl:    String,
    teams:       Array
});

const csgoMatch = mongoose.model('csgomatch', csgoMatchSchema);

module.exports = csgoMatch;
