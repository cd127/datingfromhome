App.factory("ReviewServ", function($http, $log, Url) {
  var factory = {};
  factory.data = {
    url_ios: "",
    url_android: "",
    prompt: "",
    label: "",
    page_title: ""
  };
  factory.loaded = false;

  factory.find = function(value_id) {
    return new Promise(function(resolve, reject) {
      if (!value_id)
        reject(new Error("invalid value_id passed to factory: ", value_id));

      if (factory.loaded && !ionic.Platform.isWebView()) {
        resolve(factory.data);
      } else {
        var url = Url.get("review/mobile_view/find", { value_id: value_id });
        $http({
          method: "GET",
          url: url,
          cache: false,
          responseType: "json"
        })
          .success(function(data) {
            if (!data || data == null) {
              $log.error("invalid data recevied from :", url);
              reject(new Error("invalid data recevied from :", url));
            } else {
              factory.data.prompt = data.prompt;
              factory.data.label = data.link_label;
              factory.data.page_title = data.page_title;
              factory.data.url_ios = data.url_ios;
              factory.data.url_android = data.url_android;
              factory.loaded = true;
              resolve(factory.data);
            }
          })
          .error(function(err) {
            reject(err);
          });
      }
    });
  };

  return factory;
});
