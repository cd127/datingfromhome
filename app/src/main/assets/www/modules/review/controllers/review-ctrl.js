App.controller("ReviewViewController", function(
  $log,
  $scope,
  $stateParams,
  $translate,
  $window,
  $ionicPopup,
  ReviewServ
) {
  $log.log("Hello from ReviewViewController");
  $scope.is_apple = ionic.Platform.isIPad() || ionic.Platform.isIOS();
  $scope.is_google = ionic.Platform.isAndroid();
  $scope.loading = false;
  $scope.value_id = $stateParams.value_id;
  $scope.page_title = "";
  $scope.review = {
    url_apple: "",
    url_google: "",
    label: "",
    prompt: ""
  };

  $scope.loadContent = (function() {
    $scope.loading = true;
    ReviewServ.find($scope.value_id)
      .then(function(data) {
        $scope.review.url_apple = data.url_ios;
        $scope.review.url_google = data.url_android;
        $scope.review.label = data.label;
        $scope.review.prompt = data.prompt;
        $scope.page_title = data.page_title;
        $scope.loading = false;
        $scope.$apply();
      })
      .catch(function(err) {
        $scope.loading = false;
      });
  })();

  $scope.clickOnReview = function() {
    if ($scope.review.url_apple == null && $scope.review.url_google == null) {
      $ionicPopup.alert({
        title: "App not published",
        template:
          "This feature cannot be used until Application has been published"
      });
    } else {
      if ($scope.is_apple || $scope.is_google) {
        var url = $scope.is_apple
          ? $scope.review.url_apple
          : $scope.review.url_google;
        $window.open(url, "_system", "location=yes");
      } else {
        $ionicPopup.alert({
          title: "You are in a Webview",
          template: "This feature is available in-App only"
        });
      }
    }
  };
});
