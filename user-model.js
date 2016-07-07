const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    provider:     String,
    id:           String,
    displayName:  String,
    name:         Object,
    emails:       [{
      value: String,
    }],
    photos:       [{
      value: String
    }]

});

const User = mongoose.model('user', userSchema);

module.exports = User;
