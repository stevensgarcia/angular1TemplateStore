angular.module('templateStore.templates', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
   $routeProvider
      .when('/templates', {
         templateUrl: 'templates/templates.html',
         controller: 'TemplatesCtrl'
      })
      .when('/templates/:id', {
         templateUrl: 'templates/template-details.html',
         controller: 'TemplateDetailsCtrl'
      });
}])

.controller('TemplatesCtrl', ['$scope', '$http', 'TemplateService',function($scope, $http, TemplateService) {

   TemplateService.getTemplates()
      .then(function(templates) {
         // render all templates in db
         $scope.templates = templates;
      });

}])

.controller('TemplateDetailsCtrl', ['$scope', '$http', '$routeParams', 'TemplateService', function($scope, $http, $routeParams, TemplateService) {

   TemplateService.getTemplate($routeParams.id)
      .then(function(template) {
         // render a single template
         $scope.template = template;
         // set main template image
         $scope.mainImage = template.images[0].name;
         // change main image by selecting a thumbnail
         $scope.changeMainImage = function(image) {
            $scope.mainImage = image.name;
         };
      });

}])

.factory('TemplateService', ['$http', '$routeParams', '$filter', function($http, $routeParams, $filter) {

   /**
    * Filter the requested template from route param
    * @param {Array} templates JSON array from db
    * @param {Number} routeParamId Template id property
    * @return {Array} Array with the filtered match from templates array
    */
   var filteredTemplate = function(templates, routeParamId) {
      return $filter('filter')(templates, function(template) {
         return (template.id == routeParamId);
      });
   };

  return {
     getTemplates: function() {
        return $http.get('json/templates.json')
           .then(function(response) {
              // set the response to use in ctrl inmediately
              return response.data;
           });
     },
     getTemplate: function(routeParamId) {
        return this.getTemplates()
           .then(function(templates) {
              return filteredTemplate(templates, routeParamId);
           })
           .then(function(template) {
              // set the response to use in ctrl inmediately
              return template[0];
           });
     }
  };
}]);
