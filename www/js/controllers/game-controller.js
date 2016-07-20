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
