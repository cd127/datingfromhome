App.directive('preciseLongtextInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      maxlength: '@',
      placeholder: '@',
      description: '@',
      required: '@',
      missed: '=',
      requiremessage: '@'
    },
    templateUrl: 'modules/preciseform/directives/precise/longtext-input/longtext-input.html',
    transclude: true,
    controller: function ($scope, $log)
    {
      function strToBool(str) {
        if (str === 'true' || str === 'TRUE') {
          return true;
        }
        return false;
      }

      $scope.input_focused = false;
      $scope.count = $scope.value.length
      $scope.error = false;
      if ($scope.required == undefined) {
        $scope.required = "false";
      }

      $scope.change = function () {
        $scope.count = $scope.value.length
      }

      $scope.focus = function () {
        $scope.input_focused = true;
      }

      $scope.blur = function () {
        $scope.input_focused = false;
        if (strToBool($scope.required) == true && $scope.value == '') {
          $log.debug('required, value:', $scope.value)
          $scope.error = true;
        }
        else {
          $scope.error = false;
          $scope.missed = false;
        }
      }
    }
  }
})
