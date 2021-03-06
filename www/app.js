///// Defining App module
angular.module('ggApp', ['ui.router', 'ngCookies', 'angular-loading-bar'])
  .config(ggAppRouter)
///// Defining App injections
ggAppRouter.$inject = ['$stateProvider', '$urlRouterProvider'];
///// Router function to define routes
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
    .state('statistics', {
      url : '/statistics',
      templateUrl : 'partials/statistics.html',
      controller  : 'statisticsCtrl as sCtrl'
    })
    .state('admin', {
      url : '/admin',
      templateUrl : 'partials/admin.html',
      controller  : 'adminCtrl as aCtrl'
    })
    .state('dashboard', {
      url : '/dashboard',
      templateUrl : 'partials/dashboard.html',
      controller  : 'dashboardCtrl as dCtrl'
    })
    .state('game', {
      url : '/game',
      templateUrl : 'partials/game.html',
      controller  : 'gameCtrl as gCtrl'
    })
    .state('newProfile', {
      url : '/newProfile',
      templateUrl : 'partials/new-profile.html',
      controller  : 'newProfileCtrl as npCtrl'
    })

    $urlRouterProvider.otherwise('/')
}
///// Added directive to handle player images being missing
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
