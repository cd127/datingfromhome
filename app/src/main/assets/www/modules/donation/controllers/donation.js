App.requires.push('payment');

App.config(function ($stateProvider, HomepageLayoutProvider)
{
  $stateProvider.state('donation-view', {
    url: BASE_PATH + "/donation/mobile_view/index/value_id/:value_id",
    controller: 'DonationViewController',
    templateUrl: "modules/donation/templates/l1/view.html",
      cache: false
  })
  .state('donation-donate', {
    url: BASE_PATH + "/donation/mobile_donate/index/value_id/:value_id/stripe_pub_key/:stripe_pub_key/page_title/:page_title/amount_to_donate/:amount_to_donate/currency/:currency/msg_congrats/:msg_congrats/twocheckout_sid/:twocheckout_sid/gateway/:gateway/message/:message",
    controller: 'DonationDonateController',
    templateUrl: "modules/donation/templates/l1/donate.html"
  })
  .state('donation-confirm', {
    url: BASE_PATH + "/donation/mobile_confirm/index/value_id/:value_id/msg_congrats/:msg_congrats/page_title/:page_title/amount_to_donate/:amount_to_donate/currency/:currency",
    controller: 'DonationConfirmController',
    templateUrl: "modules/donation/templates/l1/confirm.html"
  });
})
