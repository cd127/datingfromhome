App.directive("preciseForm", function() {
  return {
    restrict: "E",
    scope: {
      fields: "=",
      action: "=",
      config: "=",
      valueid: "=",
      redirectafter: "=",
      redirecturl: "=",
      pagetitle: "="
    },
    templateUrl: "modules/preciseform/directives/precise/form.html",
    transclude: true,
    controller: function(
      $scope,
      $log,
      ionicTimePicker,
      $ionicPopup,
      $state,
      $http,
      $location,
      $sce,
      Url
    ) {
      $log.debug("Hello from preciseForm directive");
      $log.debug("$location", $location);

      $scope.color = "";
      var data_type = [
        "color",
        "range",
        "toggle",
        "date",
        "time",
        "image",
        "text",
        "email",
        "longtext",
        "number",
        "selectlist",
        "multilist"
      ];
      var can_be_empty_type = [
        "color",
        "range",
        "toggle",
        "date",
        "time",
        "image",
        "text",
        "email",
        "longtext",
        "number",
        "selectlist",
        "multilist"
      ];

      function containIt(data, item) {
        for (var i = 0; i < data.length; i++) {
          if (data[i] == item) {
            return true;
          }
        }
        return false;
      }

      $scope.showAlertIncompleteForm = function() {
        var alertPopup = $ionicPopup.alert({
          title: $scope.config.incomplete_form_title,
          template: $scope.config.incomplete_form_message
        });
      };

      $scope.trustedHtml = function(plainText) {
        return $sce.trustAsHtml(plainText);
      };

      // TODO
      // REFACTORIZE parsing result should sending result should be separeded
      // add hook to type or id
      // don't send on invalid field
      // proper error modal
      $scope.submit = function() {

        var to_send = {}; // id => value

        // parse fields list and retrieve value
        for (var i = 0; i < $scope.fields.length; i++) {
          // check if is a data type
          if (
            $scope.fields[i].id &&
            containIt(data_type, $scope.fields[i].type)
          ) {
            // convert date to string
            if (
              $scope.fields[i].type == "time" ||
              $scope.fields[i].type == "date"
            ) {
              var value = $scope.fields[i].value.toString();
            } else if ($scope.fields[i].type == "multilist") {
              // $log.debug("checking multilist value:", $scope.fields[i].value)
              var new_multilist_value = [];

              var keys = Object.keys($scope.fields[i].value);
              for (var j = 0; j < keys.length; j++) {
                if ($scope.fields[i].value[keys[j]] == true) {
                  new_multilist_value.push(keys[j]);
                }
              }
              // for (var key in $scope.fields[i].value) {
              //   if ($scope.fields[i].value[key] == true) {
              //     new_multilist_value.push(key);
              //   }
              // }
              // $log.debug("multilist value", new_multilist_value)
              var value = new_multilist_value;
            } else {
              var value = $scope.fields[i].value;
            }
            // ensure data sent for required field
            if (
              containIt(can_be_empty_type, $scope.fields[i].type) &&
              $scope.fields[i].required
            ) {
              if ($scope.fields[i].type == "multilist") {
                var select_count = 0;
                var keys = Object.keys($scope.fields[i].value);
                for (var j = 0; j < keys.length; j++) {
                  if ($scope.fields[i].value[keys[j]] == true) {
                    select_count++;
                  }
                }
                // for (var key in $scope.fields[i].value) {
                //   if ($scope.fields[i].value[key] == true) {
                //     select_count++;
                //   }
                // }

                if (select_count == 0) {
                  $log.debug("field missing: ", $scope.fields[i].id);
                  $scope.fields[i].missed = true;
                } else {
                  $scope.fields[i].missed = false;
                }
              } else if (!value) {
                $log.debug("field missing: ", $scope.fields[i].id);
                $scope.fields[i].missed = true;
              } else {
                $scope.fields[i].missed = false;
              }
            }
            to_send[$scope.fields[i].id] = value;
          }
        }
        var required_error = false;
        for (var i = 0; i < $scope.fields.length; i++) {
          if ($scope.fields[i].missed) {
            required_error = true;
            break;
          }
        }

        if (required_error) {
          $scope.showAlertIncompleteForm();
        } else {
          $http
            .post(
              Url.get("preciseform/mobile_view/postform", {
                value_id: $scope.valueid
              }),
              to_send
            )
            .success(function(data) {
              $log.debug("success postform request", data);

              if ($scope.redirectafter) {
                $log.debug("redirecting");
                $log.debug("$scope.redirecturl :", $scope.redirecturl);
                $location.path(BASE_PATH + "/" + $scope.redirecturl);
              } else {
                $state.go("confirm-view", {
                  value_id: $scope.valueid,
                  message: $scope.config.submitted_content,
                  page_title: $scope.pagetitle
                });
              }
            })
            .catch(function(err) {
              $log.error("error postform request", err);
            });
        }
      };
    }
  };
});
