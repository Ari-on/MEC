'use strict';

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var commonService = function (app) {
    this.app = app;
};


module.exports = commonService;

commonService.prototype.commonGET = function(req,collectionName,callback) {

    console.log("This is commonGET service!!!");
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

commonService.prototype.commonPOST = function(myobj,collectionName,callback) {

    console.log("This is commonPOST service!!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection(collectionName);


    collection.insert(myobj,function(err,resp) {
        if(resp){
            callback(err,resp['ops']);
        }
        else{
            callback(err,'inserterror');
        }
    });
};

commonService.prototype.commonUpdate = function(condition,updation,collectionName,callback) {

    console.log("This is commonUpdate service!!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection(collectionName);

    collection.update(condition,updation,function(err,resp) {
        if(resp){
            callback(err,resp['result']);
        }
        else{
            callback('updateError',null);
        }

    });
};

commonService.prototype.commonDelete = function(condition,collectionName,callback) {

    console.log("This is commonDelete service !!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection(collectionName);

    collection.remove(condition, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    });
};
