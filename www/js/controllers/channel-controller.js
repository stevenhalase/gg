angular.module('ggApp')
  .controller('channelCtrl', channelController);

channelController.$inject = ['$stateParams', '$sce', 'StreamFactory', '$state', '$cookies'];

function channelController($stateParams, $sce, StreamFactory, $state, $cookies) {
  var cCtrl = this;

  cCtrl.title = 'Channel Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();

  // console.log(StreamFactory.currentChannel)
  console.log($cookies.getObject("currentChannel"))

  cCtrl.channel = $cookies.getObject("currentChannel");

  cCtrl.channelUrl = $sce.trustAsResourceUrl('https://player.twitch.tv/?channel=' + cCtrl.channel.name);

}
