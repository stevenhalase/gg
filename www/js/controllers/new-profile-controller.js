///// Attaching Home controller to App module
angular.module('ggApp')
  .controller('newProfileCtrl', newProfileController);
///// Defining Home controller injections
newProfileController.$inject = ['$state', '$http', 'userFactory'];
///// Home controller function
function newProfileController($state, $http, userFactory) {
  ///// Local variable referring to 'this'
  var npCtrl = this;
  npCtrl.currentUser = userFactory.currentUser;
  console.log(npCtrl.currentUser);

  npCtrl.searchFavoriteGame = function() {
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

  npCtrl.removeGame = function(game) {
    var index = npCtrl.currentUser.favoriteGames.indexOf(game);
    npCtrl.currentUser.favoriteGames.splice(index, 1);
    $http.post('/api/me', npCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      });
  };

  npCtrl.saveProfile = function() {
    // console.log(npCtrl.currentUser.imageUrl)
    if(npCtrl.currentUser.imageUrl === undefined) {
      npCtrl.currentUser.imageUrl = './images/defaultavatar.png';
    }
    $http.post('/api/me', npCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
        $state.go('dashboard');
      });
  };
}
