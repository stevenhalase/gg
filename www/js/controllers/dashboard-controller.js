///// Attaching Dashboard controller to App module
angular.module('ggApp')
  .controller('dashboardCtrl', dashboardController);
///// Defining Dashboard controller injections
dashboardController.$inject = ['$state', '$http', 'userFactory', '$cookies'];
///// Dashboard controller function
function dashboardController($state, $http, userFactory, $cookies) {
  ///// Local variable referring to 'this'
  var dCtrl = this;
  ///// Setting current user in controller to current user from userFactory
  $http.get('/api/me')
    .then(function(response) {
      dCtrl.currentUser = response.data
    })
  ///// Change channel by placing channel info in $cookie
  dCtrl.changeChannel = function(streamObj) {
    $cookies.putObject("currentChannel", streamObj);
    ///// Go to channel view after setting current channel
    $state.go('channel');
  };
  dCtrl.goToGame = function(gameObj) {
    $cookies.putObject("currentGame", gameObj);
    // console.log(streamObj);
    $state.go('game');
  };
  ///// Remove stream from User object in DB
  dCtrl.removeStream = function (stream) {
    ///// Get index of stream in User profile recentChannels array
    var index = dCtrl.currentUser.recentChannels.indexOf(stream);
    dCtrl.currentUser.recentChannels.splice(index, 1);
    ///// POST request to User API route to update profile after removing stream
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      });
  };
  ///// Remove all streams from User object in DB
  dCtrl.clearStreams = function() {
    ///// Clear User profile recentChannels array
    dCtrl.currentUser.recentChannels = [];
    ///// POST request to User API route to update profile after removing streams
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      });
  };

  dCtrl.searchFavoriteGame = function() {
    console.log(dCtrl.favoriteGameSearchField);
    $http.get('https://api.twitch.tv/kraken/search/games?q=' + dCtrl.favoriteGameSearchField + '&type=suggest')
      .then(function(response) {
        // console.log(response)
        if(response.data.games.length > 0) {
          dCtrl.favoriteGameSearchField = '';
          Materialize.toast('Game added!', 3000)
          // console.log('game result: ', response.data.games[0])
          dCtrl.currentUser.favoriteGames.push(response.data.games[0]);
          console.log(dCtrl.currentUser.favoriteGames[0]);
          $http.post('/api/me', dCtrl.currentUser)
            .then(function(response) {
              console.log('SAVED DUDE: ', response);
            });
        } else {
          Materialize.toast('Game not found!', 3000)
        }
      });
  };

  dCtrl.removeGame = function(game) {
    var index = dCtrl.currentUser.favoriteGames.indexOf(game);
    dCtrl.currentUser.favoriteGames.splice(index, 1);
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      });
  };

  dCtrl.searchForFriends = function() {
    console.log(dCtrl.friendSearchField);
    console.log('current user: ', dCtrl.currentUser);
    $http.post('/api/users', {'query': dCtrl.friendSearchField})
      .then(function(response) {
        console.log(response);
        dCtrl.currentUser.friends.push(response.data[0]);
        $http.post('/api/me', dCtrl.currentUser)
          .then(function(response) {
            console.log('SAVED DUDE: ', response);
          });
      });
  };

  dCtrl.openFriendModal = function(_id) {
    console.log('#' + _id);
     $('#' + _id).openModal();
  };
}
