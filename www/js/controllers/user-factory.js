angular.module('ggApp')
  .factory('userFactory', userFactory);

  userFactory.$inject = ['$http'];

  function userFactory($http) {

    var currentUser = {};

    function getUser() {
      return $http.get('/api/me/');
    }

    return {
      getUser : getUser,
      currentUser : currentUser
    };
  }
