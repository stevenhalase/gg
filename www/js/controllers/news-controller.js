angular.module('ggApp')
  .controller('newsCtrl', newsController);

newsController.$inject = [];

function newsController() {
  var nCtrl = this;

  nCtrl.title = 'News Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
}
