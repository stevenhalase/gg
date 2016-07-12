angular.module('ggApp')
  .controller('newsCtrl', newsController);

newsController.$inject = ['$http'];

function newsController($http) {
  var nCtrl = this;

  nCtrl.title = 'News Controller';

  nCtrl.csgoNews = [];

  nCtrl.selectedGame = 730;

  nCtrl.newsChange = function() {
    console.log(nCtrl.selectedGame)
    $http.get('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=' + nCtrl.selectedGame + '&count=10&maxlength=300&format=json')
      .then(function(response) {
        nCtrl.news = response.data.appnews.newsitems;
        console.log(nCtrl.news)
      })
  }
  nCtrl.newsChange();

  $(document).ready(function() {
    $('select').material_select();
  });
}
