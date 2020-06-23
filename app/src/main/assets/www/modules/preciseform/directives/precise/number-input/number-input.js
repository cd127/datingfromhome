App.directive('preciseNumberInput', function () {
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
    templateUrl: 'modules/preciseform/directives/precise/number-input/number-input.html',
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
        required: false,
        step: 1,
        decimal: false,
        description: $scope.description,
        placeholder: $scope.placeholder,
        min: false,
        max: false
      }
      if (!!$scope.value)
        $scope.value = 1;

      function initOptions () {
        $scope.vm.required = strToBool($scope.required)
        if (!!$scope.min)
          $scope.vm.min = $scope.min
        if (!!$scope.max)
          $scope.vm.max = $scope.max
        if (!!$scope.decimal)
          $scope.vm.decimal = $scope.decimal
        if (!!$scope.step)
          $scope.vm.step = $scope.step
        $scope.vm.count = $scope.value.length
      }
      initOptions();


      if ($scope.decimal) {
        $scope.vm.value = parseDecimal($scope.value, $scope.vm.decimal)
      }

      $scope.change = function () {
        $scope.value = $scope.value.replace(/[^\d.-]/g, '');
        $scope.vm.count = $scope.value.length
        if ($scope.vm.count > 0) {
          $scope.missed = false;
        }
      }

      $scope.focus = function () {
        $scope.vm.input_focused = true;
      }

      $scope.decreaseAmount = function() {
        if ($scope.value == '')
          $scope.value = 0;
        $scope.value = parseDecimal(parseFloat($scope.value) - parseFloat($scope.vm.step), $scope.vm.decimal)
        truncMin()
        $scope.missed = false;
      }

      $scope.increaseAmount = function() {
        if ($scope.value == '')
          $scope.value = 0;
        $scope.value = parseDecimal(parseFloat($scope.value) + parseFloat($scope.vm.step), $scope.vm.decimal)
        truncMax()
        $scope.missed = false;
      }

      $scope.blur = function () {
        var tmp_value = $scope.value ;

        tmp_value = parseDecimal(tmp_value, $scope.vm.decimal);
        if (isNaN(tmp_value))
          tmp_value = "";

        $scope.vm.input_focused = false;
        $scope.value = tmp_value;
        truncMin()
        truncMax()

        if ($scope.vm.required == true && !$scope.value) {
          $scope.vm.error = true;
        }
        else {
          $scope.vm.error = false;
          $scope.missed = false;
        }
      }
    }
  }
})
