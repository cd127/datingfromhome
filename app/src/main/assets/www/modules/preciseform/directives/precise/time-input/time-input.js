App.directive('preciseTimeInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      description: '@',
      pmam: '@',
      setlabel: '@',
      closelabel: '@',
      placeholder: '@',
      missed: '=',
      step: '@'
    },
    templateUrl: 'modules/preciseform/directives/precise/time-input/time-input.html',
    transclude: true,
    controller: function ($scope, $log, ionicTimePicker)
    {
      var format = 24;
      var set_label = 'Set';
      var step = 5;
      var close_label = 'Close';
      var placeholder = 'Select Hour';

      if ($scope.pmam) {
        if ($scope.pmam == 'true' || $scope.pmam == 'TRUE' || $scope.pmam == '1') {
          format = 12;
        }
      }
      if ($scope.setlabel) {
        set_label = $scope.setlabel;
      }
      if ($scope.closelabel) {
        close_label = $scope.closelabel;
      }
      if ($scope.placeholder) {
        placeholder = $scope.placeholder;
      }
      if ($scope.step) {
        step = parseInt($scope.step);
      }
      $scope.change = function (value) {
        $scope.value = value
        $scope.missed = false;
      }
      $scope.error = false;

      $scope.openTimePicker = function () {
        function renderHourMinute(date_to_render) {
          var hh = date_to_render.getUTCHours();
          var mm = date_to_render.getUTCMinutes();
          if (hh < 10) {
            hh = "0" + hh;
          }
          if (mm < 10) {
            mm = "0" + mm;
          }
          return hh + ":" + mm;
        }

        var pickerConfig = {
          callback: function (val) {
            if (typeof (val) === 'undefined') {
              $log.debug('Time not selected');
            } else {
              var selectedTime = new Date(val * 1000);
              $scope.missed = false;
              $scope.placeholder = renderHourMinute(selectedTime);
              var selectedTimeLocale = new Date(val * 1000 + selectedTime.getTimezoneOffset() * 60 * 1000);
              $scope.value = selectedTimeLocale;
            }
          },
          inputTime: 50400,
          format: format,
          step: step,
          setLabel: set_label,
          closeLabel: close_label
        };
        ionicTimePicker.openTimePicker(pickerConfig);
      };
    }
  }
})
