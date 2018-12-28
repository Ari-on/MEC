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

DefaultService.prototype.read_db = function (req, callback) {
    console.log("This is read_dbGET method!!!");
    var self = this;
    var db = self.app.db;

    var myobj = parseInt(req.params.rowno)-1;
    var collection = db.collection("BWM_API_swagger");

    collection.find().toArray(function(err,resp) {
        if(resp){
            callback(err,resp[myobj]);
        }
        else{
            callback(err,'finderror');
        }
    })
};


DefaultService.prototype.bw_allocationsAllocationIdDELETE = function(req,callback) {

	console.log("This is bw_allocationsAllocationIdDELETE method!!!");
	var self = this;
	var db = self.app.db;

	var myquery = {
	    allocationId : req.params.allocationID
	};
	var collation = db.collection('BWM_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
          callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
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
            var result = {
                statuscode: 200,
                bwInfo: resp[0]['bwInfo']
            };
            callback(err,result)
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
        var collection = db.collection("BWM_API_swagger");
        // if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
        //     console.log("Parameters are INCORRECT");
        //     var errorbody = {
        //         "Problem Details": {
        //             "type": "string",
        //             "title": "string",
        //             "status": 400,
        //             "detail": "Incorrect parameters",
        //             "instance": "string"
        //         }
        //     };
        //
        //     var result = {
        //         statuscode: 400,
        //         res: errorbody
        //     };
        //     callback(null, result)
        // } else {
    var criteria={
        condition:{
            "allocationId" : allocationId
        },
        value:{
            "bwInfo.fixedBWPriority" : myobj.fixedBWPriority,
            "bwInfo.allocationDirection" : myobj.allocationDirection,
            "bwInfo.appInsId" : myobj.appInsId,
            "bwInfo.sessionFilter" : myobj.sessionFilter,
            "bwInfo.requestType" : myobj.requestType,
            "bwInfo.fixedAllocation" : myobj.fixedAllocation
        },
        options:{
            multi:false,
            upsert:false
        }
    };
    collection.findAndModify(criteria.condition,{},{$set:criteria.value},{new: true},function(err,resp) {
        if(resp){
            var result = {
                statuscode:200,
                bwInfo: resp.value.bwInfo
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });
};


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
    var allocationId = req.params.allocationID;
    var myobj = req.body;
    var collection = db.collection("BWM_API_swagger");

    // if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
    //     console.log("Parameters are INCORRECT")
    //     var errorbody = {
    //         "Problem Details": {
    //             "type": "string",
    //             "title": "string",
    //             "status": 400,
    //             "detail": "Incorrect parameters",
    //             "instance": "string"
    //         }
    //     };
    //
    //     var result = {
    //         statuscode: 400,
    //         res: errorbody
    //     };
    //     callback(null, result)
    // } else {
    var criteria={
        condition:{
            "allocationId" : allocationId
        },
        value:{
            "bwInfo" : myobj
        },
        options:{
            multi:false,
            upsert:false
        }
    };
    collection.update(criteria.condition,{$set:criteria.value},function(err,resp) {
        if(resp){
            var result = {
                statuscode:200,
                bwInfo: myobj
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
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

            collection.find({"app_instance_id":app_instance_id},{"bwInfo":1,"_id":0}).toArray(function (err,resp) {
                if (resp){
                    var newArray = resp.filter(value => Object.keys(value).length !== 0);
                    var result = {
                        statuscode: 200,
                        res: newArray
                    };
                    callback(err,result)
                }
                else{
                    callback(err,"can't find")
                }
                })
        }

        else if (app_instance_id == null && session_Id != null && app_name == null) {
            collection.find({"session_id":session_Id},{"bwInfo":1,"_id":0}).toArray(function (err,resp) {
                if (resp){
                    var newArray = resp.filter(value => Object.keys(value).length !== 0);
                    var result = {
                        statuscode: 200,
                        res: newArray
                    };
                    callback(err,result)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else if (app_instance_id == null && session_Id == null && app_name != null) {
            collection.find({"app_name":app_name},{"bwInfo":1,"_id":0}).toArray(function (err,resp) {
                if (resp){
                    var newArray = resp.filter(value => Object.keys(value).length !== 0);
                    var result = {
                        statuscode: 200,
                        res: newArray
                    };
                    callback(err,result)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else if (app_instance_id != null && session_Id != null && app_name != null) {
            collection.find({"app_instance_id":app_instance_id,"app_name":app_name,"session_id":session_Id},{"bwInfo":1,"_id":0}).toArray(function (err,resp) {
                if (resp){
                    var newArray = resp.filter(value => Object.keys(value).length !== 0);
                    var result = {
                        statuscode: 200,
                        res: newArray
                    };
                    callback(err,result)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else if (app_instance_id == null && session_Id == null && app_name == null) {
            collection.find({},{"bwInfo":1,"_id":0}).toArray(function (err,resp) {
                if (resp){
                    var newArray = resp.filter(value => Object.keys(value).length !== 0);
                    var result = {
                        statuscode: 200,
                        bwInfo: newArray
                    };
                    callback(err,result)
                }
                else{
                    callback(err,"can't find")
                }
            })
        }

        else {
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

        var myobj = req.body;
        // if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
        //
        //     console.log("No Body is passed")
        //     var errorbody = {
        //         "Problem Details": {
        //             "type": "string",
        //             "title": "string",
        //             "status": 400,
        //             "detail": "Please enter Request Body for the POST method",
        //             "instance": "string"
        //         }
        //     };
        //
        //     var result = {
        //         statuscode: 400,
        //         res: errorbody
        //     };
        //     callback(null, result)
        //
        // }
        // else{

            // callback(null,myobj)
            var collection1 = db.collection("counter");
            collection1.find().toArray(function(err,resp1) {
                if (err){
                    var counter = {
                        "app_instance_id" : 0,
                        "app_name" : 0,
                        "session_id" : 0,
                        "allocationId" : 0,
                    }
                }
                else if(resp1.length > 0 && resp1[0].hasOwnProperty('BWM')){
                    var counter = (resp1[0]["BWM"])
                    var criteria={
                        condition:{ },
                        value:{
                            "app_instance_id" : (counter.app_instance_id + 1),
                            "app_name" : (counter.app_name + 1),
                            "session_id" : (counter.session_id + 1),
                            "allocationId" : (counter.allocationId + 1),
                        },
                        options:{
                            multi:false,
                            upsert:false
                        }
                    };
                    collection1.update(criteria.condition,{$set:{BWM:criteria.value}},function(err,docs) {
                        if(docs){
                            console.log("counter updated")
                        }
                        else{
                            console.log("Error in counter update")
                        }
                    });
                }
                else{
                    var counter = {
                        "app_instance_id" : 0,
                        "app_name" : 0,
                        "session_id" : 0,
                        "allocationId" : 0,
                    }
                }

                var collection = db.collection("BWM_API_swagger");
                var bwInfo = {
                    "app_instance_id" : (counter.app_instance_id + 1).toString(),
                    "app_name" : (counter.app_name + 1).toString(),
                    "session_id" : (counter.session_id + 1).toString(),
                    "allocationId" : (counter.allocationId + 1).toString(),
                    "bwInfo" : myobj
                };
                collection.insert(bwInfo,function(err,resp) {
                    if(resp){
                        var result = {
                            statuscode:201,
                            bwInfo: resp['ops'][0]['bwInfo']
                        };
                        callback(err,result);
                    }
                    else{
                        callback(err,'inserterror');
                    }
                })
            });

    // }
    };


DefaultService.prototype.commanPOST = function (req, callback) {
    console.log("This is commonPOST method!!!");
    var self = this;
    var db = self.app.db;

    var url = req.originalUrl;
    if (url.includes('/bwm/v1')){
        var collectionName = "BWM_API_swagger"
    }
    else if (url.includes('/mx2/v1')){
        var collectionName = "UE_Application_Interface_API_swagger"
    }
    else if (url.includes('/exampleAPI/mp1')){
        var collectionName = "Mp1_API_swagger"
    }
    else if (url.includes('/exampleAPI/location')){
        var collectionName = "Location_API_swagger"
    }
    else if (url.includes('/rni/v1')){
        var collectionName = "RNI_API_swagger"
    }
    var myobj = req.body;
    // if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
    //     console.log("No Body is passed")Location_API_swagger
    //     var errorbody = {
    //         "Problem Details": {
    //             "type": "string",
    //             "title": "string",
    //             "status": 400,
    //             "detail": "Please enter Request Body for the POST method",
    //             "instance": "string"
    //         }
    //     };
    //
    //     var result = {
    //         statuscode: 400,
    //         res: errorbody
    //     };
    //     callback(null, result)
    //
    // }
    // else{

        // callback(null,myobj)
    var collection = db.collection(collectionName);

    collection.insert(myobj,function(err,resp) {
        if(resp){
            callback(err,resp['ops']);
        }
        else{
            callback(err,'inserterror');
        }
    });
    // }
};