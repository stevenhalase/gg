angular.module('ggApp')
  .controller('indexCtrl', indexController);

indexController.$inject = ['$scope', '$location'];

function indexController($scope, $location) {
  const iCtrl = this;

  $scope.$on('$locationChangeSuccess', function () {
    // console.log('changing location', $location.path())
    $scope.location = $location.path().replace('/', '');
  });



  iCtrl.title = 'Index Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();

  iCtrl.toggleNav = function() {
    $("#menu-button").sideNav();
  }
}
