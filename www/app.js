angular.module('ggApp', ['ui.router', 'ngCookies'])
  .config(ggAppRouter)

ggAppRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

function ggAppRouter($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl : 'partials/home.html',
      controller  : 'homeCtrl as hCtrl'
    })
    .state('matches', {
      url: '/matches',
      templateUrl : 'partials/matches.html',
      controller  : 'matchesCtrl as mCtrl'
    })
    .state('news', {
      url: '/news',
      templateUrl : 'partials/news.html',
      controller  : 'newsCtrl as nCtrl'
    })
    .state('streams', {
      url: '/streams',
      templateUrl : 'partials/streams.html',
      controller  : 'streamsCtrl as sCtrl'
    })
    .state('channel', {
      url : '/channel',
      templateUrl : 'partials/channel.html',
      params : {channelswitch : null},
      controller  : 'channelCtrl as cCtrl'
    })

    $urlRouterProvider.otherwise('/')
}

angular.module('ggApp')
  .directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.onErrorSrc) {
              attrs.$set('src', attrs.onErrorSrc);
            }
          });
        }
    }
});
