App.directive('preciseToggleInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      description: '@'
    },
    templateUrl: 'modules/preciseform/directives/precise/toggle-input/toggle-input.html',
    transclude: true,
    controller: function ($scope, $log)
    {

    }
  }
})
