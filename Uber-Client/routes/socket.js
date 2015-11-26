/**
 * Created by Rushil on 11/25/2015.
 */
var socketio = require('socket.io');

var io;

module.exports.listen = function(app){
    io = socketio.listen(app);

    io.on('connection', function(socket){
        console.info('New client connected (id=' + socket.id + ').');
        //socket.handshake.session.socketId = socket.id;
        //console.log(socket.handshake.session);
        //socket.emit('chat message', {userID: socket.handshake.session.socketId});
        // When socket disconnects, remove it from the list:
        socket.on('disconnect', function () {
                //socket.handshake.session.socketId = null;
                console.info('Client gone (id=' + socket.id + ').');
            }
        );

        socket.on('join', function (data) {
            console.info('Join: ',data.email);
            socket.join(data.email); // We are using room of socket io
        });
    });

    return io;
};

exports.onInformationretrieved = function(userID){
    io.sockets.in(userID).emit('new_msg', {msg: 'hello'});
};