angular.module('ggApp')
  .controller('dashboardCtrl', dashboardController);

dashboardController.$inject = ['$state', '$http', 'userFactory', '$cookies'];

function dashboardController($state, $http, userFactory, $cookies) {
  var dCtrl = this;

  // $(document).ready(function(){
  //     // Materialize.toast(message, displayLength, className, completeCallback);
  //     Materialize.toast('Thanks for logging in!', 3000) // 4000 is the duration of the toast
  //  });

  dCtrl.title = 'Dassshhh Controller';

  console.log(userFactory.currentUser);
  dCtrl.currentUser = userFactory.currentUser;
  dCtrl.profileGames = [];

  dCtrl.changeChannel = function(streamObj) {
    $cookies.putObject("currentChannel", streamObj);
    // console.log(streamObj);
    $state.go('channel');
  }

  dCtrl.removeStream = function (stream) {
    var index = dCtrl.currentUser.recentChannels.indexOf(stream);
    dCtrl.currentUser.recentChannels.splice(index, 1);
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      })
  }

  dCtrl.clearStreams = function() {
    dCtrl.currentUser.recentChannels = [];
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      })
  }

  $http.get(' http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=5E9C274F1883D1017D2D677F0DD21F3C&include_appinfo=1&steamid=' + dCtrl.currentUser.openId + '&format=json')
    .then(function(response) {
      console.log(response);
      dCtrl.profileGames = response.data.response.games.slice(0,9);
      // for (game of dCtrl.profileGames) {
      //   console.log('ggaaaammmmeee: ', game.appid)
      //   $http.get('http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + game.appid + '&key=5E9C274F1883D1017D2D677F0DD21F3C&steamid=' + dCtrl.currentUser.openId)
      //     .then(function(response) {
      //       // console.log(response)
      //       game.achievements = response.data.playerstats.achievements;
      //       console.log(game)
      //     })
      // }
    })


}
