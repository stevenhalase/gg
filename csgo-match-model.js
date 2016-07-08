var mongoose = require('mongoose');

var csgoMatchSchema = mongoose.Schema({
    matchUrl:    String,
    teams:       Array
});

var csgoMatch = mongoose.model('csgomatch', csgoMatchSchema);

module.exports = csgoMatch;
