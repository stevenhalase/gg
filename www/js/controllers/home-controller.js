angular.module('ggApp')
  .controller('homeCtrl', homeController);

homeController.$inject = ['$state', '$http'];

function homeController($state, $http) {
  var hCtrl = this;

  $(document).ready(function(){
      // Materialize.toast(message, displayLength, className, completeCallback);
      Materialize.toast('Thanks for visiting! Be sure to check out the streams and matches!', 5000) // 4000 is the duration of the toast
   });

  hCtrl.title = 'Home Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
}
