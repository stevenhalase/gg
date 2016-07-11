angular.module('ggApp')
  .controller('streamsCtrl', streamsController);

streamsController.$inject = ['$http', '$state', 'StreamFactory', 'userFactory', '$cookies'];

function streamsController($http, $state, StreamFactory, userFactory, $cookies) {
  var sCtrl = this;

  sCtrl.title = 'Home Controller';

  $(document).ready(function(){
      // Materialize.toast(message, displayLength, className, completeCallback);
      Materialize.toast('You can click on individual games to see available streams and watch them!', 5000) // 4000 is the duration of the toast
   });


  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();

  $(document).ready(function(){
      $('.slider').slider({full_width: true});
    });

  sCtrl.openModal = function(modalID) {
    // console.log('opening modal', modalID);
    $('#' + modalID).openModal();
  }

  sCtrl.closeModal = function(modalID) {
    // console.log('closing modal', modalID);
    $('#' + modalID).closeModal();
  }

  sCtrl.getStreamLink = function(streamName) {
    return 'https://player.twitch.tv/?channel=' + streamName;
  }

  sCtrl.changeChannel = function(streamObj,modalID) {
    console.log('loggedin user: ', userFactory.currentUser);
    userFactory.currentUser.recentChannels.push(streamObj);
    $cookies.putObject("currentChannel", streamObj);
    // console.log(streamObj);
    $state.go('channel');
    $('#' + modalID).closeModal();
  }

  sCtrl.games = [];
  sCtrl.gameStreams = [];

  // TWITCH API CALL
  $http.get('https://api.twitch.tv/kraken/search/streams?q=esea')
    .then(function(response) {
      // console.log('Twitch Streams Response: ', response.data.streams);
    })

  $http.get('https://api.twitch.tv/kraken/games/top')
    .then(function(response) {
      // console.log('Twitch Top Games Response: ', response.data.top);

      sCtrl.games = response.data.top;

        for(var i = 0; i < sCtrl.games.length; i++) {
          // console.log(game);
          gameName = sCtrl.games[i].game.name;
          gameName = gameName.split(' ');
          gameName = gameName.join('+');
          // console.log(gameName)
          (function(i) {
            $http.get('https://api.twitch.tv/kraken/streams/?game=' + gameName + '&stream_type=live&limit=4')
              .then(function(response) {
                // console.log('Streams: ', response.data.streams);
                sCtrl.games[i].streams = response.data.streams;
              })
          })(i);

        }

    })

  sCtrl.fixLogoUrl = function(url) {

    url = url.split('logoart')
    url = url[0] + 'boxart' + url[1];
    url = url.split('240')
    url = url[0] + '800' + url[1];
    url = url.split('144');
    url = url[0] + '800' + url[1];
    // console.log(url);
    return url;
  }
}
