
var Swagger2Postman = require("swagger2-postman-generator");
Swagger2Postman
	.convertSwagger()
	.fromFile("./outputFiles/swagger.json")
	.toPostmanCollectionFile("./outputFiles/postman_collection.json", {prettyPrint:true})
	
	
	
	
	