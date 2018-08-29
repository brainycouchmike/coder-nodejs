const http = require('http');
const fs = require('fs');
const port = 3000;

const dumpToString = (titleOrObject, objWithTitle) => (
    console.debug('dumpToString[' + titleOrObject.toString() + ']', undefined === titleOrObject ? 'undefined' : titleOrObject, undefined === objWithTitle ? 'undefined' : objWithTitle) ||
    '<div>' +
    '<h3>' + (undefined === objWithTitle ? 'DUMP' : titleOrObject) + ':</h3>' +
    '<pre>' +
    JSON.stringify(undefined === objWithTitle ? titleOrObject : objWithTitle)
        .replace(/(,)([0-9a-z"])/ig, '$1\n$2')
        .split(/[{}]/g)[1] +
    '</pre>' +
    '</div>'
);

const requestHandler = (request, response) => {
    // Log request in terminal
    console.info(
        'URL: ',
        request.headers['x-forwarded-proto'] + "://" +
        request.headers.host +
        request.url
    );

    // grab flat values from request
    // method 3
    const flat = Object.keys(request).reduce((obj, key) => {
        obj[key] = typeof request[key] != 'object' ? request[key] : 'object';
        return obj;
    }, {});
    // method 1 & 2
    // let flat = {};
    Object.keys(request)
        // method 1
        // .filter(key => typeof request[key] != 'object')
        // .forEach(key => flat[key] = request[key])
        // method 2
        // .forEach(key => flat[key] = typeof request[key] != 'object' ? request[key] : 'object')


    // response.setHeader('Content-Type', 'text/html');
    response.setHeader('X-Foo', 'bar');
    const filename = '.' + request.url;
    fs.readFile(filename, 'utf8', (err, data) => {
        console.log((err ? 'ERROR' : 'OK') + ': ' + filename);
        response.writeHead(err ? err.code : 200, { 'Content-Type': 'text/html' });
        response.end(err ? err : data);
    });
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened.', err);
    }

    console.log(`Server is listening on ${port}`);
});