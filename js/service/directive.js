// for design slider 
app.directive('slideit', function ($timeout,DesignService,$routeParams,$rootScope,$compile) {
  return {
	restrict: 'AE',
	transclude: true,
	replace: true,
	templateUrl:'views/design_slider.html',
	link: function (scope, elem, attrs) {
	       scope.$watch('designImages',function(newValue, oldValue){
	       	scope.designImages = newValue;
	       	scope.designid = $routeParams.param2;
	       	if(scope.designImages.length != 0){
	       		elem.ready(function() {
			         	elem.find('#cartSlider').bxSlider({
							slideWidth: 110,
							minSlides: 2,
							maxSlides: 4,
							slideMargin: 0,
							nextSelector: '#slider-next',
							prevSelector: '#slider-prev',
							nextText: '<img src="img/rug/arrow-next.png">',
							prevText: '<img src="img/rug/arrow-prev.png">',
							pager:false,
							onSliderLoad: function() { $('.bx-wrapper').addClass('design-wrapper'); $('.bx-wrapper').removeClass('bx-wrapper'); }
							});   
	            });
                
	       		}

	       },true);

	       
	 	}
	
  }
});

//for zoom
app.directive('zoomIn', function(){
    function link(scope, element, attrs){
       
       scope.$watch('src',function(newValue,oldValue){
			if(!newValue){
			element.hide();
			}else{
			element.show();
			}
       });
      var $ = angular.element;
      var original = $(element[0].querySelector('.original'));
      var originalImg = original.find('img');
      var zoomed = $(element[0].querySelector('.zoomed'));
      var zoomedImg = zoomed.find('img');

      var mark = $('<div></div>')
        .addClass('mark')
        .css('position', 'absolute')
        .css('height', scope.markHeight +'px')
        .css('width', scope.markWidth +'px')

      $(element).append(mark);

      element
        .on('mouseenter', function(evt){
          mark.removeClass('hide');

          var offset = calculateOffset(evt);
          moveMark(offset.X, offset.Y);
        })
        .on('mouseleave', function(evt){
          mark.addClass('hide');
        })
        .on('mousemove', function(evt){
          var offset = calculateOffset(evt);
          moveMark(offset.X, offset.Y);
        });

      scope.$on('mark:moved', function(event, data){
        updateZoomed.apply(this, data);
      });

      function moveMark(offsetX, offsetY){
        var dx = scope.markWidth, 
            dy = scope.markHeight, 
            x = offsetX - dx/2, 
            y = offsetY - dy/2;

        mark
          .css('left', x + 'px')
          .css('top',  y + 'px');

        scope.$broadcast('mark:moved', [
          x, y, dx, dy, originalImg[0].height, originalImg[0].width
        ]);
      }

      function updateZoomed(originalX, originalY, originalDx, originalDy, originalHeight, originalWidth){
        var zoomLvl = scope.zoomLvl;
        scope.$apply(function(){
          zoomed
            .css('height', zoomLvl*originalDy+'px')
            .css('width', zoomLvl*originalDx+'px');
          zoomedImg
            .attr('src', scope.src)
            .css('height', zoomLvl*originalHeight+'px')
            .css('width', zoomLvl*originalWidth+'px')
            .css('left',-zoomLvl*originalX +'px')
            .css('top',-zoomLvl*originalY +'px');
        });
      }

      var rect;
      function calculateOffset(mouseEvent){
        rect = rect || mouseEvent.target.getBoundingClientRect();
        var offsetX = mouseEvent.clientX - rect.left;
        var offsetY = mouseEvent.clientY - rect.top;  

        return { 
          X: offsetX, 
          Y: offsetY
        }
      }

      attrs.$observe('ngSrc', function(data) {
        scope.src = attrs.ngSrc;
      }, true);


      attrs.$observe('zoomLvl', function(data) {
        scope.zoomLvl =  data;;
      }, true);
    }

    return {
      restrict: 'EA',
     /* scope: {
      	
        markHeight: '@markHeight',
        markWidth: '@markWidth',
        src: '@src', 
        zoomLvl: "@zoomLvl"
      },*/
      template: [
        '<div class="original">',
          '<img class="dynamicimg" ng-src="{{src}}" src="{{src}}"/>',
        '</div>',
        '<div class="zoomed ">',
          '<img class="dynamicimg"/>',
        '</div>'
      ].join(''),
      link: link
    };
  });
//ends here


app.directive('loaderOrder', function () {
      return {
        restrict: 'A',
        template: '<div  class="orderdetails loaderorder" ><img src="https://s3.amazonaws.com/images.rugstudioonline.com/strikeoff-loader.gif"></div>',
        //	template: 'loading...',
        link: function (scope, element, attr) {
        	
        scope.$watch('orderloading', function (val) {
     
	          if (val){
	              $(element).show();
	          }else{
	              $(element).hide();
	          }
        });
        }
      }
 });

app.directive('loader', function () {
      return {
        restrict: 'A',
        template: '<div class="facebook_blockG" id="blockG_1"></div><div class="facebook_blockG" id="blockG_2"></div><div class="facebook_blockG" id="blockG_3"></div>',
        //	template: 'loading...',
        link: function (scope, element, attr) {
        	
        scope.$watch('facebookLoader', function (val) {
     
	          if (val){
	              $(element).show();
	          }else{
	            var img=1;
	            var images = angular.element(document.querySelectorAll('.dynamicimg'));
				$('.dynamicsect img').on('load',function(){ 
					if(this.complete){
                    //console.log(img);
					if(img==scope.len){ 
					$(element).hide();
					scope.changeProgress=false;
					img=1;
					} 
					img++;
					} 

				});
	          }
        });
        }
      }
 });

app.directive('singleLoader', function () {
      return {
        restrict: 'A',
        template: '<div class="facebook_blockG" id="blockG_1"></div><div class="facebook_blockG" id="blockG_2"></div><div class="facebook_blockG" id="blockG_3"></div>',
        //	template: 'loading...',
        link: function (scope, element, attr) {
        	
        scope.$watch('singlefbloader', function (response) {
              
			if (response){
			$(element).show();
			}else{
			if(scope.imageId){
				$('#'+scope.imageId).on('load',function(){
				if(this.complete){
				scope.changeProgress=false;
				$(element).hide();
				}
				});
			}else{
			    $(element).hide();
			}


			}
				 
			       
	    });
	              
	    }
       
     }
      
 });


/****************************** Svg text **********************************/

// for svg object 
app.directive('svgobject', function ($timeout,$rootScope,$compile,$parse) {
  return {
	restrict: 'AE',
	transclude: true,
	replace: true,
	templateUrl:'views/text_svg.svg',
	link: function (scope, elem, attrs,template) {
        
		 //for by default rotation value
		    $compile(elem.contents())(scope);
			var textObj=SvgFrame();
			var rotation=scope.textslider;
			$(textObj).attr('transform','rotate('+rotation+' 0,20)');  
		
         // show text on rug

	     scope.$watch('svg_text',function(newValue, oldValue){
           InsertTextSvg(newValue);
         },true);

          //apply the fonts on change on written text

		 scope.$watch('font_familiy',function(newValue, oldValue){
			var textObj=SvgFrame();
			$(textObj).css("font-family", newValue);
          },true);  
          
          //apply the fonts size on change on written text

		 scope.$watch('text_size',function(newValue, oldValue){
			var textObj=SvgFrame();
			var fontSize=newValue;
			var tspan=$(textObj).children();
			if(tspan.length>1)
			{
			var y=-(fontSize*tspan.length)/2;
			$(tspan[0]).attr('y',y);
			} 

			$(textObj).attr("font-size",newValue);
          },true); 
        

          scope.$watch('text_bold',function(newValue, oldValue){
			var textObj=SvgFrame();
			var font = (newValue) ? 'bold' : 'normal';
			$(textObj).css("font-weight", font);

          },true);

		  scope.$watch('text_italic',function(newValue, oldValue){
			 var textObj=SvgFrame();
			 var font = (newValue) ? 'italic' : 'normal';
			 $(textObj).css("font-style", font);

			},true);

          scope.$watch('textslider',function(newValue, oldValue){
			 var textObj=SvgFrame();
			 var rotation=newValue;
             $(textObj).attr('transform','rotate('+rotation+' 0,20)');
			},true);


    
		//For touch Device
		document.getElementById("fontSel").addEventListener("touchmove",function(event) {
		event.preventDefault();
		x1 = event.changedTouches[0].clientX;
		y1 = event.changedTouches[0].clientY;
		C=document.getElementById('transformElement');
		moveIt(event.changedTouches[0]); 
		}, false);


	document.getElementById("fontSel").addEventListener("touchmove",function(event) {
	 event.preventDefault();
	 x1 = event.changedTouches[0].clientX;
 	 y1 = event.changedTouches[0].clientY;
 	 C=document.getElementById('transformElement');
 	 moveIt(event.changedTouches[0]); 
	}, false);	

	var x1,y1,C;
		  elem.find('#fontSel').bind('click', function(evt) {
		  	
		  	   if(navigator.userAgent.indexOf("Firefox") != -1 ||navigator.userAgent.indexOf("Safari") != -1){
	            
			    //if(evt.detail=='2')
				//{
				startMove(evt);
				changeCursor('move');
				
				document.getElementById('fontSel').addEventListener('click', function() {
				changeCursor('text');
				endMove();
				}, false);
				//}

			    }else{

				startMove(evt);
				changeCursor('move');
				
				document.getElementById('fontSel').addEventListener('click', function() {
					
				changeCursor('text');
				endMove();
				}, false);
				
				}
		 });


		  elem.find('#fontSel').bind('ng-mouseup', function(evt) {
              endMove();
		  });
		  
          scope.$watch(attrs.content, function() {
            elem.html($parse(attrs.content)(scope));
            $compile(elem.contents())(scope);
          }, true);

		function startMove(evt)
		{
		x1 = evt.clientX;
		y1 = evt.clientY;

		C=document.getElementById('transformElement');
		elem.find('#fontSel').bind("ng-mouseleave","moveIt(evt)");
		}
        
        

        function endMove(){
			document.documentElement.setAttributeNS(null, "ng-mouseleave",null);
			C=document.getElementById('transformElement');
			//trans=document.getElementById('translate');
			//trans.value=C.getAttributeNS(null, "transform");
            

			if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0){
			$compile(C.setAttributeNS(null, "ng-dblClick",'bindDrag(event)'))(scope);
			}else{
			$compile(C.setAttributeNS(null, "ng-click",'bindDrag(event)'))(scope);
			}
        }
         

		//Function Start Drag
		function moveIt(evt){

			translation = C.getAttributeNS(null, "class").slice(10,-1).split(' ');
			sx = parseInt(translation[0]);
			sy = parseInt(translation[1]);
		 	
			DragTarget = document.getElementById('fontSel');
			//---reference point to its respective viewport--
			Pnt = DragTarget.nearestViewportElement.createSVGPoint();
			Pnt.x = evt.clientX;
			Pnt.y = evt.clientY;
			//---elements in different(svg) viewports---
			var sCTM = DragTarget.nearestViewportElement.getScreenCTM();
			Pnt = Pnt.matrixTransform(sCTM.inverse());

			C.setAttributeNS(null, "transform", "translate(" + (Pnt.x-30) + " " + (Pnt.y-30) + ")");
			C.setAttributeNS(null, "class", "translate(" + (Pnt.x-30) + " " + (Pnt.y-30) + ")");

			x1 = evt.clientX;
			y1 = evt.clientY;
		}

	     scope.bindDrag=function(evt){
				
				console.log(evt);
				if(navigator.userAgent.indexOf("Firefox") != -1 ||navigator.userAgent.indexOf("Safari") != -1){
				if(evt.detail=='2')
				{
				startMove(evt);
				changeCursor('move');

				document.getElementById('fontSel').addEventListener('click', function() {
				changeCursor('text');
				endMove();
				}, false);
				}

				}else{

				startMove(evt);
				changeCursor('move');

				document.getElementById('fontSel').addEventListener('click', function() {
				changeCursor('text');
				endMove();
				}, false);

				}
		}


		function changeCursor(cursor)
		{

			var tspan=$("#fontSel").children();
			for(var i=0;i<tspan.length;i++)
			{
			$(tspan[i]).css('cursor',cursor);
			}
		}
           
          function SvgFrame(){	 
				var text=elem.find('#fontSel');
				 return text;
          }



	      function InsertTextSvg (enterTxt) {
	      	 
				if(enterTxt!=''){
					scope.svgtext=false;
					var str ='';
                    var fontSize=scope.text_size;
					var textObj=SvgFrame();
					       str = enterTxt.split('\n');
					
					// We delete the old children
					while (textObj[0].firstChild) {

					textObj[0].removeChild(textObj[0].firstChild);
					}

					textObj.textContent='';
					for(var i=0;i<str.length;i++){
	                var tspan=document.createElementNS('http://www.w3.org/2000/svg','tspan');
					tspan.setAttribute('x',0);
					tspan.setAttribute('dy','1.2em');
					//Set for Virtual Alignment
					if(i==0 && str.length>1)
					{
					var y=-(fontSize*str.length)/2;
					tspan.setAttribute('y',y);
					}
					tspan.textContent=str[i];
					$(textObj).append(tspan);
					}

			    }
		   }

  }
}

});