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
    .state('login', {
      url: '/login',
      templateUrl : 'partials/login.html',
      controller  : 'loginCtrl as lCtrl'
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
    .state('statistics', {
      url : '/statistics',
      templateUrl : 'partials/statistics.html',
      controller  : 'statisticsCtrl as sCtrl'
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