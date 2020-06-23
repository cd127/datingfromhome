App.directive('preciseRangeInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      placeholder: '@',
      description: '@',
      required: '@',
      decimal: '@',
      min: '@',
      max: '@',
      step: '@',
      missed: '=',
      requiremessage: '@'
    },
    templateUrl: 'modules/preciseform/directives/precise/range-input/range-input.html',
    transclude: true,
    controller: function ($scope, $log)
    {
      function strToBool(str) {
        if (str === 'true' || str === 'TRUE') {
          return true;
        }
        return false;
      }

      function parseDecimal(value, decimal) {
        if (decimal) {
          return parseFloat(value).toFixed(parseInt(decimal))
        } else {
          return parseFloat(value).toFixed(0)
        }
      }

      function truncMax() {
        if ($scope.vm.max) {
          if (parseFloat($scope.vm.max) < parseFloat($scope.value))
            $scope.value = parseDecimal($scope.vm.max, $scope.vm.decimal);
        }
      }

      function truncMin() {
        if ($scope.min) {
          if (parseFloat($scope.min) > $scope.value)
            $scope.value = parseDecimal($scope.min, $scope.decimal);
        }
      }

      $scope.vm = {
        input_focused: false,
        count: 0,
        error: false,
        description: $scope.description,
        placeholder: $scope.placeholder,
        min: false,
        max: false,
        step: $scope.step
      }
      if (!!$scope.value)
        $scope.value = 1;

      function initOptions () {

        $scope.vm.required = strToBool($scope.required)
        if (!!$scope.min)
          $scope.vm.min = $scope.min
        if (!!$scope.max)
          $scope.vm.max = $scope.max
      }
      initOptions();


    }
  }
})
