angular.module('ggApp')
  .controller('indexCtrl', indexController);

indexController.$inject = ['$scope', '$location', '$http', 'userFactory'];

function indexController($scope, $location, $http, userFactory) {
  var iCtrl = this;


  iCtrl.loggedInUser = {};
  iCtrl.loggedIn = false;

  $scope.$on('$locationChangeSuccess', function () {
    // console.log('changing location', $location.path())
    $scope.location = $location.path().replace('/', '');
  });

  iCtrl.title = 'Index Controller';

  userFactory.getUser()
    .then(function(response) {
      console.log(response);
      iCtrl.loggedInUser = response.data;
      userFactory.currentUser = iCtrl.loggedInUser;
      if(iCtrl.loggedInUser._id) {
        iCtrl.loggedIn = true;
      }
    })


  /// FIREBASE Initialization
  // Set the configuration for your app
  // var config = {
  //   apiKey: "AIzaSyC8PGdOCsKwsLepAgepj1EeccM_pj2e8yU",
  //   authDomain: "gghub-9103b.firebaseapp.com",
  //   databaseURL: "https://gghub-9103b.firebaseio.com",
  //   storageBucket: "gghub-9103b.appspot.com",
  // };
  // firebase.initializeApp(config);
  //
  // // Get a reference to the database service
  // var database = firebase.database();
  //
  // database.ref('/csgoMatches/').once('value').then(function(snapshot) {
  //   // console.log(snapshot.val())
  //   iCtrl.firebaseObj = snapshot.val();
  //   iCtrl.newData = Object.keys(iCtrl.firebaseObj).map(function(k) { return iCtrl.firebaseObj[k] });
  //   for (var i = 0; i < iCtrl.newData.length; i++) {
  //     iCtrl.newData[i].id = i;
  //   }
  //   console.log(iCtrl.newData)
  //   iCtrl.matches = iCtrl.newData;
  //   $scope.$digest();
  // });
}
