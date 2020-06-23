App.directive('preciseSelectlistInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      description: '@',
      missed: '=',
      optionlist: '='
    },
    templateUrl: 'modules/preciseform/directives/precise/selectlist-input/selectlist-input.html',
    transclude: true,
    controller: function ($scope, $log)
    {
      $scope.change = function (value) {
        $scope.value = value
        $scope.missed = false
      }
    }
  }
})
