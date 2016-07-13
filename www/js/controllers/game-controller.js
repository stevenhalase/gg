angular.module('ggApp')
  .controller('gameCtrl', gameController);

gameController.$inject = ['$state', '$http', 'userFactory', '$cookies'];

function gameController($state, $http, userFactory, $cookies) {
  var gCtrl = this;

  // $(document).ready(function(){
  //     // Materialize.toast(message, displayLength, className, completeCallback);
  //     Materialize.toast('Thanks for logging in!', 3000) // 4000 is the duration of the toast
  //  });

  gCtrl.title = 'Dassshhh Controller';

  // console.log($cookies.getObject("currentGame"))

  gCtrl.currentGame = $cookies.getObject("currentGame");
  console.log('current game: ', gCtrl.currentGame)

  // console.log(userFactory.currentUser);
  gCtrl.currentUser = userFactory.currentUser;
  gCtrl.favoriteGames = [];
  gCtrl.currentGameData = {}

  $http.get('https://api.twitch.tv/kraken/streams/?game=' + gCtrl.currentGame.game.name + '&stream_type=live&limit=3')
    .then(function(response) {
      console.log('Streams: ', response.data.streams);
      gCtrl.currentGame.streams = response.data.streams;
    })

  gCtrl.changeChannel = function(streamObj,modalID) {
    if (userFactory.currentUser.recentChannels !== undefined) {
      userFactory.currentUser.recentChannels.push(streamObj);
      // console.log('loggedin user: ', userFactory.currentUser);
      $http.post('/api/me', userFactory.currentUser)
        .then(function(response) {
          console.log('SAVED DUDE: ', response);
        })
    }
    $cookies.putObject("currentChannel", streamObj);
    // console.log(streamObj);
    $state.go('channel');
    $('#' + modalID).closeModal();
  }

  gCtrl.getStreamLink = function(streamName) {
    return 'https://player.twitch.tv/?channel=' + streamName;
  }

  gCtrl.fixLogoUrl = function(url) {

    url = url.split('logoart')
    url = url[0] + 'boxart' + url[1];
    url = url.split('240')
    url = url[0] + '800' + url[1];
    url = url.split('144');
    url = url[0] + '800' + url[1];
    // console.log(url);
    return url;
  }

  gCtrl.fixGiantBombUrl = function(imageUrl) {
    imageUrl = imageUrl.split('//')[1]
    return imageUrl = 'http://' + imageUrl
  }

  var queryName = gCtrl.currentGame.game.name.split(' ').join('')
  console.log(gCtrl.currentGame.game.giantbomb_id)
  $http({
    method: 'JSONP',
    url: 'https://www.giantbomb.com/api/game/' + gCtrl.currentGame.game.giantbomb_id + '/?api_key=c63b181fdfa9d0b843f4d59835027bfbe3616c85&format=json',
    params: {
      format: 'jsonp',
      json_callback: 'JSON_CALLBACK'
    }
  })
    .then(function(response) {
      gCtrl.currentGameData = response.data.results;
      console.log('db response: ', gCtrl.currentGameData)
      console.log(gCtrl.currentGameData.image.super_url)

      parsedImageUrl = gCtrl.fixGiantBombUrl(gCtrl.currentGameData.image.super_url)
      console.log(parsedImageUrl)

      $('.game-wrapper').css({
        'background-image' : 'url(' + parsedImageUrl + ')'
      })
    })

  // setTimeout(function() {
  //   $(window).on('scroll', function() {
  //     $('#game-cover').css('top', Math.max(0, 20 - $(window).scrollTop()))
  //   })
  // }, 1000);


}
