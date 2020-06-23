App.directive("preciseSeparatorhtmlInput", function() {
  return {
    restrict: "E",
    scope: {
      id: "@",
      value: "="
    },
    templateUrl: "modules/preciseform/directives/precise/separatorhtml-input/separatorhtml-input.html",
    transclude: true,
    controller: function($scope, $log, $sce)
    {
      $scope.trustedHtml = function (plainText) {
        return $sce.trustAsHtml(plainText);
      }
    }
  };
});
