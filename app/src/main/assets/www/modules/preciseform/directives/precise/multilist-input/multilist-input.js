App.directive('preciseMultilistInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      description: '@',
      missed: '=',
      optionlist: '='
    },
    templateUrl: 'modules/preciseform/directives/precise/multilist-input/multilist-input.html',
    transclude: true,
    controller: function ($scope, $log)
    {
      $log.log("scope value", $scope.value)

      $scope.checkbox_model = []
      $scope.valueArray = []
      for (var i = 0; i < $scope.optionlist.length; i++) {
        $scope.valueArray[$scope.optionlist[i]] = false;
        $scope.checkbox_model.push(false);
      }

      $scope.autoCheck = function () {
        for (var i = 0; i < $scope.value.length; i++) {
          $scope.valueArray[$scope.value[i]] = true;
          j = 0;
          for (var key in $scope.valueArray) {
            if (key == $scope.value[i]) {
              $scope.checkbox_model[j] = true;
            }
            j++;
          }
        }
      }

      // default value given (checked box)
      if (Array.isArray($scope.value)) {
        $scope.autoCheck()
      }
      else if (typeof $scope.value === 'string' || $scope.value instanceof String) {
        $log.debug("default value is of type string")
        // $scope.valueArray[$scope.value[0]] = true
        var new_value = []
        new_value.push($scope.value)
        $scope.valueArray[$scope.value[0]] = true
        $scope.value = new_value;
        $log.log("scope value", $scope.value)
        $scope.autoCheck()
      }
      $scope.value = $scope.valueArray;

      $scope.change = function (index) {
        $scope.valueArray[$scope.optionlist[index]] = !$scope.valueArray[$scope.optionlist[index]];
        $scope.value = $scope.valueArray;
      }
    }
  }
})
