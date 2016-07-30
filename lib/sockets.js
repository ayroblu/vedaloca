// sockets.js
var socketio = require('socket.io')

module.exports.listen = function(app){
  io = socketio.listen(app)
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('chat progress', function(msg){
      console.log('progress: ' + msg);
    });
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
  //users = io.of('/users')
  //users.on('connection', function(socket){
  //    socket.on ...
  //})

  return io
}
