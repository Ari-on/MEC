'use strict';

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var DefaultService = function (app) {
	this.app = app;
};


module.exports = DefaultService;


/**
 * Remove a specific bandwidthAllocation resource. DELETE method is typically used in \"Unregister from Bandwidth Management Service\" procedure
 *
 * allocationId String Represents a bandwidth allocation instance
 * no response value expected for this operation
 **/
DefaultService.prototype.bw_allocationsAllocationIdDELETE = function(req,callback) {
	console.log("This is bw_allocationsAllocationIdDELETE method!!!")
	var self = this;
	var db = self.app.db;

	var allocationId = req;
	db.collection('bwInfo').findOne({"allocationDirection" : allocationId}, function(err,result){
		if (err){
				console.log(err);
				callback(null,err)
		}
		else{
			if (result !== null){
				var bwInfoId = result["bwInfo_Id"]
				var sessionId = result["session_Id"]
				var timeStampId = result["timeStamp_Id"]
				var appInfoId = result["appInfo_Id"]
				
				db.collection('sessionFilter').findOneAndDelete(
					{"session_Id" : sessionId}
				)

				db.collection('timeStamp').findOneAndDelete(
					{"timeStamp_Id" : timeStampId}
				)

				db.collection('appInfo').findOneAndDelete(
					{"appInfo_Id" : appInfoId}
				)

				db.collection('bwInfo').findOneAndDelete(
					{"bwInfo_Id" : bwInfoId}
				)

				db.collection('ports').deleteMany(
					{"session_Id" : sessionId}
				)
				console.log("Refresh db and check")
				var result = {
					statuscode:"200",
					res:"Record deleted!!!"
				}
				callback(null,result)
			}//end of if block

			else{
				var result = {
					statuscode:"403",
					ProblemDetails: {
						"type": "string",
						"title": "string",
						"status": 0,
						"detail": "string",
						"instance": "string"
					}
				}
				callback(null,result)
			}// end of the else (status code)
		}// end of main else block
	})//  end of findOne
}


/**
 * This method retrieves information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * returns inline_response_200
 **/
DefaultService.prototype.bw_allocationsAllocationIdGET = function(req,callback) {
	console.log("This is bw_allocationsAllocationIdGET method!!!")
	var self = this;
	var db = self.app.db;
	var allocationId = req

	if (allocationId != null){
		var collection = db.collection('bwInfo')
		collection.aggregate([
			{
				$match:
				{
					allocation_Id : allocationId
				}
			},
			{
				$lookup:
				{
					from : "timeStamp",
					localField : "timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
					$unwind : "$timeStamp"
			},

			{
				$lookup:
				{
					from : "reqstType",
					localField : "reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},
			{
				$unwind : "$requestType"
			},

			{
				$lookup:
				{
					from : "sessionFilter",
					localField : "appIns_Id",
					foreignField : "appIns_Id",
					as : "sessionFilterInfo"
				}
			},
			{
				$unwind : "$sessionFilterInfo"
			},

			{
				$lookup:
				{
					from : "ports",
					localField : "session_Id",
					foreignField : "session_Id",
					as : "ports"
				}
			},
			{
				$unwind : "$ports"
			},

			{
				$project:
				{
					_id : 0,
					requestType : 1,
					fixedBWPriority : 1,
					fixedAllocation : 1,
					allocationDirection : 1,
					appIns_Id : 1,
					"timeStamp.seconds" : 1 ,
					"timeStamp.nanoSeconds" : 1,

					"sessionFilterInfo.session_Id" : 1,
					"sessionFilterInfo.sourceIP" : 1,
					"ports" : 1,
					"sessionFilterInfo.destAddress" : 1,
					"sessionFilterInfo.protocol" : 1,
				}
			}
		]).toArray(function(err, item) {
			if(err){
				console.log(err)
				callback(null,err)
			}
			else{
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
				for(var i = 0 ; item.length > i; i++){
					sessionFilter = {
						sourceIP : item[i]['sessionFilterInfo']['sourceIP'],
						sourcePort : [],
						destAddress : item[i]['sessionFilterInfo']['destAddress'],
						dstPort : [],
						protocol : item[i]['sessionFilterInfo']['protocol']
					}
					console.log('sessionFilterInfo : \n', sessionFilter)

					if (item[i]['sessionFilterInfo']['session_Id'] == item[i]['ports']['session_Id']){
						sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
						sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
					}
					
					finalItemArrObj.push({
						bwInfo :{ 
							'timeStamp' : item[i]['timeStamp'],
							'appIns_Id' : item[i]['appIns_Id'],
							'requestType' : item[i].requestType['reqstTypeDescription'],
							'sessionFilter' : [sessionFilter],
							'fixedBWPriority' : item[i]['fixedBWPriority'],
							'fixedAllocation' : item[i]['fixedAllocation'],
							'allocationDirection' : item[i]['allocationDirection']
						}
					})
				}
				for (var j = 0; finalItemArrObj.length > j; j++) {
					for (var k = j + 1; finalItemArrObj.length > k; k++) {
						if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
							finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
							finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
							finalItemArrObj.splice(k, 1);
							j = 0;
						}
					}
				}

				var result = {
					statuscode:"400",
					res: finalItemArrObj
				}
				callback(null,result);
			}
		});
	}// end of main if
	else{
		var result = {
			statuscode: "400",
			ProblemDetails: {
				"type": "string",
				"title": "string",
				"status": 0,
				"detail": "string",
				"instance": "string"
			}
		}
		callback(null, result);
	}
}


/**
 * This method updates the information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * bwInfoDeltas BwInfoDeltas Description of the changes to instruct the server how to modify the resource representation. 
 * returns inline_response_200
 **/
DefaultService.prototype.bw_allocationsAllocationIdPATCH = function(req,callback) {
	console.log("This is bw_allocationsAllocationIdPATCH method!!!")

	var self = this;
	var db = self.app.db;
	var allocationId = req.params.allocationID
	var myobj = req.body

	if(myobj.sessionFilter !== null){
		var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
		var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
		var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
		var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
		var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]
		
		db.collection('bwInfo').findOneAndUpdate(
			{"allocation_Id" : allocationId},
			{
				$set :
				{
					"bwInfo_Id" : "bwInfo_4",
					"fixedBWPriority" : myobj.fixedBWPriority,
					"fixedAllocation" : myobj.fixedAllocation,
					"allocationDirection" : myobj.allocationDirection,
					"appIns_Id" : myobj.appInsId,
					"session_Id" : "session_3",
					"appInfo_Id" : "appInfo_3"
				}
			}
		)

		db.collection('sessionFilter').findOneAndUpdate(
			{"session_Id" : "session_3"},
			{
				$set :
				{
					"sourceIP" : sessionFilter_sourceIp,
					"destAddress" : sessionFilter_dstAddress,
					"protocol" : sessionFilter_protocol,
					"appIns_Id" : myobj.appInsId,
				}
			}
		)

		if (myobj['reqstType'] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || myobj['reqstType'] == "application_specific_bw_allocation"){
			db.collection('bwInfo').findOneAndUpdate(
				{"bwInfo_Id" : "bwInfo_4"},
				{
					$set:
					{
						"reqstType" : "0"
					}
				}
			)
		}

		else if (myobj['reqstType'] == "SESSION_SPECIFIC_BW_ALLOCATION" || myobj['reqstType'] == "session_specific_bw_allocation"){
			db.collection('bwInfo').findOneAndUpdate(
				{"bwInfo_Id" : "bwInfo_4"},
				{
					$set:
					{
						"reqstType" : "1"
					}
				}
			)
		}
		
		var mainLength;
		if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
			mainLength = sessionFilter_sourcePort.length
		}
		else{
			mainLength = sessionFilter_dstPort.length
		}
		var sourcePort, destPort;
		for(var i = 0; i < mainLength; i++){

			if(sessionFilter_dstPort[i]){
				destPort = sessionFilter_dstPort[i]
			}
			else{
				destPort = ''
			}
			if(sessionFilter_sourcePort[i]){
				sourcePort = sessionFilter_sourcePort[i]
			}
			else{
				sourcePort = ''
			}
			db.collection('ports').findOneAndUpdate(
				{"session_Id" : "session_3"},
				{
					$set:
					{
						 "port_Id" : "port_5",
						"srcPort" : sourcePort,
						"dstPort" : destPort,
					}
				}
			)
		} 

		//Querying the DB
		var collection = db.collection('bwInfo')
		collection.aggregate([
			{
				$match:
				{
					allocation_Id : allocationId
				}
			},

			{
				$lookup:
				{
					from : "timeStamp",
					localField : "timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
				$unwind : "$timeStamp"
			},

			{
				$lookup:
				{
					from : "reqstType",
					localField : "reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},
			{
				$unwind : "$requestType"
			},

			{
				$lookup:
				{
					from : "sessionFilter",
					localField : "appIns_Id",
					foreignField : "appIns_Id",
					as : "sessionFiltedInfo"
				}
			},
			{
				$unwind : "$sessionFiltedInfo"
			},

			{
				$lookup:
				{
					from : "ports",
					localField : "session_Id",
					foreignField : "session_Id",
					as : "ports"
				}
			},
			{
				$unwind : "$ports"
			},

			{
				$project:
				{
					_id : 0,
					requestType : 1,
					fixedBWPriority : 1,
					fixedAllocation : 1,
					allocationDirection : 1,
					appIns_Id : 1,
					"timeStamp.seconds" : 1 ,
					"timeStamp.nanoSeconds" : 1,

					"sessionFiltedInfo.session_Id" : 1,
					"sessionFiltedInfo.sourceIP" : 1,
					"ports" : 1,
					"sessionFiltedInfo.destAddress" : 1,
					"sessionFiltedInfo.protocol" : 1,
				}
			}
		]).toArray(function(err, item){
			if(err) {
				console.log(err)
			}
			else{
				var finalItem = [];
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};

				for(var i = 0 ; item.length > i; i++){
					sessionFilter = {
						sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
						sourcePort : [],
						destAddress : item[i]['sessionFiltedInfo']['destAddress'],
						dstPort : [],
						protocol : item[i]['sessionFiltedInfo']['protocol']
					}

					if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id']){
						sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
						sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
					}

					finalItemArrObj.push({
						bwInfo :{ 
							'timeStamp' : item[i]['timeStamp'],
							'appIns_Id' : item[i]['appIns_Id'],
							'requestType' : item[i].requestType['reqstTypeDescription'],
							'sessionFilter' : [sessionFilter],
							'fixedBWPriority' : item[i]['fixedBWPriority'],
							'fixedAllocation' : item[i]['fixedAllocation'],
							'allocationDirection' : item[i]['allocationDirection']
						}
					})

					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}
				}  
			}
			console.log(finalItemArrObj)
			console.log("Refresh and check the DB")
			var result = {
				statuscode:"200",
				res:finalItemArrObj 
			}
			callback(null,result)
		})
	}// end of If
	else{
		console.log("No Body is passed")
		var errorbody = {
			"Problem Details" : {
				"type": "string",
				"title": "string",
				"status": 0,
				"detail": "string",
				"instance": "string"
			}
		}

		var result = {
				statuscode:"400",
				res:errorbody
		}
		callback(null, result)
	}// end of ELSE
}


/*
 *
 * This method updates the information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * bwInfo BwInfo BwInfo with updated information is included as entity body of the request
 * returns inline_response_200
 *
*/
DefaultService.prototype.bw_allocationsAllocationIdPUT = function(req,callback) {
	console.log("This is bw_allocationsAllocationIdPUT method!!!")
	var self = this;
	var db = self.app.db;
	var allocationId = req.params.allocationID
	var myobj = req.body

	if(myobj.sessionFilter !== null){

		var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
		var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
		var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
		var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
		var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]

		db.collection('bwInfo').findOneAndUpdate(
			{"allocation_Id" : allocationId},
			{
				$set :
				{
					"bwInfo_Id" : "bwInfo_4",
					"fixedBWPriority" : myobj.fixedBWPriority,
					"fixedAllocation" : myobj.fixedAllocation,
					"allocationDirection" : myobj.allocationDirection,
					"timeStamp_Id" : "timeStamp_3",
					"appIns_Id" : myobj.appInsId,
					"session_Id" : "session_3",
					"appInfo_Id" : "appInfo_3"
				}
			}
		)

		db.collection('timeStamp').findOneAndUpdate(
			{"timeStamp_Id": "timeStamp_3"},
			{
				$set:
				{
					"seconds" : myobj.timeStamp["seconds"],
					"nanoSeconds": myobj.timeStamp["nanoSeconds"],
					"bwInfo_Id" : "bwInfo_4"
				}
			}
		)

		db.collection('sessionFilter').findOneAndUpdate(
			{"session_Id" : "session_3"},
			{
				$set:
				{
					"sourceIP" : sessionFilter_sourceIp,
					"destAddress" : sessionFilter_dstAddress,
					"protocol" : sessionFilter_protocol,
					"appIns_Id" : myobj.appInsId,
				}
			}
		)

		if (myobj["reqstType"] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || myobj["reqstType"] == "application_specific_bw_allocation"){
			db.collection('bwInfo').findOneAndUpdate(
				{"bwInfo_Id" : "bwInfo_4"},
				{
					$set:
					{
						"reqstType" : "0"
					}
				}
			)
			console.log("updated for ", myobj["reqstType"])
		}

		else if(myobj["reqstType"] == "SESSION_SPECIFIC_BW_ALLOCATION" || myobj["reqstType"] == "session_specific_bw_allocation"){
			console.log(myobj["reqstType"])

			db.collection('bwInfo').findOneAndUpdate(
				{"bwInfo_Id" : "bwInfo_4"},
				{
					$set:
					{
						"reqstType" : "1"
					}
				}
			)
			console.log("updated for ", myobj["reqstType"])
		}

		var mainLength;
		if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
			mainLength = sessionFilter_sourcePort.length
		}
		else{
			mainLength = sessionFilter_dstPort.length
		}
		var sourcePort, destPort;
		for(var i = 0; i < mainLength; i++){

			if(sessionFilter_dstPort[i]){
				destPort = sessionFilter_dstPort[i]
			}
			else{
				destPort = ''
			}
			if(sessionFilter_sourcePort[i]){
				sourcePort = sessionFilter_sourcePort[i]
			}
			else{
				sourcePort = ''
			}
			db.collection('ports').findOneAndUpdate(
				{"session_Id" : "session_3"},
				{
					$set:
					{
						"port_Id" : "port_5",
						"srcPort" : sourcePort,
						"dstPort" : destPort,
					}
				}
			)
		}

	//Querying the DB
	var collection = db.collection('bwInfo')
	collection.aggregate([
		{
			$match:
			{
				allocation_Id : allocationId
			}
		},

		{
			$lookup:
			{
				from : "timeStamp",
				localField : "timeStamp_Id",
				foreignField : "timeStamp_Id",
				as : "timeStamp"
			}
		},
		{
			$unwind : "$timeStamp"
		},

		{
			$lookup:
			{
				from : "reqstType",
				localField : "reqstType",
				foreignField : "reqstType_Id",
				as : "requestType"
			}
		},
		{
			$unwind : "$requestType"
		},

		{
			$lookup:
			{
				from : "sessionFilter",
				localField : "appIns_Id",
				foreignField : "appIns_Id",
				as : "sessionFiltedInfo"
			}
		},
		{
			$unwind : "$sessionFiltedInfo"
		},

		{
			$lookup:
			{
				from : "ports",
				localField : "session_Id",
				foreignField : "session_Id",
				as : "ports"
			}
		},
		{
			$unwind : "$ports"
		},

		{
			$project:
			{
				_id : 0,
				requestType : 1,
				fixedBWPriority : 1,
				fixedAllocation : 1,
				allocationDirection : 1,
				appIns_Id : 1,
				"timeStamp.seconds" : 1 ,
				"timeStamp.nanoSeconds" : 1,

				"sessionFiltedInfo.session_Id" : 1,
				"sessionFiltedInfo.sourceIP" : 1,
				"ports" : 1,
				"sessionFiltedInfo.destAddress" : 1,
				"sessionFiltedInfo.protocol" : 1,
			}
		}
	]).toArray(function(err, item){
		if(err) {
			console.log(err)
		}
		else{
			var finalItem = [];
			var finalItemArrObj = [];
			var bwInfo = {};
			var sessionFilter = {};

			for(var i = 0 ; item.length > i; i++){
				sessionFilter = {
					sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
					sourcePort : [],
					destAddress : item[i]['sessionFiltedInfo']['destAddress'],
					dstPort : [],
					protocol : item[i]['sessionFiltedInfo']['protocol']
				}

				if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id']){
					sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
					sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
				}

				finalItemArrObj.push({
					bwInfo :{ 
						'timeStamp' : item[i]['timeStamp'],
						'appIns_Id' : item[i]['appIns_Id'],
						'requestType' : item[i].requestType['reqstTypeDescription'],
						'sessionFilter' : [sessionFilter],
						'fixedBWPriority' : item[i]['fixedBWPriority'],
						'fixedAllocation' : item[i]['fixedAllocation'],
						'allocationDirection' : item[i]['allocationDirection']
					}
				})

					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}
				}  
			}
			console.log("Refresh db and check")
			var result = {
				statuscode:"200",
				res:finalItemArrObj 
			}
			callback(null,result)
		})
	}//end of IF

	else{
		console.log("Parameters are INCORRECT")
		var errorbody = {
			"Problem Details" : {
				"type": "string",
				"title": "string",
				"status": 0,
				"detail": "string",
				"instance": "string"
			}
		}

		var result = {
			statuscode:"400",
			res:errorbody
		}
		callback(null,result)
	}//end of ELSE
}


/**
 * This method retrieves information about a list of bandwidthAllocation resources
 *
 * app_instance_id List A mobile edge application instance may use multiple app_instance_ids as an input parameter to query the bandwidth allocation of a list of mobile edge application instances.  (optional)
 * app_name List A mobile edge application instance may use multiple ser_names as an input parameter to query the bandwidth allocation of a list of mobile edge application instances.  (optional)
 * session_id List A mobile edge application instance may use session_id as an input parameter to query the bandwidth allocation of a list of sessions.  (optional)
 * returns inline_response_200
 **/
DefaultService.prototype.bw_allocationsGET = function(req,callback) {
	console.log("This is bw_allocationsGET method!!!")
	var self = this;
	var db = self.app.db;
	var app_instance_id,app_name,session_Id;
	if(req.app_instance_id){
			app_instance_id = req.app_instance_id
	}
	else{
			app_instance_id = null
	}

	if(req.app_name) {
			app_name = req.app_name
	}
	else{
			app_name = null
	}

	if(req.session_id) {
			session_Id = req.session_id;
	}
	else{
			session_Id = null
	}

	if(app_instance_id!= null && session_Id == null && app_name == null ){
		var collection = db.collection('bwInfo')
		collection.aggregate([
			{
				$match :
				{
					appIns_Id : app_instance_id
				}
			},
			{ 
				$lookup :
				{
					from : "timeStamp",
					localField : "timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
				$unwind : "$timeStamp"
			},
			
			{ 
				$lookup :
				{
					from : "reqstType",
					localField : "reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},
			{
				$unwind : "$requestType"
			},

			{
				$lookup:
				{
					from : "sessionFilter",
					localField : "appIns_Id",
					foreignField : "appIns_Id",
					as : "sessionFiltedInfo"
				}
			},

			{
				$lookup:
				{
					from : "appInfo",
					localField : "appInfo_Id",
					foreignField : "appInfo_Id",
					as : "appInfo"
				}
			},
			{
				$unwind : "$appInfo"
			},

			{
				$project :
				{
					requestType : 1
					,fixedBWPriority : 1
					,fixedAllocation : 1
					,allocationDirection : 1
					,appIns_Id : 1
					,"timeStamp.seconds" : 1
					,"timeStamp.nanoSeconds" : 1

					,"sessionFiltedInfo.session_Id" : 1
					,"sessionFiltedInfo.sourceIP" : 1
					,"sessionFiltedInfo.sourcePort" : 1
					,"sessionFiltedInfo.destAddress" : 1
					,"sessionFiltedInfo.destPort" : 1
					,"sessionFiltedInfo.protocol" : 1
				}
			},
		]).toArray(function(err, item) {
			if(err){
				console.log(err)
				callback(null,err)
			}
			else{
				var finalItem = [];
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};

				if (item.length > 0) {
					for(var i = 0 ; item.length > i; i++){
							sessionFilter = {
									sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
									sourcePort : [],
									destAddress : item[i]['sessionFiltedInfo']['destAddress'],
									dstPort : [],
									protocol : item[i]['sessionFiltedInfo']['protocol']
							}
							if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id'])
							{
									sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
									sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
							}

						finalItemArrObj.push({
								bwInfo :{
								'timeStamp' : item[i]['timeStamp'],
								'appIns_Id' : item[i]['appIns_Id'],
								'requestType' : item[i].requestType['reqstTypeDescription'],
								'sessionFilter' : [sessionFilter],
								'fixedBWPriority' : item[i]['fixedBWPriority'],
								'fixedAllocation' : item[i]['fixedAllocation'],
								'allocationDirection' : item[i]['allocationDirection']
							}
						})
					}
					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}

					var result = {
							statuscode:"200",
							res:finalItemArrObj
					}
					callback(null,result)
				}//end of IF
				else{
					var result = {
						statuscode: "400",
						ProblemDetails: {
							"type": "string",
							"title": "string",
							"status": 0,
							"detail": "string",
							"instance": "string"
						}
					}
					callback(null, result)
				}//end of ELSE
			}
		});
	}

	else if (app_instance_id == null && session_Id != null && app_name == null){
		var collection = db.collection('bwInfo')
		collection.aggregate([
			{
				$match :
				{
					session_Id : session_Id
				}
			},
			{ 
				$lookup :
				{
					from : "timeStamp",
					localField : "timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
				$unwind : "$timeStamp"
			},
			
			{ 
				$lookup :
				{
					from : "reqstType",
					localField : "reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},

			{
				$unwind : "$requestType"
			},

			{
				$lookup:
				{
					from : "sessionFilter",
					localField : "appIns_Id",
					foreignField : "appIns_Id",
					as : "sessionFiltedInfo"
				}
			},

			{
				$lookup:
				{
					from : "appInfo",
					localField : "appInfo_Id",
					foreignField : "appInfo_Id",
					as : "appInfo"
				}
			},
			{
				$unwind : "$appInfo"
			},

			{
				$project :
				{
					requestType : 1
					,fixedBWPriority : 1
					,fixedAllocation : 1
					,allocationDirection : 1
					,appIns_Id : 1
					,"timeStamp.seconds" : 1
					,"timeStamp.nanoSeconds" : 1

					,"sessionFiltedInfo.session_Id" : 1
					,"sessionFiltedInfo.sourceIP" : 1
					,"sessionFiltedInfo.sourcePort" : 1
					,"sessionFiltedInfo.destAddress" : 1
					,"sessionFiltedInfo.destPort" : 1
					,"sessionFiltedInfo.protocol" : 1
				}
			},
		]).toArray(function(err, item) {
			if(err){
				console.log(err)
				callback(null,err)
			}
			else{
				var finalItem = [];
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};

				if (item.length > 0) {
					for(var i = 0 ; item.length > i; i++){
						sessionFilter = {
							sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
							sourcePort : [],
							destAddress : item[i]['sessionFiltedInfo']['destAddress'],
							dstPort : [],
							protocol : item[i]['sessionFiltedInfo']['protocol']
						}

						if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id'])
						{
							sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
							sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
						}

						finalItemArrObj.push({
							bwInfo :{
								'timeStamp' : item[i]['timeStamp'],
								'appIns_Id' : item[i]['appIns_Id'],
								'requestType' : item[i].requestType['reqstTypeDescription'],
								'sessionFilter' : [sessionFilter],
								'fixedBWPriority' : item[i]['fixedBWPriority'],
								'fixedAllocation' : item[i]['fixedAllocation'],
								'allocationDirection' : item[i]['allocationDirection']
							}
						})
					}
					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}

					var result = {
							statuscode:"200",
							res:finalItemArrObj
					}
					callback(null,result)
				}//end of IF
				else{
					var result = {
						statuscode: "400",
						ProblemDetails: {
							"type": "string",
							"title": "string",
							"status": 0,
							"detail": "string",
							"instance": "string"
						}
					}
					callback(null, result)
				}//end of ELSE
			}
		});
	}

	else if (app_instance_id == null && session_Id == null && app_name != null){
		var collection = db.collection('appInfo')
		collection.aggregate([
			{ 
				$lookup :
				{
					from : "bwInfo",
					localField : "appInfo_Id",
					foreignField : "appInfo_Id",
					as : "appInfo"
				}
			},
			{
					$unwind : "$appInfo"
			},
			{ 
				$lookup :
				{
					from : "sessionFilter",
					localField : "appInfo.session_Id",
					foreignField : "session_Id",
					as : "sessionFiltedInfo"
				}
			},

			{
					$unwind : "$sessionFiltedInfo"
			},

			{ 
				$lookup :
				{
					from : "timeStamp",
					localField : "appInfo.timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
					$unwind : "$timeStamp"
			},

			{ 
				$lookup :
				{
					from : "reqstType",
					localField : "appInfo.reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},
			{
					$unwind : "$requestType"
			},

			{ $match :
				{
					appName : app_name
				}
			},

			{
				$project :
				{
					requestType : 1
					,"appInfo.fixedBWPriority" : 1
					,"appInfo.fixedAllocation" : 1
					,"appInfo.allocationDirection" : 1
					,"appInfo.appIns_Id" : 1
					,"timeStamp.seconds" : 1
					,"timeStamp.nanoSeconds" : 1

					,"sessionFiltedInfo.session_Id" : 1
					,"sessionFiltedInfo.sourceIP" : 1
					,"sessionFiltedInfo.sourcePort" : 1
					,"sessionFiltedInfo.destAddress" : 1
					,"sessionFiltedInfo.destPort" : 1
					,"sessionFiltedInfo.protocol" : 1

				}
			},
		]).toArray(function(err, item) {
			if(err){
				console.log(err)
				callback(null,err)
			}
			else{
				var finalItem = [];
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};

				if (item.length > 0) {
					for(var i = 0 ; item.length > i; i++){
							sessionFilter = {
									sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
									sourcePort : [],
									destAddress : item[i]['sessionFiltedInfo']['destAddress'],
									dstPort : [],
									protocol : item[i]['sessionFiltedInfo']['protocol']
							}
							if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id'])
							{
									sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
									sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
							}

						finalItemArrObj.push({
							bwInfo :{
								'timeStamp' : item[i]['timeStamp'],
								'appIns_Id' : item[i]['appIns_Id'],
								'requestType' : item[i].requestType['reqstTypeDescription'],
								'sessionFilter' : [sessionFilter],
								'fixedBWPriority' : item[i]['fixedBWPriority'],
								'fixedAllocation' : item[i]['fixedAllocation'],
								'allocationDirection' : item[i]['allocationDirection']
							}
						})
					}
					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}

					var result = {
							statuscode:"200",
							res:finalItemArrObj
					}
					callback(null,result)
				}//end of IF
				else{
					var result = {
						statuscode: "400",
						ProblemDetails: {
							"type": "string",
							"title": "string",
							"status": 0,
							"detail": "string",
							"instance": "string"
						}
					}
					callback(null, result)
				}//end of ELSE
			}
		});
	}

	else if (app_instance_id != null && session_Id != null && app_name != null){
		var collection = db.collection('appInfo')
		collection.aggregate([
			{ 
				$lookup :
				{
					from : "bwInfo",
					localField : "appInfo_Id",
					foreignField : "appInfo_Id",
					as : "appInfo"
				}
			},
			{
				$unwind : "$appInfo"
			},

			{ 
				$lookup :
				{
					from : "sessionFilter",
					localField : "appInfo.session_Id",
					foreignField : "session_Id",
					as : "sessionFiltedInfo"
				}
			},
			{
				$unwind : "$sessionFiltedInfo"
			},

			{ 
				$lookup :
				{
					from : "timeStamp",
					localField : "appInfo.timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
				$unwind : "$timeStamp"
			},

			{ 
				$lookup :
				{
					from : "reqstType",
					localField : "appInfo.reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},
			{
					$unwind : "$requestType"
			},

            {
                $lookup:
                    {
                        from : "ports",
                        localField : "appInfo.session_Id",
                        foreignField : "session_Id",
                        as : "ports"
                    }
            },
            {
                $unwind : "$ports"
            },
			
			{ $match :
				{
					appName :  app_name
					// appName : {$in : app_name}
				}
			},

			{
				$project :
				{
					requestType : 1
					,"appInfo.fixedBWPriority" : 1
					,"appInfo.fixedAllocation" : 1
					,"appInfo.allocationDirection" : 1
					,"appInfo.appIns_Id" : 1
					,"timeStamp.seconds" : 1
					,"timeStamp.nanoSeconds" : 1,
                     "ports" : 1
					,"sessionFiltedInfo.session_Id" : 1
					,"sessionFiltedInfo.sourceIP" : 1
					,"sessionFiltedInfo.sourcePort" : 1
					,"sessionFiltedInfo.destAddress" : 1
					,"sessionFiltedInfo.destPort" : 1
					,"sessionFiltedInfo.protocol" : 1
					}
			},
		]).toArray(function(err, item) {
			if(err){
				console.log(err)
				callback(null,err)
			}
			else{
				var finalItem = [];
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};

				if (item.length > 0) {

					for(var i = 0 ; item.length > i; i++){
							sessionFilter = {
									sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
									sourcePort : [],
									destAddress : item[i]['sessionFiltedInfo']['destAddress'],
									dstPort : [],
									protocol : item[i]['sessionFiltedInfo']['protocol']
							}
							if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id'])
							{
									sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
									sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
							}

						finalItemArrObj.push({
								bwInfo :{
								'timeStamp' : item[i]['timeStamp'],
								'appIns_Id' : item[i]['appInfo']['appIns_Id'],
								'requestType' : item[i].requestType['reqstTypeDescription'],
								'sessionFilter' : [sessionFilter],
								'fixedBWPriority' : item[i]['appInfo']['fixedBWPriority'],
								'fixedAllocation' : item[i]['appInfo']['fixedAllocation'],
								'allocationDirection' : item[i]['appInfo']['allocationDirection']
							}
						})
					}
					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}

					var result = {
							statuscode:"200",
							res:finalItemArrObj
					}
					callback(null,result)
				}//end of IF
				else{
					var result = {
						statuscode: "400",
						ProblemDetails: {
							"type": "string",
							"title": "string",
							"status": 0,
							"detail": "string",
							"instance": "string"
						}
					}
					callback(null, result)
				}//end of ELSE
			}
		});
	}

	else if (app_instance_id == null && session_Id == null && app_name == null){
		var collection = db.collection("bwInfo");
		collection.aggregate([
			{ 
				$lookup :
				{
					from : "timeStamp",
					localField : "timeStamp_Id",
					foreignField : "timeStamp_Id",
					as : "timeStamp"
				}
			},
			{
				$unwind : "$timeStamp"
			},

			{ 
				$lookup :
				{
					from : "reqstType",
					localField : "reqstType",
					foreignField : "reqstType_Id",
					as : "requestType"
				}
			},
			{
				$unwind : "$requestType"
			},

			{
				$lookup:
				{
					from : "sessionFilter",
					localField : "appIns_Id",
					foreignField : "appIns_Id",
					as : "sessionFiltedInfo"
				}
			},
			{
				$unwind : "$sessionFiltedInfo"
			},

			{
				$lookup:
				{
					from : "ports",
					localField : "session_Id",
					foreignField : "session_Id",
					as : "ports"
				}
			},
			{
				$unwind : "$ports"
			},

			{
				$project :
				{
					_id : 0,
					requestType : 1,
					fixedBWPriority : 1,
					fixedAllocation : 1,
					allocationDirection : 1,
					appIns_Id : 1,
					"timeStamp.seconds" : 1 ,
					"timeStamp.nanoSeconds" : 1,

					"sessionFiltedInfo.session_Id" : 1,
					"sessionFiltedInfo.sourceIP" : 1,
					"ports" : 1,
					"sessionFiltedInfo.destAddress" : 1,
					"sessionFiltedInfo.protocol" : 1,
				}
			},
		]).toArray(function(err, item) {
			if(err){
				console.log(err)
				callback(null,err)
			}
			else{
				var finalItemArrObj = [];
				var bwInfo = {};
				var sessionFilter = {};

				if (item.length > 0) {
					for(var i = 0 ; item.length > i; i++){
						sessionFilter = {
								sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
								sourcePort : [],
								destAddress : item[i]['sessionFiltedInfo']['destAddress'],
								dstPort : [],
								protocol : item[i]['sessionFiltedInfo']['protocol']
						}
						if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id'])
						{
								sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
								sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
						}

						finalItemArrObj.push({
								bwInfo :{
								'timeStamp' : item[i]['timeStamp'],
								'appIns_Id' : item[i]['appIns_Id'],
								'requestType' : item[i].requestType['reqstTypeDescription'],
								'sessionFilter' : [sessionFilter],
								'fixedBWPriority' : item[i]['fixedBWPriority'],
								'fixedAllocation' : item[i]['fixedAllocation'],
								'allocationDirection' : item[i]['allocationDirection']
							}
						})
					}
					for (var j = 0; finalItemArrObj.length > j; j++) {
						for (var k = j + 1; finalItemArrObj.length > k; k++) {
							if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
								finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
								finalItemArrObj.splice(k, 1);
								j = 0;
							}
						}
					}

					var result = {
							statuscode:"200",
							res:finalItemArrObj
					}
					callback(null,result)
				}//end of IF
				else{
					var result = {
						statuscode: "400",
						ProblemDetails: {
							"type": "string",
							"title": "string",
							"status": 0,
							"detail": "string",
							"instance": "string"
						}
					}
					callback(null, result)
				}//end of ELSE
			}
		});
	}

	else{
		console.log("ELSE BLOCK")
		var examples = {};
		examples['application/json'] = {
			"bwInfo" : {
				"timeStamp" : {
					"seconds" : { },
					"nanoSeconds" : { }
				},
				"fixedBWPriority" : { },
				"allocationDirection" : { },
				"requestType" : { },
				"sessionFilter" : "",
				"appInsId" : { },
				"fixedAllocation" : { }
			}
		}
		var result = {
			statuscode:"400",
			res:examples['application/json']
		}
		callback(null,result)
	}
}
	

/**
 * This method is used to create a bandwidthAllocation resource.
 *
 * bwInfo BwInfo BwInfo with updated information is included as entity body of the request
 * returns inline_response_200
 **/
DefaultService.prototype.bw_allocationsPOST = function(req,callback) {
	console.log("This is bw_allocationsPOST method!!!")
	var self = this;
	var db = self.app.db;

	var myobj = req.body
	if (myobj !== undefined){
		var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
		var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
		var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
		var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
		var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]

		var insertquery = {
			"bwInfo_Id" : "bwInfo_4",
			"reqstType" : myobj.requestType,
			"fixedBWPriority" : myobj.fixedBWPriority,
			"fixedAllocation" : myobj.fixedAllocation,
			"allocationDirection" : myobj.allocationDirection,
			"timeStamp_Id" : "timeStamp_3",
			"appIns_Id" : myobj.appInsId,
			"session_Id" : "session_3",
			"appInfo_Id" : "appInfo_3",
			"allocation_Id" : "alloc_3"
		}

		db.collection('bwInfo').insertOne(insertquery, function(err, res) {
			if (err) {
				throw err;
			}
			else {
				db.collection('timeStamp').insertOne(
					{
						"timeStamp_Id" : "timeStamp_3",
						"seconds": myobj.timeStamp["seconds"],
						"nanoSeconds": myobj.timeStamp["nanoSeconds"],
						"bwInfo_Id" : "bwInfo_4"
					}
				);

				db.collection('sessionFilter').insertOne(
						{
								"session_Id" : "session_3",
								"sourceIP" : sessionFilter_sourceIp,
								"destAddress" : sessionFilter_dstAddress,
								"protocol" : sessionFilter_protocol,
								"appIns_Id" : myobj.appInsId,
						}
				);

				var port_Id = 0
				var mainLength;
				if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
						mainLength = sessionFilter_sourcePort.length
				}else{
						mainLength = sessionFilter_dstPort.length
				}
				var sourcePort, destPort;
				for(var i = 0; i < mainLength; i++){
					if(sessionFilter_dstPort[i]){
						destPort = sessionFilter_dstPort[i]
					}
					else{
						destPort = ''
					}
					if(sessionFilter_sourcePort[i]){
						sourcePort = sessionFilter_sourcePort[i]
					}
					else{
						sourcePort = ''
					}
					db.collection('ports').insertOne({
						"port_Id" : i+1,
						"srcPort" : sourcePort,
						"dstPort" : destPort,
						"session_Id" : insertquery["session_Id"]
					})
				}

				if (insertquery["reqstType"] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || insertquery["reqstType"] == "application_specific_bw_allocation"){
					var myquery = {"reqstType" : "APPLICATION_SPECIFIC_BW_ALLOCATION"}
					var newvalues = {$set: {"reqstType" : "0"} };

					db.collection("bwInfo").updateOne(myquery, newvalues, function(err, res) {
							if (err) throw err;
					});
				}

				else if(insertquery["reqstType"] == "SESSION_SPECIFIC_BW_ALLOCATION" || insertquery["reqstType"] == "session_specific_bw_allocation"){
					var myquery = {"reqstType" : "SESSION_SPECIFIC_BW_ALLOCATION"}
					var newvalues = {$set: {"reqstType" : "1"} };

					db.collection("bwInfo").updateOne(myquery, newvalues, function(err, res) {
							if (err) throw err;
					});
				}
				else{
						console.log("final else case --")
				}
					
				//Querying the DB
				var collection = db.collection('bwInfo')
				collection.aggregate([
					{
						$match:
						{
							allocation_Id : allocationId
						}
					},

					{
						$lookup:
						{
							from : "timeStamp",
							localField : "timeStamp_Id",
							foreignField : "timeStamp_Id",
							as : "timeStamp"
						}
					},
					{
						$unwind : "$timeStamp"
					},

					{
						$lookup:
						{
							from : "reqstType",
							localField : "reqstType",
							foreignField : "reqstType_Id",
							as : "requestType"
						}
					},
					{
						$unwind : "$requestType"
					},

					{
						$lookup:
						{
							from : "sessionFilter",
							localField : "appIns_Id",
							foreignField : "appIns_Id",
							as : "sessionFiltedInfo"
						}
					},
					{
						$unwind : "$sessionFiltedInfo"
					},

					{
						$lookup:
						{
							from : "ports",
							localField : "session_Id",
							foreignField : "session_Id",
							as : "ports"
						}
					},
					{
						$unwind : "$ports"
					},

					{
						$project:
						{
							_id : 0,
							requestType : 1,
							fixedBWPriority : 1,
							fixedAllocation : 1,
							allocationDirection : 1,
							appIns_Id : 1,
							"timeStamp.seconds" : 1 ,
							"timeStamp.nanoSeconds" : 1,

							"sessionFiltedInfo.session_Id" : 1,
							"sessionFiltedInfo.sourceIP" : 1,
							"ports" : 1,
							"sessionFiltedInfo.destAddress" : 1,
							"sessionFiltedInfo.protocol" : 1,
						}
					}
				]).toArray(function(err, item){
					if(err) {
						console.log(err)
					}
					else{
						var finalItem = [];
						var finalItemArrObj = [];
						var bwInfo = {};
						var sessionFilter = {};

						for(var i = 0 ; item.length > i; i++){
							sessionFilter = {
								sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
								sourcePort : [],
								destAddress : item[i]['sessionFiltedInfo']['destAddress'],
								dstPort : [],
								protocol : item[i]['sessionFiltedInfo']['protocol']
							}

							if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id']){
								sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
								sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
							}

							finalItemArrObj.push({
								bwInfo :{ 
									'timeStamp' : item[i]['timeStamp'],
									'appIns_Id' : item[i]['appIns_Id'],
									'requestType' : item[i].requestType['reqstTypeDescription'],
									'sessionFilter' : [sessionFilter],
									'fixedBWPriority' : item[i]['fixedBWPriority'],
									'fixedAllocation' : item[i]['fixedAllocation'],
									'allocationDirection' : item[i]['allocationDirection']
								}
							})

							for (var j = 0; finalItemArrObj.length > j; j++) {
								for (var k = j + 1; finalItemArrObj.length > k; k++) {
									if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
										finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
										finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
										finalItemArrObj.splice(k, 1);
										j = 0;
									}
								}
							}
						}  
					}
					console.log("Refresh db and check")
					var result = {
						statuscode:"200",
						res:finalItemArrObj 
					}
					callback(null,result)
				})
			}// end of main ELSE	
		})
	}

	else {
		console.log("No Body is passed")
		var errorbody = {
			"Problem Details" : {
				"type": "string",
				"title": "string",
				"status": "400",
				"detail": "string",
				"instance": "string"
			}
		}

		var result = {
				statuscode:"400",
				res:errorbody
		}
		callback(null,result)
	}
};