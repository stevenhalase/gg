angular.module('ggApp')
  .controller('homeCtrl', homeController);

homeController.$inject = ['$state', '$http'];

function homeController($state, $http) {
  var hCtrl = this;

  hCtrl.title = 'Home Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
}
