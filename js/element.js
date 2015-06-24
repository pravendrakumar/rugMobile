window.onload = function(e) 
{
   alert('call');
     // for change attribute
  if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0){
       var text=document.getElementById("fontSel").getAttribute("class");
      console.log(getInternetExplorerVersion());
      document.getElementById("fontSel").setAttributeNS(null,"ondblclick","bindDrag(evt)");
      //console.log(document.getElementById("fontSel").getAttribute("onclick"));
     }else{
     
     document.getElementById("fontSel").setAttributeNS(null,"onclick","bindDrag(evt)");
     console.log(document.getElementById("fontSel"));
     }

	//For touch Device
	document.getElementById("fontSel").addEventListener("touchmove",function(event) {
	 event.preventDefault();
	 x1 = event.changedTouches[0].clientX;
 	 y1 = event.changedTouches[0].clientY;
 	 C=document.getElementById('transformElement');
 	 moveIt(event.changedTouches[0]); 
	}, false);

};


//Function Change Cursor
function changeCursor(cursor)
{
	var tspan=$("#fontSel").children();
	for(var i=0;i<tspan.length;i++)
	{
	$(tspan[i]).css('cursor',cursor);
	}
}

//Function bind Drag on double click
function bindDrag(evt)
{
    
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


function startMove(evt)
{	 
x1 = evt.clientX;
y1 = evt.clientY;
C=document.getElementById('transformElement');
document.documentElement.setAttribute("onmousemove","moveIt(evt)");
}


//Function Start Drag
function moveIt(evt)
{
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


//Function End Drag
function endMove()
{
document.documentElement.setAttributeNS(null, "onmousemove",null);
C=document.getElementById('transformElement');
//trans=document.getElementById('translate');
//trans.value=C.getAttributeNS(null, "transform");


 if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0){
     C.setAttributeNS(null, "ondblclick",'bindDrag(evt)');
     }else{
      C.setAttributeNS(null, "onclick",'bindDrag(evt)');
     }


}

// function for testing

function getInternetExplorerVersion()
{
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  else if (navigator.appName == 'Netscape')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}