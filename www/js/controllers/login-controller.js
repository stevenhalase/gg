angular.module('ggApp')
  .controller('loginCtrl', loginController);

loginController.$inject = ['$http', '$state'];

function loginController($http, $state) {
  const lCtrl = this;

  // setTimeout(function() {
  //   console.log('home: ', $state.includes('home'));
  // },1000)

  lCtrl.title = 'Home Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();lCtrl.submitLogin(username,password)

  lCtrl.submitLogin = function (username,password) {
    let user = {"username": username, "password" : password}
    console.log('sending')
    $http.post('/login', user)
      .then(
        function(response) {
          console.log('success', response);
        },
        function(response) {
          console.log('error', response)
        })
  }

  lCtrl.submitSignUp = function (username,password) {
    let user = {"username": username, "password" : password}
    console.log('sending')
    $http.post('/signup', user)
      .then(
        function(response) {
          console.log('success', response);
        },
        function(response) {
          console.log('error', response)
        })
  }

}
