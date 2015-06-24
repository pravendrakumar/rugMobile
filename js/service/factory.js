//making factory
app.factory('User', function (DS) {
  return DS.defineResource('login');

});

app.factory('GeneratePng', function (DS) {
  return DS.defineResource('textChangePng');

});
//for logout
app.factory('UserLog', function (DS) {
  return DS.defineResource('logout');

});

//for get design list 
app.factory('ListDesign', function (DS) {
  return DS.defineResource('cartDesign');

});

//for zoom
app.factory('Zoom', function (DS) {
  return DS.defineResource('zoomImage');

});

//for zoom
app.factory('Multiset', function (DS) {
  return DS.defineResource('getMultisetting');

});

//for login page  slider iamge
app.factory('Image', function (DS) {
  return DS.defineResource('sliderImage');

});

//for storeinfo of loggedin user
app.factory('UserService', [function() {
  var sdo = {
    isLogged: false,
    username: '',
    userId: ''
  };
  return sdo;
}]);

//for catalogs
app.factory('Catalog', function (DS) {
  return DS.defineResource('findCatalog');
});

//for catalogs
app.factory('Design', function (DS) {
  return DS.defineResource('findDesign');
});

//for edit design
app.factory('editDesign', function (DS) {
  return DS.defineResource('editRug');
});

//for edit design get all colors data
app.factory('getColor', function (DS) {
  return DS.defineResource('getColorPalette');
});

//for edit design get color data on change color name
app.factory('getSinglePalette', function (DS) {
  return DS.defineResource('getSingleColorPalette');
});

//for edit design get color data on change color name
app.factory('colorChange', function (DS) {
  return DS.defineResource('changeColor');
});

//for edit design get color data on change change texture
app.factory('textureChange', function (DS) {
  return DS.defineResource('changeTexture');
});

//for change shape of the rug
app.factory('shapeChange', function (DS) {
  return DS.defineResource('changeShape');
});

//for shuffle the images 
app.factory('shuffleImage', function (DS) {
  return DS.defineResource('multisetting');
});

//for shuffle the images 
app.factory('pdfSave', function (DS) {
  return DS.defineResource('savePdf');
});


app.factory('shuffleFact', function () {
var factory = {};  

factory.shuffle = function(arr) {
  for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr;
};
return factory;

});

//for Insert text slider

app.factory('uiSliderConfig', function ($log) {
  return {
    start: function (event, ui) { $log.info('Slider start'); },
    stop: function (event, ui) { $log.info('Slider stop'); }
  };
});


// for generate new  UUID  of drag element
app.factory('uuid', function() {
    var svc = {
        new: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        empty: function() {
          return '00000000-0000-0000-0000-000000000000';
        }
    };

    return svc;
});

