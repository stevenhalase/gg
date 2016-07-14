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
  dCtrl.currentUser = userFactory.currentUser;
  dCtrl.profileGames = [];
  ///// Change channel by placing channel info in $cookie
  dCtrl.changeChannel = function(streamObj) {
    $cookies.putObject("currentChannel", streamObj);
    ///// Go to channel view after setting current channel
    $state.go('channel');
  }
  ///// Remove stream from User object in DB
  dCtrl.removeStream = function (stream) {
    ///// Get index of stream in User profile recentChannels array
    var index = dCtrl.currentUser.recentChannels.indexOf(stream);
    dCtrl.currentUser.recentChannels.splice(index, 1);
    ///// POST request to User API route to update profile after removing stream
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      })
  }
  ///// Remove all streams from User object in DB
  dCtrl.clearStreams = function() {
    ///// Clear User profile recentChannels array
    dCtrl.currentUser.recentChannels = [];
    ///// POST request to User API route to update profile after removing streams
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      })
  }
  ///// GET request to Steam API to get User recently played games from Steam profile by passing in User's OpenId
  $http.get(' http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=5E9C274F1883D1017D2D677F0DD21F3C&include_appinfo=1&steamid=' + dCtrl.currentUser.openId + '&format=json')
    .then(function(response) {
      ///// Get top 10 user recently played games from Steam profile response
      dCtrl.profileGames = response.data.response.games.slice(0,9);
    })
}
