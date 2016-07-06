angular.module('ggApp')
  .controller('matchesCtrl', matchesController);

matchesController.$inject = ['$http'];

function matchesController($http) {
  const mCtrl = this;

  mCtrl.title = 'Home Controller';

  mCtrl.matches = [];

  mCtrl.posOrNeg = function(perc1, perc2) {
    if (perc1 > perc2) {
      return true;
    } else {
      return false;
    }
  }

  mCtrl.parseImageUrl = function(url) {
    // console.log('parsingurl')
    url = url.slice(2);
    url = 'http://' + url;
    // console.log(url);
    return url;
  }

  mCtrl.openModal = function(modalID) {
    console.log('opening modal');
    $('#' + modalID).openModal();
  }

  mCtrl.closeModal = function(modalID) {
    // console.log('closing modal', modalID);
    $('#' + modalID).closeModal();
  }

  $http.get('/api/v1/matches')
    .then(function(response) {
      console.log('Internal API response: ', response);
      mCtrl.matches = response.data;
    })

}
