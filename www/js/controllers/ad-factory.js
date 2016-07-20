angular.module('ggApp')
  .factory('adFactory', adFactory);

  adFactory.$inject = ['$http'];

  function adFactory($http) {

    function getVideoCards() {
      return $http.get('/api/ads/video-cards')
    }


    return {
      getVideoCards : getVideoCards
    };
  }
