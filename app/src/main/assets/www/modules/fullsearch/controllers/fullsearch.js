
App.factory('$fullsearchservice', ['$http','$q','$rootScope','Url', function($http,$q,$rootScope,Url) {
    return {
        search: function(search) {
            var deferred = $q.defer(); //create promise to handle async data
      $http.defaults.withCredentials = false;
      var data = { search_for : search};
            $http({
              method: 'POST',
              url: Url.get("fullsearch/mobile_view/findall"),
              data: data,
              responseType:'json'
            })
            .success(function(data) {
                console.log(data);
                deferred.resolve(data); // resolve promise with data
            })
            .error(function(msg, code) {
                deferred.reject(msg); // reject promise with message
            });

            return deferred.promise; // return promise to requesting controller to wait for asyn response from this service
        }
    }
}]);

App.run(function($rootScope,$fullsearchservice,$http,AUTH_EVENTS,Url,HomepageLayout,$state,$location,Application,$ionicHistory,$ionicSideMenuDelegate) {

  $rootScope.FULLSEARCH_RESULTS = false;
  $rootScope.FULLSEARCH_ENABLE = true;
  $rootScope.FULLSEARCH_APPENDED = false;
  $rootScope.FULLSEARCH_ENABLE = false;
  $rootScope.FULLSEARCH_TOGGLE = false;
  $rootScope.fullsearchTimeout = null;
  $rootScope.fullsearch_noresult = "";
  $rootScope.value_id = '';
  $rootScope.SETTING_VALUE_IDS = [];
  
  
  
   $rootScope.viewPage = function(url){

    var location = window.location.href;
    location = location.split("#");
    location = location[0]+"#"+BASE_PATH+"/"+url;
    window.location.href  = location;
  }
  
  $rootScope.addFullsearch = function(){



    if(!$rootScope.FULLSEARCH_APPENDED){
      var searchbar = '<div  ng-show="FULLSEARCH_TOGGLE" class="bar bar-header hidden fullsearch-bar item-input-inset" style="position:absolute" ng-style="{border:fullsearch_border}" ng-show="$root.FULLSEARCH_ENABLE" ><label class="item-input-wrapper"><i ng-hide="is_loading" class="icon ion-ios-search placeholder-icon"></i><ion-spinner ng-show="is_loading" icon="ios-small"></ion-spinner><input ng-model="search_query" type="search" placeholder="{{fullsearch_placeholder}}" ng-keyup="fullsearch(this)" ></label><span style="color:red">{{fullsearch_noresult}}</span> <i ng-hide="is_loading" class="icon ion-ios-close placeholder-icon" ng-click="hideFullsearchResult(this)"></i> </div>';
      searchbar += '<ion-list style="overflow-y: auto;" class="fullsearch-results" ng-hide="!FULLSEARCH_RESULTS"><a class="item item-thumbnail-left" ng-repeat="item in FULLSEARCH_RESULTS" href="javascript:void(0)" ng-click="viewPage(item.url)"><img ng-src="'+IMAGE_URL+'{{item.icon_url}}" style="background:#ccc;padding:2px 2px;"><h2>{{item.title}}</h2><p>{{item.contents}}</p></a></ion-list>';
      searchbar += "<style>.fullsearch-results .list{ margin-top: 45px;overflow-y: auto;height: 400px; }</style>";
      
      var body = angular.element(document).find('body');
      //var body = $("body");
      body.append(searchbar);
      $rootScope.FULLSEARCH_APPENDED = true;
    }
  }


  $rootScope.addFullsearch(); 

  HomepageLayout.getFeatures().then(function (features) {
           
            for(var i = 0; i <  features.data.pages.length; i++){

                if(features.data.pages[i].code=="fullsearch"){
                    $rootScope.FULLSEARCH_ENABLE = true;
                    $rootScope.FULLSEARCH_TOGGLE = true;
                    var settings = features.data.pages[i].settings;
                    var myEl = angular.element( document.querySelector( 'div.fullsearch-bar') );
                    console.log('ids'+settings.feature_value_ids);
                    if( settings.feature_value_ids != null){
                        $rootScope.SETTING_VALUE_IDS = settings.feature_value_ids;
                    }
                    
                    if(settings.enable_bottom_search_bar){
                      myEl.removeClass('bar-header');
                      myEl.addClass('bar-footer'); 
                    }
                    $rootScope.fullsearch_placeholder= settings.search_bar_placeholder;
                    $rootScope.fullsearch_border= "1px solid "+settings.search_bar_border_color;


                  }

            }
    });
  
  $rootScope.fullsearch = function(){
    $rootScope.FULLSEARCH_RESULTS = true;
    if($rootScope.fullsearchTimeout) clearTimeout($rootScope.fullsearchTimeout);


    if($rootScope.search_query.length>2 || $rootScope.search_query=="cc"){


    
  

    $rootScope.fullsearchTimeout =  setTimeout(function(){
        $rootScope.is_loading = true;
        $rootScope.fullsearch_noresult ='';


        $fullsearchservice.search($rootScope.search_query).then(function(res){ 
              $rootScope.FULLSEARCH_RESULTS = res; 
              $rootScope.is_loading = false;
              if(res.message){
                  $rootScope.fullsearch_noresult = res.message;
                  $rootScope.FULLSEARCH_RESULTS = false;

                }
              
           
          });

  },250);

  }
      
  }

  $rootScope.hideFullsearchResult = function(){
    $rootScope.is_loading = false;
    $rootScope.FULLSEARCH_RESULTS = false;
    $rootScope.search_query ="";
    $rootScope.fullsearch_noresult="";
    //alert("search:"+$rootScope.search_query);
   
      
  }

  
  
  
  
  //$rootScope.$watch(function () {
  //    return $ionicSideMenuDelegate.getOpenRatio();
  //  },
  //  function (ratio) {
  //    if (ratio === 1){
  //      $rootScope.FULLSEARCH_ENABLE = true;
  //    } else if($ionicHistory.currentStateName()!="home"){
  //    $rootScope.FULLSEARCH_ENABLE = false;
  //    }
  //    //$rootScope.toggleFullSearch();
  //});
  
   $rootScope.$on('$stateChangeSuccess', function(event, toState,toParams, fromState, fromParams){
    $rootScope.search_query = "";
    $rootScope.FULLSEARCH_RESULTS = false;
    $rootScope.value_id = toParams.value_id;
    //console.log('is feature selected to show search='+$rootScope.SETTING_VALUE_IDS);
    if($rootScope.FULLSEARCH_ENABLE){
	    if(toState.name!="home" && ($rootScope.SETTING_VALUE_IDS.length == 0 || $rootScope.SETTING_VALUE_IDS.indexOf($rootScope.value_id) == '-1') ){
	       $rootScope.FULLSEARCH_TOGGLE = false;
	    }else{
	       $rootScope.FULLSEARCH_TOGGLE = true;	
	    }
    }
    //$rootScope.toggleFullSearch();
   });
})




