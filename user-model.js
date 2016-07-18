const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    twitchId       : String,
    googleId       : String,
    displayName    : String,
    imageUrl       : String,
    accessLevel    : Number,
    recentChannels : Array,
    favoriteGames  : Array,
    friends        : Array,
    newUser        : Boolean,
    age            : String,
    location       : String,
    email          : String
});

const User = mongoose.model('user', userSchema);

module.exports = User;
