var express = require('express');
var router = express.Router();
var async = require('async');
var fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veda Loca'});

});
router.get('/data', function(req, res, next) {
  fetch('https://koordinates.com/services/query/v1/vector.json?key=015972f8788d4b738f3576eb02d77c9a&layer=8578&x=174.758700&y=-36.844784&max_results=100&radius=10000&geometry=true&with_field_names=true').then(res=>{
    if (res.ok){
      return res.json()
    } else {
      throw new Error('not ok!');
    }
  }).then(jso=>{
    res.json(jso);
  }).catch(e=>{
    console.error('Error:', e)
    res.status(400).json({err: e});
  })
});
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Socket.IO Chat' });
});

module.exports = router;
