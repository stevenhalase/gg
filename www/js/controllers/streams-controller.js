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
  };

  sCtrl.closeModal = function(modalID) {
    // console.log('closing modal', modalID);
    $('#' + modalID).closeModal();
  };

  sCtrl.goToGame = function(gameObj) {
    $cookies.putObject("currentGame", gameObj);
    // console.log(streamObj);
    $state.go('game');
  };

  sCtrl.games = [];

  // TWITCH API CALL
  $http.get('https://api.twitch.tv/kraken/games/top')
    .then(function(response) {
      // console.log('Twitch Top Games Response: ', response.data.top);
      sCtrl.games = response.data.top;
    });

  sCtrl.fixLogoUrl = function(url) {

    url = url.split('logoart');
    url = url[0] + 'boxart' + url[1];
    url = url.split('240');
    url = url[0] + '800' + url[1];
    url = url.split('144');
    url = url[0] + '800' + url[1];
    // console.log(url);
    return url;
  };

  sCtrl.searchGame = function() {
    console.log(sCtrl.gameSearchField);
    $http.get('https://api.twitch.tv/kraken/search/games?q=' + sCtrl.gameSearchField + '&type=suggest')
      .then(function(response) {
        console.log(response);
        if(response.data.games.length > 0) {
          sCtrl.goToGame(response.data.games[0]);
        }
        console.log('couldnt find anything');
      });
    // if (sCtrl.gameSearchField.includes(' ')) {
    //   console.log('has spaces')
    //   sCtrl.gameSearchField = sCtrl.gameSearchField.split(' ').join('')
    //   console.log(sCtrl.gameSearchField)
    // }
  };
}
