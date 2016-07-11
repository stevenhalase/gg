var User = require('./user-model')

var UserController = {
    all : function(req, res) {
        User.find({}, function(error, matches) {
            if (error) { console.error('ERROR FINDING USERS!', error); }
            else {
              console.log('ITS GOING THROUGH HERE!')
                res.json(matches);
            }
        });
    },
    create : function(req, res) {
        var newMatch = new User(req.body);
        User.save(function(error, user) {
             if (error) { console.error('ERROR SAVING USER!', error); }
             else {
                 res.json(match);
             }
        });
    },
    single : function(req, res) {
        var id = req.params.id;
        User.findById(id, function(error, match) {
            if (error) { console.error('ERROR FINDING USER!', error); }
             else {
                 res.json(match);
             }
        })
    },
    update: function(req, res) {
        var id = req.params.id;

        User.findByIdAndUpdate(id, req.body, { new: true}, function(error, upMatch) {
            if (error) { console.error('ERROR UPDATING USER!', error); }
             else {
                 res.json(upMatch);
             }
        })
    },
    destroy: function(req, res) {
        var id = req.params.id;

        User.findByIdAndRemove(id, function(error) {
            if (error) { console.error('ERROR UPDATING USER!', error, id); }
            res.json( {
                result : "Success",
                matchRemoved : id
            })
        })
    },
    upsert : function(req, res){
        if(req.params.googleId){
            // Update
            User.update({googleId : req.params.id}, req.body, function(err, updated){
                if(err){
                   return res.send(err)
                }
                res.send(updated)
            })
        }
        else{
            // Create
            var newUser = new User(req.body)

            newUser.save(function(err, doc){
                res.send(doc)
            })
        }
    }
};

module.exports = UserController;
