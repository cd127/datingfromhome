App.directive('preciseImageInput', function () {
  return {
    restrict: 'E',
    scope: {
      id: '@',
      value: '=',
      description: '@',
      placeholder: '@',
      missed: '='
    },
    templateUrl: 'modules/preciseform/directives/precise/image-input/image-input.html',
    transclude: true,
    controller: function ($scope, $log, Picture)
    {
      $scope.missed = false;

      $scope.takePicture = function () {
        Picture.takePicture()
        .then(function(success) {
            $scope.value = success.image;
            $log.debug(success);
        });
      };
    }
  }
})
