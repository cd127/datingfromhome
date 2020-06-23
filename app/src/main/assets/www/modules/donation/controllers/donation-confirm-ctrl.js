App.controller("DonationConfirmController", function(
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
  Application,
  Customer,
  DonationOptionsFactory
) {
  $scope.value_id = DonationOptionsFactory.value_id = $stateParams.value_id;
  $scope.msg_congrats = $stateParams.msg_congrats;
  $scope.page_title = $stateParams.page_title;
  $scope.amount_to_donate = $stateParams.amount_to_donate;
  $scope.currency = $stateParams.currency;

  // redirect to the first page
  $timeout(function() {
    $state.go("donation-view", { value_id: $scope.value_id });
  }, 5000);
});
