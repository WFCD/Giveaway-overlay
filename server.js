var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var fs = require('fs');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use( bodyParser.json() );
app.listen(80);

app.post('/data', function(req,res){
    console.log(req.body);
	fs.writeFile('data.json', JSON.stringify(req.body));
	console.log("File written");
});