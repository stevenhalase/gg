var User = require('./user-model')

var UserController = {
    all : function(req, res) {
        User.find({}, function(error, matches) {
            if (error) { console.error('ERROR FINDING MATCHES!', error); }
            else {
                res.json(matches);
            }
        });
    },
    create : function(req, res) {
        var newMatch = new User(req.body);
        newMatch.save(function(error, match) {
             if (error) { console.error('ERROR SAVING MATCH!', error); }
             else {
                 res.json(match);
             }
        });
    },
    single : function(req, res) {
        var id = req.params.id;
        User.findById(id, function(error, match) {
            if (error) { console.error('ERROR FINDING MATCH!', error); }
             else {
                 res.json(match);
             }
        })
    },
    update: function(req, res) {
        var id = req.params.id;

        User.findByIdAndUpdate(id, req.body, { new: true}, function(error, upMatch) {
            if (error) { console.error('ERROR UPDATING MATCH!', error); }
             else {
                 res.json(upMatch);
             }
        })
    },
    destroy: function(req, res) {
        var id = req.params.id;

        User.findByIdAndRemove(id, function(error) {
            if (error) { console.error('ERROR UPDATING MATCH!', error, id); }
            res.json( {
                result : "Success",
                matchRemoved : id
            })
        })
    }
};

module.exports = UserController;
