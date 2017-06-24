declare var require, __dirname;

const listenPort = 8124;
const statsDHost = 'localhost';
const statsDPort = 8125;

import {MetricRelayer} from './metric-relayer';

const statsDRelayer = new MetricRelayer(`${statsDHost}:${statsDPort}`);

let app = require('http').createServer(handler)
let io = require('socket.io')(app);
let fs = require('fs');

app.listen(listenPort);
console.log(`ng-metric-receiver server websocket listening on port ${listenPort}`);

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
        console.log(`Incoming data, relaying to ${statsDHost}:${statsDPort}`, data);
        statsDRelayer.receive(data);
    });
});


