var express = require('express');
var router = express.Router();
var async = require('async');
try{
  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host     : '127.0.0.1',
      user     : 'root',
      password : 'vidaloca123!',
      database : 'vidaloca'
    },
    pool: {
      min: 1,
      max: 7
    }
  });

  router.post('/data', function(req, res, next) {
    var viewport = req.body.viewport;
    //var latlng = req.body.latlng;
    //var lat0 = map.getBounds().getNorthEast().lat();
    //var lng0 = map.getBounds().getNorthEast().lng();
    //var lat1 = map.getBounds().getSouthWest().lat();
    //var lng1 = map.getBounds().getSouthWest().lng();
    //if (!latlng || !latlng.lat || !latlng.lng){
    if (!viewport){
      //res.status(400).json({err:'No Lat long provided'});
      //return;
    }
    var center = {lat: -36.844784, lng: 174.758700};
    knex.select().from('masterrating').
      //whereBetween('lat', [viewport.sw.lat, viewport.ne.lat]).
      //whereBetween('lng', [viewport.sw.lng, viewport.ne.lng]).
      whereNotNull('center_lat').
      whereNotNull('center_long').
      orderByRaw(`SQRT(POW(center_lat - ${center.lat}, 2)+ POW(center_long - ${center.lng}, 2))`).
      limit(4000).then(function(rows){
        res.json(rows);
      }).catch(err=>{
        res.status(400).json(err);
      });
  });
} catch (err) {
  console.log('knex not openable');
}
module.exports = router;
