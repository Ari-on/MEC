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
	db.collection('bwInfo').findOne({"allocation_Id" : allocationId}, function(err,result){
		if (err){
				console.log(err);
				callback(null,err)
		}
		else{
			if (result == null){

                var result = {
                    statuscode:403,
                    ProblemDetails: {
                        "type": "string",
                        "title": "string",
                        "status": 403,
                        "detail": "Allocation_Id doesn't match with any records",
                        "instance": "string"
                    }
                };
                callback(null,result)

			}//end of if block

			else{
                var bwInfoId = result["bwInfo_Id"];
                var sessionId = result["session_Id"];
                var timeStampId = result["timeStamp_Id"];
                var appInfoId = result["appInfo_Id"];

                db.collection('sessionFilter').findOneAndDelete(
                    {"session_Id" : sessionId}
                );

                db.collection('timeStamp').findOneAndDelete(
                    {"timeStamp_Id" : timeStampId}
                );

                db.collection('appInfo').findOneAndDelete(
                    {"appInfo_Id" : appInfoId}
                );

                db.collection('bwInfo').findOneAndDelete(
                    {"bwInfo_Id" : bwInfoId}
                );

                db.collection('ports').deleteMany(
                    {"session_Id" : sessionId}
                );
                console.log("Refresh db and check")
                var result = {
                    statuscode:200,
                    // res:"Record deleted!!!"
                };
                callback(null,result)
			}// end of the else (status code)
		}// end of main else block
	});//  end of findOne
};


/**
 * This method retrieves information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * returns inline_response_200
 **/
DefaultService.prototype.bw_allocationsAllocationIdGET = function(req,callback) {
    console.log("This is bw_allocationsAllocationIdGET method!!!");
    var self = this;
    var db = self.app.db;
    var allocationId = req;

    var collection = db.collection('BWM_API_swagger');
    collection.find({"allocationId":allocationId}).toArray(function (err,resp) {
        if (resp){
            callback(err,resp)
        }
        else{
            callback(err,"can't find")
        }
    })
};

/**
 * This method updates the information about a specific bandwidthAllocation resource.
 *
 * allocationId String Represents a bandwidth allocation instance
 * bwInfoDeltas BwInfoDeltas Description of the changes to instruct the server how to modify the resource representation.
 * returns inline_response_200
 **/
DefaultService.prototype.bw_allocationsAllocationIdPATCH = function(req,callback) {
		console.log("This is bw_allocationsAllocationIdPATCH method!!!");
        var self = this;
        var db = self.app.db;
        var allocationId = req.params.allocationID;
        var myobj = req.body;

        if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
            console.log("Parameters are INCORRECT");
            var errorbody = {
                "Problem Details": {
                    "type": "string",
                    "title": "string",
                    "status": 400,
                    "detail": "Incorrect parameters",
                    "instance": "string"
                }
            };

            var result = {
                statuscode: 400,
                res: errorbody
            };
            callback(null, result)
        } else {

            db.collection('bwInfo').find({"allocation_Id": allocationId}).toArray(function (err, bwInfo_result) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                else if (bwInfo_result.length <= 0) {
                    var errorbody = {
                        "Problem Details": {
                            "type": "string",
                            "title": "string",
                            "status": 412,
                            "detail": "Allocation_Id doesn't match with any records",
                            "instance": "string"
                        }
                    };

                    var result = {
                        statuscode: 412,
                        res: errorbody
                    };
                    callback(null, result)
                }
                else {
                    // console.log("ddddddddddddd", bwInfo_result);
                    var session_Id = bwInfo_result[0].session_Id;
                    db.collection('sessionFilter').find({"session_Id": session_Id}).toArray(function (err, session_result) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        else if (session_result.length < 0) {
                            var errorbody = {
                                "Problem Details": {
                                    "type": "string",
                                    "title": "string",
                                    "status": 412,
                                    "detail": "Allocation_Id doesn't match with any records",
                                    "instance": "string"
                                }
                            };

                            var result = {
                                statuscode: 412,
                                res: errorbody
                            };
                            callback(null, result)
                        }
                        else {
                            // console.log('ffffffffffffff', session_result);
                            // // var timeStamp_Id = bwInfo_result[0].timeStamp_Id
                            // db.collection('timeStamp').find({"timeStamp_Id": timeStamp_Id}).toArray(function (err, time_result) {
                            //     if (err) {
                            //         console.log(err);
                            //         throw err;
                            //     }
                            //     else if (time_result.length < 0) {
                            //         var errorbody = {
                            //             "Problem Details": {
                            //                 "type": "string",
                            //                 "title": "string",
                            //                 "status": 412,
                            //                 "detail": "Allocation_Id doesn't match with any records",
                            //                 "instance": "string"
                            //             }
                            //         };
                            //
                            //         var result = {
                            //             statuscode: 412,
                            //             res: errorbody
                            //         };
                            //         callback(null, result)
                            //     }
                            //     else {
                                    // console.log('hhhhhhhhhhhhhhhh', time_result)
                                    db.collection('ports').find({"session_Id": session_Id}).toArray(function (err, ports_result) {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        }
                                        else if (ports_result.length < 0) {
                                            var errorbody = {
                                                "Problem Details": {
                                                    "type": "string",
                                                    "title": "string",
                                                    "status": 412,
                                                    "detail": "Allocation_Id doesn't match with any records",
                                                    "instance": "string"
                                                }
                                            };

                                            var result = {
                                                statuscode: 412,
                                                res: errorbody
                                            };
                                            callback(null, result)
                                        }
                                        else {
                                            // console.log('jjjjjjjjjjjjjj', ports_result)
                                            var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"];
                                            var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"];
                                            var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"];
                                            var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"];
                                            var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"];

                                            var query = {
                                                reqstTypeDescription: myobj.requestType
                                            };

                                            db.collection('reqstType').find(query).toArray(function (err, reqTypeResult) {
                                                if (err) {
                                                    throw err;
                                                }
                                                else if (reqTypeResult.length === 0) {

                                                    result = {
                                                        statuscode: 400,
                                                        res: {
                                                            "Problem Details": {
                                                                "type": "string",
                                                                "title": "string",
                                                                "status": 400,
                                                                "detail": "Request Type is not valid in database.",
                                                                "instance": "string"
                                                            }
                                                        }
                                                    };
                                                    callback(null, result)

                                                }
                                                else {  //reqst ELSE

                                                    var reqstType = reqTypeResult[0].reqstType_Id;

                                                    db.collection('bwInfo').findOneAndUpdate({"allocation_Id": allocationId},
                                                        {
                                                            $set:
                                                                {
                                                                    "reqstType":reqstType,
                                                                    "fixedBWPriority": myobj.fixedBWPriority,
                                                                    "fixedAllocation": myobj.fixedAllocation,
                                                                    "allocationDirection": myobj.allocationDirection,
                                                                    "appIns_Id": myobj.appInsId
                                                                }
                                                        });

                                                    // db.collection('timeStamp').findOneAndUpdate({"timeStamp_Id": timeStamp_Id},
                                                    //     {
                                                    //         $set:
                                                    //             {
                                                    //                 "seconds": myobj.timeStamp["seconds"],
                                                    //                 "nanoSeconds": myobj.timeStamp["nanoSeconds"]
                                                    //             }
                                                    //     });
                                                    db.collection('sessionFilter').findOneAndUpdate({"session_Id": session_Id},
                                                        {
                                                            $set:
                                                                {
                                                                    "sourceIP": sessionFilter_sourceIp,
                                                                    "destAddress": sessionFilter_dstAddress,
                                                                    "protocol": sessionFilter_protocol,
                                                                    "appIns_Id": myobj.appInsId,
                                                                }
                                                        });

                                                    db.collection('ports').findOneAndUpdate({"session_Id": session_Id},
                                                        {
                                                            $set:
                                                                {
                                                                    "srcPort": sessionFilter_sourcePort[0],
                                                                    "dstPort": sessionFilter_dstPort[0],
                                                                }
                                                        });

                                                    var collection = db.collection('bwInfo');
                                                    collection.aggregate([
                                                        {
                                                            $match:
                                                                {
                                                                    allocation_Id: allocationId
                                                                }
                                                        },

                                                        {
                                                            $lookup:
                                                                {
                                                                    from: "timeStamp",
                                                                    localField: "timeStamp_Id",
                                                                    foreignField: "timeStamp_Id",
                                                                    as: "timeStamp"
                                                                }
                                                        },
                                                        {
                                                            $unwind: "$timeStamp"
                                                        },

                                                        {
                                                            $lookup:
                                                                {
                                                                    from: "reqstType",
                                                                    localField: "reqstType",
                                                                    foreignField: "reqstType_Id",
                                                                    as: "requestType"
                                                                }
                                                        },
                                                        {
                                                            $unwind: "$requestType"
                                                        },

                                                        {
                                                            $lookup:
                                                                {
                                                                    from: "sessionFilter",
                                                                    localField: "session_Id",
                                                                    foreignField: "session_Id",
                                                                    as: "sessionFiltedInfo"
                                                                }
                                                        },
                                                        {
                                                            $unwind: "$sessionFiltedInfo"
                                                        },

                                                        {
                                                            $lookup:
                                                                {
                                                                    from: "ports",
                                                                    localField: "session_Id",
                                                                    foreignField: "session_Id",
                                                                    as: "ports"
                                                                }
                                                        },
                                                        {
                                                            $unwind: "$ports"
                                                        },

                                                        {
                                                            $project:
                                                                {
                                                                    _id: 0,
                                                                    requestType: 1,
                                                                    fixedBWPriority: 1,
                                                                    fixedAllocation: 1,
                                                                    allocationDirection: 1,
                                                                    appIns_Id: 1,
                                                                    "timeStamp.seconds": 1,
                                                                    "timeStamp.nanoSeconds": 1,

                                                                    "sessionFiltedInfo.session_Id": 1,
                                                                    "sessionFiltedInfo.sourceIP": 1,
                                                                    "ports": 1,
                                                                    "sessionFiltedInfo.destAddress": 1,
                                                                    "sessionFiltedInfo.protocol": 1,
                                                                }
                                                        }
                                                    ]).toArray(function (err, item) {
                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                        else {
                                                            var finalItem = [];
                                                            var finalItemArrObj = [];
                                                            var bwInfo = {};
                                                            var sessionFilter = {};

                                                            for (var i = 0; item.length > i; i++) {
                                                                sessionFilter = {
                                                                    SourceIp: item[i]['sessionFiltedInfo']['sourceIP'],
                                                                    SourcePort: [],
                                                                    DstAddress: item[i]['sessionFiltedInfo']['destAddress'],
                                                                    DstPort: [],
                                                                    Protocol: item[i]['sessionFiltedInfo']['protocol']
                                                                }

                                                                if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id']) {
                                                                    sessionFilter['SourcePort'].push(item[i]['ports']['srcPort'])
                                                                    sessionFilter['DstPort'].push(item[i]['ports']['dstPort'])
                                                                }

                                                                finalItemArrObj.push({
                                                                    bwInfo: {
                                                                        'timeStamp': item[i]['timeStamp'],
                                                                        'appInsId': item[i]['appIns_Id'],
                                                                        'requestType': item[i].requestType['reqstTypeDescription'],
                                                                        'sessionFilter': [sessionFilter],
                                                                        'fixedBWPriority': item[i]['fixedBWPriority'],
                                                                        'fixedAllocation': item[i]['fixedAllocation'],
                                                                        'allocationDirection': item[i]['allocationDirection']
                                                                    }
                                                                })

                                                                for (var j = 0; finalItemArrObj.length > j; j++) {
                                                                    for (var k = j + 1; finalItemArrObj.length > k; k++) {
                                                                        if (finalItemArrObj[j].bwInfo['appInsId'] == finalItemArrObj[k].bwInfo['appInsId']) {
                                                                            finalItemArrObj[j].bwInfo['sessionFilter'][0]['SourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['SourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['SourcePort'])
                                                                            finalItemArrObj[j].bwInfo['sessionFilter'][0]['DstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['DstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['DstPort'])
                                                                            finalItemArrObj.splice(k, 1);
                                                                            j = 0;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        console.log("Refresh db and check")
                                                        var result = {
                                                            statuscode: 200,
                                                            res: finalItemArrObj
                                                        }
                                                        callback(null, result)
                                                    })
                                                } //reqst ELSE
                                            }); //reqsr DB
                                        }
                                    });//ports DB
                                // }
                            // });//timeStamp DB
                        }
                    });//session DB
                }
            });//bwInfo DB
        }//main Else
    };

// 	var self = this;
// 	var db = self.app.db;
// 	var allocationId = req.params.allocationID
// 	var myobj = req.body
//
// 	if(myobj.sessionFilter === undefined){
//         console.log("No Body is passed");
//         var errorbody = {
//             "Problem Details" : {
//                 "type": "string",
//                 "title": "string",
//                 "status": 400,
//                 "detail": "string",
//                 "instance": "string"
//             }
//         };
//
//         var result = {
//             statuscode:400,
//             res:errorbody
//         };
//         callback(null, result)
// 	}// end of If
// 	else{
//         var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
//         var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
//         var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
//         var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
//         var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]
//
//         db.collection('bwInfo').findOneAndUpdate(
//             {"allocation_Id" : allocationId},
//             {
//                 $set :
//                     {
//                         "bwInfo_Id" : "bwInfo_4",
//                         "fixedBWPriority" : myobj.fixedBWPriority,
//                         "fixedAllocation" : myobj.fixedAllocation,
//                         "allocationDirection" : myobj.allocationDirection,
//                         "appIns_Id" : myobj.appInsId,
//                         "session_Id" : "session_3",
//                         "appInfo_Id" : "appInfo_3"
//                     }
//             }
//         )
//
//         db.collection('sessionFilter').findOneAndUpdate(
//             {"session_Id" : "session_3"},
//             {
//                 $set :
//                     {
//                         "sourceIP" : sessionFilter_sourceIp,
//                         "destAddress" : sessionFilter_dstAddress,
//                         "protocol" : sessionFilter_protocol,
//                         "appIns_Id" : myobj.appInsId,
//                     }
//             }
//         )
//
//         if (myobj['reqstType'] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || myobj['reqstType'] == "application_specific_bw_allocation"){
//             db.collection('bwInfo').findOneAndUpdate(
//                 {"bwInfo_Id" : "bwInfo_4"},
//                 {
//                     $set:
//                         {
//                             "reqstType" : "0"
//                         }
//                 }
//             )
//         }
//
//         else if (myobj['reqstType'] == "SESSION_SPECIFIC_BW_ALLOCATION" || myobj['reqstType'] == "session_specific_bw_allocation"){
//             db.collection('bwInfo').findOneAndUpdate(
//                 {"bwInfo_Id" : "bwInfo_4"},
//                 {
//                     $set:
//                         {
//                             "reqstType" : "1"
//                         }
//                 }
//             )
//         }
//
//         var mainLength;
//         if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
//             mainLength = sessionFilter_sourcePort.length
//         }
//         else{
//             mainLength = sessionFilter_dstPort.length
//         }
//         var sourcePort, destPort;
//         for(var i = 0; i < mainLength; i++){
//
//             if(sessionFilter_dstPort[i]){
//                 destPort = sessionFilter_dstPort[i]
//             }
//             else{
//                 destPort = ''
//             }
//             if(sessionFilter_sourcePort[i]){
//                 sourcePort = sessionFilter_sourcePort[i]
//             }
//             else{
//                 sourcePort = ''
//             }
//             db.collection('ports').findOneAndUpdate(
//                 {"session_Id" : "session_3"},
//                 {
//                     $set:
//                         {
//                             "port_Id" : "port_5",
//                             "srcPort" : sourcePort,
//                             "dstPort" : destPort,
//                         }
//                 }
//             )
//         }
//
//         //Querying the DB
//         var collection = db.collection('bwInfo')
//         collection.aggregate([
//             {
//                 $match:
//                     {
//                         allocation_Id : allocationId
//                     }
//             },
//
//             {
//                 $lookup:
//                     {
//                         from : "timeStamp",
//                         localField : "timeStamp_Id",
//                         foreignField : "timeStamp_Id",
//                         as : "timeStamp"
//                     }
//             },
//             {
//                 $unwind : "$timeStamp"
//             },
//
//             {
//                 $lookup:
//                     {
//                         from : "reqstType",
//                         localField : "reqstType",
//                         foreignField : "reqstType_Id",
//                         as : "requestType"
//                     }
//             },
//             {
//                 $unwind : "$requestType"
//             },
//
//             {
//                 $lookup:
//                     {
//                         from : "sessionFilter",
//                         localField : "appIns_Id",
//                         foreignField : "appIns_Id",
//                         as : "sessionFiltedInfo"
//                     }
//             },
//             {
//                 $unwind : "$sessionFiltedInfo"
//             },
//
//             {
//                 $lookup:
//                     {
//                         from : "ports",
//                         localField : "session_Id",
//                         foreignField : "session_Id",
//                         as : "ports"
//                     }
//             },
//             {
//                 $unwind : "$ports"
//             },
//
//             {
//                 $project:
//                     {
//                         _id : 0,
//                         requestType : 1,
//                         fixedBWPriority : 1,
//                         fixedAllocation : 1,
//                         allocationDirection : 1,
//                         appIns_Id : 1,
//                         "timeStamp.seconds" : 1 ,
//                         "timeStamp.nanoSeconds" : 1,
//
//                         "sessionFiltedInfo.session_Id" : 1,
//                         "sessionFiltedInfo.sourceIP" : 1,
//                         "ports" : 1,
//                         "sessionFiltedInfo.destAddress" : 1,
//                         "sessionFiltedInfo.protocol" : 1,
//                     }
//             }
//         ]).toArray(function(err, item){
//             if(err) {
//                 console.log(err)
//                 callback(null,err)
//             }
//             else{
//                 var finalItem = [];
//                 var finalItemArrObj = [];
//                 var bwInfo = {};
//                 var sessionFilter = {};
//
//                 for(var i = 0 ; item.length > i; i++){
//                     sessionFilter = {
//                         sourceIP : item[i]['sessionFiltedInfo']['sourceIP'],
//                         sourcePort : [],
//                         destAddress : item[i]['sessionFiltedInfo']['destAddress'],
//                         dstPort : [],
//                         protocol : item[i]['sessionFiltedInfo']['protocol']
//                     }
//
//                     if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id']){
//                         sessionFilter['sourcePort'].push(item[i]['ports']['srcPort'])
//                         sessionFilter['dstPort'].push(item[i]['ports']['dstPort'])
//                     }
//
//                     finalItemArrObj.push({
//                         bwInfo :{
//                             'timeStamp' : item[i]['timeStamp'],
//                             'appIns_Id' : item[i]['appIns_Id'],
//                             'requestType' : item[i].requestType['reqstTypeDescription'],
//                             'sessionFilter' : [sessionFilter],
//                             'fixedBWPriority' : item[i]['fixedBWPriority'],
//                             'fixedAllocation' : item[i]['fixedAllocation'],
//                             'allocationDirection' : item[i]['allocationDirection']
//                         }
//                     })
//
//                     for (var j = 0; finalItemArrObj.length > j; j++) {
//                         for (var k = j + 1; finalItemArrObj.length > k; k++) {
//                             if (finalItemArrObj[j].bwInfo['appIns_Id'] == finalItemArrObj[k].bwInfo['appIns_Id']) {
//                                 finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['sourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['sourcePort'])
//                                 finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['dstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['dstPort'])
//                                 finalItemArrObj.splice(k, 1);
//                                 j = 0;
//                             }
//                         }
//                     }
//                 }
//             }
//             console.log("Refresh and check the DB")
//             var result = {
//                 statuscode:"200",
//                 res:finalItemArrObj
//             }
//             callback(null,result)
//         })
//     }
//
// };


/**
 *
 * This method updates the information about a specific bandwidthAllocation resource.
 *
 * allocationId String Represents a bandwidth allocation instance
 * bwInfo BwInfo BwInfo with updated information is included as entity body of the request
 * returns inline_response_200
 *
**/
DefaultService.prototype.bw_allocationsAllocationIdPUT = function(req,callback) {
    console.log("This is bw_allocationsAllocationIdPUT method!!!");
    var self = this;
    var db = self.app.db;
    var allocationId = req.params.allocationID
    var myobj = req.body

    if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
        console.log("Parameters are INCORRECT")
        var errorbody = {
            "Problem Details": {
                "type": "string",
                "title": "string",
                "status": 400,
                "detail": "Incorrect parameters",
                "instance": "string"
            }
        };

        var result = {
            statuscode: 400,
            res: errorbody
        };
        callback(null, result)
    } else {

        db.collection('bwInfo').find({"allocation_Id": allocationId}).toArray(function (err, bwInfo_result) {
            if (err) {
                console.log(err);
                throw err;
            }
            else if (bwInfo_result.length <= 0) {
                var errorbody = {
                    "Problem Details": {
                        "type": "string",
                        "title": "string",
                        "status": 412,
                        "detail": "Allocation_Id doesn't match with any records",
                        "instance": "string"
                    }
                };

                var result = {
                    statuscode: 412,
                    res: errorbody
                };
                callback(null, result)
            }
            else {
                // console.log("ddddddddddddd", bwInfo_result);
                var session_Id = bwInfo_result[0].session_Id;
                db.collection('sessionFilter').find({"session_Id": session_Id}).toArray(function (err, session_result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    else if (session_result.length < 0) {
                        var errorbody = {
                            "Problem Details": {
                                "type": "string",
                                "title": "string",
                                "status": 412,
                                "detail": "Allocation_Id doesn't match with any records",
                                "instance": "string"
                            }
                        };

                        var result = {
                            statuscode: 412,
                            res: errorbody
                        };
                        callback(null, result)
                    }
                    else {
                        // console.log('ffffffffffffff', session_result);
                        var timeStamp_Id = bwInfo_result[0].timeStamp_Id
                        db.collection('timeStamp').find({"timeStamp_Id": timeStamp_Id}).toArray(function (err, time_result) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            else if (time_result.length < 0) {
                                var errorbody = {
                                    "Problem Details": {
                                        "type": "string",
                                        "title": "string",
                                        "status": 412,
                                        "detail": "Allocation_Id doesn't match with any records",
                                        "instance": "string"
                                    }
                                };

                                var result = {
                                    statuscode: 412,
                                    res: errorbody
                                };
                                callback(null, result)
                            }
                            else {
                                // console.log('hhhhhhhhhhhhhhhh', time_result)
                                db.collection('ports').find({"session_Id": session_Id}).toArray(function (err, ports_result) {
                                    if (err) {
                                        console.log(err);
                                        throw err;
                                    }
                                    else if (ports_result.length < 0) {
                                        var errorbody = {
                                            "Problem Details": {
                                                "type": "string",
                                                "title": "string",
                                                "status": 412,
                                                "detail": "Allocation_Id doesn't match with any records",
                                                "instance": "string"
                                            }
                                        };

                                        var result = {
                                            statuscode: 412,
                                            res: errorbody
                                        };
                                        callback(null, result)
                                    }
                                    else {
                                        // console.log('jjjjjjjjjjjjjj', ports_result)
                                        var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"];
                                        var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"];
                                        var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"];
                                        var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"];
                                        var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"];

                                        var query = {
                                            reqstTypeDescription: myobj.requestType
                                        };

                                        db.collection('reqstType').find(query).toArray(function (err, reqTypeResult) {
                                            if (err) {
                                                throw err;
                                            }
                                            else if (reqTypeResult.length === 0) {

                                                result = {
                                                    statuscode: 400,
                                                    res: {
                                                        "Problem Details": {
                                                            "type": "string",
                                                            "title": "string",
                                                            "status": 400,
                                                            "detail": "Request Type is not valid in database.",
                                                            "instance": "string"
                                                        }
                                                    }
                                                };
                                                callback(null, result)

                                            }
                                            else {  //reqst ELSE

                                                var reqstType = reqTypeResult[0].reqstType_Id;

                                                db.collection('bwInfo').findOneAndUpdate({"allocation_Id": allocationId},
                                                    {
                                                        $set:
                                                            {
                                                            	"reqstType":reqstType,
                                                                "fixedBWPriority": myobj.fixedBWPriority,
                                                                "fixedAllocation": myobj.fixedAllocation,
                                                                "allocationDirection": myobj.allocationDirection,
                                                                "appIns_Id": myobj.appInsId
                                                            }
                                                    });

                                                db.collection('timeStamp').findOneAndUpdate({"timeStamp_Id": timeStamp_Id},
                                                    {
                                                        $set:
                                                            {
                                                                "seconds": myobj.timeStamp["seconds"],
                                                                "nanoSeconds": myobj.timeStamp["nanoSeconds"]
                                                            }
                                                    });
                                                db.collection('sessionFilter').findOneAndUpdate({"session_Id": session_Id},
                                                    {
                                                        $set:
                                                            {
                                                                "sourceIP": sessionFilter_sourceIp,
                                                                "destAddress": sessionFilter_dstAddress,
                                                                "protocol": sessionFilter_protocol,
                                                                "appIns_Id": myobj.appInsId,
                                                            }
                                                    });

                                                db.collection('ports').findOneAndUpdate({"session_Id": session_Id},
                                                    {
                                                        $set:
                                                            {
                                                                "srcPort": sessionFilter_sourcePort[0],
                                                                "dstPort": sessionFilter_dstPort[0],
                                                            }
                                                    });

                                                var collection = db.collection('bwInfo');
                                                collection.aggregate([
                                                    {
                                                        $match:
                                                            {
                                                                allocation_Id: allocationId
                                                            }
                                                    },

                                                    {
                                                        $lookup:
                                                            {
                                                                from: "timeStamp",
                                                                localField: "timeStamp_Id",
                                                                foreignField: "timeStamp_Id",
                                                                as: "timeStamp"
                                                            }
                                                    },
                                                    {
                                                        $unwind: "$timeStamp"
                                                    },

                                                    {
                                                        $lookup:
                                                            {
                                                                from: "reqstType",
                                                                localField: "reqstType",
                                                                foreignField: "reqstType_Id",
                                                                as: "requestType"
                                                            }
                                                    },
                                                    {
                                                        $unwind: "$requestType"
                                                    },

                                                    {
                                                        $lookup:
                                                            {
                                                                from: "sessionFilter",
                                                                localField: "appIns_Id",
                                                                foreignField: "appIns_Id",
                                                                as: "sessionFiltedInfo"
                                                            }
                                                    },
                                                    {
                                                        $unwind: "$sessionFiltedInfo"
                                                    },

                                                    {
                                                        $lookup:
                                                            {
                                                                from: "ports",
                                                                localField: "session_Id",
                                                                foreignField: "session_Id",
                                                                as: "ports"
                                                            }
                                                    },
                                                    {
                                                        $unwind: "$ports"
                                                    },

                                                    {
                                                        $project:
                                                            {
                                                                _id: 0,
                                                                requestType: 1,
                                                                fixedBWPriority: 1,
                                                                fixedAllocation: 1,
                                                                allocationDirection: 1,
                                                                appIns_Id: 1,
                                                                "timeStamp.seconds": 1,
                                                                "timeStamp.nanoSeconds": 1,

                                                                "sessionFiltedInfo.session_Id": 1,
                                                                "sessionFiltedInfo.sourceIP": 1,
                                                                "ports": 1,
                                                                "sessionFiltedInfo.destAddress": 1,
                                                                "sessionFiltedInfo.protocol": 1,
                                                            }
                                                    }
                                                ]).toArray(function (err, item) {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    else {
                                                        var finalItem = [];
                                                        var finalItemArrObj = [];
                                                        var bwInfo = {};
                                                        var sessionFilter = {};

                                                        for (var i = 0; item.length > i; i++) {
                                                            sessionFilter = {
                                                                SourceIp: item[i]['sessionFiltedInfo']['sourceIP'],
                                                                SourcePort: [],
                                                                DstAddress: item[i]['sessionFiltedInfo']['destAddress'],
                                                                DstPort: [],
                                                                Protocol: item[i]['sessionFiltedInfo']['protocol']
                                                            }

                                                            if (item[i]['sessionFiltedInfo']['session_Id'] == item[i]['ports']['session_Id']) {
                                                                sessionFilter['SourcePort'].push(item[i]['ports']['srcPort'])
                                                                sessionFilter['DstPort'].push(item[i]['ports']['dstPort'])
                                                            }

                                                            finalItemArrObj.push({
                                                                bwInfo: {
                                                                    'timeStamp': item[i]['timeStamp'],
                                                                    'appInsId': item[i]['appIns_Id'],
                                                                    'requestType': item[i].requestType['reqstTypeDescription'],
                                                                    'sessionFilter': [sessionFilter],
                                                                    'fixedBWPriority': item[i]['fixedBWPriority'],
                                                                    'fixedAllocation': item[i]['fixedAllocation'],
                                                                    'allocationDirection': item[i]['allocationDirection']
                                                                }
                                                            })

                                                            for (var j = 0; finalItemArrObj.length > j; j++) {
                                                                for (var k = j + 1; finalItemArrObj.length > k; k++) {
                                                                    if (finalItemArrObj[j].bwInfo['appInsId'] == finalItemArrObj[k].bwInfo['appInsId']) {
                                                                        finalItemArrObj[j].bwInfo['sessionFilter'][0]['SourcePort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['SourcePort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['SourcePort'])
                                                                        finalItemArrObj[j].bwInfo['sessionFilter'][0]['DstPort'] = finalItemArrObj[j].bwInfo['sessionFilter'][0]['DstPort'].concat(finalItemArrObj[k].bwInfo['sessionFilter'][0]['DstPort'])
                                                                        finalItemArrObj.splice(k, 1);
                                                                        j = 0;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    console.log("Refresh db and check")
                                                    var result = {
                                                        statuscode: 200,
                                                        res: finalItemArrObj
                                                    }
                                                    callback(null, result)
                                                })
                                            } //reqst ELSE
                                        }); //reqsr DB
                                    }
                                });//ports DB
                            }
                        });//timeStamp DB
                    }
                });//session DB
            }
        });//bwInfo DB
    }//main Else
};


    /**
     * This method retrieves information about a list of bandwidthAllocation resources
     *
     * app_instance_id List A mobile edge application instance may use multiple app_instance_ids as an input parameter to query the bandwidth allocation of a list of mobile edge application instances.  (optional)
     * app_name List A mobile edge application instance may use multiple ser_names as an input parameter to query the bandwidth allocation of a list of mobile edge application instances.  (optional)
     * session_id List A mobile edge application instance may use session_id as an input parameter to query the bandwidth allocation of a list of sessions.  (optional)
     * returns inline_response_200
     **/
DefaultService.prototype.bw_allocationsGET = function (req, callback) {
        console.log("This is bw_allocationsGET method!!!");
        var self = this;
        var db = self.app.db;
        var app_instance_id, app_name, session_Id;
        if (req.app_instance_id) {
            app_instance_id = req.app_instance_id;
        }
        else {
            app_instance_id = null
        }

        if (req.app_name) {
            app_name = req.app_name
        }
        else {
            app_name = null
        }

        if (req.session_id) {
            session_Id = req.session_id;
        }
        else {
            session_Id = null
        }

        var collection = db.collection("BWM_API_swagger");

        if (app_instance_id != null && session_Id == null && app_name == null) {

            collection.find({"app_instance_id":app_instance_id}).toArray(function (err,resp) {
                if (resp){
                    callback(err,resp)
                }
                else{
                    callback(err,"can't find")
                }
                })
        }

        else if (app_instance_id == null && session_Id != null && app_name == null) {
            console.log(session_Id)
            collection.find({"session_id":session_Id}).toArray(function (err,resp) {
                if (resp){
                    callback(err,resp)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else if (app_instance_id == null && session_Id == null && app_name != null) {
            collection.find({"app_name":app_name}).toArray(function (err,resp) {
                if (resp){
                    callback(err,resp)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else if (app_instance_id != null && session_Id != null && app_name != null) {
            collection.find({"app_instance_id":app_instance_id,"app_name":app_name,"session_id":session_Id}).toArray(function (err,resp) {
                if (resp){
                    callback(err,resp)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else if (app_instance_id == null && session_Id == null && app_name == null) {
            collection.find().toArray(function (err,resp) {
                if (resp){
                    callback(err,resp)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else {
            console.log("ELSE BLOCK")
            var examples = {};
            examples['application/json'] = {
            	ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 400,
                    "detail": "Incorrect parameters passed",
                    "instance": "string"
                }
            };
            var result = {
                statuscode: 400,
                res: examples['application/json']
            };
            callback(null, result)
        }
    };


    /**
     * This method is used to create a bandwidthAllocation resource.
     *
     * bwInfo BwInfo BwInfo with updated information is included as entity body of the request
     * returns inline_response_200
     **/
DefaultService.prototype.bw_allocationsPOST = function (req, callback) {
        console.log("This is bw_allocationsPOST method!!!");
        var self = this;
        var db = self.app.db;

        var myobj = req;
        if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {

            console.log("No Body is passed")
            var errorbody = {
                "Problem Details": {
                    "type": "string",
                    "title": "string",
                    "status": 400,
                    "detail": "Please enter Request Body for the POST method",
                    "instance": "string"
                }
            };

            var result = {
                statuscode: 400,
                res: errorbody
            };
            callback(null, result)

        }
        else{

            // callback(null,myobj)
            var collection = db.collection("BWM_API_swagger");

            collection.insert(myobj,function(err,resp) {
                if(resp){
                    console.log(resp['ops']);
                    callback(err,resp['ops']);
                }
                else{
                    callback(err,'inserterror');
                }
            })
        }
    };

DefaultService.prototype.read_dbGET = function (req, callback) {
    console.log("This is read_dbGET method!!!");
    var self = this;
    var db = self.app.db;

    var myobj = parseInt(req)-1;
    // callback(null,myobj)
    var collection = db.collection("BWM_API_swagger");

    collection.find().toArray(function(err,resp) {
        if(resp){
            callback(err,resp[myobj]);
        }
        else{
            callback(err,'inserterror');
        }
    })
}