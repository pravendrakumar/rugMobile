app.controller('DesignCtrl', 
	 function ($timeout, $scope,$document,$window,angularLoad,$rootScope, $location,$cookieStore,$routeParams,UndoRedo,UserLog,DesignService,AuthenticationService,RESOURCES) {

	var catalogId = $routeParams.param1;
	var rugId = $routeParams.param2;

	$scope.changeProgress=false;
	$scope.Cartimg1=new Array();
	$scope.Cartimg2=new Array();
	$scope.imgSrcold = new Array();
	//for undo redo
	$scope.pos = 0;
	$scope.store1 = new Array();
	$scope.store2 = new Array();

	//for get shapes array

	$scope.changecart=false;
	$scope.orderval=true;
	$scope.order_form=true;
	$scope.order_detail=false;
	$scope.order_confirm=false;
	$scope.orderloading=false;
	$scope.change=false;
	$scope.zooming=false;
	$scope.multisetting=false;
	$scope.cart=false;
	$scope.unitArr=[0,1,2,3,4,5,6,7,8,9,10,11];

$scope.logout = function () {
//$scope.dataLoading = true;
    AuthenticationService.logout($location);
};	
  
$scope.zoomout = function () {
 if($('#zoomImage').parent().hasClass('zoomout')){
  	$(".featuredimagezoomerhidden").remove();
  	$('.zoomtracker').remove();
  	$('#zoomImage').parent().attr('class','zoom');
  	$('#zoomImage').tooltip( "option", "content", "Zoom In" );
  }
};

//for get multisetting value
$scope.MultiSet = function () {
	$scope.multisetting=!$scope.multisetting;
	if(!$scope.multisetting){
	$(".rug-setting").removeClass("setting_hover"); 
	 return false;
	}
	DesignService.getMultisetting(catalogId,$scope);
};

//disable enable select option for multisetting
$scope.MultiSelEnable=function(event){
	var i = $(event.target).val();
	var disable = ($(event.target).is(':checked')) ? false : true;

	$("#multiColor_"+i).attr('disabled',disable);
	$("#multiTexture_"+i).attr('disabled',disable);
	$("#multiPile_"+i).attr('disabled',disable);
};


//for show multisetting color pallate 
$scope.MultisetShowpal = function (event) {
	var i = $(event.target).data('index');
	if(!$('#multicheck_'+i).is(':checked')){
	 return false;
	}

	$('#milticolorpallate_'+i).show();

};

//for geting color pallate for multisetting
$scope.getMultiColor  = function(obj){
	DesignService.getMultiColorPallate(obj.mult_select_value,$scope);
};


//for close clr pallate multisetting
$scope.closeMultiClrTab  = function(event){
	var i = $(event.target).data('id');
	$('#milticolorpallate_'+i).hide();
};

$scope.ApplyMultiClr = function(event){
	var i=$(event.target).data('index');
	var clr=$('#multiColor_'+i).val();
	 $('#multiseting_selected_color_'+i).css('background-color','#'+clr);
	 $('#milticolorpallate_'+i).hide();
};

//for setcolor value multisetting
$scope.setMultiColorValue = function(event){
	var i=$(event.target).parent().data('id');
	$('#multiColor_'+i).val($(event.target).data('color'));
	$scope.multiselected_color=$(event.target).data('value');
	$('#color_apply_multiset_'+i).show();
};

//for setcolor value multisetting
$scope.ApplyMultisetting = function(){
    DesignService.ChangeMultisetting($scope);
};

$scope.CartPop = function () {
	$scope.AddCartImage();
	$scope.cart=true;
};

$scope.CartPopClose= function () {
    $scope.cart=!$scope.cart;
};	  
 // for add more remove order details div
 
$scope.AddMoreDiv=function(){
 var id=parseInt($("#add_more_id").val())+1;
	if(id<=4){
	$("#add_more_id").val(id);
	$("#addMore"+id).val(1);
	$("#add_more_"+id).removeClass('ng-hide');
	$("#add_more_"+id).fadeIn('slow');
	$(this).show();
	$('.close_addMore').show();
	}
	$scope.setAddmoreClass();
 };

$scope.CloseDiv=function(){
  var id=parseInt($("#add_more_id").val());
	if(id!=1)
	{
	$("#addMore"+id).val(0);
	$("#add_more_"+id).fadeOut('slow');
	var addMore=parseInt($("#add_more_id").val())-1;
	$("#add_more_id").val(addMore);
	}
	$scope.setAddmoreClass();
 };

 $scope.setAddmoreClass=function(){
	var addMore=parseInt($("#add_more_id").val());
	if(addMore==4)
	{	
	$("#add_more").addClass('disabled');
	} else {
	$("#add_more").removeClass('disabled');
	}
 };

//function for add unit for feet
$scope.checkUnit=function(element){
	var id=$(element).attr('id');
	
	if($(element).val()=='feet'){
	$("#width_inch_"+id).show();
	$("#length_inch_"+id).show();
	} else {
	$("#width_inch_"+id).hide();
	$("#length_inch_"+id).hide();
	}
};

//for redirect
$scope.redirectCatalog = function () {
    AuthenticationService.SendCatalog($location);
};


$rootScope.$on('$includeContentLoaded', function() {

	DesignService.updateDesign(catalogId,rugId,$scope);
	DesignService.getColors(catalogId,$scope);

	$('#undo').parent().addClass('nonclickable');
	$('#revert').parent().addClass('nonclickable');
	$('#redo').parent().addClass('nonclickable');

	$scope.shapeArr=DesignService.getShapeArr();
    DesignService.getCountry($scope);
    DesignService.getEditData($scope)

	angularLoad.loadScript('js/allinone.js').then(function() {
	// Script loaded succesfully.
	// We can now start using the functions from someplugin.js
	}).catch(function() {
	// There was some error loading the script. Meh
	});

});


 /* 
 *function for add active class 
 *item is a value that contain catlog id and name 
 */       
$scope.rowClass = function(item){

	if(item !='border_image'){
	return 'rugImg';
	}
	return '';
};

/* 
 *function for show and hide shapes
 *
 */   

    $scope.shapeStyle='none'; 
$scope.openShape = function(){
    $scope.shapeStyle='block';
};

/*
* function for show loading image  loader
*/

$scope.showImageLoader = function(){
    $scope.facebookLoader=true;
};


/* 
 *function for show and hide color name on mose hover on color pallate
 *
 */   

	$scope.selectedColor=''; 
	$scope.selectedColorId=null;
	$scope.newColor='';
	$scope.newColorValue=null;
	$scope.clrSelected=null;


$scope.setColorValue = function(event){

	$scope.new_background_color=$(event.target).data('color');
	$scope.new_colorName=$(event.target).data('value');


	//$(".selected_color_ipad").html("("+$(event.target).data('value')+")");	
	$(".apply_texture_ipad").hide();
	$(".apply_color_ipad").show();
	$scope.selectedColor='('+$(event.target).data('value')+')'; 
	$scope.newColor=$(event.target).data('color');
	$scope.clrSelected=$scope.itemActive;
	$('.dynamicimg').css('visibility','visible');

};


$scope.applyColor = function(){
	$scope.singlefbloader=true;
	$scope.changeProgress=true;
	
	$($scope.clrTabObj).css('background-color','#'+$scope.new_background_color);
	$($scope.clrTabObj).siblings('.clrname').html($scope.new_colorName);
     //for Insert text pop up color tab change
     var textId=$($scope.clrTabObj).attr('data-id');
     $('.text_in_'+textId).css('background-color','#'+$scope.new_background_color);
     $('.text_in_'+textId).siblings('.clrname_text').html($scope.new_colorName);
	
	$(".apply_color_ipad").hide();
	$scope.clrplate='none';
	$scope.itemActive=null;
	$scope.clrTabObj=null;
	DesignService.ChangeColor($scope.selectedColorId,$scope.newColor,$scope);
	$scope.selectedColor='';
};
//for texture change

$scope.setTextureValue = function(event){
	$scope.new_texture_name=$(event.target).data('id');
	$scope.new_texture=$(event.target).data('value');

	$(".selected_texture_ipad").html("("+$(event.target).data('id')+")");	
	$(".apply_color_ipad").hide();
	$(".apply_texture_ipad").show();
};


$scope.applyTexture = function(){
	$($scope.clrTabObj).siblings('.txtrename').html($scope.new_texture_name);
	$scope.newTexture=$scope.new_texture;
	$scope.showImageLoader();
	$scope.changeProgress=true;

	$scope.itemActive=null;
	$scope.clrTabObj=null;
	$scope.clrplate='none';
	DesignService.ChangeTexture($scope.selectedColorId,$scope.newTexture,$scope);
	$(".selected_texture_ipad").html("");
	$(".apply_texture_ipad").hide();
};

/*
* function for change shape
*/

$scope.shapeChange = function(event){
	$scope.facebookLoader=true;
	$scope.changeProgress=true;
	DesignService.ChangeShape($(event.target).data('value'),rugId,$scope);
};

/*
* function for save pdf
*/

$scope.Savepdf = function(){
    DesignService.Savepdf($cookieStore.get('globals').currentUser.userId,$scope);
};


/*
* function for print
*/

$scope.Print = function(){
//return true;
   DesignService.Print($cookieStore.get('globals').currentUser.userId,catalogId,$scope);
};

/*
* function for shuffling image
*/

$scope.ShuffleImage = function(event){
	$scope.showImageLoader();
	$scope.changeProgress=true;
	DesignService.ShuffleImage(rugId,$scope);

};

/*
*function for show and hide color pallate 
*clrTabObj used for mainatin the active clr tab object
*/
	$scope.clrplate='none';
	$scope.itemActive=null;
	$scope.clrTabObj=null;

$scope.logMouseIn = function(event){
	$scope.clrTabObj=event.target;
	$scope.itemActive=$(event.target).data('value');
	$scope.selectedColorId=$(event.target).data('id');
	$('.dynamicimg').css('visibility','hidden');
	$('#'+$scope.selectedColorId).css('visibility','visible');
	$scope.clrplate='';
};

$scope.hideColorValue = function(){
   $scope.selectedColor=''; 
};

 /* 
 *function for rediect to catalog page 
 *
 */       
$scope.goCatalog = function(){
	$location.path('/catalog');
};


/*
*function for hide color tab
*/

$scope.closeClrTab = function(event){
	$scope.itemActive=null;
	$('.dynamicimg').css('visibility','visible');
	$scope.clrplate='none';
};


/*
* function for getting color pallate on change name of clr pallate
*/

$scope.getColor = function(obj){
    DesignService.getColorPallate(obj.selected_value,$scope);
};


//function for change color Rgb to hex
$scope.rgb2hex=function(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return  hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

$scope.hextorgb=function(hex) {
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return r + "," + g + "," + b;
};
$scope.MessageShow=function(){
	 if($scope.changeProgress){
	      alert('Please wait untill the change color image Loading');
	 }
};


//function for sae order form
$scope.placeOrder=function(){
    DesignService.getOrderDetail($cookieStore.get('globals').currentUser.userId,$scope);
        
};

$scope.orderConfirm=function(){
    DesignService.orderConfirm($cookieStore.get('globals').currentUser.userId,$scope);
        
};

//function for download pdf
$scope.downloadPdf=function(){
	 var filename=$('#orderid').val();
	window.location=RESOURCES.USERS_API+'/downloadPdf/'+filename+'.pdf';
}

$scope.BackEdit=function(){
	$scope.orderval=true;
	$scope.order_form=true;
	$scope.order_detail=false;
};

$scope.orderCancel=function(){	
	$scope.orderval=true;
	$scope.order_form=true;
	$scope.order_detail=false;
	$('.placeorder').attr('disabled',false);
};

//function for zoom image
$scope.zoomImage=''; 
$scope.zoomingRug=function(){	
	
	 if($('#zoomImage').parent().hasClass('zoom'))
	  	{
	     $scope.singlefbloader=true;
	  	$('#zoomImage').parent().attr('class','zoomout');
		  $scope.zooming=true;
		  $('.gallery').hide();
	  	} else {
	  	$(".featuredimagezoomerhidden").remove();
	  	$('.zoomtracker').remove();
	  	$('.gallery').show();
	  	$('#zoomImage').parent().attr('class','zoom');
        $scope.src='';
		$('.original').find('img').removeAttr('src');
		
		//var zoomed =angular.element.querySelector('.zoomed');
		//zoomed.find('img').removeAttr('src');

	    $scope.zooming=false;
	  	return false;
	  	}

	 DesignService.zoomImage($cookieStore.get('globals').currentUser.userId,rugId,$scope);
};

//function for Add to cart image
$scope.AddCartImage=function(){
   DesignService.AddCart($scope);
};

//for delete cart image
$scope.deleteCartImage=function($event){
   DesignService.deleteCartImg($event,$scope);
};

//for load cart image
$scope.loadCartImage=function($event){
	$scope.CartPopClose();
	DesignService.loadCartImg($event,$scope);
};

//for add or remove active class
$scope.addActClass=function($event){
 	$('.loaded_cart').removeClass('active');
	$($event.target).parent().parent().addClass('active'); 
};

//function for reset buttons of undo,redo,revert
$scope.resetButton=function(){
	$("#revert").parent().removeClass('rug-skew-active').addClass('opac rug-skew');
	$("#redo").parent().removeClass('redo-active').addClass('opac rug-redo');
	$("#undo").parent('li').removeClass('undo-active').addClass('opac rug-undo');
};




//function for undo
$scope.undo=function(){
	
	UndoRedo.undo($scope);
};

//for redo
$scope.redo=function(){
	
	UndoRedo.redo($scope);
};

//for revert
$scope.revert=function(){
	
	UndoRedo.revert($scope);
	
     $("#redo").addClass('nonclickable');
     $("#undo").addClass('nonclickable');
	//angular.element(document.getElementById('redo')).attr('disabled',true);
	//angular.element(document.getElementById('undo')).attr('disabled',true);
};


//function for get list of designs on click of Design setting
	$scope.designshow=false;
	$scope.designloader=false;
	$scope.slideit_show=false;
	$scope.designImages = [];

$scope.getDesigns=function(){
	 $scope.designshow=true;
	 $scope.designloader=true;
	 DesignService.CartDesign($routeParams.param1,$routeParams.param2,$scope);
/*
$timeout(function(){
	console.log($scope);
},2000)
*/ 
 };


$scope.CloseDesignPop=function(){
    $scope.designshow=false;
};

// for change image from designs image click
$scope.ChangeDesignImg=function(event){

	var rugid=$($(event.target)[0]).attr('data-id');
	$('.slideCart').removeClass('design-active');
	$('.class_active_check').hide();
	$(event.target).parent().addClass('design-active');
	$($(event.target)).siblings().removeClass('ng-hide').css('display','block');

	DesignService.updateDesign(catalogId,rugid,$scope);
	DesignService.getColors(catalogId,$scope);

	$('#undo').parent().addClass('nonclickable');
	$('#revert').parent().addClass('nonclickable');
	$('#redo').parent().addClass('nonclickable');
	$scope.CloseDesignPop();
};


/***************  Insert text pop functions starts here    **************/


// for show text popup model
   $scope.text_pop_show=false;
   $scope.text_svg_show=false;
   $scope.svg_text='';
   $scope.text_bold=false;
   $scope.text_italic=false;
   $scope.textcolorvalue=false;

$scope.showTextModel=function(){

 
    $scope.text_svg_show=true;
    $scope.text_pop_show=true;
   // $scope.text_pop_show=!$scope.text_pop_show;
    $(".textpngImage").hide();
    $scope.color_value_selected=$(".colortexture li ").first().find('.clrname').text();
   	if(navigator.userAgent.search("Chrome") >= 0)
		{ 
          
			$timeout(function(){
                
			var textObj=document.getElementById("fontSel");
			if($scope.textcolorvalue)
			{
			$scope.text_div_color = $("#text_div_color").css('background-color');
			//textcolorvalue=false;
			}else{
			$scope.text_div_color = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
			}

			//$("#text_div_color").css('background-color',$firstBg);

			$(textObj).attr("fill", $scope.text_div_color);

			var transform=$(textObj).parent();

			//console.log($('#svg_text').val());

			}, 400);


		}else if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){
		// for safari
		$timeout(function(){
   
		var textObj=document.getElementById("fontSel");

		if($scope.textcolorvalue)
		{
		$scope.text_div_color = $("#text_div_color").css('background-color');
		//textcolorvalue=false;
		}else{
		$scope.text_div_color = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
		}

		//$("#text_div_color").css('background-color',$scope.text_div_color);
		var transform=$(textObj).parent();

		$(textObj).attr("fill", $scope.text_div_color);
		
		//console.log($('#svg_text').val());

		}, 1500);

		}else{

		
		if($scope.textcolorvalue)
		{
		$scope.text_div_color = $("#text_div_color").css('background-color');
		//textcolorvalue=false;
		}else{
		$scope.text_div_color = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
		}

		//$("#text_div_color").css('background-color',$firstBg);
	    
		var textObj=document.getElementById("fontSel");
	    $(textObj).attr("fill", $scope.text_div_color);
		}
    
};


$scope.hideTextModel=function(){
   $scope.text_pop_show=false;
   $scope.text_svg_show=false;
   $("#"+$('#textImagepng').val()).show();
};

//for show text color pallate

   $scope.text_show_clr=false;
   
$scope.showtextColor=function(){
   $scope.text_show_clr=!$scope.text_show_clr;
   $scope.text_clr_applybtn=false;

};

$scope.text_clr_applybtn=false;
$scope.setColorTextValue=function(event){
if($(event.target).attr('class')=='text_pop'){

	$scope.text_selected_clr=$(event.target).data('color');
	$scope.text_div_color ='rgb('+$scope.hextorgb($(event.target).data('color'))+')';
	$scope.color_value_selected = $(event.target).data('value');
	var textObj=document.getElementById("fontSel");
	$(textObj).attr("fill",$scope.text_div_color);
	$scope.textcolorvalue=true;

	}else{
	$scope.text_clr_applybtn=true;	
	$scope.text_selected_clr=$(event.target).data('color');
	$scope.text_div_color ='rgb('+$scope.hextorgb($(event.target).data('color'))+')';
	$scope.color_value_selected = $(event.target).data('value');
	}



};

$scope.textColor=function(Obj){
	DesignService.getTextColorPallate(Obj.text_select_palate,$scope)
 
};

$scope.ResetInTest=function(){
	
	var textObj=document.getElementById("fontSel");
	$(textObj).css({"font-family":'Arial',"font-weight":"normal","font-style":"normal"});
    $(textObj).attr("font-size", '50');

	var transform=$(textObj).parent();
	$(transform[0]).attr('transform','translate(507 680)');
	$(transform[0]).attr('class','translate(507 680)');

	$scope.text_div_color=$(".colortexture li").first().find('a').css('background-color');
	$(textObj).attr("fill",$scope.text_div_color);
	$(textObj).attr('transform','rotate(0, 0,20)');

	textObj.textContent='';
	$scope.font_familiy='Arial';
    $scope.svg_text='';
	$scope.textslider=0;
	$scope.text_size=50;
	$scope.text_italic=false;
	$scope.text_bold=false;

};

$scope.ApplytextColor=function(){
   var textObj=document.getElementById("fontSel");
    $(textObj).attr("fill",$scope.text_div_color);
    $scope.textcolorvalue=true;
    $scope.text_show_clr=false;
};

$scope.slider = {
	'options': {
	start: function (event, ui) { $log.info('Event: Slider start - set with slider options', event); },
	stop: function (event, ui) { $log.info('Event: Slider stop - set with slider options', event); }
	}
}

//for generate canvas to png image
$scope.changeText=false;
$scope.svgtext=true;
$scope.generateImage=function(){

		if($scope.changeText!=true)
		{
		$scope.changeText = true;
		}
		$scope.text_svg_show=false;
		$scope.text_pop_show=false;
       var textObj=document.getElementById("fontSel");
  
        $(textObj).attr('onmousedown','');
        $(textObj).attr('onmouseup','');

        var svgDoc =document.getElementById("svg_element");
        //var svgData=svgDoc.getElementById('transformElement');
         
       // var svgD=document.querySelector('svg');
        var serializer = new XMLSerializer();
        var str = serializer.serializeToString(svgDoc);
     
    
        $(svgDoc).find('defs').remove();

     canvas = document.getElementById("canvas");
     canvg(canvas, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="273" height="410">'+str+'</svg>');
   // canvg(canvas, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="462" height="687">'+str+'</svg>'); 

       var img_PNG = Canvas2Image.saveAsPNG(canvas, true);
       var imgData = $(img_PNG).attr('src'); 
        $scope.ResetInTest();
       DesignService.SvgToPng($cookieStore.get('globals').currentUser.userId,imgData,$scope);
       
};


});

