//App.requires.push('payment');

App.config(function ($stateProvider, HomepageLayoutProvider)
{
  $stateProvider.state('preciseform-view', {
    url: BASE_PATH + "/preciseform/mobile_view/index/value_id/:value_id",
    controller: 'PreciseformViewController',
    templateUrl: "modules/preciseform/templates/l1/view.html",
      cache: false
  })
  .state('confirm-view', {
    url: BASE_PATH + "/preciseform/mobile_confirm/index/value_id/:value_id/message/:message/page_title/:page_title",
    controller: 'PreciseformConfirmController',
    templateUrl: "modules/preciseform/templates/l1/confirm.html",
      cache: false
  });
})
