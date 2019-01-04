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
}
