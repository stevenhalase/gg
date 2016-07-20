///// Attaching Admin controller to App module
angular.module('ggApp')
  .controller('adminCtrl', adminController);
///// Defining Admin controller injections
adminController.$inject = ['$state', '$http'];
///// Admin controller function
function adminController($state, $http) {
  ///// Local variable referring to 'this'
  var aCtrl = this;
  aCtrl.matches = [];
  aCtrl.words = ['one', 'two', 'three', 'four', 'five'];
  aCtrl.activeUsers = [];
  ///// Open modal using JQuery
  aCtrl.openModal = function(modalID) {
    $('#' + modalID).openModal();
  };
  ///// Close modal using JQuery
  aCtrl.closeModal = function(modalID) {
    $('#' + modalID).closeModal();
  };

  ///// Saves admin updated Match to DB
  aCtrl.saveMatch = function() {
    ///// If Match has an _id (i.e. checking if Match is originally came from DB
    ///// or it is a newly generated Match)
    if (aCtrl.match._id) {
      ///// Send PUT request to Express server API route to save updated Match
      $http.put('/api/v1/csgo-matches/' + aCtrl.match._id, aCtrl.match)
        .then(function(response) {
          ///// Display result from saving match
          console.log('Match Save API response: ', response);
        });
    ///// If Match is newly generated and hasn't been in DB
    } else {
      ///// Send POST request to Express server API route to save new Match
      $http.post('/api/v1/csgo-matches/', aCtrl.match)
        .then(function(response) {
          ///// Display result from saving match
          console.log('Match Save API response: ', response);
        });
    }
    ///// After saving new Match or updating existing one, refresh
    ///// displayed matches from DB
    $http.get('/api/v1/csgo-matches/')
      .then(function(response) {
        console.log('Internal API response: ', response);
        aCtrl.matches = response.data;
      });
  };
  ///// Removes Match from DB through API call to Express
  aCtrl.removeMatch = function(id) {
    ///// Send DELETE request to DB through API
    $http.delete('/api/v1/csgo-matches/' + id)
      .then(function(response) {
        ///// Display result from deleting Match from DB
        console.log('Match Save API response: ', response);
      });
    ///// After saving new Match or updating existing one, refresh
    ///// displayed matches from DB
    $http.get('/api/v1/csgo-matches/')
      .then(function(response) {
        console.log('Internal API response: ', response);
        aCtrl.matches = response.data;
      });
  };

  ///// Setting current Match to respective user selected Match
  aCtrl.editMatch = function(match) {
    aCtrl.match = match;
  };
  ///// GET request to get Matches from DB
  $http.get('/api/v1/csgo-matches/')
    .then(function(response) {
      console.log('Internal API response: ', response);
      aCtrl.matches = response.data;
    });
  ///// Clearing current Match object when user selects to create new Match
  aCtrl.clearForNew = function() {
    aCtrl.match = {
      matchUrl : '',
      teams : [{
        teamName : '',
        teamUrl : '',
        teamLogoUrl : '',
        players : [{
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        }]
      },
      {
        teamName : '',
        teamUrl : '',
        teamLogoUrl : '',
        players : [{
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        }]
      }]
    };
  };
  ///// Setting default current Match to empty
  aCtrl.match = {
    matchUrl : '',
    teams : [{
      teamName : '',
      teamUrl : '',
      teamLogoUrl : '',
      players : [{
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      }]
    },
    {
      teamName : '',
      teamUrl : '',
      teamLogoUrl : '',
      players : [{
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      }]
    }]
  };
}
