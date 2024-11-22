const express = require('express');
const helper = require('./helper');
const pokemon = require('./route/pokemon.route');
const user = require('./route/user.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/pokemon', pokemon);
app.use('/api/user', user);

app.get('/', function(request, response) {
    const responseString = helper.returnRandomString();
    
    response.send('Hello from the express server. It says: ' + responseString);
})

app.post('/', function(request, response) {

    response.send("This response is preventing the later API");

})

app.post('/', function(request, response) {

    response.send('Hello from the POST API in the Express server');
})

app.listen(3000, function() {
    console.log('Server started');
})

// const http = require('http');

// const server = http.createServer(function(request, response) {
//     response.writeHead(404, { 'Content-Type': 'text/plain' });
//     response.end('Server not found :(');
// });

// server.listen(3000, "127.0.0.1", function() {
//     console.log("Starting server...");
// })