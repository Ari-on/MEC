var Mp1Service = function (app) {
    this.app = app;
};

module.exports = Mp1Service;

Mp1Service.prototype.ApplicationsDnsRules_GET = function (req,callback) {

    console.log("Mp1 Method1");
    callback(null,"DONE Mp1 ApplicationsDnsRules_GET");
};

Mp1Service.prototype.ApplicationsDnsRule_GET = function (req,callback) {

    console.log("Mp1 Method2");
    callback(null,"DONE Mp1 ApplicationsDnsRule_GET");
};

Mp1Service.prototype.ApplicationsDnsRule_PUT = function (req,callback) {

    console.log("Mp1 Method3");
    callback(null,"DONE Mp1 ApplicationsDnsRule_PUT");
};

Mp1Service.prototype.ApplicationsSubscriptions_GET = function (req,callback) {

    console.log("Mp1 Method4");
    callback(null,"DONE Mp1 ApplicationsSubscriptions_GET");
};

Mp1Service.prototype.ApplicationsSubscriptions_POST = function (req,callback) {

    console.log("This is ApplicationsSubscriptions_POST!!!");
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
    var collection = db.collection("Mp1_API_swagger");
    var bwInfo = {
        "AppTerminationNotificationSubscription" : myobj
    };
    collection.insert(bwInfo,function(err,resp) {
        if(resp){
            var result = {
                statuscode:201,
                AppTerminationNotificationSubscription: resp['ops'][0]['AppTerminationNotificationSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'inserterror');
        }
    })
    // }
};

Mp1Service.prototype.ApplicationsSubscription_GET = function (req,callback) {

    console.log("Mp1 Method6");
    callback(null,"DONE Mp1 ApplicationsSubscription_GET");
};

Mp1Service.prototype.ApplicationsSubscription_DELETE = function (req,callback) {

    console.log("Mp1 Method7");
    callback(null,"DONE Mp1 ApplicationsSubscription_DELETE");
};

Mp1Service.prototype.ApplicationsTrafficRules_GET = function (req,callback) {

    console.log("Mp1 Method8");
    callback(null,"DONE Mp1 ApplicationsTrafficRules_GET");
};

Mp1Service.prototype.ApplicationsTrafficRule_GET = function (req,callback) {

    console.log("Mp1 Method9");
    callback(null,"DONE Mp1 ApplicationsTrafficRule_GET ");
};

Mp1Service.prototype.ApplicationsTrafficRules_PUT = function (req,callback) {

    console.log("Mp1 Method10");
    callback(null,"DONE Mp1 ApplicationsTrafficRules_PUT");
};

Mp1Service.prototype.Services_GET = function (req,callback) {

    console.log("This is Services_GET method!!!");
    var self = this;
    var db = self.app.db;
    var ser_instance_id, ser_name, ser_category_id;
    if (req.ser_instance_id) {
        ser_instance_id = req.ser_instance_id;
    }
    else {
        ser_instance_id = null
    }

    if (req.ser_name) {
        ser_name = req.ser_name
    }
    else {
        ser_name = null
    }

    if (req.ser_category_id) {
        ser_category_id = req.ser_category_id;
    }
    else {
        ser_category_id = null
    }

    var collection = db.collection("Mp1_API_swagger");

    if (ser_instance_id != null && ser_category_id == null && ser_name == null) {

        collection.find({"ServiceInfo.serInstanceId":ser_instance_id},{"ServiceInfo":1,"_id":0}).toArray(function (err,resp) {
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

    else if (ser_instance_id == null && ser_category_id != null && ser_name == null) {
        collection.find({"ServiceInfo.serCategory.id":ser_category_id},{"ServiceInfo":1,"_id":0}).toArray(function (err,resp) {
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

    else if (ser_instance_id == null && ser_category_id == null && ser_name != null) {
        collection.find({"ServiceInfo.serName":ser_name},{"ServiceInfo":1,"_id":0}).toArray(function (err,resp) {
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

    else if (ser_instance_id != null && ser_category_id != null && ser_name != null) {
        collection.find({"ServiceInfo.serInstanceId":ser_instance_id,"ServiceInfo.serName":ser_name,"ServiceInfo.serCategory.id":ser_category_id},{"ServiceInfo":1,"_id":0}).toArray(function (err,resp) {
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

    else if (ser_instance_id == null && ser_category_id == null && ser_name == null) {
        collection.find({},{"ServiceInfo":1,"_id":0}).toArray(function (err,resp) {
            if (resp){
                var newArray = resp.filter(value => Object.keys(value).length !== 0);
                var result = {
                    statuscode: 200,
                    ServiceInfo: newArray
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

Mp1Service.prototype.Services_POST = function (req,callback) {

    console.log("This is Services_POST method!!!");
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
        if (err) {
            var counter = {
                "serviceId": 0,
            }
        }
        else if (resp1.length > 0 && resp1[0].hasOwnProperty('MP1')) {
            var counter = (resp1[0]["MP1"])
            var criteria = {
                condition: {},
                value: {
                    "serviceId": (counter.serviceId + 1)
                },
                options: {
                    multi: false,
                    upsert: false
                }
            };
            collection1.update(criteria.condition, {$set: {MP1: criteria.value}}, function (err, docs) {
                if (docs) {
                    console.log("counter updated")
                } else {
                    console.log("Error in counter update")
                }
            });
        } else {
            var counter = {
                "serviceId": 0
            }
        }

        var collection = db.collection("Mp1_API_swagger");
        var bwInfo = {
            "serviceId": (counter.serviceId + 1).toString(),
            "ServiceInfo": myobj
        };
        collection.insert(bwInfo, function (err, resp) {
            if (resp) {
                var result = {
                    statuscode: 201,
                    ServiceInfo: resp['ops'][0]['ServiceInfo']
                };
                callback(err, result);
            } else {
                callback(err, 'inserterror');
            }
        })
    });

    // }
};

Mp1Service.prototype.ServicesServiceId_GET = function (req,callback) {

    console.log("This is ServicesServiceId_GET method!!!");
    var self = this;
    var db = self.app.db;
    var serviceId = req.params.serviceId;

    var collection = db.collection('Mp1_API_swagger');
    collection.find({"serviceId":serviceId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                ServiceInfo: resp[0]['ServiceInfo']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

Mp1Service.prototype.ServicesServiceId_PUT = function (req,callback) {

    console.log("This is bw_allocationsAllocationIdPUT method!!!");
    var self = this;
    var db = self.app.db;
    var serviceId = req.params.serviceId;
    var myobj = req.body;
    var collection = db.collection("Mp1_API_swagger");

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
            "serviceId" : serviceId
        },
        value:{
            "ServiceInfo" : myobj
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
                ServiceInfo: myobj
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

Mp1Service.prototype.TimingCurrentTime_GET = function (req,callback) {

    console.log("Mp1 Method15");
    callback(null,"DONE Mp1 TimingCurrentTime_GET");
};

Mp1Service.prototype.TimingCaps_GET = function (req,callback) {

    console.log("Mp1 Method16");
    callback(null,"DONE Mp1 TimingCaps_GET");
};

Mp1Service.prototype.Transports_GET = function (req,callback) {

    console.log("Mp1 Method17");
    callback(null,"DONE Mp1 Transports_GET");
};


