var fileName = process.argv.splice(2);
var myFile1 = JSON.stringify(fileName);
var myFile = myFile1.split("\"");
var Swagger2Postman = require("swagger2-postman-generator");
Swagger2Postman
	.convertSwagger()
	.fromFile("./outputFiles/"+myFile[1])
	.toPostmanCollectionFile("./outputFiles/"+myFile[1], {prettyPrint:true})
	// .toPostmanCollectionFile("./outputFiles/postman_collection.json", {prettyPrint:true})
	
	
	
	
// var Swagger2Postman = require("swagger2-postman-generator");
// Swagger2Postman
// 	.convertSwagger()
// 	.fromFile("./outputFiles/swagger.json")
// 	.toPostmanCollectionFile("./outputFiles/postman_collection.json", {prettyPrint:true})
	
	
	
	
	