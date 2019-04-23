const mongoose = require('mongoose');
const config = require('./db/db');

var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users= {};
const PORT= process.env.PORT || 3000
server.listen(PORT, function () {
    console.log('Listening on port 3000');
});

const registrationRoute = require('./routes/registrationRoute');
const loginRoute = require ('./routes/loginRoute');
const qrRoute = require ('./routes/qrcodeRoute')(io, users);

const jwt = require('jsonwebtoken');

const cors=require('cors');
const bodyParser =require('body-parser');


mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

/*Configuring middleware*/

app.use(bodyParser.json())
app.use(cors());
app.use('/api/register', registrationRoute);
app.use('/api/login', loginRoute);
app.use('/api/qrcode',qrRoute);



io.on('connection', (socket) => {
    console.log("New client is connected with socket id: " + socket.id);
    socket.on('disconnect', function(){
        console.log("client is disconnected");
    });

    socket.on('set-username', (username) => {
        users[username] = socket.id;
        console.log("Users");
        console.log(users);
    });

    socket.on('Message', (data) => {
        console.log("Message received: ", data);
        var result = data.from + ' sent you ' + data.message;
        io.sockets.in(users[data.toID]).emit('Message', {event:'regenerate'})
        // users[data.toID].emit('receivedMessage', data)
        //io.emit('Message', data);
    });
});

