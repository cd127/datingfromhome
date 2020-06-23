App.requires.push('ionic-timepicker');
App.requires.push('ionic-datepicker');

App.controller("PreciseformViewController", function(
  $log,
  $rootScope,
  $scope,
  $state,
  $stateParams,
  $timeout,
  $translate,
  $window,
  Application,
  PreciseformOptionsFactory,
  Url
) {
  // Raven.config('https://7b347f118ee749db8a056a900d478919@sentry.io/1232685')
  //   .addPlugin(Raven.Plugins.Angular)
  //   .install();

  $log.debug("Hello from PreciseformViewController")
  $scope.vm = {
    fields: [
    ],
    config: {
      mail_address: "",
      submit_button_text: "Submit",
      feature: "",
      require_message: "field required",
      invalid_email_message: "address mail invalid",
      header: "",
      footer: "",
      date_format: "YYYY-MM-DD",
      hour_format: "HH:mm",
      text: {"ok":"OK","cancel":"Cancel"},
      set_time: "Ok",
      close_time: "Close",
      days_list: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      today: "Auj.",
      months_list: ["Jan","Fev","Mar","Apr","May","June","Jully","Aug","Sept","Oct","Nov","Dec"],
      incomplete_form_title: "Form incomplete",
      incomplete_form_message: "Please fill up all missed field<br/>(Marked in red)",
      submitted_content: "<h3>Thank you</h3>\n"
    }
  };
  $scope.vm.isToOpenInBrowser = true;
  $scope.vm.isPad = ionic.Platform.isIPad();
  $scope.vm.isIOS = ionic.Platform.isIOS();
  $scope.vm.isApple = ionic.Platform.isIPad() || ionic.Platform.isIOS();
  var domain = Url.get("/");
  var domain_splitted = domain.split("/");
  $scope.url_prefix = domain_splitted[domain_splitted.length - 2];
  $log.log("url_prefix :" + $scope.url_prefix);
  $log.log("plateform: " + ionic.Platform.platform());
  $log.log(
    "isPad: " + ionic.Platform.isIPad() + " isIOS: " + ionic.Platform.isIOS()
  );
  $log.log("isWebview: " + ionic.Platform.isWebView());
  $scope.is_loading = true;
  $scope.value_id = PreciseformOptionsFactory.value_id = $stateParams.value_id;

  $scope.loadContent = function() {
    $log.info("loading");
    $scope.is_loading = true;

    PreciseformOptionsFactory.find()
      .success(function(data) {
        $scope.vm.config = data.config;
        $scope.vm.fields = data.model;
        $scope.vm.value_id = data.value_id;
        $scope.vm.page_title = data.page_title;
        $scope.vm.redirect_after = data.redirect_after;
        $scope.vm.redirect_url = data.redirect_url;
        // $log.log("PreciseformOptionsFactory", JSON.parse(data));
        // $log.log("PreciseformOptionsFactory.config", JSON.parse(data.form.config));
      })
      .finally(function() {
        $scope.is_loading = false;
      });
  };

  $scope.loadContent();
});
