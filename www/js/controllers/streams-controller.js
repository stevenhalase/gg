angular.module('ggApp')
  .controller('streamsCtrl', streamsController);

streamsController.$inject = ['$http', '$state', 'StreamFactory', 'userFactory', '$cookies'];

function streamsController($http, $state, StreamFactory, userFactory, $cookies) {
  var sCtrl = this;

  sCtrl.title = 'Home Controller';

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

  sCtrl.goToGame = function(gameObj) {
    $cookies.putObject("currentGame", gameObj);
    // console.log(streamObj);
    $state.go('game');
  }

  sCtrl.games = [];

  // TWITCH API CALL
  $http.get('https://api.twitch.tv/kraken/games/top')
    .then(function(response) {
      // console.log('Twitch Top Games Response: ', response.data.top);
      sCtrl.games = response.data.top;
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
