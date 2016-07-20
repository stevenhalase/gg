///// Attaching Home controller to App module
angular.module('ggApp')
  .controller('newProfileCtrl', newProfileController);
///// Defining Home controller injections
newProfileController.$inject = ['$state', '$http', 'userFactory'];
///// Home controller function
function newProfileController($state, $http, userFactory) {
  ///// Local variable referring to 'this'
  var npCtrl = this;
  $http.get('/api/me')
    .then(function(response) {
      npCtrl.currentUser = response.data
    })
  console.log(npCtrl.currentUser);

  npCtrl.searchFavoriteGame = function() {
    console.log(npCtrl.favoriteGameSearchField);
    $http.get('https://api.twitch.tv/kraken/search/games?q=' + npCtrl.favoriteGameSearchField + '&type=suggest')
      .then(function(response) {
        // console.log(response)
        if(response.data.games.length > 0) {
          npCtrl.favoriteGameSearchField = '';
          Materialize.toast('Game added!', 3000)
          // console.log('game result: ', response.data.games[0])
          npCtrl.currentUser.favoriteGames.push(response.data.games[0]);
          console.log(npCtrl.currentUser.favoriteGames[0]);
          $http.post('/api/me', npCtrl.currentUser)
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
