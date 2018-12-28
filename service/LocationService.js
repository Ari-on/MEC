var LocationService = function (app) {
    this.app = app;
};

module.exports = LocationService;

LocationService.prototype.read_db = function (req, callback) {
    console.log("This is read_db method!!!");
    var self = this;
    var db = self.app.db;

    var myobj = parseInt(req.params.rowno)-1;
    var collection = db.collection("Location_API_swagger");

    collection.find().toArray(function(err,resp) {
        if(resp){
            callback(err,resp[myobj]);
        }
        else{
            callback(err,'finderror');
        }
    })
};

LocationService.prototype.zonesGet = function (req,callback) {

    console.log("LOCATION Method1");
    callback(null,"DONE LOCATION zonesGet");
};

LocationService.prototype.zonesGetById = function (req,callback) {

    console.log("LOCATION Method2");
    callback(null,"DONE LOCATION zonesGetById");
};

LocationService.prototype.zonesByIdGetAps = function (req,callback) {

    console.log("LOCATION Method3");
    callback(null,"DONE LOCATION zonesByIdGetAps");
};

LocationService.prototype.zonesByIdGetApsById = function (req,callback) {

    console.log("LOCATION Method4");
    callback(null,"DONE LOCATION zonesByIdGetApsById");
};

LocationService.prototype.usersGet = function (req,callback) {

    console.log("LOCATION Method5");
    callback(null,"DONE LOCATION usersGet");
};

LocationService.prototype.usersGetById = function (req,callback) {

    console.log("LOCATION Method6");
    callback(null,"DONE LOCATION usersGetById");
};

LocationService.prototype.zonalTrafficSubGet = function (req,callback) {
    console.log("This is zonalTrafficSubGet method!!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection("Location_API_swagger");
    collection.find({},{"zonalTrafficSubscription":1,"_id":0}).toArray(function (err,resp) {
        if (resp){
            var newArray = resp.filter(value => Object.keys(value).length !== 0);
            var zonalTrafficSubscription = newArray.map(function(obj){
                return obj.zonalTrafficSubscription;
            });
            var result = {
                statuscode: 200,
                notificationSubscriptionList:{zonalTrafficSubscription: zonalTrafficSubscription}
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

LocationService.prototype.zonalTrafficSubPost = function (req,callback) {

    console.log("This is zonalTrafficSubPost method!!!");
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
                "zonalTraffic" : 0,
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('Location')){
            var counter = (resp1[0]["Location"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"Location.zonalTraffic":counter.zonalTraffic + 1}},function(err,docs) {
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
                "zonalTraffic" : 0,
            }
        }

        var collection = db.collection("Location_API_swagger");
        var zonalTrafficSubscription = {
            "subscriptionId" : "zonalTraffic"+(counter.zonalTraffic + 1).toString(),
            "zonalTrafficSubscription" : myobj
        };
        collection.insert(zonalTrafficSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    zonalTrafficSubscription: resp['ops'][0]['zonalTrafficSubscription']
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

LocationService.prototype.zonalTrafficSubGetById = function (req,callback) {

    console.log("This is zonalTrafficSubGetById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId
    var collection = db.collection("Location_API_swagger");
    collection.find({"subscriptionId" : subscriptionId},{"zonalTrafficSubscription":1,"_id":0}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                zonalTrafficSubscription: resp[0]['zonalTrafficSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

LocationService.prototype.zonalTrafficSubPutById = function (req,callback) {

    console.log("This is zonalTrafficSubPutById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("Location_API_swagger");
    var criteria={
        condition:{
            "subscriptionId" : subscriptionId
        },
        value:{
            "zonalTrafficSubscription" : myobj
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
                zonalTrafficSubscription: myobj
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });
};

LocationService.prototype.zonalTrafficSubDelById = function (req,callback) {

    console.log("This is zonalTrafficSubDelById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId
    var collection = db.collection("Location_API_swagger");
    collection.removeOne({"subscriptionId" : subscriptionId},function(err, resp) {
        if (resp) {
            callback(err, '')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

LocationService.prototype.userTrackingSubGet = function (req,callback) {
    console.log("This is userTrackingSubGet method!!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection("Location_API_swagger");
    collection.find({},{"userTrackingSubscription":1,"_id":0}).toArray(function (err,resp) {
        if (resp){
            var newArray = resp.filter(value => Object.keys(value).length !== 0);
            var userTrackingSubscription = newArray.map(function(obj){
                return obj.userTrackingSubscription;
            });
            var result = {
                statuscode: 200,
                notificationSubscriptionList:{userTrackingSubscription: userTrackingSubscription}
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

LocationService.prototype.userTrackingSubPost = function (req,callback) {

    console.log("This is userTrackingSubPost method!!!");
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
                "userTracking" : 0,
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('Location')){
            var counter = (resp1[0]["Location"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"Location.userTracking":counter.userTracking + 1}},function(err,docs) {
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
                "userTracking" : 0,
            }
        }

        var collection = db.collection("Location_API_swagger");
        var zonalTrafficSubscription = {
            "subscriptionId" : "userTracking"+(counter.userTracking + 1).toString(),
            "userTrackingSubscription" : myobj
        };
        collection.insert(zonalTrafficSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    userTrackingSubscription: resp['ops'][0]['userTrackingSubscription']
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

LocationService.prototype.userTrackingSubGetById = function (req,callback) {

    console.log("This is userTrackingSubGetById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var collection = db.collection("Location_API_swagger");
    collection.find({"subscriptionId" : subscriptionId},{"userTrackingSubscription":1,"_id":0}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                userTrackingSubscription: resp[0]['userTrackingSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

LocationService.prototype.userTrackingSubPutById = function (req,callback) {

    console.log("This is userTrackingSubPutById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body
    var collection = db.collection("Location_API_swagger");
    var criteria={
        condition:{
            "subscriptionId" : subscriptionId
        },
        value:{
            "userTrackingSubscription" : myobj
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
                userTrackingSubscription: myobj
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });
};

LocationService.prototype.userTrackingSubDelById = function (req,callback) {

    console.log("This is userTrackingSubDelById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId
    var collection = db.collection("Location_API_swagger");
    collection.removeOne({"subscriptionId" : subscriptionId},function(err, resp) {
        if (resp) {
            callback(err, '')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

LocationService.prototype.zoneStatusGet = function (req,callback) {

    console.log("This is zoneStatusGet method!!!");
    var self = this;
    var db = self.app.db;
    var collection = db.collection("Location_API_swagger");
    collection.find({},{"zoneStatusSubscription":1,"_id":0}).toArray(function (err,resp) {
        if (resp){
            var newArray = resp.filter(value => Object.keys(value).length !== 0);
            var zoneStatusSubscription = newArray.map(function(obj){
                return obj.zoneStatusSubscription;
            });
            var result = {
                statuscode: 200,
                notificationSubscriptionList:{zoneStatusSubscription: zoneStatusSubscription}
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

LocationService.prototype.zoneStatusPost = function (req,callback) {

    console.log("This is zoneStatusPost method!!!");
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
                "zonalStatus" : 0,
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('Location')){
            var counter = (resp1[0]["Location"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"Location.zonalStatus":counter.zonalStatus + 1}},function(err,docs) {
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
                "zonalStatus" : 0,
            }
        }

        var collection = db.collection("Location_API_swagger");
        var zonalTrafficSubscription = {
            "subscriptionId" : "zonalStatus"+(counter.zonalStatus + 1).toString(),
            "zoneStatusSubscription" : myobj
        };
        collection.insert(zonalTrafficSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    zoneStatusSubscription: resp['ops'][0]['zoneStatusSubscription']
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

LocationService.prototype.zoneStatusGetById = function (req,callback) {

    console.log("This is zoneStatusGetById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId
    var collection = db.collection("Location_API_swagger");
    collection.find({"subscriptionId" : subscriptionId},{"zoneStatusSubscription":1,"_id":0}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                zoneStatusSubscription: resp[0]['zoneStatusSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

LocationService.prototype.zoneStatusPutById = function (req,callback) {

    console.log("This is zoneStatusPutById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body
    var collection = db.collection("Location_API_swagger");
    var criteria={
        condition:{
            "subscriptionId" : subscriptionId
        },
        value:{
            "zoneStatusSubscription" : myobj
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
                zoneStatusSubscription: myobj
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });
};

LocationService.prototype.zoneStatusDelById = function (req,callback) {

    console.log("This is zoneStatusDelById method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId
    var collection = db.collection("Location_API_swagger");
    collection.removeOne({"subscriptionId" : subscriptionId},function(err, resp) {
        if (resp) {
            callback(err, '')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};