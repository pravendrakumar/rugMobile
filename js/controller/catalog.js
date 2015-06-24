app.controller('CatalogCtrl', 
	 function ($scope, $rootScope, $location,$cookieStore, UserLog,AuthenticationService,CatalogService, RESOURCES) {



$scope.logout = function () {
//$scope.dataLoading = true;

AuthenticationService.logout($location);

};

//for redirect
$scope.redirectCatalog = function () {
AuthenticationService.SendCatalog($location);
};

// for rediect	
$scope.changePage=function(catId,designId){
 $location.path('/edit/'+catId+'/'+designId);
}

$scope.loader=true;
$scope.loadData=false;
$scope.dropdown=true;
// for getting catalogs and thumbs images
$scope.init = function () {
CatalogService.GetCatalogs($rootScope.globals.currentUser.userId,$scope);
};
$scope.init();

/* 
*function for show catalog list
*
*/  

$scope.showDropDown= function(){
$scope.dropdown=!$scope.dropdown;
};

 /* 
 *function for add active class 
 *item is a value that contain catlog id and name 
 */       
$scope.rowClass = function(item){

	if(item.id == $scope.defaultCatId){
	return 'active';
	}
	return '';
};





});