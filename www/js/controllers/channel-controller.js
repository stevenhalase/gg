///// Attaching Channel controller to App module
angular.module('ggApp')
  .controller('channelCtrl', channelController);
///// Defining Channel controller injections
channelController.$inject = ['$stateParams', '$sce', 'StreamFactory', '$state', '$cookies'];
///// Channel controller function
function channelController($stateParams, $sce, StreamFactory, $state, $cookies) {
  ///// Local variable referring to 'this'
  var cCtrl = this;
  ///// Setting current channel to channel located in $cookie
  cCtrl.channel = $cookies.getObject("currentChannel");
  ///// Passing channel Twitch url through $sce to trust it as a valid url
  cCtrl.channelUrl = $sce.trustAsResourceUrl('https://player.twitch.tv/?channel=' + cCtrl.channel.name);
  ///// Passing chat Twitch url through $sce to trust it as a valid url
  cCtrl.chatUrl = $sce.trustAsResourceUrl('http://www.twitch.tv/' + cCtrl.channel.name + '/chat/');
}
