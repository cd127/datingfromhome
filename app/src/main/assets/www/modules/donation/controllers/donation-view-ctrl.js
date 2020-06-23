App.controller("DonationViewController", function(
  $log,
  $cordovaGeolocation,
  $cordovaSocialSharing,
  $ionicModal,
  $rootScope,
  $scope,
  $state,
  $stateParams,
  $timeout,
  $translate,
  $window,
  Application,
  Customer,
  DonationOptionsFactory,
  Url
) {
  $scope.vm = {};
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

  // $scope.vm.isApple = true;
  // $scope.vm.isToOpenInBrowser = true;

  $scope.openInNav = function() {
    var url =
      "https://" +
      $scope.hostname +
      "/app/local/modules/Donation/webview/index.html#/index/value_id/" +
      $scope.value_id +
      "/amount_to_donate/" +
      $scope.data.amount_to_donate +
      "/url_prefix/" +
      $scope.url_prefix +
      "/page_title/" +
      encodeURIComponent($scope.page_title) +
      "/message/" +
      encodeURIComponent($scope.data.message);

    $log.log("Open in browser: " + url);
    $window.open(url, "_system", "location=yes");
  };

  $scope.openPaypalNav = function() {
    var url =
      "http://" +
      $scope.hostname +
      "/app/local/modules/Donation/paypal/index.html#/index/value_id/" +
      $scope.value_id +
      "/amount_to_donate/" +
      $scope.data.amount_to_donate +
      "/url_prefix/" +
      $scope.url_prefix +
      "/page_title/" +
      $scope.page_title;
    $log.log("Open in browser: " + url);
    $window.open(url, "_system", "location=yes");
  };

  $scope.is_loading = true;
  $scope.social_sharing_active = false;
  $scope.is_loading = true;
  $scope.value_id = DonationOptionsFactory.value_id = $stateParams.value_id;
  $scope.modal = null;
  $scope.manage_modal = null;
  $scope.is_admin = false;
  $scope.collection = new Array();
  $scope.is_custom_amount = false;
  $scope.is_paypal = false;
  $scope.data = {
    amount_to_donate: null,
    message: ""
  };

  $scope.$on("connectionStateChange", function(event, args) {
    if (args.isOnline === true) {
      $scope.loadContent();
    }
  });

  $scope.goDonate = function(valid_form) {
    if (valid_form) {
      if ($scope.amount_to_donate !== null && $scope.amount_to_donate !== "") {
        $state.go("donation-donate", {
          value_id: $scope.value_id,
          page_title: $scope.page_title,
          amount_to_donate: $scope.data.amount_to_donate,
          stripe_pub_key: $scope.stripe_pub_key,
          currency: $scope.currency,
          msg_congrats: $scope.msg_congrats,
          twocheckout_sid: $scope.twocheckout_sid,
          gateway: $scope.gateway_number,
          message: $scope.data.message
        });
      }
    }
  };

  $scope.isCustomAmount = function() {
    if ($scope.amount_custom === "1") return true;
    else return false;
  };

  $scope.increaseAmount = function() {
    $scope.data.amount_to_donate =
      parseInt($scope.data.amount_to_donate) + parseInt($scope.step_height);
  };

  $scope.decreaseAmount = function() {
    if (!$scope.isMinAmountRequired()) {
      if (parseInt($scope.data.amount_to_donate) > parseInt($scope.step_height))
        $scope.data.amount_to_donate =
          parseInt($scope.data.amount_to_donate) - parseInt($scope.step_height);
    } else {
      // do not go under minimum amout (step_one)
      if (
        parseInt($scope.data.amount_to_donate) >=
        parseInt($scope.step_one) + parseInt($scope.step_height)
      )
        $scope.data.amount_to_donate =
          parseInt($scope.data.amount_to_donate) - parseInt($scope.step_height);
    }
  };

  $scope.isMinAmountRequired = function() {
    if ($scope.amount_min === "1") {
      return true;
    }
    else {
      return false;
    }
  };

  $scope.loadContent = function() {
    $log.info("loading");
    $scope.is_loading = true;

    DonationOptionsFactory.find()
      .success(function(data) {
        // $log.info('received data: ' +  JSON.stringify(data))
        $scope.stripe_pub_key = data.collection.pub_key;
        $scope.amount_min = data.collection.amount_min;
        $scope.amount_custom = data.collection.amount_custom;
        $scope.step_one = data.collection.step_one;
        $scope.step_height = data.collection.step_height;
        $scope.msg_welcome = data.collection.msg_welcome;
        $scope.msg_congrats = data.collection.msg_congrats;
        $scope.page_title = data.page_title;
        $scope.collection = data.collection;
        $scope.hostname = data.collection.hostname;
        $scope.currency = data.collection.currency;
        $scope.open_browser = data.collection.open_browser;
        $scope.message_enable = parseInt(data.collection.message_enable) === 1;
        $scope.twocheckout_sid = "";
        // $scope.use_stripe = data.collection.gateway_number
        $scope.gateway_number = parseInt(data.collection.gateway_number);
        $scope.gateway = {
          stripe: true,
          twocheckout: false
        };

        if ($scope.gateway_number === 1) {
          $scope.gateway.stripe = true;
          $scope.gateway.twocheckout = false;
        } else if ($scope.gateway_number === 2) {
          $scope.gateway.stripe = false;
          $scope.gateway.twocheckout = true;
          $scope.twocheckout_sid = data.collection.twocheckout_sid;
        } else {
          $scope.gateway.stripe = false;
          $scope.gateway.twocheckout = false;
          $scope.gateway.paypal = true;
          $scope.is_paypal = true;
        }

        if (parseInt($scope.open_browser) === 1)
          $scope.vm.isToOpenInBrowser = true;
        else $scope.vm.isToOpenInBrowser = false;

        if (parseInt($scope.amount_custom) === 1)
          $scope.is_custom_amount = true;
        else $scope.is_custom_amount = false;

        if ($scope.amount_custom === "1") {
          $scope.data.amount_to_donate = 10;
        } else {
          if ($scope.amount_min === "1")
            $scope.data.amount_to_donate = $scope.step_one;
          else $scope.data.amount_to_donate = $scope.step_height;
        }
      })
      .finally(function() {
        if ($scope.gateway_number === 1) {
          if (typeof Stripe === "undefined") {
            $log.log("loading stripe");
            $scope.is_loading = true;

            var stripeJS = document.createElement("script");
            stripeJS.type = "text/javascript";
            stripeJS.src = "https://js.stripe.com/v2/";
            stripeJS.onload = function() {
              $timeout(function() {
                $scope.is_loading = false;
              });
            };
            document.body.appendChild(stripeJS);
          } else {
            $log.debug("no need to fetch stripe script");
            $scope.is_loading = false;
          }
        } else if ($scope.gateway_number === 2) {
          if (typeof TCO === "undefined") {
            $log.log("loading 2checkout");
            $scope.is_loading = true;

            var twocheckoutJS = document.createElement("script");
            twocheckoutJS.type = "text/javascript";
            twocheckoutJS.src =
              "https://www.2checkout.com/checkout/api/2co.min.js";
            twocheckoutJS.onload = function() {
              $timeout(function() {
                $scope.is_loading = false;
              });
            };
            document.body.appendChild(twocheckoutJS);
          } else {
            $log.debug("no need to fetch 2checkout script");
            $scope.is_loading = false;
          }
        }
        $scope.is_loading = false;
      });
  };

  $scope.loadContent();
});
