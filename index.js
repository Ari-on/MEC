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

// app.use((req, res, next) => {
//     const error = new Error('Not Found!');
//     error.status = 404;
//     next(error);
// });
//
//
// app.use((error, req, res, next) => {
//     if (error) {
//         res.status(error.status || 500);
//         res.json({
//             error: {message: error.message}
//         });
//     } else{
//         next();
//     }
// });

var WebRoutes = require("./routes/ui-routes.js");
var webRoutes = new WebRoutes(app);
webRoutes.init();

app.use(function(req, res, next){
    // res.status(404);

    // respond with json
    if (req.accepts('json')) {
        res.status(404).send({Problem_Details: {
                "type": "string",
                "title": "string",
                "status": 404,
                "detail": "Page Not Found",
                "instance": "string"
            }});
        // return;
    }
});