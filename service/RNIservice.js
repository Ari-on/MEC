var RNIservice = function (app) {
    this.app = app;
};

module.exports = RNIservice;

RNIservice.prototype.rab_infoGET = function (req,callback) {

    console.log("RNI Method1");
    callback(null,"DONE rab_infoGET");
};

RNIservice.prototype.plmn_infoGET = function (req,callback) {

    console.log("RNI Method2");
    callback(null,"DONE plmn_infoGET");
};

RNIservice.prototype.s1_bearer_infoGET = function (req,callback) {

    console.log("RNI Method3");
    callback(null,"DONE s1_bearer_infoGET");
};

RNIservice.prototype.SubscriptionLinkList_subscriptionsGET = function (req,callback) {

    console.log("RNI Method4");
    callback(null,"DONE SubscriptionLinkList_subscriptionsGET");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_cc_GET = function (req,callback) {

    console.log("RNI Method5");
    callback(null,"DONE SubscriptionLinkList_subscriptions_cc_GET");
};

RNIservice.prototype.CellChange_subscriptionsPOST = function (req,callback) {

    console.log("This is CellChange_subscriptionsPOST method!!!");
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
                "cell_change_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.cell_change_subscriptionId": counter.cell_change_subscriptionId + 1}},function(err,docs) {
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
                "cell_change_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "CellChangeSubscription"+(counter.cell_change_subscriptionId + 1).toString(),
            "CellChangeSubscription" : myobj['CellChangeSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    CellChangeSubscription: resp['ops'][0]['CellChangeSubscription']
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

RNIservice.prototype.CellChange_subscriptionsGET = function (req,callback) {

    console.log("This is CellChange_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                CellChangeSubscription: resp[0]['CellChangeSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.CellChange_subscriptionsPUT = function (req,callback) {

    console.log("This is CellChange_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "CellChangeSubscription" : myobj['CellChangeSubscriptions']
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
                CellChangeSubscription: myobj['CellChangeSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.CellChange_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is CellChange_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_s1_GET = function (req,callback) {

    console.log("RNI Method10");
    callback(null,"DONE SubscriptionLinkList_subscriptions_s1_GET");
};

RNIservice.prototype.S1BearerSubscription_subscriptionsPOST = function (req,callback) {

    console.log("This is S1BearerSubscription_subscriptionsPOST method!!!");
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
                "s1_bearer_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.s1_bearer_subscriptionId": counter.s1_bearer_subscriptionId + 1}},function(err,docs) {
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
                "s1_bearer_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "S1BearerSubscription"+(counter.s1_bearer_subscriptionId + 1).toString(),
            "S1BearerSubscription" : myobj['S1BearerSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    S1BearerSubscription: resp['ops'][0]['S1BearerSubscription']
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

RNIservice.prototype.S1BearerSubscription_subscriptionsGET = function (req,callback) {

    console.log("This is S1BearerSubscription_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                S1BearerSubscription: resp[0]['S1BearerSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.S1BearerSubscription_subscriptionsPUT = function (req,callback) {

    console.log("This is S1BearerSubscription_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "S1BearerSubscription" : myobj['S1BearerSubscription']
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
                S1BearerSubscription: myobj['S1BearerSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.S1Bearer_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is S1Bearer_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_ta_GET = function (req,callback) {

    console.log("RNI Method15");
    callback(null,"DONE SubscriptionLinkList_subscriptions_ta_GET");
};

RNIservice.prototype.MeasTa_subscriptionsPOST = function (req,callback) {

    console.log("This is MeasTa_subscriptionsPOST method!!!");
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
                "ta_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.ta_subscriptionId": counter.ta_subscriptionId + 1}},function(err,docs) {
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
                "ta_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "MeasTaSubscription"+(counter.ta_subscriptionId + 1).toString(),
            "MeasTaSubscription" : myobj['MeasTaSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    MeasTaSubscription: resp['ops'][0]['MeasTaSubscription']
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

RNIservice.prototype.MeasTa_subscriptionsGET = function (req,callback) {

    console.log("This is MeasTa_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                MeasTaSubscription: resp[0]['MeasTaSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.MeasTa_subscriptionsPUT = function (req,callback) {

    console.log("This is S1BearerSubscription_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "MeasTaSubscription" : myobj['MeasTaSubscription']
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
                MeasTaSubscription: myobj['MeasTaSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.MeasTa_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is S1Bearer_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_mr_GET = function (req,callback) {

    console.log("RNI Method20");
    callback(null,"DONE SubscriptionLinkList_subscriptions_mr_GET");
};

RNIservice.prototype.MeasRepUe_subscriptionsPOST = function (req,callback) {

    console.log("This is MeasRepUe_subscriptionsPOST method!!!");
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
                "meas_rep_ue_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"])
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.meas_rep_ue_subscriptionId": counter.meas_rep_ue_subscriptionId + 1}},function(err,docs) {
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
                "meas_rep_ue_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "MeasRepUeSubscription"+(counter.meas_rep_ue_subscriptionId + 1).toString(),
            "MeasRepUeSubscription" : myobj['MeasRepUeSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    MeasRepUeSubscription: resp['ops'][0]['MeasRepUeSubscription']
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

RNIservice.prototype.MeasRepUe_subscriptionsGET = function (req,callback) {

    console.log("This is MeasRepUe_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                MeasRepUeSubscription: resp[0]['MeasRepUeSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.MeasRepUeReport_subscriptionsPUT = function (req,callback) {

    console.log("This is MeasRepUeReport_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "MeasRepUeSubscription" : myobj['MeasRepUeSubscription']
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
                MeasRepUeSubscription: myobj['MeasRepUeSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.MeasRepUe_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is MeasRepUe_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_re_GET = function (req,callback) {

    console.log("RNI Method25");
    callback(null,"DONE SubscriptionLinkList_subscriptions_re_GET");
};

RNIservice.prototype.RabEstSubscription_subscriptionsPOST = function (req,callback) {

    console.log("This is RabEstSubscription_subscriptionsPOST method!!!");
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
                "rab_est_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"]);
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.rab_est_subscriptionId": counter.rab_est_subscriptionId + 1}},function(err,docs) {
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
                "rab_est_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "RabEstSubscription"+(counter.rab_est_subscriptionId + 1).toString(),
            "RabEstSubscription" : myobj['RabEstSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    RabEstSubscription: resp['ops'][0]['RabEstSubscription']
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


RNIservice.prototype.RabEstSubscription_subscriptionsGET = function (req,callback) {

    console.log("This is RabEstSubscription_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                RabEstSubscription: resp[0]['RabEstSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};


RNIservice.prototype.RabEstSubscription_subscriptionsPUT = function (req,callback) {

    console.log("This is RabEstSubscription_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "RabEstSubscription" : myobj['RabEstSubscription']
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
                RabEstSubscription: myobj['RabEstSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.RabEst_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is RabEst_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_rm_GET = function (req,callback) {

    console.log("RNI Method30");
    callback(null,"DONE SubscriptionLinkList_subscriptions_rm_GET");
};

RNIservice.prototype.RabModSubscription_subscriptionsPOST = function (req,callback) {

    console.log("This is RabModSubscription_subscriptionsPOST method!!!");
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
                "rab_mod_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"]);
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.rab_mod_subscriptionId": counter.rab_mod_subscriptionId + 1}},function(err,docs) {
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
                "rab_mod_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "RabModSubscription"+(counter.rab_mod_subscriptionId + 1).toString(),
            "RabModSubscription" : myobj['RabModSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    RabModSubscription: resp['ops'][0]['RabModSubscription']
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

RNIservice.prototype.RabModSubscription_subscriptionsGET = function (req,callback) {

    console.log("This is RabModSubscription_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                RabModSubscription: resp[0]['RabModSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.RabModSubscription_subscriptionsPUT = function (req,callback) {

    console.log("This is RabModSubscription_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "RabModSubscription" : myobj['RabModSubscription']
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
                RabModSubscription: myobj['RabModSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.RabMod_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is RabMod_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_rr_GET = function (req,callback) {

    console.log("RNI Method35");
    callback(null,"DONE SubscriptionLinkList_subscriptions_rr_GET");/////////////////////////////////////////
};

RNIservice.prototype.RabRelSubscription_subscriptionsPOST = function (req,callback) {

    console.log("This is RabRelSubscription_subscriptionsPOST method!!!");
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
                "rab_rel_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"]);
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.rab_rel_subscriptionId": counter.rab_rel_subscriptionId + 1}},function(err,docs) {
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
                "rab_rel_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "RabRelSubscription"+(counter.rab_rel_subscriptionId + 1).toString(),
            "RabRelSubscription" : myobj['RabRelSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    RabRelSubscription: resp['ops'][0]['RabRelSubscription']
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

RNIservice.prototype.RabRelSubscription_subscriptionsGET = function (req,callback) {

    console.log("This is RabRelSubscription_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                RabRelSubscription: resp[0]['RabRelSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.RabRelSubscription_subscriptionsPUT = function (req,callback) {

    console.log("This is RabRelSubscription_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "RabRelSubscription" : myobj['RabRelSubscription']
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
                RabRelSubscription: myobj['RabRelSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.RabRel_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is RabRel_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};


RNIservice.prototype.SubscriptionLinkList_subscriptions_cr_GET = function (req,callback) {

    console.log("RNI Method40");
    callback(null,"DONE SubscriptionLinkList_subscriptions_cr_GET");
};


RNIservice.prototype.CaReConfSubscription_subscriptionsPOST = function (req,callback) {

    console.log("This is CaReConfSubscription_subscriptionsPOST method!!!");
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
                "ca_reconf_subscriptionId" : 0
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('RNI')){
            var counter = (resp1[0]["RNI"]);
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            collection1.update(criteria.condition,{$set:{"RNI.ca_reconf_subscriptionId": counter.ca_reconf_subscriptionId + 1}},function(err,docs) {
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
                "ca_reconf_subscriptionId" : 0
            }
        }

        var collection = db.collection("RNI_API_swagger");
        var CellChangeSubscription = {
            "subscriptionId" : "CaReConfSubscription"+(counter.ca_reconf_subscriptionId + 1).toString(),
            "CaReConfSubscription" : myobj['CaReConfSubscription']
        };
        collection.insert(CellChangeSubscription,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    CaReConfSubscription: resp['ops'][0]['CaReConfSubscription']
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

RNIservice.prototype.CaReConfSubscription_subscriptionsGET = function (req,callback) {

    console.log("This is CaReConfSubscription_subscriptionsGET method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;

    var collection = db.collection('RNI_API_swagger');
    collection.find({"subscriptionId":subscriptionId}).toArray(function (err,resp) {
        if (resp){
            var result = {
                statuscode: 200,
                CaReConfSubscription: resp[0]['CaReConfSubscription']
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

RNIservice.prototype.CaReConfSubscription_subscriptionsPUT = function (req,callback) {

    console.log("This is CaReConfSubscription_subscriptionsPUT method!!!");
    var self = this;
    var db = self.app.db;
    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;
    var collection = db.collection("RNI_API_swagger");

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
            "subscriptionId" : subscriptionId
        },
        value:{
            "CaReConfSubscription" : myobj['CaReConfSubscription']
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
                CaReConfSubscription: myobj['CaReConfSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else
};

RNIservice.prototype.CaReConf_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("This is CaReConf_subscriptionsSubscrIdDELETE method!!!");
    var self = this;
    var db = self.app.db;

    var myquery = {
        subscriptionId : req.params.subscriptionId
    };
    var collation = db.collection('RNI_API_swagger');

    collation.removeOne(myquery, function(err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })
};






