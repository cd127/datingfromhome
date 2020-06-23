App.controller("PreciseformConfirmController", function(
  $log,
  $rootScope,
  $scope,
  $state,
  $stateParams,
  $sce
) {
  $log.debug("Hello from PreciseformConfirmController");
  $scope.message = $stateParams.message;
  $scope.page_title = $stateParams.page_title;

  $scope.trustedHtml = function (plainText) {
    return $sce.trustAsHtml(plainText);
  }

  setTimeout(function() {
    $state.go("home");
  }, 4500);
});
