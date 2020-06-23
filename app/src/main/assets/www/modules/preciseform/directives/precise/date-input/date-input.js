App.directive('preciseDateInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      description: '@',
      setlabel: '@',
      closelabel: '@',
      todaylabel: '@',
      placeholder: '@',
      showtoday: '@',
      dayslist: '=',
      monthslist: '=',
      required: '@',
      missed: '=',
      mondayfirst: '@',
    },
    templateUrl: 'modules/preciseform/directives/precise/date-input/date-input.html',
    transclude: true,
    controller: function ($scope, $log, ionicDatePicker)
    {
      var format = 24;
      var set_label = 'Set';
      var step = 5;
      var close_label = 'Close';
      var today_label = 'Today';
      var placeholder = 'Select Hour';
      var days_list = ["S", "M", "T", "W", "T", "F", "S"];
      var months_list = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
      var show_today_btn = false;
      var monday_first = false;
      if ($scope.showtoday) {
        if ($scope.showtoday == 'true' || $scope.showtoday == 'TRUE' || $scope.showtoday == '1') {
          show_today_btn = true;
        }
      }
      if ($scope.mondayfirst) {
        if ($scope.mondayfirst == 'true' || $scope.mondayfirst == 'TRUE' || $scope.mondayfirst == '1') {
          monday_first = true;
        }
      }
      if ($scope.setlabel) {
        set_label = $scope.setlabel;
      }
      if ($scope.todaylabel) {
        today_label = $scope.todaylabel;
      }
      if ($scope.closelabel) {
        close_label = $scope.closelabel;
      }
      if ($scope.dayslist) {
        days_list = $scope.dayslist;
      }
      if ($scope.monthslist) {
        months_list = $scope.monthslist;
      }
      if ($scope.placeholder) {
        placeholder = $scope.placeholder;
      }
      $scope.change = function (value) {
        $scope.value = value
        $scope.missed = false;
      }
      $scope.error = false;

      $scope.openDatePicker = function (val) {
        var pickerConfig = {
          callback: function (val) {  //Mandatory
            selected_date = new Date(val);
            $scope.placeholder = selected_date.toLocaleDateString();
            $scope.value = selected_date;
            $scope.missed = false;
          },
          disabledDates: [],
          setLabel: set_label,
          closeLabel: close_label,
          inputDate: new Date(),
          mondayFirst: monday_first,
          weeksList: days_list,
          monthsList: months_list,
          disableWeekdays: [],
          closeOnSelect: false,
          templateType: 'popup'
        };
        if (show_today_btn) {
          pickerConfig.showTodayButton = show_today_btn
          pickerConfig.todayLabel = today_label
        }
        ionicDatePicker.openDatePicker(pickerConfig);
      };
    }
  }
})
