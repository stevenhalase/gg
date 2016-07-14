///// Attaching Index controller to App module
angular.module('ggApp')
  .controller('indexCtrl', indexController);
///// Defining Index controller injections
indexController.$inject = ['$scope', '$location', '$http', 'userFactory'];
///// Index controller function
function indexController($scope, $location, $http, userFactory) {
  ///// Local variable referring to 'this'
  var iCtrl = this;
  iCtrl.loggedInUser = {};
  iCtrl.loggedIn = false;
  ///// When UI-Router route changes parse it to be used for 'active' class
  ///// for nav bar links
  $scope.$on('$locationChangeSuccess', function () {
    // console.log('changing location', $location.path())
    $scope.location = $location.path().replace('/', '');
  });
  ///// Get user from userFactory
  userFactory.getUser()
    .then(function(response) {
      ///// Setting current user
      iCtrl.loggedInUser = response.data;
      ///// Letting userFactory know that the currentUser has changed
      userFactory.currentUser = iCtrl.loggedInUser;
      ///// Checking to see that the User is valid
      if(iCtrl.loggedInUser._id) {
        iCtrl.loggedIn = true;
      }
    })
}
