angular.module('ggApp')
  .controller('statisticsCtrl', statisticsController);

statisticsController.$inject = [];

function statisticsController() {
  const sCtrl = this;

  sCtrl.title = 'News Controller';
  // Initialize collapse button
  $(".button-collapse").sideNav();
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
}
