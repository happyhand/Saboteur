//// === Http ===
const Client = require('./model/Client.js');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    let clientClass = require('./model/Client.js');
    new clientClass(socket);
});

http.listen(6699, function () {
    console.log('Server start on *:6699');
    let dbService = require('./model/core/DBService.js').getInstance();
    dbService.onInit();
    let lobby = require('./model/Lobby.js').getInstance();
    lobby.setServer(io);
});

// http.listen(9453, function () {
//     console.log('Server start on *:9453');
//     let lobby = require('./model/Lobby.js').getInstance();
//     lobby.setServer(io);
// });
//// === Https ===
// let app = require('express')();
// let fs = require('fs');
// let config = {
//     key: fs.readFileSync('privatekey.pem'),
//     cert: fs.readFileSync('certificate.pem')
// }
// let server = require('https').createServer(config, app); //// const server = require('https').Server(app)
// let io = require('socket.io').listen(server); //// const io = require('socket.io')(server)

// server.listen(6699, function () {
//     console.log('Server start on *:6699');
//     let lobby = require('./model/Lobby.js').getInstance();
//     lobby.setServer(io);
// });

// io.on('connection', (socket) => {
//     let clientClass = require('./model/Client.js');
//     new clientClass(socket);
    
//     // var clientIp = socket.request.connection.remoteAddress;
//     // console.log(clientIp);
// });