angular.module('ggApp')
  .controller('dashboardCtrl', dashboardController);

dashboardController.$inject = ['$state', '$http', 'userFactory', '$cookies'];

function dashboardController($state, $http, userFactory, $cookies) {
  var dCtrl = this;

  $(document).ready(function(){
      // Materialize.toast(message, displayLength, className, completeCallback);
      Materialize.toast('Thanks for logging in!', 3000) // 4000 is the duration of the toast
   });

  dCtrl.title = 'Dassshhh Controller';

  console.log(userFactory.currentUser);
  dCtrl.currentUser = userFactory.currentUser;

  dCtrl.changeChannel = function(streamObj) {
    $cookies.putObject("currentChannel", streamObj);
    // console.log(streamObj);
    $state.go('channel');
  }


}
