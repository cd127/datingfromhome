App.config(function($stateProvider) {
  $stateProvider.state("review-view", {
    url: BASE_PATH + "/review/mobile_view/index/value_id/:value_id",
    templateUrl: "modules/review/templates/review.html",
    controller: "ReviewViewController",
    cache: false
  });
});
