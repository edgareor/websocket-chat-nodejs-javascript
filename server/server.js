const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

module.exports.main = () => {

    const app = express();
    let server = http.createServer(app);

    app.use(express.static('../public'));

    module.exports.io = require('socket.io')(server);
    require('./sockets/socket');

    server.listen(8186, (err) => {
        if (err) throw new Error(err);
        console.log(`Servidor corriendo en puerto ${8186}`);
    });
}