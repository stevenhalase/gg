angular.module('ggApp')
  .factory('StreamFactory', streamFactory);

  streamFactory.$inject = ['$http'];

  function streamFactory($http) {
    currentChannel = null;


    return {
      currentChannel : currentChannel
    }
  }
