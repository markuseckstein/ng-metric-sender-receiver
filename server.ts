declare var require, __dirname;

import {MetricRelayer} from './metric-relayer';

const relayer = new MetricRelayer('http://localhost:8125');

let app = require('http').createServer(handler)
let io = require('socket.io')(app);
let fs = require('fs');

app.listen(8124);

function handler(req, res) {
    fs.readFile(__dirname + '/www/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function (socket) {
    console.log(`Client connected`, socket);
    socket.on('statsc', function (data) {
        console.log(`Incoming data:`, data);
        relayer.receive(data);
    });
});


