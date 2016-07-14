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
