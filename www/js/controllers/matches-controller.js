///// Attaching Matches controller to App module
angular.module('ggApp')
  .controller('matchesCtrl', matchesController);

matchesController.$inject = ['$http','$sce', '$scope'];

function matchesController($http, $sce, $scope) {
  var mCtrl = this;

  mCtrl.title = 'Home Controller';

  mCtrl.matches = [];

  $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });

  mCtrl.posOrNeg = function(perc1, perc2) {
    if (perc1 > perc2) {
      return true;
    } else {
      return false;
    }
  }

  mCtrl.parseImageUrl = function(url) {
    console.log('parsin fool!')
    return $sce.trustAsResourceUrl(url);
  }

  mCtrl.openModal = function(modalID) {
    console.log('opening modal');
    $('#' + modalID).openModal();
  }

  mCtrl.closeModal = function(modalID) {
    // console.log('closing modal', modalID);
    $('#' + modalID).closeModal();
  }

  mCtrl.goCray = function() {
    var randomWidth = Math.floor(Math.random() * 500) + 'px';
    var randomAngle = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
    console.log(randomWidth)
    $('#broke-img').css({
      width: randomWidth,
      transform: randomAngle
    })
    $('main').css({
      'background-image': "url('../images/flames.jpg')",
      'background-size': 'cover',
      'background-position': 'center'
    })
    $('#updating').text('OH DAYUM!');
    $('#updating').css({
      'font-weight': 'bolder',
      color: 'white'
    })
  }

  mCtrl.nah = function() {
    $('#broke-img').css({
      width: '200px',
      transform: 'none'
    })
    $('main').css({
      'background-image': "none",
      'background-size': 'cover',
      'background-position': 'center'
    })
    $('#updating').text("We're updating matches, relax.");
    $('#updating').css({
      'font-weight': 'normal',
      color: 'black'
    })
  }

  // Local MONGODB API Call
  $http.get('/api/v1/csgo-matches/')
    .then(function(response) {
      console.log('Internal API response: ', response);
      mCtrl.matches = response.data;
    })



  setTimeout(function() {
    // console.log(mCtrl.matches)
  },2000)

}
