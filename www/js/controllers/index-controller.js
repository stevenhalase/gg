///// Attaching Index controller to App module
angular.module('ggApp')
  .controller('indexCtrl', indexController);
///// Defining Index controller injections
indexController.$inject = ['$scope', '$location', '$http', '$state', 'userFactory'];
///// Index controller function
function indexController($scope, $location, $http, $state, userFactory) {
  ///// Local variable referring to 'this'
  var iCtrl = this;
  $(document).ready(function() {
    // Initialize collapse button
    $(".button-collapse").sideNav({menuWidth: 300,closeOnClick: true});
  });
  iCtrl.openNav = function() {
    $('.button-collapse').sideNav('show');
  };

  var length = 0;
  setInterval(function() {
    // console.log('1')
    var sideNavOverlay = document.getElementsByClassName('drag-target')
    if (sideNavOverlay !== null) {
      // console.log('1')
      if(sideNavOverlay.length !== length) {
        length = sideNavOverlay.length
        // console.log(length)
      }
      for (var i = 0; i < sideNavOverlay.length; i++) {
        sideNavOverlay[i].addEventListener("touchstart", handlerFunction, false);
      }

      function handlerFunction(event) {
        // console.log('some shit happened')
        for (var i = 0; i < sideNavOverlay.length; i++) {
          $(sideNavOverlay[i]).remove();
          // console.log($(sideNavOverlay[i]))
        }
      }
    }

  },10)



  iCtrl.closeOverlay = function() {
    $('div[id^=sidenav-overlay]').remove();
    if (iCtrl.loggedIn === false) {
      if(iCtrl.showLogin === true) {
        iCtrl.showLogin = false;
      }
    } else if (iCtrl.loggedIn === true) {
      if(iCtrl.showUserMenu === true) {
        iCtrl.showUserMenu = false;
      }
    }
  };

  iCtrl.showLogin = false;
  iCtrl.showUserMenu = false;

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
    });
}
