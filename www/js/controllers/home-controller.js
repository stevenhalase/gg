angular.module('ggApp')
  .controller('homeCtrl', homeController);

homeController.$inject = ['$state'];

function homeController($state) {
  var hCtrl = this;

  // setTimeout(function() {
  //   console.log('home: ', $state.includes('home'));
  // },1000)


  hCtrl.title = 'Home Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
}
