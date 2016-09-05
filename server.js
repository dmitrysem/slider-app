var http = require('http');
var fs = require("fs");
var url = require('url');

var server = http.createServer(function(req, res) {
    if (req.method !== 'GET') return res.end();

    var urlParsed = url.parse(req.url, true);

    switch (urlParsed.pathname) {
        case '/':
            sendFile('./index.html', res);
            break;
        case '/index.html':
        case '/app.js':
        case '/style.css':
            sendFile('.' + urlParsed.pathname, res);
            break;
        case '/sliderData':
            sendJSON(urlParsed.query.min, urlParsed.query.max, res);
            break;
        default:
            res.statusCode = 404;
            res.end('Page Not Found');
            break;
    }
}).listen(8080);

// ---

function sendFile(filePath, res) {
    var file = fs.createReadStream(filePath);
    file.pipe(res);

    file.on('error', function() {
        res.statusCode = 500;
        res.end('Server Error');
    });

    res.on('close', function() {
        file.destroy();
    });
}

function sendJSON(minValue, maxValue, res) {
    var json = JSON.stringify({
        value: randomInteger(+minValue, +maxValue)
    });
    console.log(json);

    res.setHeader('Content-Type', 'application/json');
    res.end(json);
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}