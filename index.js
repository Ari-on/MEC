'use strict';

var fs = require('fs'),
    path = require('path');
    // http = require('http');
var MongoClient = require('mongodb').MongoClient;

var  express = require ('express');
var app = express();
var bodyParser = require('body-parser');

// var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 8081;
app.use(bodyParser.json({limit: '50mb'}));


var url = "mongodb://localhost:27017/MEC";

MongoClient.connect(url, function (err, db) {
    app.db = db;
});


app.listen (serverPort,function () {
    console.log('server running on http://localhost:'+serverPort)

});

var WebRoutes = require("./routes/ui-routes.js");
var webRoutes = new WebRoutes(app);
webRoutes.init();

// swaggerRouter configuration
// var options = {
//   swaggerUi: path.join(__dirname, '/swagger.json'),
//   controllers: path.join(__dirname, './controllers'),
//   useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
// };
//
//
// // read the url and fetch the basePath (/bwm/v1)    or (/m2/v1)
// // if basePath = /bwm/v1
//   //    swagger = swagger.yaml
// // elif
// //      swagger = swagger1.yaml
//
//
// // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
// var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');    // api/swagger
// var swaggerDoc = jsyaml.safeLoad(spec);
//
// // Initialize the Swagger middleware
// swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
//
//   // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
//   app.use(middleware.swaggerMetadata());
//
//   // Validate Swagger requests
//   app.use(middleware.swaggerValidator());
//
//   // Route validated requests to appropriate controller
//   app.use(middleware.swaggerRouter(options));
//
//   // Serve the Swagger documents and Swagger UI
//   app.use(middleware.swaggerUi());
//
//   // Start the server
//   http.createServer(app).listen(serverPort, function () {
//     console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
//     console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
//   });
//
// });

//bwm/v1/bw_allocations
