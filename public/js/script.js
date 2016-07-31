// This example uses the Google Maps JavaScript API's Data layer
// to create a rectangular polygon with 2 holes in it.

var controls = document.querySelector('.controls')
var sControls;
var data;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: -36.844784, lng: 174.758700},
  });

  getData(map);
  sControls = handleRangeSliders(controls)
  controls.querySelector('.hideControl').onclick = function(){
    var showing = controls.classList.toggle('show');
    this.innerText = showing ? "Hide" : "Show"
  }
}
function getData(map){
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    var d = JSON.parse(this.responseText);
    d.forEach(row=>{
      var coords = JSON.parse(row.polygon.replace(/'/g,'"'));
      coords = coords.map(ll=>{
        return new google.maps.LatLng(ll[1],ll[0])
      });
      row.polygon = coords;
      
      drawPolygon(row, map);
    })
    data = d;
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
function drawPolygon(row, map){
  var cc = row.polygon;

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
  });
  // STEP 5: Listen for when the mouse stops hovering over the polygon.
  google.maps.event.addListener(polygon, 'mouseout', function (event) {
    this.setOptions({
      //strokeColor: '#ff0000',
      fillColor: getColour(row.val)
    });
    infoWindow.close(map);
  });
}
function drawInfoWindow(row, map, cc){
  var featureData = {
    oid: row.MB2013
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
    s.on('slide', setColours);
    slider.parentElement.style.paddingBottom = "50px"
    return {el: slider, slider: s};
  });
}
function getColour(percent){
  if (percent> 1){
    percent = 1;
  }else if(percent < 0){
    percent = 0;
  }
  var g = percent*255;
  var r = (1-percent)*255
  return `rgb(${r}, ${g}, 50)`
}

function setColours(){
  var sliderVals = sControls.map(s=>{
    s.s.get();
  });
  var sum = sliderVals.reduce((p, v)=>{
    return p + v;
  }, 0);

  //var keys = [
  //  'Median_Age_of_Community', 'Educational_Achievement', 'Access_to_Cycle_Ways'
  //, 'Access_to_Public_Transport', 'Cafe_Culture', 'Nightlife'
  //, 'Schools', 'Average_Rental_Price', 'Average_Sale_Price'
  //]
  var keys = [
    'Educational_Achievement', 'Access_to_Public_Transport', 'Cafe_Culture'
  ];
  data.forEach(row=>{
    if (sum > 0){
      row.val = keys.reduce((p, v, i)=>{
        return p + row[v] * sliderVals[i] / 4;
      }, 0)/(sum/4)/10;
    } else {
      row.val = 1;
    }

    polygon.setOptions({
      fillColor: getColour(row.val)
    });
  });
}
