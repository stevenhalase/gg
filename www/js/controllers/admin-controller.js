angular.module('ggApp')
  .controller('adminCtrl', adminController);

adminController.$inject = ['$state', '$http'];

function adminController($state, $http) {
  var aCtrl = this;

  aCtrl.title = 'Admin Controller';

  aCtrl.matches = [];


  aCtrl.words = ['one', 'two', 'three', 'four', 'five'];

  aCtrl.openModal = function(modalID) {
    console.log('opening modal');
    $('#' + modalID).openModal();
  }

  aCtrl.closeModal = function(modalID) {
    // console.log('closing modal', modalID);
    $('#' + modalID).closeModal();
  }

  aCtrl.saveMatch = function() {
    if (aCtrl.match._id) {
      $http.put('/api/v1/csgo-matches/' + aCtrl.match._id, aCtrl.match)
        .then(function(response) {
          console.log('Match Save API response: ', response);
        })
    } else {
      $http.post('/api/v1/csgo-matches/', aCtrl.match)
        .then(function(response) {
          console.log('Match Save API response: ', response);
        })
    }
    $http.get('/api/v1/csgo-matches/')
      .then(function(response) {
        console.log('Internal API response: ', response);
        aCtrl.matches = response.data;
      })
  }

  aCtrl.removeMatch = function(id) {
    $http.delete('/api/v1/csgo-matches/' + id)
      .then(function(response) {
        console.log('Match Save API response: ', response);
      })
    $http.get('/api/v1/csgo-matches/')
      .then(function(response) {
        console.log('Internal API response: ', response);
        aCtrl.matches = response.data;
      })
  }

  aCtrl.editMatch = function(match) {
    aCtrl.match = match;
  }

  // Local MONGODB API Call
  $http.get('/api/v1/csgo-matches/')
    .then(function(response) {
      console.log('Internal API response: ', response);
      aCtrl.matches = response.data;
    })

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
    }

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
  }
}
