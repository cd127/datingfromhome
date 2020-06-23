App.controller("DonationDonateController", function(
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
  $http,
  Url,
  Application,
  Customer,
  DonationOptionsFactory
) {
  $log.log("DonationDonateController fired");
  $log.log("stateparam :" + JSON.stringify($stateParams));
  $scope.value_id = DonationOptionsFactory.value_id = $stateParams.value_id;
  $scope.stripe_pub_key = $stateParams.stripe_pub_key;
  $scope.page_title = $stateParams.page_title;
  $scope.amount_to_donate = $stateParams.amount_to_donate;
  $scope.currency = $stateParams.currency;
  $scope.msg_congrats = $stateParams.msg_congrats;
  $scope.gateway_number = $stateParams.gateway;
  $scope.twocheckout_sid = $stateParams.twocheckout_sid;
  $scope.message = $stateParams.message;
  $scope.customer_email = "";
  $scope.customer_id = 0;
  $scope.is_loading = false;

  Customer.find()
  .then(function(customer) {
    $scope.customer_email = customer.email;
    $scope.customer_id = customer.id;
  })
  .catch(function (err) {
    console.log('no costumer found');
  })

  $scope.cardNumber = "";
  $scope.cardExpiry = "";
  $scope.cardCvc = "";
  $scope.validForm = true;
  $scope.errorMessageForm = "";
  $scope.card = {
    number: null,
    cvc: null,
    exp_year: null,
    exp_month: null,
    name: null
  };

  $scope.isFormInvalid = function() {
    return !$scope.validForm;
  };

  if (parseInt($scope.gateway_number) === 1) {
    Stripe.setPublishableKey($scope.stripe_pub_key);
  } else {
    //TCO.loadPubKey("sandbox", function() {});​
    //TCO.loadPubKey('sandbox');
    TCO.loadPubKey("production");
  }

  $scope.stripeCallback = function(valid_form) {
    if (valid_form) {
      $log.debug("gateway number: " + $scope.gateway_number);
      $scope.validForm = true;
      $scope.is_loading = true;

      if (parseInt($scope.gateway_number) === 1) {
        $log.debug("going with stripe");
        Stripe.createToken(
          {
            number: $scope.card.number,
            name: $scope.card.name,
            exp_month: $scope.card.exp_month,
            exp_year: $scope.card.exp_year,
            cvc: $scope.card.cvc
          },
          function(status, response) {
            if (status === 200) {
              // check if result ok:
              if (response.id !== undefined && response.object === "token") {
                $http({
                  method: "POST",
                  url: Url.get("donation/mobile_view/chargestripe", {
                    value_id: $scope.value_id,
                    amount: $scope.amount_to_donate,
                    currency: $scope.currency,
                    token: response.id,
                    message: $scope.message,
                    customer_email: $scope.customer_email,
                    customer_id: $scope.customer_id
                  }),
                  data: {},
                  cache: false,
                  responseType: "json"
                })
                  .success(function(data) {
                    $scope.is_loading = false;
                    if (data.error === 0 || data.error === "0") {
                      $state.go("donation-confirm", {
                        value_id: $scope.value_id,
                        page_title: $scope.page_title,
                        msg_congrats: $scope.msg_congrats,
                        amount_to_donate: $scope.amount_to_donate,
                        currency: $scope.currency
                      });
                    } else {
                      $log.debug(
                        "error while charging - data recevied :" +
                          JSON.stringify(data)
                      );
                      $scope.validForm = false;
                      $scope.is_loading = false;
                      $scope.errorMessageForm = $translate.instant(
                        data.message
                      );
                    }
                  })
                  .catch(function(err) {
                    $scope.is_loading = false;
                    $log.debug(
                      "error while trying to contact server in order to charge: " +
                        JSON.stringify(err)
                    );
                    $scope.validForm = false;
                    $scope.errorMessageForm = $translate.instant(
                      err.data.message
                    );
                  });
              } else {
                $log.debug(JSON.stringify(response));
                $scope.is_loading = false;
                $scope.validForm = false;
                $scope.errorMessageForm = $translate.instant(
                  response.error.message
                );
              }
            } else {
              $log.debug("error status: " + status);
              $log.debug(JSON.stringify(response));
              $scope.is_loading = false;
              $scope.validForm = false;
              $scope.errorMessageForm = $translate.instant(
                response.error.message
              );
            }
          }
        );
      } else if (parseInt($scope.gateway_number) === 2) {
        // 2checkout
        $log.debug("going with 2checkout");
        var args = {
          sellerId: $scope.twocheckout_sid,
          publishableKey: $scope.stripe_pub_key,
          ccNo: $scope.card.number,
          cvv: $scope.card.cvc,
          expMonth: $scope.card.exp_month,
          expYear: $scope.card.exp_year
        };
        // Make the token request
        TCO.requestToken(
          function(success) {
            //$scope.is_loading = false;
            $http({
              method: "POST",
              url: Url.get("donation/mobile_view/charge2checkout", {
                value_id: $scope.value_id,
                amount: $scope.amount_to_donate,
                currency: $scope.currency,
                token: success.response.token.token,
                name: $scope.card.name,
                message: $scope.message,
                customer_email: $scope.customer_email,
                customer_id: $scope.customer_id
              }),
              data: {},
              cache: false,
              responseType: "json"
            })
              .success(function(data) {
                $scope.is_loading = false;
                if (data.error === 0 || data.error === "0") {
                  $state.go("donation-confirm", {
                    value_id: $scope.value_id,
                    page_title: $scope.page_title,
                    msg_congrats: $scope.msg_congrats,
                    amount_to_donate: $scope.amount_to_donate,
                    currency: $scope.currency,
                    name: $scope.card.name
                  });
                } else {
                  $log.debug(
                    "error while charging - data recevied :" +
                      JSON.stringify(data)
                  );
                  $scope.validForm = false;
                  $scope.is_loading = false;
                  $scope.errorMessageForm = $translate.instant(data.message);
                }
              })
              .catch(function(err) {
                $scope.is_loading = false;
                $log.debug(
                  "error while trying to contact server in order to charge: " +
                    JSON.stringify(err)
                );
                $scope.validForm = false;
                $scope.errorMessageForm = $translate.instant(err.data.message);
              });
          },
          function(err) {
            $scope.is_loading = false;
            $scope.validForm = false;
            $log.debug(err.errorMsg);
            $scope.errorMessageForm = $translate.instant(
              "Connection lost. Please retry again"
            );
          },
          args
        );
      }
    } else {
      $log.debug("invalid form");
      $scope.validForm = false;
      $scope.errorMessageForm = $translate.instant(
        "Incomplete form or incorrect data. Please check you correctly typed each field required."
      );
    }
  };
});
