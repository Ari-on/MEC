'use strict';

var MongoClient = require('mongodb').MongoClient;

var  express = require ('express');
var app = express();
var bodyParser = require('body-parser');

var serverPort = 8081;
app.use(bodyParser.json({limit: '50mb'}));


var url = "mongodb://127.0.0.1:27017/MEC";

MongoClient.connect(url, function (err, db) {
    if (err){
        console.log("Mongo Error",err);
    }
    app.db = db;
});


app.listen (serverPort,function () {
    console.log('server running on http://localhost:'+serverPort);
    console.log("##########################################");

});


var WebRoutes = require("./routes/ui-routes.js");
var webRoutes = new WebRoutes(app);
webRoutes.init();
