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
    // console.log('parsin fool!')
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

  mCtrl.getAvg = function(team, category) {
    // console.log(team.players[0].rating.length)
    var playersLength = 5;
    for (player of team.players) {
      // console.log('PLAYER: ', player);
      if (player.rating.length === 0) {
        playersLength--
      }
    }
    if(category === 'rating') {
      var sum = 0;
      for (player of team.players) {
        if (player.rating.length !== 0) {
          sum = sum + parseFloat(player.rating);
        }
      }
      team.rating = sum / playersLength;
      // console.log(team)
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum / playersLength;
    } else if (category === 'killsPerRound') {
      var sum = 0;
      for (player of team.players) {
        if (player.killsPerRound.length !== 0) {
          sum = sum + parseFloat(player.killsPerRound);
        }
      }
      team.killsPerRound = sum / playersLength;
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum / playersLength;
    } else if (category === 'deathsPerRound') {
      var sum = 0;
      for (player of team.players) {
        if (player.deathsPerRound.length !== 0) {
          sum = sum + parseFloat(player.deathsPerRound);
        }
      }
      team.deathsPerRound = sum / playersLength;
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum / playersLength;
    } else if (category === 'headshots') {
      var sum = 0;
      for (player of team.players) {
        if (player.headshots.length !== 0) {
          sum = sum + parseFloat(player.headshots);
        }
      }
      team.headshots = sum / playersLength;
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum / playersLength;
    } else if (category === 'roundsContributed') {
      var sum = 0;
      for (player of team.players) {
        if (player.roundsContributed.length !== 0) {
          sum = sum + parseFloat(player.roundsContributed);
        }
      }
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum / playersLength;
    }
  }

  mCtrl.getBg = function(teamOne, teamTwo, category) {
    console.log(category)
    if (category === 'rating') {
      if(teamOne.rating === teamTwo.rating) {
        return 'tied';
      } else if(teamOne.rating > teamTwo.rating) {
        return 'higher';
      } else {
        return 'lower'
      }
    } else if (category === 'killsPerRound') {
      if(teamOne.killsPerRound === teamTwo.killsPerRound) {
        return 'tied';
      } else if(teamOne.killsPerRound > teamTwo.killsPerRound) {
        return 'higher';
      } else {
        return 'lower'
      }
    } else if (category === 'deathsPerRound') {
      if(teamOne.deathsPerRound === teamTwo.deathsPerRound) {
        return 'tied';
      } else if(teamOne.deathsPerRound > teamTwo.deathsPerRound) {
        return 'higher';
      } else {
        return 'lower'
      }
    } else if (category === 'headshots') {
      if(teamOne.headshots === teamTwo.headshots) {
        return 'tied';
      } else if(teamOne.headshots > teamTwo.headshots) {
        return 'higher';
      } else {
        return 'lower'
      }
    }

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
