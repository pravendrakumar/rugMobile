
var change = false;
//var touch  = false; 
var changecart=false;
var curentimg=false;
var textcolorvalue=false;
var touch  = true; 
var timeout=60000;
var changeProgress=false;
var touch  = false;
//for on hover change color and texture
var changecolorval;
//var changetextureval;
var imageId;
var Imgobj;
var Svgdata;
var svgArr=new Array();

if(navigator.userAgent.match(/iPad/i))
{
touch = true; 
}

var Cartimg1=new Array();
var Cartimg2=new Array();
var imgSrcold = new Array();


//Load Rugs of Catalogs
$( document ).ready(function() {
var site_url=$("#site_url").val();

$( ".catalog" ).click(function() {
	var id= $(this).data("id");
	$(".navigationin li").removeClass('active');
	$(this).parent().addClass('active');

	$.ajax({
	  url: site_url+"portals/getAllDesigns/"+id,
	  global: false,
	  type: "POST", 
	  cache: false,
	  dataType: "JSON",
	  success: function(data) {
	  	console.log(data);
	  $("#catalog_name").html(data.description);
	  $('#catalog_list').hide().html(data.html).fadeIn('slow');
	  }
	  
	});
});

//Load Additional Info
$( "#additional_info" ).click(function() {
	if($(this).data('value')=='hide')
	{
	$(this).data('value','show');
	$(this).html('&and;');
	} else {
	$(this).data('value','hide');
	$(this).html('&or;');
	}
	$("#additional_info_html").fadeToggle(1000);
});	



//Set Hover On color

$(document).on({
    mouseenter: function () {
    	
     $('.clrsize').removeClass('active');
	 Imgobj=$(this).addClass('active');
     $( "#all_colors" ).fadeIn('show');
     $id=$(this).data('id');

     imageId=$(this).data('id');
     $(".dynamicimg").css('visibility','hidden');
     $('#'+$id).css('visibility','visible');

	 $bc=$(this).css('background-color');
	 $(".colorchoice").removeClass('active');
	 $(".colorchoice").each(function() {
		 if($(this).css('background-color')==$bc)
		 {
		 $(this).addClass('active');
		 }	
	 });
    },
    mouseleave: function () {
         $( "#all_colors" ).hide();
     setTimeout(setHoverOut,1000)	
    }
}, '.clrsize');




function setHoverOut()
{
  if($("#all_colors" ).css('display')=='none')
  {
  $('.clrsize').removeClass('active');	
  $(".dynamicimg").css('visibility','visible');	
  }

}


$("#all_colors").hover(function() {
     $( "#all_colors" ).show();
   },function() {
      //$( "#all_colors" ).hide();
      $('.clrsize').removeClass('active');
      $(".dynamicimg").css('visibility','visible');
   }
);

//Add More 
$("#add_more").click(function() {

$id=parseInt($("#add_more_id").val())+1;
	if($id<=4)
	{
	$("#add_more_id").val($id);
	$("#addMore"+$id).val(1);
	$("#add_more_"+$id).fadeIn('slow')
	$(this).show();
	$('.close_addMore').show();
	}
	setAddmoreClass();
});

//Cancel add more
$(".close_addMore").click(function() {
	
$id=parseInt($("#add_more_id").val());
	if($id!=1)
	{
	$("#addMore"+$id).val(0);
	$("#add_more_"+$id).fadeOut('slow');
	$addMore=parseInt($("#add_more_id").val())-1;
	$("#add_more_id").val($addMore);
	}
	setAddmoreClass();
});

//Change Unit
$(".unit").change(function() {
$id=$(this).data('id');
	if($(this).val()=='feet')
	{
	$("#width_inch_"+$id).show();
	$("#length_inch_"+$id).show();
	} else {
	$("#width_inch_"+$id).hide();
	$("#length_inch_"+$id).hide();
	}
});


	//Set Add More Class
	function setAddmoreClass()
	{
	$addMore=parseInt($("#add_more_id").val());
		if($addMore==4)
		{	
		$("#add_more").addClass('disabled');
		} else {
		$("#add_more").removeClass('disabled');
		}

		/*if($addMore==1)
		{
		$("#close_addMore").addClass('disabled');	
		} else {
        $("#close_addMore").removeClass('disabled');
		}	*/

	}
//**************************Some Useful function start here*************************
//Get Rug Image
function getImage()
{
	var imgStr  = new Array();
	$( ".dynamicimg" ).each(function() {
	imgStr.push($(this).data('src'));	
	});
	imgStr = imgStr.join(','); 
return imgStr;	
}

//Get Rug Pile
function getPile()
{
	var pileStr  = new Array();
	$( ".pilename" ).each(function() {
	pileStr.push($(this).html());	
	});
	pileStr = pileStr.join(',');
return pileStr;
}


//**************************Some Useful function end here************************



//************************Function For Order Details Start****************************
//Confirm Order
$(document).on("click","#order_confirm",function() {
	
	$textpngname=$('#textpng').val();
	var imgStr  = new Array();
	$( ".dynamicimg" ).each(function() {
	imgStr.push($(this).attr('data-src'));	
	});
	imgStr = imgStr.join(','); 

	var pileStr  = new Array();
	$( ".pilename" ).each(function() {
	pileStr.push($(this).html());	
	});
	pileStr = pileStr.join(',');
    
	  $.ajax({
	  url: site_url+"order/placeOrder/",
	  global: false,
	  type: "POST", 
	  cache: false,
	  data: {imgStr:imgStr, pileStr:pileStr,txtimg:$textpngname},

	 beforeSend:function() {
				$('#loaderorder').show();
				$("#order_confirm").attr('disabled',true);
				}, 
	  success: function(data) {
	  $('#order_detail_append').html(data); 
	  $("#order_confirm").attr('disabled',false);
	   $('#loaderorder').hide();
	  },
	  error: function (xhr, ajaxOptions, thrownError) {
         ErrorHandle(xhr.status,thrownError);
             $('#loaderorder').hide();
      }
	});
});

//Back to Order
$(document).on("click","#order_back",function() {
	ShowButton();
	$("#orderform").show();
  	$("#catlog_heading").show();
  	$("#colortexture_nav").show();
  	$('#order_detail_append').html('');
});

//Cancel order
$(document).on("click","#order_cancel",function() {
	ShowButton();
	$("#orderform")[0].reset();
	$("#orderform").show();
  	$("#catlog_heading").show();
  	$("#colortexture_nav").show();
  	$('#order_detail_append').html('');
});


//************************Function For Order Details End****************************

$(document).on("touchstart click",".apply_color_ipad",function() {
var obj = $(".colorchoice.active");
changeColor(obj);
obj.removeClass('active');
$(".selected_color_ipad").html("");	
$(".apply_color_ipad").hide();

});




//Color Change
$(document).on("click touchstart",".colorchoice",function() {

	if(changeProgress) {alert(processMsg()); return false; }

	//Only for touch
	if(touch)
	{
	$(".selected_color_ipad").html("("+$(this).data('value')+")");	
	$(".colorchoice").removeClass('active');
	$(this).addClass('active');
	$(".apply_texture_ipad").hide();
	$(".apply_color_ipad").show();
	} else {

		 if($('#controller').val()=='newPortals')
		 {
		   TestchangeColor(this);
		 }else{
		 	changeColor(this);
		 }		
	
	
	}
	
});


function changeColor(obj)
{
	//processMsg();

	$(".dynamicimg").css('visibility','visible');
	$(".colorchoice").removeClass('active');
	$("#all_colors").hide();
	setZoomIcon();
	
	
	//Set All Value
	var newColor = $(obj).attr('data-color');
	var newColorValue = $(obj).attr('data-value');

	var imgobj = Imgobj;//$('.clrsize.active');
	var imgId = imageId;//$(imgobj).attr('data-id');

	var imgSrc = $("#"+imgId).attr('data-src');
   //console.log(imgobj);
    //console.log(imgId);
   //console.log( $(obj).attr('data-value'));


	$.ajax({
	url: site_url+"portals/changeColor/",
	global: false,
	type: "POST", 
	cache: false,
	dataType: "JSON",
	timeout: timeout,
	data: {newColor:newColor, imgSrc:imgSrc},
	beforeSend: function (data){
		showImageLoader();

	},
	success: function(data) {
	
    changecart=false;
	$('#'+imgId).attr('src',data.image); 
	$('#'+imgId).attr('data-src',data.imgSrc);
	$(imgobj).css('background-color','#'+newColor);
	$(imgobj).siblings('.clrname').html(newColorValue);

	
	setUndoRedo();
	
	hideImageLoader(data.image);
  
	change = true;		
	}, 
	error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
			$('#facebook-loader').hide();
			$("#unbind-screen").hide();
      }
	});	
}
//-------------for testing--------------
function TestchangeColor(obj)
{
	//processMsg();

	$(".dynamicimg").css('visibility','visible');
	$(".colorchoice").removeClass('active');
	$("#all_colors").hide();
	setZoomIcon();
	
	
	//Set All Value
	var newColor = $(obj).attr('data-color');
	var newColorValue = $(obj).attr('data-value');

	var imgobj = Imgobj;//$('.clrsize.active');
	var imgId = imageId;//$(imgobj).attr('data-id');

	var imgSrc = $("#"+imgId).attr('data-src');
   //console.log(imgobj);
    //console.log(imgId);
   //console.log( $(obj).attr('data-value'));


	$.ajax({
	url: site_url+"newPortals/changeColor/",
	global: false,
	type: "POST", 
	cache: false,
	dataType: "JSON",
	timeout: timeout,
	data: {newColor:newColor, imgSrc:imgSrc},
	beforeSend: function (data){
		showImageLoader();

	},
	success: function(data) {
	//console.log(data); return false;
	
    changecart=false;
	$('#'+imgId).attr('src',data.image); 
	$('#'+imgId).attr('data-src',data.imgSrc);
	$(imgobj).css('background-color','#'+newColor);
	$(imgobj).siblings('.clrname').html(newColorValue);

	
	setUndoRedo();
	
	hideImageLoader(data.image);
  
	change = true;		
	}, 
	error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
			$('#facebook-loader').hide();
			$("#unbind-screen").hide();
      }
	});	
}
$(document).on("touchstart click",".apply_texture_ipad",function() {
var obj = $(".textureChange.active");
changeTexture(obj);
obj.removeClass('active');
$(".selected_texture_ipad").html("");	
$(".apply_texture_ipad").hide();

});


//Texture Change
$(document).on("click touchstart",".textureChange",function() {

	if(changeProgress) {alert(processMsg()); return false; }
	
	if(touch)
	{
	$(".selected_texture_ipad").html("("+$(this).data('value')+")");	
	$(".textureChange").removeClass('active');
	$(this).addClass('active');
	$(".apply_color_ipad").hide();
	$(".apply_texture_ipad").show();
	} else {
	changeTexture(this);
	}

});


function changeTexture(obj)
{
$(".dynamicimg").css('visibility','visible');
$(".colorchoice").removeClass('active');
$("#all_colors").hide();	
setZoomIcon();

$imgobj = Imgobj;//$('.clrsize.active');
$imgId = imageId;//$($imgobj).attr('data-id');

$imgSrc = $("#"+$imgId).attr('data-src');
//for testing
if($('#controller').val()=='newPortals'){
$url=site_url+"newPortals/changeTexture/";	
}else{
 $url=site_url+"portals/changeTexture/";	
}

$newTexture = $(obj).attr('data-value');

	$.ajax({
	  url: $url,
	  global: false,
	  type: "POST", 
	  cache: false,
	  dataType: "JSON",
	  data: {imgSrc:$imgSrc, newTexture:$newTexture},
	  beforeSend: function (data){
		showImageLoader();

	 },
	  success: function(data) {
	  $('#'+$imgId).attr('src',data.image);
	  $('#'+$imgId).attr('data-src',data.imgSrc);
	  $($imgobj).siblings('.txtrename').html(data.textureName);
	  
      setUndoRedo();
	  hideImageLoader(data.image);
	  $('#unbind-screen').hide();
	  change = true;
	  changecart=false;
	  },
	  error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
			$('#facebook-loader').hide();
			$("#unbind-screen").hide();
      }
	});	
}



$(document).on("click touchstart",'#color_close',function() {
$(".dynamicimg").css('visibility','visible');
$(".colorchoice").removeClass('active');
$("#all_colors").hide();
});


//Single Color Palatte Change
$(document).on("change","#colorPalatteId",function() {
	$.ajax({
		  url: site_url+'portals/getSingleColorPalette/'+$(this).val(),
		  global: false,
		  type: "POST", 
		  cache: false,
		  dataType: "JSON",
		  success: function(data) {
				if(data.width !='')
				{
				$('#color_choice_main').css({'width':data.width+'px','height':'auto'});
				}
				$('.colorchoicetexture').html(data.html);
         }
		  
    });	

});

//Shape Change
$(document).on("click",".shapeChange",function() {
    zoomout();
	setZoomIcon();
	showImageLoader();
	var imgOld  = new Array();
	var imgNew  = new Array();

	//Get All Old/New Image
	$( ".rugImg" ).each(function() {
	imgOld.push($(this).attr('data-srcold'));	
	imgNew.push($(this).attr('data-src'));	
	});
	imgOld = imgOld.join(',');
	imgNew = imgNew.join(',');

	$shape = $(this).data('value');

	$.ajax({
		  url: site_url+'portals/changeShape/',
		  global: false,
		  type: "POST", 
		  cache: false,
		  dataType: "JSON",
		  data: {shapeName:$shape, imgOld:imgOld, imgNew:imgNew, designId:$('#designId').val()},
		  beforeSend: function (data){
		     showImageLoader();
	      },
		  success: function(data) {
		  $("#current_shape").val($shape);
		  $(".first_shape_detail").html($shape);	
		  $("#border_image").attr('src','');
		  $("#border_image").attr('src',data.borderImg);	
		  $("#OrdersDetailShapeName1").val($shape);

		  $allImg = data.imgSrc.split(',');	
		  	var i=0;
		  	$( ".rugImg" ).each(function() 
		  	{
		  	hideImageLoader(data.imgPath+$allImg[i]);	
		  	$(this).attr('src','');
			$(this).attr('src',data.imgPath+$allImg[i]);
			$(this).attr('data-src',$allImg[i]);
			i++;
			});
		  	setUndoRedo();
		  	
		  	hideImageLoaderMulti(data.imgLength);
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
		  	 
		     ErrorHandle(xhr.status,thrownError);
             $('#facebook-loader').hide();
             $("#unbind-screen").hide();
      }
		  
		});	


	});


//Get Multisetting Data

$( "#multisettings" ).click(function() {
	//console.log('y');
	//$('head').append('<script rel="stylesheet" src="/js/jquery-ui.js" type="text/javascript" />');
	$(".rug-setting").addClass("setting_hover");
	 //$('#myElement').off('hover');

	//hide button
	HideZoomShapeRoom();
	$('#get_setting').html('<div id="loading_image" class="loader_img"><img src="/img/loading-small.gif"></div>');
	$('.multi_popup').show();
	
	//Get Old and New Image
	var imgId  = new Array();
	var imgNew  = new Array();
	$( ".rugImg" ).each(function() {
	imgId.push($(this).attr('id'));	
	imgNew.push($(this).attr('data-src'));	
	});
	imgId = imgId.join(',');
	imgNew = imgNew.join(',');

	var content;
	var clrName = new Array();
	var pile = new Array();
	$( ".sidesection" ).each(function() {
	content = $(this).children();
	clrName.push($(content[1]).html());
	pile.push($(content[3]).html());
	});
	$clrNameStr = clrName.join(',');
	$pileStr = pile.join(',');




	$.ajax({
	  url: site_url+"portals/getMultisetting/",
	  global: false,
	  type: "POST", 
	  cache: false,
	  data: {imgId:imgId, imgNew:imgNew, catalogId:$("#catalogId").val(), pile:$pileStr, clrName:$clrNameStr},
	  beforeSend: function (data){
		   // $("#load-screen").show();
	      },
	  success: function(data) {	
	  $('#get_setting').html(data);
	  //$('.multi_popup').show();
	  $("#multisettingtable").draggable();
      //$(".clrsize").unbind('mouseenter mouseleave');
	  $("#unbind-screen").show();

		// for geting color pallate value
    	var colorpalat=new Array();
		var pallatetext=new Array();
		var opts = document.getElementById('colorPalatteId').options;
		//console.log(opts);
		for(var i = 0, j = opts.length; i < j; i++)
		{ 
		colorpalat.push(opts[i].value);
		pallatetext.push(opts[i].text);
		}

		var strColor = '';
		strColor += '<div class="div01 col-md-6 col-lg-7 col-sm-6">Select Color<span class="pull-right color_apply_multiset"  style="display:none;"><button  class="btn btn-success apply-btn padding_btn" type="submit">Apply</button></span></div>';
	    strColor +='<div id="MultisetColorOption" class="div02 col-md-6 col-lg-5 col-sm-6"><select id="select_color_palatet_multiset">';

		for(var i=0; i<colorpalat.length;i++) 
		{
			if(document.getElementById('colorPalatteId').value==colorpalat[i])
			{
			strColor +='<option selected value="'+colorpalat[i]+'">'+pallatetext[i]+'</option>';
			}else{
			strColor +='<option value="'+colorpalat[i]+'">'+pallatetext[i]+'</option>';
			}
		}

		strColor +='</select></div>';

		if(touch)
		{ 
		strColor +='<div><button type="button" class="cls-btn multiset_close">×</button></div>';
		}

        var colorwidth='';
        if($("#color_choice_main").css('width')!='')
        {
         colorwidth='style="height:auto; width:'+$("#color_choice_main").css('width')+';"';
        } 
		$(".multisettingclrplte" ).html(strColor+'<ul id="colorchoicemultisettingId" class="colorchoicetexture colorchoice-multisetting" '+colorwidth+' >'+$("#color_choice_main").html()+'</ul>');
		$(".colorchoice-multisetting li").removeClass('colorchoice');
		$(".colorchoice-multisetting li").addClass('colorchoicemultisetting');
		$('#MultisetColorOption').removeClass('colorchoicetext');
         


	  },
	  error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
             $('#facebook-loader').hide();
             $("#unbind-screen").hide();
      }
	  
	});





});



//function for colorpalate for Multisetting

$(document).on("change","#select_color_palatet_multiset",function() {
	
	$.ajax({
		  url: site_url+'portals/getSingleColorPalette/'+$(this).val(),
		  global: false,
		  type: "POST", 
		  cache: false,
		  dataType: "JSON",

		  success: function(data) {
		  	if(data.width !='')
		  	{
             $('.colorchoice-multisetting').css({'width':data.width+'px','height':'auto'});
		  	}
			$('.colorchoice-multisetting').html(data.html);

			/*$('#colorchoicetextureId li').attr('onmouseover','setColorValueText(this)');
			$('#colorchoicetextureId li').attr('onmouseout','hideColorValueText()');
			$('#colorchoicetextureId li').first().removeAttr('onmouseover');
			$('#colorchoicetextureId li').first().removeAttr('onmouseout');*/

			$(".colorchoice-multisetting li").removeClass('colorchoice');
			$(".colorchoice-multisetting li").addClass('colorchoicemultisetting');
			$('#MultisetColorOption').removeClass('colorchoicetext');
		  }
		  
		});	


	});



$(document).on('click','.multi_popup_hdr .close',function(){
$('#get_setting').html('');

$('#room_view').show();

	$(".multi_popup").hide();
	$(".rug-setting").removeClass("setting_hover");
	$("#unbind-screen").hide();
	ShowZoomShapeRoom();
});


//Get Zoom Image Data
$( "#zoomImage" ).click(function() {	
	
	
	//Check Zoom Condition
 	if($('#zoomImage').parent().hasClass('zoom'))
  	{

  	$('#zoomImage').parent().attr('class','zoomout');
	    if(!touch) 
	  	{
	    $('#zoomImage').tooltip( "option", "content", "Zoom Out" );
	  	}
  	} else {
  	$(".featuredimagezoomerhidden").remove();
  	$('.zoomtracker').remove();
  	$('#zoomImage').parent().attr('class','zoom');	
	  	if(!touch) 
	  	{
	  	$('#zoomImage').tooltip( "option", "content", "Zoom In" );
	  	}
  	return false;
  	}
  	

	//Get New Image
	var imgNew  = new Array();
	$( ".rugImg" ).each(function() {
	imgNew.push($(this).attr('data-src'));	
	});

	imgNew = imgNew.join(',');

	//Get Old Image
	var imgOld  = new Array();
	$( ".rugImg" ).each(function() {
	imgOld.push($(this).attr('data-srcold'));	
	});

	imgOld = imgOld.join(',');
	
	$.ajax({
	  url: site_url+"portals/zoomImage/",
	  async: true,
	  global: false,
	  type: "POST", 
	  cache: false,
	  dataType: "JSON",
	  data: {imgNew:imgNew,imgOld:imgOld, change:change, designId:$("#designId").val(), shape:$("#current_shape").val(),textpng:$('#textpng').val()},
      beforeSend: function (data){
            
		     showImageLoader();
	      },
	  success: function(data) {	  	
	  hideImageLoader(data.img);
       $("#unbind-screen").hide();
	  	$('#border_image').addimagezoom({ 
		zoomrange: [2, 10],
		magnifiersize: [425,440],
		magnifierpos: 'right',
		cursorshade: true,
		largeimage: data.img
		})
	  },
	  error: function (xhr, ajaxOptions, thrownError) {
	  	
		     ErrorHandle(xhr.status,thrownError);
             $('#facebook-loader').hide();
             $("#unbind-screen").hide();
      }
	  
	});
});



//---------------------------------Order Functions--------------------------------
  

	$("#textrug").click(function(){
	hidePopUp();	
	HideZoomShapeRoom();

    $('#svg_object').show();
	$("#svgElement").show();
	$(".multi_popup1").show();
	$(".rug-text").addClass("setting_hoverT");
	$('#color_value_selected').html($('.clrname').html());

    // for geting color pallate value
    var colorpalat=new Array();
    var pallatetext=new Array();
    var opts = document.getElementById('colorPalatteId').options;
    for(var i = 0, j = opts.length; i < j; i++)
      { 
     colorpalat.push(opts[i].value);
     pallatetext.push(opts[i].text);
      }
     
    var strColor = '<div class="div01 col-md-6 col-lg-6 col-sm-6">Select Color <span id="selected_color_value_text" ></span> <span class="pull-right" id="color_apply_text" style="display:none;"><button  class="btn btn-success apply-btn padding_btn" type="submit">Apply</button></span></div>';
		strColor +='<div id="textColorOption" class="div02 col-md-6 col-lg-6 col-sm-6"><select id="select_color_palatetext">';
		
		for(var i=0; i<colorpalat.length;i++) 
			{
				if(document.getElementById('colorPalatteId').value==colorpalat[i])
				{
                  strColor +='<option selected value="'+colorpalat[i]+'">'+pallatetext[i]+'</option>';
				}else{
					strColor +='<option value="'+colorpalat[i]+'">'+pallatetext[i]+'</option>';
				}
			
		    }

		strColor +='</select></div>';
		
		if(touch)
		{	
		strColor +='<div><button type="button" class="cls-btn">×</button></div>';
	  	}
       
        var colorwidth='';
        if($("#color_choice_main").css('width')!='')
        {
         colorwidth='style="height:auto; width:'+$("#color_choice_main").css('width')+';"';
        }

		$("#colorchoicetextureHover" ).html(strColor+'<ul id="colorchoicetextureId" class="colorchoicetexture colorchoice-text" '+ colorwidth +' >'+$("#color_choice_main").html()+'</ul>');
		$('#colorchoicetextureId li').attr('onmouseover','setColorValueText(this)');
		$('#colorchoicetextureId li').attr('onmouseout','hideColorValueText()');
		$('#colorchoicetextureId li').first().removeAttr('onmouseover');
		$('#colorchoicetextureId li').first().removeAttr('onmouseout');

		$("#colorchoicetextureId li").removeClass('colorchoice');
		$("#colorchoicetextureId li").addClass('colorchoicetext');
		$('#textColorOption').removeClass('colorchoicetext');

		$("#svg_object").attr('height',parseInt($("#border_image").height())-7);
		$("#svg_object").attr('width',parseInt($("#border_image").width())-7);


		$("#unbind-screen").show();
		$(".textpngImage").hide();

    // for text  // for Chrome
    
		if(navigator.userAgent.search("Chrome") >= 0)
		{

		setTimeout(function(){

		var svg = document.getElementById("svg_object");  
		var svgData=svg.contentDocument;    
		var textObj=svgData.getElementById("fontSel");
		if(textcolorvalue)
		{
		$firstBg = $("#text_div_color").css('background-color');
		//textcolorvalue=false;
		}else{
		$firstBg = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
		}

		$("#text_div_color").css('background-color',$firstBg);

		$(textObj).attr("fill", $firstBg);

		var transform=$(textObj).parent();

		if(svgArr.length !=0)
		{

		SetSvgtext();
		}
		//console.log($('#svg_text').val());

		}, 400);


		}else if(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){
		// for safari
		setTimeout(function(){

		var svg = document.getElementById("svg_object");  
		var svgData=svg.contentDocument;    
		var textObj=svgData.getElementById("fontSel");

		if(textcolorvalue)
		{
		$firstBg = $("#text_div_color").css('background-color');
		//textcolorvalue=false;
		}else{
		$firstBg = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
		}

		$("#text_div_color").css('background-color',$firstBg);
		var transform=$(textObj).parent();

		$(textObj).attr("fill", $firstBg);
		if(svgArr.length !=0)
		{
		SetSvgtext();
		}
		//console.log($('#svg_text').val());

		}, 1500);

		}else{

		var svg = document.getElementById("svg_object");  
		var svgData=svg.contentDocument;    
		var textObj=svgData.getElementById("fontSel");
		if(textcolorvalue)
		{
		$firstBg = $("#text_div_color").css('background-color');
		//textcolorvalue=false;
		}else{
		$firstBg = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
		}

		$("#text_div_color").css('background-color',$firstBg);
		var transform=$(textObj).parent();

		$(textObj).attr("fill", $firstBg);
		}



	//colortexture_nav2
    $("#colortexture_nav2").html('<div id="color-slider-prev"></div><ul id="color_text_tab" class="colortexture"></ul><div id="color-slider-next"></div>')


	$('#color_text_tab').html($(".colortexture").html());	
    $colorObj = $("#color_text_tab li").attr('class','text_main');
	
	   $($colorObj).each(function() {
		 content = $(this).children();
		 $(content[0]).attr('class','text_pop');
		 $(content[0]).attr('data-value',$(content[1]).html());
		 $(content[0]).attr('onmouseover','setColorValueText(this)');
		 $(content[0]).attr('onmouseout','hideColorValueText()');
		 $(content[1]).attr('class','clrname_text');
	     $(content[2]).remove();
		 $(content[3]).attr('class','pilename_text');
		 $(this).attr('class','text_main');
		});


		if($(".sidesection").length>10)
		{	
			$('#color_text_tab').bxSlider({
		    slideWidth: 'auto',
		    minSlides: 2,
		    maxSlides: 8,
		    slideMargin: 0,
		    nextSelector: '#color-slider-next',
		    prevSelector: '#color-slider-prev',
		    nextText: '<img class="flip" src="/img/rug/arrow-next.png">',
		    prevText: '<img class="flip" src="/img/rug/arrow-prev.png">',
		    pager:false,
		    infiniteLoop: true,
		  	}); 
		}


    });




	$(".multi_popup_hdr .close").click(function(){

		
	$(".color_div").css('border',"1px solid #545454");
      // var textObj=svgFrame();
    
		var svgData=null;
		var svg = document.getElementById("svg_object");  
		svgData=svg.contentDocument;    
		var textObj=svgData.getElementById("fontSel");
     

       // textObj.textContent='';
       var transform=$(textObj).parent();
       // store text data
  svgArr.push({color:$('#text_div_color').css('background-color'),
                  text:textObj.textContent,
                  transform:$(transform).attr('transform'),
                  rotate: $("#rotateText").val(),
                  fontsize:$("#font_familiy").val(),
                  fontweight:$('#text_bold').val(),
                  fontstyle:$('#text_italic').val(),
                    });
        
      
      
       if(textcolorvalue)
        {
        $firstBg = $("#text_div_color").css('background-color');
        //textcolorvalue=false;
        }else{
        $firstBg = $(".colortexture li").first().find('a').css('background-color');//$("#text_div_color").css('background-color');//
        }

        $("#text_div_color").css('background-color',$firstBg);
        //$(textObj).attr("fill", $firstBg);


        $( "#slider" ).slider({range: "min",
        value: 0,
        min: -180,
        max: 180});
        $("#rotateText").val(0);
     
		$('#svg_object').hide();

		$("#"+$('#textImagepng').val()).show();
		$(".multi_popup1").hide();
		$(".rug-text").removeClass("setting_hoverT");
	});



//function for colorpalate for text

$(document).on("change","#select_color_palatetext",function() {
	
	$.ajax({
		  url: site_url+'portals/getSingleColorPalette/'+$(this).val(),
		  global: false,
		  type: "POST", 
		  cache: false,
		  dataType: "JSON",

		  success: function(data) {
		  	console.log(data);
		  	if(data.width !='')
		  	{
             $('#colorchoicetextureId').css({'width':data.width+'px','height':'auto'});
		  	}
			$('#colorchoicetextureId').html(data.html);
			$('#colorchoicetextureId li').attr('onmouseover','setColorValueText(this)');
			$('#colorchoicetextureId li').attr('onmouseout','hideColorValueText()');
			$('#colorchoicetextureId li').first().removeAttr('onmouseover');
			$('#colorchoicetextureId li').first().removeAttr('onmouseout');

			$("#colorchoicetextureId li").removeClass('colorchoice');
			$("#colorchoicetextureId li").addClass('colorchoicetext');
			$('#textColorOption').removeClass('colorchoicetext');
		  }
		  
		});	


	});

//getting designs for cart

$("#cart_design").click(function(){
      // hideButton();
      $('#multisettingtable').html('<div class="row"><div class="col-sm-12 col-lg-12 col-md-12 multi_popup_hdr"><h3>Designs</h3><button class="close multibox_close" type="button">&times;</button></div><div class="col-sm-12 multi_popup_descript" id="get_setting"><div id="slider1"></div></div></div>');
      $('#slider1').html('<div id="loading_image" class="loader_img"><img src="/img/loading-small.gif"></div>');
      
      $('#room_view').hide();
      zoomout();
       hidePopUp();
       $('.multi_popup').show();
		$.ajax({
			  url: site_url+'portals/cartDesign',
			  global: false,
			  type: "POST", 
			  cache: false,
			  data: {catalogId:$('#catalogId').val(),desigid:$('#designId').val()},
			  dataType:"html",
			  beforeSend: function (data){
		       //$("#load-screen").show();
	          },
			  success: function(data) {
				
			    $('#slider1').html(data);
				//$("#load-screen").hide();
				//$('.multi_popup').show();
				
			  },
			error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
              $("#load-screen").hide();
            }
			  
			});	

});



// forclick on cart images
$(document).on('click','.slideCart, .slideCoRug',function(){
	  
	  $('#textpng').val('');
	  var rugid=$('img',this).attr('data-id');


	  			//For Coordinate Rug
				if($(this).hasClass('slideCoRug'))
				{
				//alert('y');		
				$("#master_rug_name").show();
				 $('#myDiv').hide();
				} else {
				$("#master_rug_name").hide();
				$('.coordinate_btn').hide();
		         $('.cord_btn').hide();	
				}
	
		$.ajax({
			  url: $("#site_url").val()+'portals/designInfo',
			  global: false,
			  type: "POST", 
			  cache: false,
			  data: {'RugId':rugid,'catalogId':$('#catalogId').val()},
			  dataType:"JSON",
			  beforeSend: function (data){
		       showImageLoader();
		      
		      $('.multi_popup').hide();
		      
	          },
			  success: function(data) 
			  {
			  	//console.log(data.sugestedImage);
                var len1 = store1.length;
                var len2 = store2.length ;
                
                for(var i = len1; i > 0; i--) {
                         store1.pop();
                         store2.pop();
                    }
                //$('.coordinate_btn').hide();     
                //$('.myButton').hide();             
				$('#designId').val(rugid);
				$('#default_texture_name').val(data.defaulttextures);
		        $(".sidesection").remove();
		        $(".colortexture").append(data.Texture);
		        
		        $("#role_shape li").remove();
		        $("#role_shape").html(data.Shapes);
                
                $("#image_container img").remove();
		        $("#image_container").append(data.Image);
		        $(".rug_name").html(data.Rugname);
		      // console.log(data.sugestedImage);
		        if(data.sugestedImage !='')
		        {
		        	$('.coordinate_btn').show();
		        	$('.myButton').show(); 
		        	$('#suggest_cord').val('yes');
		        	$("#coRugSlider li").remove();
		        	$('#coRugSlider').append(data.sugestedImage);

		        }else{
		        	$('.coordinate_btn').hide();
		        	$('.myButton').hide();
                  }
				changecart=false;
                curentimg=true;
                InfoData();
                resetButton();
				$('#room_view').show(); 
				$("#used_colors_RGB").val(data.usedColor);
				$("#current_shape").val('Rectangle');

				hideImageLoaderMulti(data.totalImg);
			  

			
			  },
			 error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
				$('#facebook-loader').hide();
				$("#unbind-screen").hide();
           }
			  
			});	
});





//save Pdf
$("#save_button").click(function(){

		 

		//$(this).attr('disabled',true);
		//Get Old and New Image
		var imgOld  = new Array();
		var imgNew  = new Array();
		$( ".rugImg" ).each(function() {
		imgOld.push($(this).attr('data-srcold'));	
		imgNew.push($(this).attr('data-src'));	
		});
		imgOld = imgOld.join(',');
		imgNew = imgNew.join(',');


		var content;
		var clrName = new Array();
		var pile = new Array();
		$( ".sidesection" ).each(function() {
		content = $(this).children();
		clrName.push($(content[1]).html());
		pile.push($(content[3]).html());
		});
		$clrNameStr = clrName.join(',');
		$pileStr = pile.join(',');
	
	 //Set Svg Text
	
     $textpngname=$('#textpng').val();
	 //console.log($svgContent);
		
		var data = $(".orderform").serialize();
			data+= "&imgOld="+imgOld;
			data+= "&imgNew="+imgNew;
			data+= "&clrName="+$clrNameStr;
			data+= "&pile="+$pileStr;
			data+= "&designname="+$(".rug_name").html();
			data+= "&textimgname="+$textpngname;

		$.ajax({
		  url: $("#site_url").val()+"order/savePdf/",
		  global: false,
		  type: "POST", 
		  data: data,
		  cache: false,
		  dataType: "JSON",
		  beforeSend: function (data){
		     $("#load-screen").show();
	      },
		  success: function(data) {
		  $("#load-screen").hide();
		 // $("#save_button").attr('disabled',false);
		  setCloseMessage();
		  window.location=$("#site_url").val()+'/order/downloadPdf/'+data.fileName;
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
		     ErrorHandle(xhr.status,thrownError);
              $("#load-screen").hide();
         }
		});


});


//save Pdf
$("#print_button").click(function(){

	var content;
	var newClr = new Array();
	var texture = new Array();
	var pile = new Array();
	$( ".sidesection" ).each(function() {
	content = $(this).children();
	newClr.push($(content[1]).html()+'~'+rgb2hex($(content[0]).css('backgroundColor')));
	texture.push($(content[2]).html());
	pile.push($(content[3]).html());
	});

	$newClrName = newClr.join(';');
	$textureStr = texture.join(',');
	$pileStr = pile.join(',');
	$textureName=$('#default_texture_name').val();
	$rugName = $(".rug_name").html();
	$textpngname=$('#textpng').val();
	$usedColor = $("#used_colors_RGB").val().replace(/:/g, "~");

   $url=$("#site_url").val()+'order/printDesign/'+$("#catalogId").val()+'/'+$usedColor+'/'+$newClrName+'/'+$rugName+'/'+$textureName+'~'+$textureStr+'/'+$pileStr;
   if($textpngname!='')
   {
   $url=$url+'/'+$textpngname;
   }

	
	newwindow=window.open($url,'printDesign','height=700,width=1000,location=yes,scrollbars=yes,status=yes,resizable=1');
	if (window.focus) { newwindow.focus(); }
	return false; 

});


//-----------------------------------for testing (change isize of rug)------------
$("#change_size").click(function(){
	 // for getting all rug images data-src
	         $images= new Array();

			$( ".rugImg" ).each(function() {
			 $src = $(this).attr('data-src');
			 $images.push($src);
			});
            $designId=$src.split('_');
			 $.ajax({
					url: $("#site_url").val()+"newPortals/ChangeImageSize",
					type: "POST", 
					data:{'images':$images,'designId':$designId[0],},
					success:function(response){
						
						
	                }

	        });	
});

//----------------------All for Room View-------------------------


//$("#room_view").click(function(){
$(document).on('click',"#room_view",function(){
  
	    hideButton();
		zoomout();
		$designtpath= $('#site_url').val()+"img/design/";

			var href = '/js/jquery.bxslider.css';
			$('head').append('<link rel="stylesheet" href="'+href+'" type="text/css" />');
           
	        // for getting all rug images data-src
	         $images= new Array();

			$( ".rugImg" ).each(function() {
			 $src = $(this).attr('data-src');
			 $images.push($src);
			});

          

            //for text img
			$textImg='';
			if($('#textpng').val()!='')
			{
             $textImg=$('#textpng').val();
			}
           
			//$("#load-screen").show();

			$.ajax({
			url: $("#site_url").val()+"portals/getRoomView",
			type: "POST", 
			beforeSend: function (data){
			$("#load-screen").show();
			},
			success: function(data) {

			$("#room_view_display").html(data);
			 //for design id
            $designId=$src.split('_');

            //for roomimage id
            $roomimageId=$('#img_name').val().split('_');
           
                $.ajax({
					url: $("#site_url").val()+"portals/getRotatedDesigns",
					type: "POST", 
					dataType:'json',
                    data:{'desinId':$designId[0],'images':$images.join(","),'roomImageId':$roomimageId[0],'textImg':$textImg,'borderImg':$('#border_image').attr('data-src')},
                    success:function(response){
						
						//for boreder image starts here
						$('<img id="border_image"  class="dynamicimg" alt="" style="position: absolute; left:8px; visibility: visible;"  data-src="'+response.borderImg+'"/>')
						.load(function() { 
							  if(this.complete)
							  {
								$('#bgimagesId').append(this);
                                  
                                  //for rug image starts here

								for(var i=0; i<response.Rugimage.length;i++)
								{
								$('<img class="dynamicimg" style="position: absolute; left:8px; visibility: visible;" />')
								.load(function() { 
										if(this.complete)
										{
										$('#bgimagesId').append(this);

										//for text image starts here

                                          if(response.textImg !='')
											{
											
											$('<img  class="dynamicimg" style="position: absolute; left:8px; visibility: visible;"/>')
											.load(function() { 
												if(this.complete){
													$('#bgimagesId').append(this);
													$('#load-screen').hide(); 
												 } 
												})
											.error(function() { console.log("error loading image"); })
											.attr("src",$designtpath+$designId[0]+'/'+response.textImg+'?'+Math.random());

											}else{$('#load-screen').hide(); } 
                                             
                                             //ens text image here
										
										} 
								 })
								.error(function() { console.log("error loading image"); })
								.attr("src", $designtpath+$designId[0]+'/'+response.Rugimage[i]+'?'+Math.random());
								}
								//ends rug image  here
							  } 
							})
						.error(function() { console.log("error loading image"); })
						.attr("src",$designtpath+$designId[0]+'/'+response.borderImg+'?'+Math.random());
                          
                          //ends boreder image here 


                    }

                });
			
			
			//$("#load-screen").hide();   
			$("#room_view_display").show();
			$("#edit_rug_container").hide();
			},
			error: function (xhr, ajaxOptions, thrownError) {
			ErrorHandle(xhr.status,thrownError);
			$("#load-screen").hide();
			}
			});

		
});



//***********************Message(onclik)*******

   $('#unbind-screen').click(function(){
      MessageShow();

   });
//*********************************************
$(document).on("click","#edit_rug_back",function(){
	ShowButton();
	if($.trim($('#suggest_cord').val())=='yes'){
		
		$('.coordinate_btn').show(); 
		$('.cord_btn').show(); 
    	}
	
	$("#edit_rug_container").show();
	$("#room_view_display").hide();
    $('#bgimagesId').find('img').remove();
});

//Shuffle Image

$("#shuffleImage").click(function() {

ShowZoomShapeRoom();
setZoomIcon();
  var pileArray = new Array();
      pileArray['Normal'] = '';
      pileArray['Low'] = 'Low';
      pileArray['High'] = 'High'; 

  var textureArray = new Array();
      textureArray['CP'] = 'CutPile';
      textureArray['SB'] = 'SB';
      textureArray['LP'] = 'Loop'; 
      textureArray['OT'] = 'OverTwist'; 
      textureArray['TH'] = 'Thick'; 
      textureArray['Tibetan'] = 'Tibetan'; 
      textureArray['SpunBamboo'] = 'SpunBamboo'; 

  //Get Image Name
  var imgOld  = new Array();
  $( ".rugImg" ).each(function() {
  imgOld.push($(this).attr('data-srcold')); 
  });
  imgOld = imgOld.join(',');

var setting = new Array();
var settingShow = new Array();

//Shuffle Color
var shuffleArr = new Array();
$('.clrsize').each(function() 
{
shuffleArr.push(rgb2hex($(this).css('background-color')));
});
$shuffleColor = $.shuffle(shuffleArr);

// set New Value
var i = 0;
$('.sidesection').each(function() 
{
content = $(this).children();
$index = $(content[0]).attr('data-value');
$color = $shuffleColor[i];
$colorName = $(content[1]).text();
$texture = textureArray[$(content[2]).text()];
$pile = $(content[3]).text();

setting.push($("#designId").val()+'_'+$("#current_shape").val()+'_'+$color+'_'+$index+'_'+$texture+'_9.png');
settingShow.push($color+'~'+$colorName+'~'+$(content[2]).text()+'~'+$pile);

i++;
});

$setting = setting.join(',');
$settingShow = settingShow.join(',');
showImageLoader();

    $.ajax({
    url: $("#site_url").val()+'portals/multisetting/',
    global: false,
    type: "POST", 
    cache: false,
    dataType: "JSON",
    data: {imgOld:imgOld, setting:$setting, settingShow:$settingShow, id:$("#designId").val(),currentShape:$("#current_shape").val()},
    success: function(data) {
      change = true;
      $allImgSplit = data.img.split(',');   
        for(var ind in $allImgSplit) 
        {
        $imgSplit = $allImgSplit[ind].split('~');
        $("#"+$imgSplit[0]).attr('data-src',$imgSplit[1]);
        $("#"+$imgSplit[0]).attr('src',data.path+$imgSplit[1]);
        
        //set color
        $obj = $(".sidesection").find("[data-id='" + $imgSplit[0] + "']");
        $($obj).css('background-color','#'+$imgSplit[2]);
        $objSib = $($obj).siblings();
        $($($objSib[0]).html($imgSplit[3]));
        $($($objSib[1]).html($imgSplit[4]));
        $($($objSib[2]).html(pileArray[$imgSplit[5]]));  
        };
        
        setUndoRedo();
        hideImageLoaderMulti(data.imgCount);
         $("#unbind-screen").hide();
    }
    
  });


});



//ready document end
});


//Set Hover On color Select
function setColorValue(obj)
{

$(".selected_color").html("("+$(obj).data('value')+")");
changecolorval=$(obj).data('value');
}

function hideColorValue()
{
$(".selected_color").html('');
}

//Set Hover On texture Select
function setTextureValue(obj)
{
$(".selected_texture").html("("+$(obj).data('value')+")");
changetextureval=$(obj).data('value');
}

function hideTextureValue()
{
$(".selected_texture").html('');
}

//set zoom icon in
function setZoomIcon()
{
	if($("#zoomImage").parent().hasClass('zoomout'))
  	{
  	$(".featuredimagezoomerhidden").remove();
  	$('.zoomtracker').remove();
  	$("#zoomImage").parent().attr('class','zoom');	
  	}	
}

function showImageLoader()
{
 changeProgress=true;
$("#facebook-loader").show();	
$("#unbind-screen").show();
}

function hideImageLoader(img)
{	
  
	$("<img />").attr('src', img).load(function() 
	{
	$("#facebook-loader").hide();	
	$("#unbind-screen").hide();
	changeProgress=false;
	});
}

function hideImageLoaderMulti(len)
{
	var img = 0;
 
	$('.dynamicsect img').on('load',function()
	{ 
		
		if(this.complete){

			if(img==len) 
			{ 
			
			$("#facebook-loader").hide(); 
			$("#unbind-screen").hide();
			changeProgress=false;

			} 
			img++;
		} 
		

		
	});	


		
}

function hideImageLoaderMultiUnRedo(len,pos,src)
{
 
 $("<img />").attr('src', src).load(function() 
	{
       
		if( pos == len)
		{
		$("#facebook-loader").hide();	
		$("#unbind-screen").hide();
		changeProgress=false;
		}
	});
	
}

	
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return  hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
//function for Some errors like 403,200
function ErrorHandle(status,error){
	
	  changeProgress=false;
	 if((status==403)&&(error=='Forbidden')){
	 	change = false;
	 	window.location.href=$('#site_url').val();
	 }else if((status==200)){
	 	
	 	alert('SomeThing went wrong .Please try Again');
	 }else if((status==0)&&(error =='')){
	 
	 	alert('There is network Problem.Please Check your network');
	 }else if((status==0)&&(error =='timeout')){
	 	
	 	alert('SomeThing went wrong .Please try Again');
	 }

}
function setCloseMessage()
{
	if(change)
	{
	change = false;
	setTimeout(function(){change = true},1000);
	}
	
}
// function for message show
function MessageShow()
{
	 if(changeProgress)
     {
      alert('Please wait untill the change color image Loading');
     }

}

function processMsg()
{
	return 'Wait until last process is complete...';
	
}

function hideButton()
{

    $('#add_more').hide();
    $('#close_addMore').hide();
    $('.settingheader').hide();
    $('.zoomsize').hide(); 
    $('#room_view').hide();  
    $('.coordinate_btn').hide(); 
    $('.cord_btn').hide(); 
    
    
 }
 function ShowButton()
{

    $('#add_more').show();
    $('#close_addMore').show();
    $('.settingheader').show();
    $('.zoomsize').show(); 
    $('#room_view').show();   
    //$('.coordinate_btn').show(); 
    //$('.cord_btn').show(); 
    
}
//function for hide and show shape,zoom,roomview save_button
 function HideZoomShapeRoom()
 {

 	$('.zoomsize').hide(); 
    $('#room_view').hide();   
 }
 function ShowZoomShapeRoom()
 {

 	$('.zoomsize').show(); 
    $('#room_view').show();   
 }

 // function for zoom

 function zoomout()
 {
   if($('#zoomImage').parent().hasClass('zoomout'))
  	{
  	$(".featuredimagezoomerhidden").remove();
  	$('.zoomtracker').remove();
  	$('#zoomImage').parent().attr('class','zoom');
  	$('#zoomImage').tooltip( "option", "content", "Zoom In" );
  	}

 }

 //Set Hover On color Select for Text
function setColorValueText(obj)
{
$("#selected_color_value_text").html("("+$(obj).data('value')+")");
 textcolorvalue=true;

}

function hideColorValueText()
{
$("#selected_color_value_text").html('');
}




 //Set Hover On color Select for Multisetting

function setColorValueMulitsetting(obj)
{
	
 $ind=$('.multiCheckbox').val();  
$("#selected_color_value_text").html("("+$(obj).data('value')+")");
 textcolorvalue=true;

}

function hideColorMulitsetting()
{

$ind=$('.multiCheckbox').val();
$("#selected_color_value_text").html('');
}

// function for hide tabs 

function hidePopUp()
{
	 $(".multi_popup1").hide();
	 $('.multi_popup').hide();
	 $(".cart_popup").hide();
}

// function for set text svg

function SetSvgtext()
{
	    
	var svg = document.getElementById("svg_object");  
	var svgData=svg.contentDocument;    
	var textObj=svgData.getElementById("fontSel");
	var transform=$(textObj).parent();
 
	var enterTxt = svgArr[0].text;
	if(enterTxt!='')
	{
	str = enterTxt.split("\n");
    textObj.textContent='';
	    for(var i=0;i<str.length;i++)
	    {
	    var tspan=document.createElementNS('http://www.w3.org/2000/svg','tspan');
	    tspan.setAttribute('x',0);
	    tspan.setAttribute('dy','1.2em');
	    //Set for Virtual Alignment
		    if(i==0 && str.length>1)
		    {
		    var y=-(svgArr[0].textsize*str.length)/2;
		    tspan.setAttribute('y',y);
		    }
	    tspan.textContent=str[i];
	    $(textObj).append(tspan);
	    }

  }


	//textObj.textContent=svgArr[0].text;
	$(textObj).css({"font-family":svgArr[0].fontfamily,"font-weight":svgArr[0].fontweight,"font-style":svgArr[0].fontstyle});
	$(textObj).attr("fill",svgArr[0].color);
	$(textObj).attr("font-size",svgArr[0].textsize);
	
	if(svgArr[0].rotate !='' && svgArr[0].rotate !=null && svgArr[0].rotate !=0)
	{
		
	 $(transform).attr('transform',svgArr[0].transform);
     $(textObj).attr('transform','rotate('+svgArr[0].rotate+' 0,20)');
	}else{
		
	 $(transform).attr('transform',svgArr[0].transform);	
	}

}

// for loading image of multisetting on load
$(document).ready(function(){
$('#get_setting').html('<div id="loading_image" class="loader_img"><img src="/img/loading-small.gif"></div>');	

});

//Shufflr function
(function($){

    $.fn.shuffle = function() {
        return this.each(function(){
            var items = $(this).children().clone(true);
            return (items.length) ? $(this).html($.shuffle(items)) : this;
        });
    }
    
    $.shuffle = function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
    
})(jQuery);
