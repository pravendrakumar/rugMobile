'use strict';

app.factory('DesignService',function ($http,$compile,$timeout,$window,GeneratePng,ListDesign,UndoRedo,Multiset,Zoom,shuffleImage,shuffleFact,pdfSave,editDesign,getColor,colorChange,textureChange,shapeChange,getSinglePalette,RESOURCES,$location) {
	var service = {};


service.updateDesign = function (catId,designId,$scope) {
	$scope.facebookLoader=true;
	var query = { where:{catId:catId,
		designId:designId,
		
	}};

    editDesign.findAll(query).then(function (response) {
    	$scope.loader=false;
		var Obj=JSON.stringify(response); 
		var designObj= JSON.parse(Obj);
		$scope.catId=catId;
		$scope.designId=designId;
		$scope.len=designObj[0].imgLength;
		$scope.imagesObj=designObj[0].imageName;
		$scope.catalogName=designObj[0].catalogName;
		$scope.imageSortName=designObj[0].imageSortName;
		$scope.colors=designObj[0].imageColor;
		$scope.textures=designObj[0].texture;
		$scope.pileShow=designObj[0].pileShow;
		$scope.shapeName=designObj[0].shapeName;
		$scope.rugName=designObj[0].name;
		$scope.usedColor=designObj[0].usedColor;
		$scope.defaultTexture=designObj[0].defaulttextures;
		$scope.currentShape='Rectangle';
		$scope.cloud_path=RESOURCES.CLOUD_PATH;
        $scope.catalogQuality=designObj[0].catalogQuality;
        $scope.defaultCatalogQuality=designObj[0].defaultCatalogQuality;
       
		$scope.loadData=true;
		$scope.facebookLoader=false;
        $timeout(function() {
		 UndoRedo.InfoData($scope);
		
		 }, 300);
	})

};
    
service.getColors = function (catId,$scope) {
	getColor.find(catId).then(function (response) {
		var Obj=JSON.stringify(response); 
		var colorObj= JSON.parse(Obj);
		
		$scope.textureArr=colorObj.textureArr;
		$scope.colorCategory=colorObj.colorCategory;
		$scope.defaultColor=colorObj.defaultColor;
		$scope.clrtextPltArr=$scope.clrPltArr=colorObj.colors;
		$scope.text_select_palate=$scope.selected_value=colorObj.defaultColor;
		
	});

};      

// for gettingcolor pallate on select pallate name
service.getColorPallate = function (colorLibId,$scope) {
   getSinglePalette.find(colorLibId).then(function (response) {
    	var Obj=JSON.stringify(response); 
		var colorObj= JSON.parse(Obj);

		$scope.clrPltArr=colorObj.colors;
		
	});

}; 


// for gettingcolor pallate on select pallate name of Insert text pop up
service.getTextColorPallate = function (colorLibId,$scope) {
   getSinglePalette.find(colorLibId).then(function (response) {
    	var Obj=JSON.stringify(response); 
		var colorObj= JSON.parse(Obj);

		$scope.clrtextPltArr=colorObj.colors;
		
	});

}; 
// for gettingcolor pallate on select pallate name
service.getMultiColorPallate = function (colorLibId,$scope) {
   getSinglePalette.find(colorLibId).then(function (response) {
    	var Obj=JSON.stringify(response); 
		var colorObj= JSON.parse(Obj);
		$scope.multi_clrPltArr=colorObj.colors;
		
	});

};

// for change color and getting image on selecting color 
service.ChangeColor = function (imageId,newColor,$scope) {
	
   // console.log($( '#'+imageId )); return false;
    $scope.imageId=imageId;
    var Myelement=angular.element( $( '#'+imageId ) );
  
	var imgSrc = Myelement.attr('data-img');
   
	var query = { where:{
		newColor:newColor,
		imgSrc:imgSrc,
		
	}};
    colorChange.findAll(query).then(function (response) {
    	
		var Obj=JSON.stringify(response); 
		var imgObj= JSON.parse(Obj);

		 Myelement.attr('data-img',imgObj[0].imgSrc);
		 Myelement.attr('ng-src',imgObj[0].image);
		 Myelement.attr('src',imgObj[0].image);

		  
          $scope.singlefbloader=false;
	      $scope.change=true;

    }).then(function(){
    	UndoRedo.setUndoRedo($scope);
    	UndoRedo.setUndoRedoButton($scope);
    });
}; 


// for change color and getting image on selecting color 
service.ChangeTexture = function (imageId,newTexture,$scope) {
	var Myelement=angular.element( $( '#'+imageId ) );

	var imgSrc = Myelement.attr('data-img');
   
	var query = { where:{
		newTexture:newTexture,
		imgSrc:imgSrc,
		
	}};
    textureChange.findAll(query).then(function (response) {
    	
		var Obj=JSON.stringify(response); 
		var imgObj= JSON.parse(Obj);

		 Myelement.attr('data-img',imgObj[0].imgSrc);
		 Myelement.attr('ng-src',imgObj[0].image);
		 Myelement.attr('src',imgObj[0].image);
		 $scope.facebookLoader=false;
		 $scope.change=true;
		
	}).then(function(){
    	UndoRedo.setUndoRedo($scope);
    });
}; 


// for shape change 
service.ChangeShape = function (newShape,designId,$scope) {

    $scope.zoomout();
    var Myelement=angular.element( $( '#border_image' ) );
	var divs = angular.element(document.querySelectorAll('.rugImg'));
    var imgOld  = new Array();
	var imgNew  = new Array();
	//for
	[].forEach.call(divs, function(div) {
 
		imgOld.push($(div).attr('data-img-old'));	
		imgNew.push($(div).attr('data-img'));
	});
		imgOld = imgOld.join(',');
		imgNew = imgNew.join(',');
	

	var query = { where:{
		shapeName:newShape, 
		imgOld:imgOld, 
		imgNew:imgNew, 
		designId:designId
		
	}};

    shapeChange.findAll(query).then(function (response) {
    	
		var Obj=JSON.stringify(response); 
		var imgObj= JSON.parse(Obj);
         
      
        Myelement.attr('src','');
        Myelement.attr('ng-src','');
        Myelement.attr('src',imgObj[0].borderImg);
        Myelement.attr('ng-src',imgObj[0].borderImg);
       
		$scope.currentShape=newShape;
        $scope.len=imgObj[0].imgLength;
        var allImg = imgObj[0].imgSrc.split(',');
        
        var i=0;
		[].forEach.call(divs, function(div) {
 
		$(div).attr('src','');
		$(div).attr('ng-src','');
		$(div).attr('src',imgObj[0].imgPath+allImg[i]);
		$(div).attr('ng-src',imgObj[0].imgPath+allImg[i]);	
		$(div).attr('data-img',allImg[i]);
        i++;
	    });
		$scope.facebookLoader=false;
		$scope.change=true;
		
	}).then(function(){
    	UndoRedo.setUndoRedo($scope);
    });
}; 


// for shuffle the images
service.ShuffleImage = function (designId,$scope) {

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

      var images = angular.element(document.querySelectorAll('.rugImg'));
      var colors = angular.element(document.querySelectorAll('.clrsize'));
      //for
      var curretShape=angular.element( $( '#current_shape' ) ).val();
      
      var imgOld  = new Array();

	  [].forEach.call(images, function(div) {
	   imgOld.push($(div).attr('data-img-old'));	
	  });

	  imgOld = imgOld.join(',');

	  var setting = new Array();
	  var settingShow = new Array();
	  //Shuffle Color
      var shuffleArr = new Array();
      [].forEach.call(colors, function(div) {
	   shuffleArr.push($scope.rgb2hex($(div).css('background-color')));	
	  });

	  var shuffleColor = shuffleFact.shuffle(shuffleArr);

	  var sidesections = angular.element(document.querySelectorAll('.sidesection'));
	  var i=0;
	  var content='';
	  [].forEach.call(sidesections, function(div) {
		content = $(div).children();
		
		var index = $(content[0]).attr('data-value');
		var color = shuffleColor[i];
		var colorName = $(content[1]).text();
		var texture = textureArray[$(content[2]).text()];
		var pile = $(content[3]).text();

		setting.push(designId+'_'+curretShape+'_'+color+'_'+index+'_'+texture+'_9.png');
		settingShow.push(color+'~'+colorName+'~'+$(content[2]).text()+'~'+pile);

        i++;	
	  });
     
	var setting = setting.join(',');
	var settingShow = settingShow.join(',');
  
    var query = { where:{
		imgOld:imgOld, 
		setting:setting, 
		settingShow:settingShow, 
		id:designId,
		currentShape:curretShape
		
	}};

    shuffleImage.findAll(query).then(function (response) {
    	$scope.changeProgress = true;
		var Obj=JSON.stringify(response); 
		var imgObj= JSON.parse(Obj);
		var allImgSplit = imgObj[0].img.split(',');
        var i=0;
        $scope.len=parseInt(imgObj[0].imgCount)+1;
       //console.log(allImgSplit);return false;
		angular.forEach(allImgSplit, function(image) {
			var imgSplit = allImgSplit[i].split('~');
			
		   $( '#'+imgSplit[0] )
			.attr('data-img',imgSplit[1])
			.attr('src','')
			.attr('ng-src','')
			.attr('src',imgObj[0].path+imgSplit[1])
			.attr('ng-src',imgObj[0].path+imgSplit[1]);
			

			//set color
		
			var obj = angular.element( $( "[data-id='" + imgSplit[0] + "']" ) );
			//console.log(obj);
			$(obj).css('background-color','#'+imgSplit[2]);
		    var objSib = $(obj).siblings();
			$($(objSib[0]).html(imgSplit[3]));
			$($(objSib[1]).html(imgSplit[4]));
			$($(objSib[2]).html(pileArray[imgSplit[5]]));

	        i++;	
	    });
          $scope.facebookLoader=false;
          $scope.change=true;
    }).then(function(){
    	UndoRedo.setUndoRedo($scope);
    });
};

//function for save pdf file of rug
service.Savepdf = function (userId,$scope) {
    var divs = angular.element(document.querySelectorAll('.rugImg'));
    var imgOld  = new Array();
	var imgNew  = new Array();
	//for
	[].forEach.call(divs, function(div) {
 
		imgOld.push($(div).attr('data-img-old'));	
		imgNew.push($(div).attr('data-img'));
	});
		imgOld = imgOld.join(',');
		imgNew = imgNew.join(',');
	
	
	 var content='';
	 var clrName = new Array();
	 var pile = new Array();
	 var sidesections = angular.element(document.querySelectorAll('.sidesection'));
	  [].forEach.call(sidesections, function(div) {
		content = $(div).children();
		clrName.push($(content[1]).text());
		pile.push($(content[3]).text());

       });

	 var clrNameStr = clrName.join(',');
	 var pileStr = pile.join(',');
	 var textpngname=$('#textpng').val();
	 var data = $("#orderform").serialize();

		 data+= "&imgOld="+imgOld;
		 data+= "&imgNew="+imgNew;
		 data+= "&clrName="+clrNameStr;
		 data+= "&pile="+pileStr;
		 data+= "&designname="+$scope.rugName;
		 data+="&userId="+userId;
		 data+= "&textimgname="+textpngname;
		 data+= "&carving="+true;
	
    $http({
	    method: 'POST',
	    url:RESOURCES.USERS_API+'/savePdf',
	    data:data ,
	    dataType:'json',
	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function(response){
     	//$scope.downloadPdf(response.data.fileName);
       window.location=RESOURCES.USERS_API+'/downloadPdf/'+response.data.fileName;
     });
  		
			
};  


//function for print
service.Print = function (userId,catalogId,$scope) {

	 var content='';
	 var contentArr=[];
	 var sidesections = angular.element(document.querySelectorAll('.sidesection'));
	 var i=0;
	  var usedColor = $scope.usedColor.replace(/:/g, "~");
	   var usedColorArr =usedColor.split(';');
	   var colrVal='';
	  [].forEach.call(sidesections, function(div) {
			content = $(div).children();
			var colrVal=usedColorArr[i].split('~');
			contentArr.push({
				newcolor:$(content[1]).html(),
				newval:$scope.rgb2hex($(content[0]).css('backgroundColor')),
				oldcolor:colrVal[0],
				oldval:colrVal[1],
				texture:$(content[2]).html(),
				pile:$(content[3]).text()
			});
		
	       i++;
       });

	 //console.log(contentArr);return false;
	
	document.getElementById('svgElement').style='display:none';
	var printContents = document.getElementById('dynamicsectId').innerHTML;
	var originalContents = document.body.innerHTML;      

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWin.window.focus();
        popupWin.document.write('<!DOCTYPE html><html><head>' +
            '<link rel="stylesheet" type="text/css" href="css/custom.css" />' +
            '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
        popupWin.onbeforeunload = function (event) {
            popupWin.close();
            return '.\n';
        };
        popupWin.onabort = function (event) {
            popupWin.document.close();
            popupWin.close();
        }
    } else {
        var popupWin = window.open('', '_blank', 'width=800,height=600');
        popupWin.document.open();
        var str='';
       // var html='<html><head><link rel="stylesheet" type="text/css" href="css/custom.css" /></head><body >' + printContents + '</html>';
		var html='<!DOCTYPE html><html moznomarginboxes mozdisallowselectionprint><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Rug Studio</title><link href="/favicon.ico" type="image/x-icon" rel="icon" /><link href="/favicon.ico" type="image/x-icon" rel="shortcut icon" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="stylesheet" type="text/css" href="css/bootstrap.css" /><link rel="stylesheet" type="text/css" href="css/custom.css" />';
        html +='<style type="text/css">@media print { .no-print { display:none; } }</style>';
        html +='<body bgcolor="White" style="background-image:url();background-color:#FFFFFF"><div id="wrap"><div id="container" style="min-height:620px;"><div class="container"><div class="row"><div class="col-md-6"><h1 style="text-shadow:0 1px 3px #EEEEEE; color:#000000">Guest</h1></div><div class="col-md-6 head_topright">Guest Account</div></div><div class="row"><hr class="hr-top"><div class="col-md-4 col-lg-6 col-xs-5"><div id="imageDesign" style="">' + printContents + '</div></div>';
        html +='<div class="col-md-8 col-xs-7 col-lg-6 portals-manage "><div class="table-responsive"><table id="client_info" border="0" cellspacing="0" cellpadding="0" class="table"><td colspan="3"><table border="0" class="table table-bordered portals_class table_hr" cellspacing="0" cellpadding="0" align="left"><tr><thead><tr><td colspan="3">Catalog Name</td><td  colspan="4"> ' + $scope.catalogName + ' </td></tr></thead><tr><td  colspan="3" class="">Design Name</td><td  colspan="4" class="">' + $scope.rugName + '</td></tr>';
        html +='<tr><td colspan="3">Used Colors</td><td colspan="2">Default Colors</td><td>Textures</td><td align="left">Pile</td></tr>';
		
		angular.forEach(contentArr, function(item) {
         str +='<tr>';
         str +='<td class="UsedColor1"></td>';
         str +='<td class="defaultColor"><div style="background-color:#'+ item.newval +'; width:19px; height:19px;text-align:left;"></div></td>';
		 str +='<td>'+ item.newcolor +'</td>';
		 str +='<td class="defaultColor"><div style="background-color:#'+ item.oldval +'; width:19px; height:19px;text-align:left;"></div></td>';
		 str +='<td>'+ item.oldcolor +'</td>';
		 str +='<td align="left" style="height:23px;">'+item.texture +'</td>';
		 str +='<td align="left" style="height:23px;">Normal</td>';
		 str +='</tr>';
		});
		html +=str;	
        html +='<tr><table border="0" id="color_table" class="table table-bordered portals_class table_hr" cellspacing="0" cellpadding="0" align="left" style="disply:none;"></table></tr></table></td></tr><tr><td colspan="3"  style="padding:5px 0 0 5px"></td></tr></table><div  id="printbtn"><p style="text-align:left; font-weight:bold;"><b>Note : </b>To print all the colors and images on the page make sure your browser setting is enabled.<br />(Inside Tools-> Options or Page Setup enable "Print Background Colors and Images" flag)</p><input class="btn btn-primary no-print" type="button" name="print" value="Print" id="print" onClick="printPage();" ></div></div></div></div><div class="clearfix"></div></div></div></div>';
		html +='<script>function printPage(){window.print();}</script></body></html>';
        popupWin.document.write(html);
        popupWin.document.close();
    }
    popupWin.document.close();	
}; 


service.getShapeArr = function () {
	 var shapesArray = new Array();
		 shapesArray['rectangle']='Rectangle', 
		 shapesArray['circlein']='Circle',
		 shapesArray['hexagon']='Octagon',
		 shapesArray['square']='Square', 
		 shapesArray['oval']='Oval',
		 shapesArray['longsquare']='Runner',
		 shapesArray['square']='Square';

   
  return shapesArray;  
};


service.getEditData = function ($scope) {
	$http.get('data/editData.JSON') 
	.success(function(response){

	$scope.strikeOff=response.strikeoff;
	$scope.units=response.Unit;
	$scope.fontsArr=response.fonts;
	}).error(function(error){
	console.log(error);
	//$scope.names = 'error';
	});
	
};

service.getCountry = function ($scope) {

	$http.get('data/country.JSON') 
	.success(function(response){

	$scope.Country= response;
	}).error(function(error){
	console.log(error);
	//$scope.names = 'error';
	});

};


//function for print
service.getOrderDetail = function (userId,$scope) {
        var msg ="";
		var cname=$('#custname').val();
		var email=$('#email').val();
	    var phone=$('#phone').val(); 
		var address=$('#address').val();  
		var zip=$('#zip').val();
		var country=$('#country').val(); 	
		var index=$('#add_more_id').val();

		//alert($('#OrdersDetailWidth'+index).val().toString().length);
		  $("#error").html('');
		  for(var ind=1;ind<=index;ind++)
		  {

			if(isNaN($('#OrdersDetailWidth'+ind).val()) || $('#OrdersDetailWidth'+ind).val()=='' ||$('#OrdersDetailWidth'+ind).val()==0)
			{
				
			msg +="Please fill valid width for row: "+ind;
			$('#error1').html(msg).fadeIn('slow');
			document.getElementById("OrdersDetailWidth"+ind).focus();
			return false;	
			}else{
			$('#error1').html(msg).hide();
			}

            if($('#OrdersDetailWidth'+index).val().toString().length > 3) 
            {
			msg +="Width should not be greater than 3 digits"+ind;
			$('#error1').html(msg).fadeIn('slow');
			document.getElementById("OrdersDetailWidth"+ind).focus();
			return false;

            }else{
			$('#error1').html(msg).hide();
			}
    

			if($('#OrdersDetailLength'+ind).val()=='' || isNaN($('#OrdersDetailLength'+ind).val() || $('#OrdersDetailLength'+ind).val()==0 ) )
			{
			msg +="Please fill valid length for row: "+ind;
			$('#error1').html(msg).fadeIn('slow');
			document.getElementById("OrdersDetailLength"+ind).focus();
			return false;	
			}else{
			$('#error1').html(msg).hide();
			}

			if($('#OrdersDetailLength'+index).val().toString().length > 3) 
            {
			msg +="Length should not be greater than 3 digits"+ind;
			$('#error1').html(msg).fadeIn('slow');
			document.getElementById("OrdersDetailWidth"+ind).focus();
			return false;

            }else{
			$('#error1').html(msg).hide();
			}

			if($('#OrdersDetailQuantity'+ind).val()=='' || isNaN($('#OrdersDetailQuantity'+ind).val())  )
			{
			msg +="Please specify quantity for row: "+ind;
			$('#error1').html(msg).fadeIn('slow');
			document.getElementById("OrdersDetailQuantity"+ind).focus();
			return false;	
			}else{
			$('#error1').html(msg).hide();
			}


			if($('#OrdersDetailProject'+ind).val()=='')
			{
			msg +="Please fill Order for Row: "+ind;
			$('#error1').html(msg).fadeIn('slow');
			document.getElementById("OrdersDetailProject"+ind).focus();
			return false;	
			}else{
			$('#error1').html(msg).hide();
			}
		}

			if($.trim(cname)=="" )
			{
			msg ="Please enter your name!";
			$('#error').html(msg).fadeIn('slow');
			document.getElementById("custname").focus();
			return false;
			}else{
			$('#error1').html(msg).hide();
			}
		

		

		if (address == "")
		{
		msg ="Please fill Address";
		$('#error').html(msg).fadeIn('slow');
		document.getElementById("address").focus();
		return false;	
		}else{
		$('#error').html(msg).hide();
		}
        
        if (phone == "" || !phone.toString().match(/^[-]?\d*\.?\d*$/))
		{
		msg ="Please fill the valid Phone number ! ";
		$('#error').html(msg).fadeIn('slow');
		document.getElementById("phone").focus();
		return false;	
		}else{
		$('#error').html(msg).hide();
		}

		if($.trim(email)=="" || !$.trim(email).toString().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
		{
		msg ="Please fill Valid Email !";
		$('#error').html(msg).fadeIn('slow');
		document.getElementById("email").focus();
		return false;
		}else{
		$('#error').html(msg).hide();
		}

		if (zip == "")
		{
		msg ="Please fill zip";
		$('#error').html(msg).fadeIn('slow');
		document.getElementById("zip").focus();
		return false;	
		}else{
		$('#error').html(msg).hide();
		}

		if (country == "")
		{
		msg ="Please select Country";
		$('#error').html(msg).fadeIn('slow');
		document.getElementById("country").focus();
		return false;	
		}else{
		$('#error').html(msg).hide();
		}
        $(".placeorder").attr('disabled',true); 
    var divs = angular.element(document.querySelectorAll('.rugImg'));
    var imgOld  = new Array();
	var imgNew  = new Array();
	//for
	[].forEach.call(divs, function(div) {
 
		imgOld.push($(div).attr('data-img-old'));	
		imgNew.push($(div).attr('data-img'));
	});
		imgOld = imgOld.join(',');
		imgNew = imgNew.join(',');
	
	
	 var content='';
	 var clrName = new Array();
	 var pile = new Array();
	 var sidesections = angular.element(document.querySelectorAll('.sidesection'));
	  [].forEach.call(sidesections, function(div) {
		content = $(div).children();
		clrName.push($(content[1]).text());
		pile.push($(content[3]).text());

       });

	 var clrNameStr = clrName.join(',');
	 var pileStr = pile.join(',');
	 var data = $("#orderform").serialize();

		 data+= "&imgOld="+imgOld;
		 data+= "&imgNew="+imgNew;
		 data+= "&clrName="+clrNameStr;
		 data+= "&pile="+pileStr;
		 data+= "&designname="+$scope.rugName;
		 data+="&userId="+userId;
         
		$http({
		method: 'POST',
		url:RESOURCES.USERS_API+'/getOrderDetails',
		data:data ,
		dataType:'json',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function(response){
			
			$scope.orderval=false;
			$scope.order_form=false;
			$scope.order_detail=true;
			$scope.clrNameString=clrNameStr;
			$scope.catalogName=response.data.catalogName;	
			$scope.designName=response.data.designName;
			$scope.oldColor=response.data.oldColor;
			$scope.newColors=response.data.newColor;
			$scope.newColorName=clrNameStr;
			$scope.textureName=response.data.textureName.replace(/&nbsp;/g,"");
			$scope.quality=response.data.order.Order.quality;
			$scope.sidemark=response.data.order.Order.sidemark;
			$scope.strikeoff=response.data.order.Order.strikeoff;
			$scope.orderDetails=response.data.orderDetails;	
			$scope.userData=response.data.user_data;
			$scope.rugPrice=response.data.rug_price;	
			$scope.orderData=response.data.order;
		});

		
};


service.orderConfirm = function (userId,$scope) {
		var textpngname='';//$('#textpng').val();
		$scope.orderloading=true;
	var imgStr  = new Array();
	$( ".dynamicimg" ).each(function() {
	imgStr.push($(this).attr('data-img'));	
	});
	imgStr = imgStr.join(','); 

	var pileStr  = new Array();
	$( ".pilename" ).each(function() {
	pileStr.push($(this).html());	
	});
	pileStr = pileStr.join(',');
    
       
       $http({
		method: 'POST',
		url:RESOURCES.USERS_API+'/placeOrder',
		data:{'imgStr':imgStr, 'pileStr':pileStr,'txtimg':textpngname,'userId':userId,'order':$scope.orderData,'order_price':$scope.rugPrice} ,

		}).then(function(response){
		$scope.order_confirm=true;
		$scope.orderloading=false;
		$scope.order_detail=false;
		var Obj=JSON.stringify(response.data); 
		var result= JSON.parse(Obj);
		$scope.orderFile=result.orderId;
		$('#orderid').val(result.orderId);
		});

};

service.zoomImage = function (userId,designId,$scope) {
 	//Get New Image
	var imgNew  = new Array();
	$( ".rugImg" ).each(function() {
	imgNew.push($(this).attr('data-img'));	
	});

	imgNew = imgNew.join(',');

	//Get Old Image
	var imgOld  = new Array();
	$( ".rugImg" ).each(function() {
	imgOld.push($(this).attr('data-img-old'));	
	});

	imgOld = imgOld.join(',');

	var query = { where:{
		imgNew:imgNew,
		imgOld:imgOld,
		userId:userId,
		change:$scope.change,
		designId:designId,
		shape:$("#current_shape").val(),
		textpng:''//$('#textpng').val()
		
	}};
    
    Zoom.findAll(query).then(function (response) {
    	
		var Obj=JSON.stringify(response); 
		var imgObj= JSON.parse(Obj);
		//$scope.zoomImage=imgObj[0].img;
		$scope.markHeight='100';
		$scope.markWidth='100';
		$scope.zoomLvl='2';
		$scope.src=imgObj[0].img;

		$scope.singlefbloader=false;
	});	
	
};

service.AddCart = function ($scope) {

 $('.loaded_cart').removeClass('active');

// for getting img attributes
// 0=>id, 1=>datasrcold, 2=>data-src, 3=>src, 4=>png image
var i=0;   
var img_src=new Array();
$( ".rugImg" ).each(function() { 
img_src.push($(this).attr('id')+'~'+$(this).attr('data-img-old')+'~'+$(this).attr('data-img')+'~'+$(this).attr('src')+'~'+$('#textpng').val());	
i++;
});

var imgArr = img_src.join('|');


// for getting clr attributes
//for color-name, pile-name, texture-name
var img_clr=new Array();
var content;
$( ".sidesection" ).each(function() { 
content = $(this).children();
img_clr.push($scope.rgb2hex($(content[0]).css('background-color'))+'~'+$(content[0]).attr('data-id')+'~'+$(content[0]).attr('data-value')+'~'+$(content[1]).html()+'~'+$(content[2]).html()+'~'+$(content[3]).html() );
});
var clrNameArr = img_clr.join('|');

var cartArrayPos = jQuery.inArray(imgArr,$scope.Cartimg1);
if(cartArrayPos == -1)
{
$scope.Cartimg1.push(imgArr);
$scope.Cartimg2.push(clrNameArr);
$('#message_cart').hide().html('<p class="alert alert-success success-cart">Design has been successfully added to shortlisted designs.</p>').fadeIn('slow');
} else {
$('#message_cart').hide().html('<p class="alert alert-warning warning-cart">This design has already been added to shortlisted designs.</p>').fadeIn('slow');
//$('li[data-pos="'+$cartArrayPos+'"]').addClass('active');
//console.log(cartArrayPos);
return false;	
}
 
    var textimage=$('#textpng').val();
	var data=$scope.Cartimg1[$scope.Cartimg1.length-1].split('|');
	var i = $('.loaded_cart').length;
	var classActive = (jQuery.inArray(imgArr,data) == -1) ? 'active' : '';		

	var img ='<li class="loaded_cart '+classActive+'" data-pos="'+$scope.pos+'"data-len="'+i+'">';		
		img += '<div class="rug_cart" ng-click="addActClass($event);">';	
		for(var i=0;i<data.length;i++)
		{
		var data_src=data[i].split('~');
		img +='<img height="130px;" width="87px;" style="position:absolute;" src="'+data_src[3]+'"/>';
		}
	    if(textimage !='')
	    {
	    img +='<img height="130px;" width="87px;" style="position:absolute;" src="'+$('#site_url').val()+'app/webroot/img/tmpimg/'+$('#UserId').val()+'/'+textimage+'"/>';	
	    }
		img +='</div>';	
	 	img +='<div class="check_cross"><img class="class_active_check_cart_cancel" ng-click="deleteCartImage($event)" src="img/clos.png">';	
		img +='<p>'+$('.rug_name').html()+'</p></div></li>';

	$('.add_cart_rugs').append($compile(img)($scope));
	$scope.changecart = true;
};

service.deleteCartImg = function ($event,$scope) {
	if(confirm("Are you sure"))
	{
		$($event.target).parent().parent().fadeOut('slow', function(){	

		$scope.Cartimg1.splice($(this).data('pos'),1);
		$scope.Cartimg2.splice($(this).data('pos'),1);
		$(this).remove();

		var i = 0;
		$( ".loaded_cart" ).each(function() {
		$( this ).attr( "data-pos",i );
		$( this ).attr( "data-len",i );
		i++;
		});
       //console.log(Cartimg1);

		if($('.loaded_cart').length == 0)
	    {	
	    $('#message_cart').html('<p class="alert alert-info">Your cart is empty.</p>').show();
	    }
		});
}
};

service.loadCartImg = function ($event,$scope) {
   if($(".loaded_cart.active").length==0)
		{
		alert('Please select a design.');
		return false;	
		}	

		var pos_img=$(".loaded_cart.active").attr("data-pos");
		var len_img=$(".loaded_cart.active").attr("data-len");

		var image='';
		var textr='';

	 	//for image
	 	// 0=>id,1=>datasrcold,2=>data-src,3=>src,4=>png image
		var data=$scope.Cartimg1[len_img].split('|');   
		
		
		for(i=0;i<data.length;i++)
		{	
		var img = data[i].split('~');	
		
	    image += '<img id="'+img[0]+'" imageonload class="dynamicimg rugImg" alt="" style="z-index:2" data-img-old="'+img[1]+'" data-img="'+img[2]+'" src="'+img[3]+'" ng-src="'+img[3]+'">';
	      var dat=img[2].split('_');
	    var designid=dat[0];
		}
      
		$(".rugImg").remove();
		$("#image_container").append($compile(image)($scope));

	  
	   //for texture

		var texture=$scope.Cartimg2[len_img].split('|'); 
		for(var i=0;i<texture.length;i++)
		{
		var text = texture[i].split('~');	
			
	    textr +='<li class="sidesection"><a class="clrsize" ng-click="logMouseIn($event);" style="background-color:#'+text[0]+'" data-id="'+text[1]+'" data-value="'+text[2]+'" href="javascript:;"></a><span class="clrname">'+text[3]+'</span><span class="txtrename">'+text[4]+'</span><span class="pilename">'+text[5]+'</span></li>';
		}

		$(".sidesection").remove();
		$(".colortexture").append($compile(textr)($scope));
		$('.rug_name').html($($event.target).children('p').html());
		$('#designId').val(designid);
		$(".cart_popup").hide();
		UndoRedo.setUndoRedo($scope);

};



service.getMultisetting = function (catalogId,$scope) {
		
		$(".rug-setting").addClass("setting_hover");
		 $('#get_setting').hide();
		//$('#myElement').off('hover');

		//hide button
		//HideZoomShapeRoom();
		$('#loading_image').attr('class','loader_img');
		$('#loading_image').html('<img src="img/loading-small.gif">');
		//$('.multi_popup').show();

		//Get Old and New Image
		var imgId  = new Array();
		var imgNew  = new Array();
		$( ".rugImg" ).each(function() {
		imgId.push($(this).attr('id'));	
		imgNew.push($(this).attr('data-img'));	
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
		var clrNameStr = clrName.join(',');
		var pileStr = pile.join(',');

		var query = { where:{
			imgId:imgId, 
			imgNew:imgNew, 
			catalogId:catalogId, 
			pile:pileStr, 
			clrName:clrNameStr
		
	    }};
    
    Multiset.findAll(query).then(function (response) {
    	$('#loading_image').html('');
    	$('#loading_image').attr('class','');

		var Obj=JSON.stringify(response); 
		var resultObj= JSON.parse(Obj);
		$scope.multiset_colors=resultObj[0].colors;
		$scope.multiset_newcolors=resultObj[0].newColors;
		$scope.multiset_pile=resultObj[0].pile;
		$scope.multiset_texture=resultObj[0].texture;
		$scope.multi_clrPltArr=$scope.clrPltArr;
        $scope.mult_select_value=$scope.defaultColor;
        $('#get_setting').show();
		
		
	});
};


service.ChangeMultisetting = function ($scope) {
  var pileArray = new Array();
      pileArray['Normal'] = '';
      pileArray['Low'] = 'Low';
      pileArray['High'] = 'High'; 

  //Get Image Name
  var imgOld  = new Array();
  $( ".rugImg" ).each(function() {
  imgOld.push($(this).attr('data-img-old')); 
  });
  imgOld = imgOld.join(',');


//Get All Changed Value
var setting = new Array();
var settingShow = new Array();
var changeDesign = false;
$('.multiCheckbox').each(function() 
{
   if($(this).is(':checked')) 
   {
   changeDesign = true; 
   var i = $(this).val();  
   setting.push($("#designId").val()+'_'+$("#current_shape").val()+'_'+$("#multiColor_"+i).val()+'_'+i+'_'+$("#multiTexture_"+i+" option:selected").text()+'_9.png');

   settingShow.push($("#multiColor_"+i).val()+'~'+$("#multiseting_selected_label_"+i).html()+'~'+$("#multiTexture_"+i).val()+'~'+$("#multiPile_"+i+" option:selected").text());

   } 
});

$scope.multisetting=!$scope.multisetting;
$(".rug-setting").removeClass("setting_hover"); 

  if(changeDesign)
  {
  //showImageLoader();
  $scope.facebookLoader=true;
  } else {
  $scope.changeProgress=false;
  return false;  
  }



var setting = setting.join(',');
var settingShow = settingShow.join(',');
var designId =$('#designId').val();
var curretShape =$('#current_shape').val();

    var query = { where:{
		imgOld:imgOld, 
		setting:setting, 
		settingShow:settingShow, 
		id:designId,
		currentShape:curretShape
		
	}};

    shuffleImage.findAll(query).then(function (response) {
    	$scope.changeProgress = true;
		var Obj=JSON.stringify(response); 
		var imgObj= JSON.parse(Obj);
		var allImgSplit = imgObj[0].img.split(',');
        var i=0;
        $scope.len=parseInt(imgObj[0].imgCount)+1;
       //console.log(allImgSplit);return false;
		angular.forEach(allImgSplit, function(image) {
			var imgSplit = allImgSplit[i].split('~');
			
		   $( '#'+imgSplit[0] )
			.attr('data-img',imgSplit[1])
			.attr('src','')
			.attr('ng-src','')
			.attr('src',imgObj[0].path+imgSplit[1])
			.attr('ng-src',imgObj[0].path+imgSplit[1]);
			

			//set color
		
			var obj = angular.element( $( "[data-id='" + imgSplit[0] + "']" ) );
			//console.log(obj);
			$(obj).css('background-color','#'+imgSplit[2]);
		    var objSib = $(obj).siblings();
			$($(objSib[0]).html(imgSplit[3]));
			$($(objSib[1]).html(imgSplit[4]));
			$($(objSib[2]).html(pileArray[imgSplit[5]]));

	        i++;	
	    });
         
          $scope.change=true;
    }).then(function(){
    	UndoRedo.setUndoRedo($scope);
    });

};


service.CartDesign = function ($catalogId,$designId,$scope) {
  ListDesign.find($catalogId).then(function (response) {
    
		var Obj=JSON.stringify(response); 
		var colorObj= JSON.parse(Obj);
		 //console.log(colorObj);
		$scope.designImages=(colorObj[0])?colorObj[0].rugId:colorObj.rugId;
        $scope.designid=$designId;
		$scope.slideit_show=true;
		$scope.designloader=false;
      });

};


service.SvgToPng = function ($userId,$img,$scope) {
	var query = { where:{
		userId:$userId, 
		data:$img
		}};
  GeneratePng.findAll(query).then(function (response) {
        
		var Obj=JSON.stringify(response); 
		var data= JSON.parse(Obj);
		
		$('div#image_container').after().append('<img id="'+data[0].textImageId+'" class="dynamicimg textpngImage" alt="" style="z-index: 2; visibility: visible;" src="http://www.rugstudioonline.com/img/tmpimg/'+$userId+'/'+data[0].textImageName+'">');
		$('#textpng').val(data[0].textImageName);
		$('#textImagepng').val(data[0].textImageId);
         
      }).then(function(){
    	UndoRedo.setUndoRedo($scope);
    });


};


service.safeApply = function ($scope, fn) {
             var phase = $scope.$root.$$phase;
             if (phase == '$apply' || phase == '$digest') {
                 if (fn && typeof fn === 'function') {
                     fn();
                 }
             } else {
                 $scope.$apply(fn);
             }
         };
return service;

});





