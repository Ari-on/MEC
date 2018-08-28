
var Swagger2Postman = require("swagger2-postman-generator");
Swagger2Postman
	.convertSwagger()
	.fromFile("swagger.json")
	.toPostmanCollectionFile("postman_collection.json", {prettyPrint:true})
	
	
	
	
	