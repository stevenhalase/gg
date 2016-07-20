angular.module('ggApp')
  .factory('adFactory', adFactory);

  adFactory.$inject = ['$http'];

  function adFactory($http) {

    function getVideoCards() {
      return $http.get('/api/ads/video-cards')
    }


    return {
      getVideoCards : getVideoCards
    };
  }

///// Attaching Admin controller to App module
angular.module('ggApp')
  .controller('adminCtrl', adminController);
///// Defining Admin controller injections
adminController.$inject = ['$state', '$http'];
///// Admin controller function
function adminController($state, $http) {
  ///// Local variable referring to 'this'
  var aCtrl = this;
  aCtrl.matches = [];
  aCtrl.words = ['one', 'two', 'three', 'four', 'five'];
  aCtrl.activeUsers = [];
  ///// Open modal using JQuery
  aCtrl.openModal = function(modalID) {
    $('#' + modalID).openModal();
  };
  ///// Close modal using JQuery
  aCtrl.closeModal = function(modalID) {
    $('#' + modalID).closeModal();
  };

  setInterval(function() {
    $http.get('/api/admin/sessions')
      .then(function(response) {
        aCtrl.activeUsers = response.data;
      })
  }, 1000*3)



  ///// Saves admin updated Match to DB
  aCtrl.saveMatch = function() {
    ///// If Match has an _id (i.e. checking if Match is originally came from DB
    ///// or it is a newly generated Match)
    if (aCtrl.match._id) {
      ///// Send PUT request to Express server API route to save updated Match
      $http.put('/api/v1/csgo-matches/' + aCtrl.match._id, aCtrl.match)
        .then(function(response) {
          ///// Display result from saving match
          console.log('Match Save API response: ', response);
        });
    ///// If Match is newly generated and hasn't been in DB
    } else {
      ///// Send POST request to Express server API route to save new Match
      $http.post('/api/v1/csgo-matches/', aCtrl.match)
        .then(function(response) {
          ///// Display result from saving match
          console.log('Match Save API response: ', response);
        });
    }
    ///// After saving new Match or updating existing one, refresh
    ///// displayed matches from DB
    $http.get('/api/v1/csgo-matches/')
      .then(function(response) {
        console.log('Internal API response: ', response);
        aCtrl.matches = response.data;
      });
  };
  ///// Removes Match from DB through API call to Express
  aCtrl.removeMatch = function(id) {
    ///// Send DELETE request to DB through API
    $http.delete('/api/v1/csgo-matches/' + id)
      .then(function(response) {
        ///// Display result from deleting Match from DB
        console.log('Match Save API response: ', response);
      });
    ///// After saving new Match or updating existing one, refresh
    ///// displayed matches from DB
    $http.get('/api/v1/csgo-matches/')
      .then(function(response) {
        console.log('Internal API response: ', response);
        aCtrl.matches = response.data;
      });
  };

  ///// Setting current Match to respective user selected Match
  aCtrl.editMatch = function(match) {
    aCtrl.match = match;
  };
  ///// GET request to get Matches from DB
  $http.get('/api/v1/csgo-matches/')
    .then(function(response) {
      console.log('Internal API response: ', response);
      aCtrl.matches = response.data;
    });
  ///// Clearing current Match object when user selects to create new Match
  aCtrl.clearForNew = function() {
    aCtrl.match = {
      matchUrl : '',
      teams : [{
        teamName : '',
        teamUrl : '',
        teamLogoUrl : '',
        players : [{
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        }]
      },
      {
        teamName : '',
        teamUrl : '',
        teamLogoUrl : '',
        players : [{
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        },
        {
          playerName : '',
          playerUrl : '',
          playerImg : '',
          playerID : '',
          rating : '',
          deathsPerRound : '',
          killsPerRound : '',
          headshots : ''
        }]
      }]
    };
  };
  ///// Setting default current Match to empty
  aCtrl.match = {
    matchUrl : '',
    teams : [{
      teamName : '',
      teamUrl : '',
      teamLogoUrl : '',
      players : [{
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      }]
    },
    {
      teamName : '',
      teamUrl : '',
      teamLogoUrl : '',
      players : [{
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      },
      {
        playerName : '',
        playerUrl : '',
        playerImg : '',
        playerID : '',
        rating : '',
        deathsPerRound : '',
        killsPerRound : '',
        headshots : ''
      }]
    }]
  };
}

///// Attaching Channel controller to App module
angular.module('ggApp')
  .controller('channelCtrl', channelController);
///// Defining Channel controller injections
channelController.$inject = ['$stateParams', '$sce', 'StreamFactory', '$state', '$cookies'];
///// Channel controller function
function channelController($stateParams, $sce, StreamFactory, $state, $cookies) {
  ///// Local variable referring to 'this'
  var cCtrl = this;
  ///// Setting current channel to channel located in $cookie
  cCtrl.channel = $cookies.getObject("currentChannel");
  ///// Passing channel Twitch url through $sce to trust it as a valid url
  cCtrl.channelUrl = $sce.trustAsResourceUrl('https://player.twitch.tv/?channel=' + cCtrl.channel.name);
  ///// Passing chat Twitch url through $sce to trust it as a valid url
  cCtrl.chatUrl = $sce.trustAsResourceUrl('https://www.twitch.tv/' + cCtrl.channel.name + '/chat/');
}

///// Attaching Dashboard controller to App module
angular.module('ggApp')
  .controller('dashboardCtrl', dashboardController);
///// Defining Dashboard controller injections
dashboardController.$inject = ['$state', '$http', 'userFactory', '$cookies'];
///// Dashboard controller function
function dashboardController($state, $http, userFactory, $cookies) {
  ///// Local variable referring to 'this'
  var dCtrl = this;
  ///// Setting current user in controller to current user from userFactory
  dCtrl.currentUser = userFactory.currentUser;
  ///// Change channel by placing channel info in $cookie
  dCtrl.changeChannel = function(streamObj) {
    $cookies.putObject("currentChannel", streamObj);
    ///// Go to channel view after setting current channel
    $state.go('channel');
  };
  dCtrl.goToGame = function(gameObj) {
    $cookies.putObject("currentGame", gameObj);
    // console.log(streamObj);
    $state.go('game');
  };
  ///// Remove stream from User object in DB
  dCtrl.removeStream = function (stream) {
    ///// Get index of stream in User profile recentChannels array
    var index = dCtrl.currentUser.recentChannels.indexOf(stream);
    dCtrl.currentUser.recentChannels.splice(index, 1);
    ///// POST request to User API route to update profile after removing stream
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      });
  };
  ///// Remove all streams from User object in DB
  dCtrl.clearStreams = function() {
    ///// Clear User profile recentChannels array
    dCtrl.currentUser.recentChannels = [];
    ///// POST request to User API route to update profile after removing streams
    $http.post('/api/me', dCtrl.currentUser)
      .then(function(response) {
        console.log('SAVED DUDE: ', response);
      });
  };

  dCtrl.searchFavoriteGame = function() {
    console.log(dCtrl.favoriteGameSearchField);
    $http.get('https://api.twitch.tv/kraken/search/games?q=' + dCtrl.favoriteGameSearchField + '&type=suggest')
      .then(function(response) {
        // console.log(response)
        if(response.data.games.length > 0) {
          // console.log('game result: ', response.data.games[0])
          dCtrl.currentUser.favoriteGames.push(response.data.games[0]);
          console.log(dCtrl.currentUser.favoriteGames[0]);
          $http.post('/api/me', dCtrl.currentUser)
            .then(function(response) {
              console.log('SAVED DUDE: ', response);
            });
        }
      });
  };

  dCtrl.removeGame = function(game) {
    var index = dCtrl.currentUser.favoriteGames.indexOf(game);
    dCtrl.currentUser.favoriteGames.splice(index, 1);
  };

  dCtrl.searchForFriends = function() {
    console.log(dCtrl.friendSearchField);
    console.log('current user: ', dCtrl.currentUser);
    $http.post('/api/users', {'query': dCtrl.friendSearchField})
      .then(function(response) {
        console.log(response);
        dCtrl.currentUser.friends.push(response.data[0]);
        $http.post('/api/me', dCtrl.currentUser)
          .then(function(response) {
            console.log('SAVED DUDE: ', response);
          });
      });
  };

  dCtrl.openFriendModal = function(_id) {
    console.log('#' + _id);
     $('#' + _id).openModal();
  };
}

///// Attaching Game controller to App module
angular.module('ggApp')
  .controller('gameCtrl', gameController);
///// Defining Game controller injections
gameController.$inject = ['$state', '$http', 'userFactory', 'adFactory', '$cookies'];
///// Game controller function
function gameController($state, $http, userFactory, adFactory, $cookies) {
  ///// Local variable referring to 'this'
  var gCtrl = this;
  ///// Setting current game to current game stored in $cookies
  gCtrl.currentGame = $cookies.getObject("currentGame");
  console.log('current game: ', gCtrl.currentGame );
  ///// Setting current user in controller to current user from userFactory
  gCtrl.currentUser = userFactory.currentUser;
  gCtrl.favoriteGames = [];
  gCtrl.currentGameData = {};
  gCtrl.currentGameAppId = '';
  gCtrl.adItems = [];
  ///// GET request to Twitch API to get top 3 streams for the current game
  $http.get('https://api.twitch.tv/kraken/streams/?game=' + gCtrl.currentGame.name + '&stream_type=live&limit=4')
    .then(function(response) {
      ///// Attach returned streams to current game object
      gCtrl.currentGame.streams = response.data.streams;
    });
  ///// Change Twitch channel based on stream selected by user
  gCtrl.changeChannel = function(streamObj,modalID) {
    ///// Check to see if current User has a recentChannels array
    ///// (asserting that there is a user logged in)
    if (userFactory.currentUser.recentChannels !== undefined) {
      ///// If user does then add the current stream to user profile
      userFactory.currentUser.recentChannels.push(streamObj);
      ///// GET request to User API to save profile after adding current stream
      $http.post('/api/me', userFactory.currentUser)
        .then(function(response) {
          console.log('SAVED DUDE: ', response);
        });
    }
    ///// Add stream to $cookie to be used in the channel controller
    $cookies.putObject("currentChannel", streamObj);
    ///// Change view to Channel
    $state.go('channel');
    ///// Close the modal using JQuery
    $('#' + modalID).closeModal();
  };
  ///// Generate Stream url from Stream name
  gCtrl.getStreamLink = function(streamName) {
    return 'https://player.twitch.tv/?channel=' + streamName;
  };
  ///// Fixes given logo url for Twitch game cover
  gCtrl.fixLogoUrl = function(url) {
    url = url.split('logoart');
    url = url[0] + 'boxart' + url[1];
    url = url.split('240');
    url = url[0] + '800' + url[1];
    url = url.split('144');
    url = url[0] + '800' + url[1];
    return url;
  };
  ///// Fixed given image url from GiantBomb
  gCtrl.fixGiantBombUrl = function(imageUrl) {
    imageUrl = imageUrl.split('//')[1];
    imageUrl = 'http://' + imageUrl;
    return imageUrl;
  };
  ///// Generating querystring to be used to call GiantBomb API
  var queryName = gCtrl.currentGame.name.split(' ').join('');
  ///// JSONP request to GiantBomb API to get information for current game
  $http({
    method: 'JSONP',
    url: 'https://www.giantbomb.com/api/game/' + gCtrl.currentGame.giantbomb_id + '/?api_key=c63b181fdfa9d0b843f4d59835027bfbe3616c85&format=json',
    params: {
      format: 'jsonp',
      json_callback: 'JSON_CALLBACK'
    }
  })
    .then(function(response) {
      ///// Save response data to controller variable
      gCtrl.currentGameData = response.data.results;
      ///// Adjusting game name to be used to get news from SteamDB
      var gameNameQuery = gCtrl.currentGameData.name.split(' ').join('-');
      if (gameNameQuery.includes(':')) {
        gameNameQuery = gameNameQuery.split(':').join('');
      }
      gCtrl.getNews(gameNameQuery);
      ///// Parsing image url to be used to set background of game page
      parsedImageUrl = gCtrl.fixGiantBombUrl(gCtrl.currentGameData.image.super_url);
      ///// Setting game page background image with JQuery
      $('.game-wrapper').css({
        'background-image' : 'url(' + parsedImageUrl + ')'
      });
    });
  ///// Get news for current game from N4G
  gCtrl.getNews = function(gameNameQuery) {
    $http.get('/api/news/game/' + gameNameQuery)
      .then(function(response) {
        console.log('news response: ', response);
        gCtrl.news = response.data;
      });
  };

  // adFactory.getVideoCards().then(function(response) {
  //   console.log('ad response: ', response)
  //   // console.log('ads: ', response.data.ItemSearchResponse.Items[0].Item);
  //   gCtrl.adItems = response.data.ItemSearchResponse.Items[0].Item.slice(0, 4);
  // });

  ///// Steam Featured Store
  // $http.get('http://store.steampowered.com/api/featured/')
  //   .then(function(response) {
  //     console.log('steam response: ', response);
  //   });
}

///// Attaching Home controller to App module
angular.module('ggApp')
  .controller('homeCtrl', homeController);
///// Defining Home controller injections
homeController.$inject = ['$state', '$http'];
///// Home controller function
function homeController($state, $http) {
  ///// Local variable referring to 'this'
  var hCtrl = this;
}

///// Attaching Index controller to App module
angular.module('ggApp')
  .controller('indexCtrl', indexController);
///// Defining Index controller injections
indexController.$inject = ['$scope', '$location', '$http', '$state', 'userFactory'];
///// Index controller function
function indexController($scope, $location, $http, $state, userFactory) {
  ///// Local variable referring to 'this'
  var iCtrl = this;
  $(document).ready(function() {
    // Initialize collapse button
    $(".button-collapse").sideNav({menuWidth: 300,closeOnClick: true});
  });
  iCtrl.openNav = function() {
    $('.button-collapse').sideNav('show');
  };

  iCtrl.closeOverlay = function() {
    $('div[id^=sidenav-overlay]').remove();
    if (iCtrl.loggedIn === false) {
      if(iCtrl.showLogin === true) {
        iCtrl.showLogin = false;
      }
    } else if (iCtrl.loggedIn === true) {
      if(iCtrl.showUserMenu === true) {
        iCtrl.showUserMenu = false;
      }
    }
  };

  iCtrl.showLogin = false;
  iCtrl.showUserMenu = false;

  iCtrl.loggedInUser = {};
  iCtrl.loggedIn = false;
  ///// When UI-Router route changes parse it to be used for 'active' class
  ///// for nav bar links
  $scope.$on('$locationChangeSuccess', function () {
    // console.log('changing location', $location.path())
    $scope.location = $location.path().replace('/', '');
  });
  ///// Get user from userFactory
  userFactory.getUser()
    .then(function(response) {
      ///// Setting current user
      iCtrl.loggedInUser = response.data;
      ///// Letting userFactory know that the currentUser has changed
      userFactory.currentUser = iCtrl.loggedInUser;
      ///// Checking to see that the User is valid
      if(iCtrl.loggedInUser._id) {
        iCtrl.loggedIn = true;
      }
    });
}

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
  };

  mCtrl.parseImageUrl = function(url) {
    // console.log('parsin fool!')
    return $sce.trustAsResourceUrl(url);
  };

  mCtrl.openModal = function(modalID) {
    console.log('opening modal');
    $('#' + modalID).openModal();
  };

  mCtrl.closeModal = function(modalID) {
    // console.log('closing modal', modalID);
    $('#' + modalID).closeModal();
  };

  mCtrl.getAvg = function(team, category) {
    // console.log(team.players[0].rating.length)
    var playersLength = 5;
    for (var i = 0; i < team.players.length; i++) {
      // console.log('PLAYER: ', player);
      if (team.players[i].rating.length === 0) {
        playersLength--;
      }
    }
    if(category === 'rating') {
      var sum1 = 0;
      for (var i = 0; i < team.players.length; i++) {
        if (team.players[i].rating.length !== 0) {
          sum1 = sum1 + parseFloat(team.players[i].rating);
        }
      }
      team.rating = sum1 / playersLength;
      // console.log(team)
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum1 / playersLength;
    } else if (category === 'killsPerRound') {
      var sum2 = 0;
      for (var i = 0; i < team.players.length; i++) {
        if (team.players[i].killsPerRound.length !== 0) {
          sum2 = sum2 + parseFloat(team.players[i].killsPerRound);
        }
      }
      team.killsPerRound = sum2 / playersLength;
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum2 / playersLength;
    } else if (category === 'deathsPerRound') {
      var sum3 = 0;
      for (var i = 0; i < team.players.length; i++) {
        if (team.players[i].deathsPerRound.length !== 0) {
          sum3 = sum3 + parseFloat(team.players[i].deathsPerRound);
        }
      }
      team.deathsPerRound = sum3 / playersLength;
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum3 / playersLength;
    } else if (category === 'headshots') {
      var sum4 = 0;
      for (var i = 0; i < team.players.length; i++) {
        if (team.players[i].headshots.length !== 0) {
          sum4 = sum4 + parseFloat(team.players[i].headshots);
        }
      }
      team.headshots = sum4 / playersLength;
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum4 / playersLength;
    } else if (category === 'roundsContributed') {
      var sum5 = 0;
      for (var i = 0; i < team.players.length; i++) {
        if (team.players[i].roundsContributed.length !== 0) {
          sum5 = sum5 + parseFloat(team.players[i].roundsContributed);
        }
      }
      // console.log('sum : ', sum, 'avg: ', sum / playersLength)
      return sum5 / playersLength;
    }
  };

  mCtrl.getBg = function(teamOne, teamTwo, category) {
    // console.log(category)
    if (category === 'rating') {
      if(teamOne.rating === teamTwo.rating) {
        return 'tied';
      } else if(teamOne.rating > teamTwo.rating) {
        return 'higher';
      } else {
        return 'lower';
      }
    } else if (category === 'killsPerRound') {
      if(teamOne.killsPerRound === teamTwo.killsPerRound) {
        return 'tied';
      } else if(teamOne.killsPerRound > teamTwo.killsPerRound) {
        return 'higher';
      } else {
        return 'lower';
      }
    } else if (category === 'deathsPerRound') {
      if(teamOne.deathsPerRound === teamTwo.deathsPerRound) {
        return 'tied';
      } else if(teamOne.deathsPerRound > teamTwo.deathsPerRound) {
        return 'higher';
      } else {
        return 'lower';
      }
    } else if (category === 'headshots') {
      if(teamOne.headshots === teamTwo.headshots) {
        return 'tied';
      } else if(teamOne.headshots > teamTwo.headshots) {
        return 'higher';
      } else {
        return 'lower';
      }
    }
  };

  mCtrl.goCray = function() {
    var randomWidth = Math.floor(Math.random() * 500) + 'px';
    var randomAngle = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
    console.log(randomWidth);
    $('#broke-img').css({
      width: randomWidth,
      transform: randomAngle
    });
    $('main').css({
      'background-image': "url('../images/flames.jpg')",
      'background-size': 'cover',
      'background-position': 'center'
    });
    $('#updating').text('OH DAYUM!');
    $('#updating').css({
      'font-weight': 'bolder',
      color: 'white'
    });
  };

  mCtrl.nah = function() {
    $('#broke-img').css({
      width: '200px',
      transform: 'none'
    });
    $('main').css({
      'background-image': "none",
      'background-size': 'cover',
      'background-position': 'center'
    });
    $('#updating').text("We're updating matches, relax.");
    $('#updating').css({
      'font-weight': 'normal',
      color: 'black'
    });
  };

  // Local MONGODB API Call
  $http.get('/api/v1/csgo-matches/')
    .then(function(response) {
      console.log('Internal API response: ', response);
      mCtrl.matches = response.data;
    });



  setTimeout(function() {
    // console.log(mCtrl.matches)
  },2000);

}

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
    console.log(npCtrl.favoriteGameSearchField);
    $http.get('https://api.twitch.tv/kraken/search/games?q=' + npCtrl.favoriteGameSearchField + '&type=suggest')
      .then(function(response) {
        // console.log(response)
        if(response.data.games.length > 0) {
          // console.log('game result: ', response.data.games[0])
          npCtrl.currentUser.favoriteGames.push(response.data.games[0]);
          console.log(npCtrl.currentUser.favoriteGames[0]);
          $http.post('/api/me', npCtrl.currentUser)
            .then(function(response) {
              console.log('SAVED DUDE: ', response);
            });
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

angular.module('ggApp')
  .controller('statisticsCtrl', statisticsController);

statisticsController.$inject = [];

function statisticsController() {
  var sCtrl = this;

  sCtrl.title = 'News Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
}

angular.module('ggApp')
  .factory('StreamFactory', streamFactory);

  streamFactory.$inject = ['$http'];

  function streamFactory($http) {
    currentChannel = null;


    return {
      currentChannel : currentChannel
    };
  }

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

angular.module('ggApp')
  .factory('userFactory', userFactory);

  userFactory.$inject = ['$http'];

  function userFactory($http) {

    var currentUser = {};

    function getUser() {
      return $http.get('/api/me/');
    }

    return {
      getUser : getUser,
      currentUser : currentUser
    };
  }
