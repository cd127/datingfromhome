App.directive('preciseEmailInput', function () {
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
      requiremessage: '@',
      invalidmessage: '@'
    },
    templateUrl: 'modules/preciseform/directives/precise/email-input/email-input.html',
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
      $scope.error_required = false;
      $scope.error_invalid = false;
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
        function is_mail(value) {
          if (value.indexOf('@') != -1 && value.indexOf('.') != -1) {
            return true;
          }
          return false;
        }

        $scope.input_focused = false;
        if (strToBool($scope.required) == true && $scope.value == '') {
          $scope.error_required = true;
          $scope.error_invalid = false;
        }
        else if (!is_mail($scope.value)) {
          $scope.error_invalid = true;
          $scope.error_required = false;
        }
        else {
          $scope.error_invalid = false;
          $scope.error_required = false;
          $scope.missed = false;
        }
      }
    }
  }
})
