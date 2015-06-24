'use strict';


app.factory('CatalogService',function (Catalog,Design,RESOURCES) {
	var service = {};

	service.GetCatalogs = function (userId, $scope) {
		 Catalog.find(userId).then(function (document) {
		 	$scope.loader=false;
			var Obj=JSON.stringify(document); 
			var catalogObj= JSON.parse(Obj);
			$scope.description=catalogObj.catalogDescription;
		    $scope.catalogNames=catalogObj.catalogName;
		    $scope.defaultCatId=catalogObj.defaultCatId;
		    $scope.catalogs=catalogObj.catalog;
		    $scope.cloud_path=RESOURCES.CLOUD_PATH;
		    $scope.loadData=true;
			//console.log(Scope);
			//callback(catalogObj);
			});

	};
  
    service.GetDesigns = function (catalogId, $scope) {
        Design.find(catalogId).then(function (document) {
        	$scope.loader=false;
			var Obj=JSON.stringify(document); 
			var catalogObj= JSON.parse(Obj);
			$scope.description=catalogObj.catalogDescription;
			$scope.catalogs=catalogObj.catalog;
			$scope.cloud_path=RESOURCES.CLOUD_PATH;
			$scope.loadData=true;

			});

	};
      

    return service;

});

app.directive('navBar', function(CatalogService) {
    var directive = {};

    directive.restrict = 'A'; /* restrict this directive to elements */

   // directive.template = '<button ng-click="click()">Click me</button>';
   directive.template = '<li ng-class="{active:$first || catalog.name===selected}"  ng-repeat="catalog in catalogNames" ng-click="getDesign(catalog.id,catalog.name);$event.preventDefault(); $event.stopPropagation();"><a data-id="{{catalog.id}}" class="catalog" href="javascript:;"  >{{catalog.name}}</a></li>';
    directive.controller = function($scope, $element){
         $scope.getDesign = function(catalogId,item){
					$scope.loader=true;
					$scope.loadData=false;
					$scope.dropdown='display:none;';
                    console.log('call'+$scope.dropdown);
                    angular.element( document.querySelector( '#dropdown-catalog' ) ).removeClass('open');
                    angular.element( document.querySelector( '.catalog-list li' ) ).removeClass('active');

					$scope.selected=item;
					CatalogService.GetDesigns(catalogId,$scope);
         }
       }
    return directive;
});