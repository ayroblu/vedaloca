// This example uses the Google Maps JavaScript API's Data layer
// to create a rectangular polygon with 2 holes in it.

var controls = document.querySelector('.controls')
function initMap() {
  try{
    var map = new google.maps.Map(document.getElementById('map'), {
      //zoom: 5,
      //center: {lat: -0, lng: 0},
      zoom: 14,
      center: {lat: -36.844784, lng: 174.758700},
    });

    getData(map);
    var sliders = handleRangeSliders(controls)
    controls.querySelector('.hideControl').onclick = function(){
      var showing = controls.classList.toggle('show');
      this.innerText = showing ? "Hide" : "Show"
    }
  }catch(err){
    console.log(err);
  }
}
function getData(map){
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    var d = JSON.parse(this.responseText);
    console.log(this.reponseText, d);
    d.forEach(row=>{
      var coords = JSON.parse(row.polygon.replace(/'/g,'"'));
      coords = coords.map(c=>{
        var cc = c.map(ll=>{
          return new google.maps.LatLng(ll[1],ll[0])
        })

        //drawPolygon(cc, map);

        return cc;
      });
      row.polygon = coords;
      
      drawPolygon(row, map);
    })
    //d = d.vectorQuery.layers;
    //Object.keys(d).forEach(layer=>{
    //  d[layer].features = d[layer].features.map(item=>{
    //    item.geometry.coordinates = item.geometry.coordinates.map(c=>{
    //      var cc = c.map(ll=>{
    //        return new google.maps.LatLng(ll[1],ll[0])
    //      })

    //      //drawPolygon(cc, map);

    //      return cc;
    //    });
    //    return item;
    //    //console.log(JSON.stringify(co));
    //    //var marker = new google.maps.Marker({
    //    //  position: co[0][0],
    //    //  map: map,
    //    //  title: 'Hello World!'
    //    //});
    //  });
    //  d[layer].features.map(item=>{
    //    drawPolygon(item, map);
    //  });
    //});
  };
  xhr.open('POST', '/api/data');

  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  //var o = {
  //  ne: {
  //    lat: map.getBounds().getNorthEast().lat()
  //  , lng: map.getBounds().getNorthEast().lng()
  //  }
  //, sw: {
  //    lat: map.getBounds().getSouthWest().lat()
  //  , lng: map.getBounds().getSouthWest().lng()
  //  }
  //}
  xhr.send(JSON.stringify({viewport: null}));
}
var popup = document.querySelector('.popup');
function drawPolygon(row, map){
  var cc = row.polygon;
  //if (co.length !== 1)
  //  console.log('coords = 1: ',co.length);

  var polygon = new google.maps.Polygon({
      map: map,
      paths: cc,
      strokeColor: '#ff0000',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: '#ff0000',
      fillOpacity: 0.5
  });

  var infoWindow = drawInfoWindow(row, map, cc)

  polygon.setOptions({
    fillColor: '#0000ff'
  });
  
  polygonClick(row, map, polygon);
  polygonShowPopup(row, map, polygon, infoWindow);
}
function polygonClick(row, map, polygon){
  google.maps.event.addListener(polygon, 'click', function (event) {
      //alert('clicked polygon!');
  });
}
function polygonShowPopup(row, map, polygon, infoWindow){
  // STEP 4: Listen for when the mouse hovers over the polygon.
  google.maps.event.addListener(polygon, 'mouseover', function (event) {
      // Within the event listener, "this" refers to the polygon which
      // received the event.
      this.setOptions({
          strokeColor: '#00ff00',
          fillColor: '#00ff00'
      });

      infoWindow.open(map);

      var iwOuter = document.querySelector('.gm-style-iw');

      var iwBackground = iwOuter.previousElementSibling;

      // Remove the background shadow DIV
      Object.assign(iwBackground.children[1].style, {
        display: 'none'
      })
      Object.assign(iwBackground.children[3].style, {
        display: 'none'
      })
      Object.assign(iwBackground.children[0].style, {
        display: 'none'
      })
      Object.assign(iwBackground.children[2].style, {
        display: 'none'
      })
      Object.assign(iwOuter.parentElement.parentElement.style, {
        pointerEvents: 'none'
      })
      var iwCloseBtn = iwOuter.nextElementSibling;

      Object.assign(iwCloseBtn.style, {
        display: 'none'
      })

      Object.assign(popup.style,{
        //top: 
      });
      //popup.classList.remove('hidden');
  });
  // STEP 5: Listen for when the mouse stops hovering over the polygon.
  google.maps.event.addListener(polygon, 'mouseout', function (event) {
      this.setOptions({
          strokeColor: '#ff0000',
          fillColor: '#ff0000'
      });
      infoWindow.close(map);
      //popup.classList.add('hidden');
  });
}
function drawInfoWindow(row, map, cc){
  var featureData = {
    oid: row.meshid
  //, mid: feature.properties.MB2013
  //, aid: feature.properties.AU2013
  , name: row.meshname
  //, nameb: feature.properties.UA2013_NAM
  //, namec: feature.properties.TA2013_NAM
  //, area: (feature.properties.LAND_AREA*10000).toFixed(0) + " square metres (land)"
  }
  var dataText = `
    <div class="popupData">
      <h2>${featureData.name}</h2>
      <p>id: ${featureData.oid}</p>
    </div>
  `
  var infoWindow = new google.maps.InfoWindow({
    content: dataText
  });
  var bounds = new google.maps.LatLngBounds();
  cc.forEach(c=>bounds.extend(c))
  infoWindow.setPosition(bounds.getCenter());
  return infoWindow
}
function handleRangeSliders(parent){
  var sliders = Array.from(parent.querySelectorAll('.slider'));
  return sliders.map(slider=>{
    var s = noUiSlider.create(slider, {
      start: [0],
      step: 1,
      range: {
        'min': [0],
        'max': [4],
      },
      pips: {
        mode: 'values',
        values: [0, 4],
        density: 25
      }
    });
    slider.parentElement.style.paddingBottom = "50px"
    return {el: slider, slider: s};
  });
}

