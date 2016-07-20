angular.module('ggApp')
  .controller('newsCtrl', newsController);

newsController.$inject = ['$http'];

function newsController($http) {
  var nCtrl = this;

  nCtrl.title = 'News Controller';

  nCtrl.pcNews = [];
  nCtrl.ps4News = [];
  nCtrl.xboxOneNews = [];

  $http.get('/api/news/game/pc')
    .then(function(response) {
      console.log('news response: ', response);
      nCtrl.pcNews = response.data;
    });

  $http.get('/api/news/game/ps4')
    .then(function(response) {
      console.log('news response: ', response);
      nCtrl.ps4News = response.data;
    });

  $http.get('/api/news/game/xbox-one')
    .then(function(response) {
      console.log('news response: ', response);
      nCtrl.xboxOneNews = response.data;
    });

  $(document).ready(function() {
    $('select').material_select();
  });

  $(document).ready(function(){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });
}
