'use strict';
app.factory('UndoRedo',function ($http,$timeout,$window,RESOURCES,$location) {
var service = {};
var image;
var content;
service.InfoData=function($scope){
	$scope.pos = 0;
	var img = new Array();
	var i=0;
	var rugimages = angular.element(document.querySelectorAll('.rugImg'));

	[].forEach.call(rugimages, function(div) {
	 img.push($(div).attr('src')+'~'+$(div).attr('data-img')+'~'+$('#textpng').val());	
	 i++;
	});



	var imgArr = img.join('|');

	$scope.store1.push(imgArr);
	img = null;

	var clrName = new Array();
	var content='';
	$( ".sidesection" ).each(function() { // for color-name,pile-name,texture-name
	content = $(this).children();
	clrName.push($scope.rgb2hex($(content[0]).css('background-color'))+'~'+$(content[1]).html()+'~'+$(content[2]).html()+'~'+$(content[3]).html() );
	});
	var clrNameArr = clrName.join('|');
	$scope.store2.push(clrNameArr);


};



//Funtion Undo
// | for Loop (rug)
// ~for inner element

service.undo=function($scope){
 	$scope.pos--;
	//showImageLoader();
	

	var data = $scope.store2[$scope.pos].split('|'); 
	var i=0;

	$( ".sidesection" ).each(function() { // for color-name,pile-name,texture-name
	var clr = data[i].split('~');
	content = $(this).children();
	$(content[0]).css('background-color','#'+clr[0]);//set the  previous background-color
	$(content[1]).text(clr[1]);//set color name
	$(content[2]).text(clr[2]);//set texture name
	$(content[3]).text(clr[3]);//set pile 
	
	i++;
	});


	var data = $scope.store1[$scope.pos].split('|');    //o =>src, 1=> data src
    var count = $(".rugImg").length
	var i=0;
	$( ".rugImg" ).each(function() {

	var img = data[i].split('~');	
	
	$(this).attr('src',img[0]);	//src
	$(this).attr('ng-src',img[0]);	//src
	$(this).attr('data-img',img[1]);	//data-src
	 image=img[2];


	i++;
	//hideImageLoaderMultiUnRedo(count,i,img[0]);
	});
   
    service.setReset(image);
	$("#redo").parent().removeClass('rug-redo').addClass('redo-active');
	$("#revert").parent().addClass('rug-skew-active');

   
    
	
	$scope.zoomout();
	service.CheckShape();
	service.setUndoRedoButton($scope);
};

//Function Redo
service.redo=function($scope){
 	$scope.pos++;
	//showImageLoader();
	
	
	var data = $scope.store2[$scope.pos].split('|'); 
	var i=0;

	$( ".sidesection" ).each(function() { // for color-name,pile-name,texture-name
	var clr = data[i].split('~');
	content = $(this).children();
	$(content[0]).css('background-color','#'+clr[0]);//set the  previous background-color
	$(content[1]).text(clr[1]);//set color name
	$(content[2]).text(clr[2]);//set texture name
	$(content[3]).text(clr[3]);//set pile 
	
	i++;
	});

   var count = $(".rugImg").length
   var data = $scope.store1[$scope.pos].split('|');  //o =>src, 1=> data src
	
	var i=0;

	$( ".rugImg" ).each(function() {
	var img = data[i].split('~');	
    
	$(this).attr('src',img[0]);
	$(this).attr('ng-src',img[0]);	//src
	$(this).attr('data-img',img[1]);	
    
	image=img[2];


	i++;
	//hideImageLoaderMultiUnRedo(count,i,img[0]);
	});	
	//console.log($image);
	
	service.setReset(image);

	$("#undo").parent().removeClass('rug-undo').addClass('undo-active');
	$("#revert").parent().addClass('rug-skew-active');
	

	$scope.zoomout();
	service.CheckShape();
    service.setUndoRedoButton($scope);
 
};


service.revert=function($scope){
    $scope.change=false;
	var i=$scope.pos;
	while(i>0){
			 $scope.store1.pop();
			 $scope.store2.pop();
			 i--;
		 }
			
		
		
	var data = $scope.store1[0].split('|');  //o =>src, 1=> data src
	
	var i=0;
	$( ".rugImg" ).each(function() {
    var img = data[i].split('~');	
  
    
	$(this).attr('src',img[0]);
	$(this).attr('data-img',img[1]);	
	
	 image=img[2];
	i++;
	});	

    service.setReset(image);

	var data = $scope.store2[0].split('|'); 
	var i=0;

	$( ".sidesection" ).each(function() { // for color-name,pile-name,texture-name
	var clr = data[i].split('~');
	content = $(this).children();
	$(content[0]).css('background-color','#'+clr[0]);//set the  previous background-color
	$(content[1]).text(clr[1]);//set color name
	$(content[2]).text(clr[2]);//set texture name
	$(content[3]).text(clr[3]);//set pile 
	
	i++;
	});
	$scope.pos=0;
	$("#revert").parent().removeClass('rug-skew-active').addClass('nonclickable');
	$("#redo").parent().removeClass('redo-active').addClass('rug-redo');
	$("#undo").parent().removeClass('undo-active');	
	
	$("#svg_text").val('');
    service.CheckShape();
	$scope.zoomout();
	service.setUndoRedoButton($scope);
};

//Store data onchange
service.setUndoRedo=function($scope){
  //imgame
	var img  = new Array();
	var i = 0;
	$( ".rugImg" ).each(function() {
	img.push($(this).attr('src')+'~'+$(this).attr('data-img')+'~'+$('#textpng').val());	
    i++;	
	});
     //img.push('~'+$('#textpng').val());

	var imgArr = img.join('|');
	$scope.store1.push(imgArr);
	

	
    //color name
	var clrName = new Array();
	var content;
	$( ".sidesection" ).each(function() { // for color-name,pile-name,texture-name
	content = $(this).children();
	clrName.push($scope.rgb2hex($(content[0]).css('background-color'))+'~'+$(content[1]).html()+'~'+$(content[2]).html()+'~'+$(content[3]).html() );
	});
	var clrNameArr = clrName.join('|');
	$scope.store2.push(clrNameArr);

	$scope.pos++;
	$("#revert").parent().removeClass('rug-skew').addClass('rug-skew-active');
	angular.element(document.getElementById('revert')).bind("click");

	service.CheckShape(); 
	service.setUndoRedoButton($scope);

};

service.setReset=function(img){
	
	if(img=='' || !img || img==null){
	  $('.textpngImage').remove();
	  $('#textpng').val('');
	}else{
	  $('.textpngImage').remove();
	  $('#textpng').val(img);
	  $('div#image_container').append('<img id="'+$('#textImagepng').val()+'" class="dynamicimg textpngImage" alt="" style="z-index: 2; visibility: visible;" src="'+$('#tmp_path').val()+'/app/webroot/img/tmpimg/'+$('#UserId').val()+'/'+img+'">');
	}
};

// for checking rug shape and undoredo shape
service.CheckShape=function(){
    var data = angular.element($("#dynamicsectId img:nth-child(3)") ).attr("data-img");
    
 	var arr = data.split('_');
 	var val='border_'+arr[1]+'.png';
    $('#OrdersDetailShapeName1').val(arr[1]);
    $('#current_shape').val(arr[1]);
    var src='https://s3.amazonaws.com/images.rugstudioonline.com/borderimg/'+val;
 	$("#dynamicsectId img:nth-child(2)").attr("data-img",val);
 	$("#dynamicsectId img:nth-child(2)").attr("data-srcold",val);
 	$("#dynamicsectId img:nth-child(2)").attr("src",src);
};

//undo redo button enable and disable
service.setUndoRedoButton=function($scope){
	
	$('#undo').parent().addClass('nonclickable');
	$('#revert').parent().addClass('nonclickable');
	$('#redo').parent().addClass('nonclickable');
	
	//for undo events
	if($scope.pos>0) {
		$scope.change=true;
		$("#undo").parent().removeClass('rug-undo').removeClass('nonclickable').addClass('undo-active');
		
		//angular.element(document.getElementById('undo')).attr('disabled',false);
	} else {
	$("#undo").parent('li').removeClass('undo-active').addClass('nonclickable').addClass('rug-undo');	
	//$("#undo").unbind('click');

	//angular.element(document.getElementById('undo')).attr('disabled',true);
	//angular.element(document.getElementById('undo')).unbind('click');
	}
	
	// for redo events
	if($scope.store1.length !=($scope.pos+1)){
			
		//$("#redo").parent().addClass('redo-active');
		//angular.element(document.getElementById('redo')).attr('disabled',false);
		$("#redo").parent().removeClass('nonclickable');
		
	}else{
		
		$("#redo").parent().removeClass('redo-active').addClass('rug-redo');
        $("#redo").parent().addClass('nonclickable');
		//angular.element(document.getElementById('redo')).attr('disabled',true);
		//$("#redo").unbind('click');
		
	}



  // for revert
    if($scope.pos == 0){
		   
		$scope.change=false;
		$("#revert").parent().removeClass('rug-skew-active').addClass('rug-skew').addClass('nonclickable');
		//$("#revert").unbind('click');
		//angular.element(document.getElementById('revert')).attr('disabled',true);
	
    }else{
    	$("#revert").parent().removeClass('nonclickable');
		//angular.element(document.getElementById('revert')).attr('disabled',false);
	}

};

return service;
});