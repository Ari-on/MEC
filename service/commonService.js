'use strict';

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var commonService = function (app) {
    this.app = app;
};


module.exports = commonService;

commonService.prototype.commonGET = function(req,collectionName,callback) {

    console.log("This is commonGET method!!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection(collectionName);

    collection.find(req).toArray(function (err,resp) {
        if (resp){
            // var newArray = resp.filter(value => Object.keys(value).length !== 0);
            // var result = {
            //     statuscode: 200,
            //     res: newArray
            // };
            callback(err,resp)
        }
        else{
            callback(err,"can't find")
        }
    })
};

// commonService.prototype.commonPOST = function(req,collectionName,callback) {
//
//     console.log("This is commonPOST method!!!");
//     var self = this;
//     var db = self.app.db;
//
//     var myobj = req.body;
//     // if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
//     //
//     //     console.log("No Body is passed")
//     //     var errorbody = {
//     //         "Problem Details": {
//     //             "type": "string",
//     //             "title": "string",
//     //             "status": 400,
//     //             "detail": "Please enter Request Body for the POST method",
//     //             "instance": "string"
//     //         }
//     //     };
//     //
//     //     var result = {
//     //         statuscode: 400,
//     //         res: errorbody
//     //     };
//     //     callback(null, result)
//     //
//     // }
//     // else{
//
//     // callback(null,myobj)
//     var collection1 = db.collection("counter");
//     collection1.find().toArray(function(err,resp1) {
//         if (err){
//             var counter = {
//                 "app_instance_id" : 0,
//                 "app_name" : 0,
//                 "session_id" : 0,
//                 "allocationId" : 0,
//             }
//         }
//         else if(resp1.length > 0 && resp1[0].hasOwnProperty('BWM')){
//             var counter = (resp1[0]["BWM"]);
//             var criteria={
//                 condition:{ },
//                 value:{
//                     "app_instance_id" : (counter.app_instance_id + 1),
//                     "app_name" : (counter.app_name + 1),
//                     "session_id" : (counter.session_id + 1),
//                     "allocationId" : (counter.allocationId + 1),
//                 },
//                 options:{
//                     multi:false,
//                     upsert:false
//                 }
//             };
//             collection1.update(criteria.condition,{$set:{BWM:criteria.value}},function(err,docs) {
//                 if(docs){
//                     console.log("counter updated")
//                 }
//                 else{
//                     console.log("Error in counter update")
//                 }
//             });
//         }
//         else{
//             var counter = {
//                 "app_instance_id" : 0,
//                 "app_name" : 0,
//                 "session_id" : 0,
//                 "allocationId" : 0,
//             }
//         }
//
//         var collection = db.collection(collectionName);
//         var bwInfo = {
//             "app_instance_id" : (counter.app_instance_id + 1).toString(),
//             "app_name" : (counter.app_name + 1).toString(),
//             "session_id" : (counter.session_id + 1).toString(),
//             "allocationId" : (counter.allocationId + 1).toString(),
//             "bwInfo" : myobj
//         };
//         collection.insert(bwInfo,function(err,resp) {
//             if(resp){
//                 var result = {
//                     statuscode:201,
//                     bwInfo: resp['ops'][0]['bwInfo']
//                 };
//                 callback(err,result);
//             }
//             else{
//                 callback(err,'inserterror');
//             }
//         })
//     });
//
//     // }
// };