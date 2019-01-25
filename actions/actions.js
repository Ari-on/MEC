

var commonservice  = require ('../service/commonservice.js');


var ApiActions = function(app) {

    this.app = app;
    this.commonInstance = new commonservice(app);
};

module.exports = ApiActions;

ApiActions.prototype.bw_allocationsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"BWM_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('bwInfo')) {
                return {bwInfo: value.bwInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result);
    })

};

ApiActions.prototype.bw_allocationsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err) {
            var counter = {
                "app_instance_id": 0,
                "app_name": 0,
                "session_id": 0,
                "allocationId": 0,
            }
        } else if (resp1.length > 0 && resp1[0].hasOwnProperty('BWM')) {
            var counter = (resp1[0]["BWM"])
            var criteria = {
                condition: {},
                value: {
                    "app_instance_id": (counter.app_instance_id + 1),
                    "app_name": (counter.app_name + 1),
                    "session_id": (counter.session_id + 1),
                    "allocationId": (counter.allocationId + 1),
                },
                options: {
                    multi: false,
                    upsert: false
                }
            };
            self.commonInstance.commonUpdate(criteria.condition, {$set: {BWM: criteria.value}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else {
            var counter = {
            "app_instance_id": 0,
            "app_name": 0,
            "session_id": 0,
            "allocationId": 0,
            }
        }
        var bwInfo = {
            "app_instance_id" : (counter.app_instance_id + 1).toString(),
            "app_name" : (counter.app_name + 1).toString(),
            "session_id" : (counter.session_id + 1).toString(),
            "allocationId" : (counter.allocationId + 1).toString(),
            "bwInfo" : myobj
        };

        self.commonInstance.commonPOST(bwInfo,"BWM_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    bwInfo: res[0]['bwInfo']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.bw_allocationsAllocationIdGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "allocationId" : req.params.allocationID
    };
    console.log(query);
    self.commonInstance.commonGET(query,"BWM_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('bwInfo')) {
                return {bwInfo: value.bwInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            bwInfo : data
            // bwInfo : data[0]['bwInfo']
        };
        callback(null,result)
    })

};

ApiActions.prototype.bw_allocationsAllocationIdPATCH = function (req, callback) {

    var self = this;

    var allocationId = req.params.allocationID;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "BWM_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            self.commonInstance.commonGET(criteria.condition,"BWM_API_swagger", function (err, res) {
                var result = {
                    statuscode:200,
                    bwInfo: res[0]['bwInfo']
                };
                callback(err,result);
            });
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.bw_allocationsAllocationIdPUT = function (req, callback) {

    var self = this;

    var allocationId = req.params.allocationID;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "BWM_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
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
};

ApiActions.prototype.bw_allocationsAllocationIdDELETE = function (req, callback) {

    var self = this;

    var myquery = {
        allocationId : req.params.allocationID
    };

    self.commonInstance.commonDelete(myquery,"BWM_API_swagger", function (err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })

};

ApiActions.prototype.app_listGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"UE_Application_Interface_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('ApplicationList')) {
                return {ApplicationList: value.ApplicationList};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.app_contextsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    var AppContext = {
        "AppContext" : myobj
    };

    self.commonInstance.commonPOST(AppContext,"UE_Application_Interface_API_swagger", function (err, res) {
        if(res){
            var result = {
                statuscode:201,
                AppContext: res[0]['AppContext']
            };
            callback(err,result);
        }
        else{
            callback(err,'inserterror');
        }
    });
};

ApiActions.prototype.app_contextsContextIdPUT = function (req, callback) {

    var self = this;

    var contextId = req.params.contextID;
    var myobj = req.body;

    var criteria={
        condition:{
            "AppContext.contextId" : contextId
        },
        value:{
            "AppContext" : myobj
        },
        options:{
            multi:false,
            upsert:false
        }
    };

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "UE_Application_Interface_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.app_contextsContextIdDELETE = function (req, callback) {

    var self = this;

    var myquery = {
        "AppContext.contextId" : req.params.contextID
    };

    self.commonInstance.commonDelete(myquery,"UE_Application_Interface_API_swagger", function (err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })

};

ApiActions.prototype.appInstanceIdUe_identity_tag_infoGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"UE_Identity_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('UeIdentityTagInfo')) {
                return {UeIdentityTagInfo: value.UeIdentityTagInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.ApplicationsDnsRules_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('DnsRule')) {
                return {bwInfo: value.bwInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.ApplicationsDnsRule_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "dnsRulesId" : req.params.dnsRulesId
    };
    self.commonInstance.commonGET(query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('DnsRule')) {
                return {DnsRule: value.DnsRule};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        // var result = {
        //     statuscode : 200,
        //     DnsRule : data[0]['DnsRule']
        // };
        callback(null,data)
    })

};

ApiActions.prototype.ApplicationsSubscriptions_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('Mp1SubscriptionLinkList')) {
                return {Mp1SubscriptionLinkList: value.Mp1SubscriptionLinkList};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.ApplicationsSubscriptions_POST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err) {
            var counter = {
                "subscriptionId": 0,
            }
        }
        else if (resp1.length > 0 && resp1[0].hasOwnProperty('MP1')) {
            var counter = (resp1[0]["MP1"]);
            var criteria = {
                condition: { },
                value: { },
                options: {
                    multi: false,
                    upsert: false
                }
            };
            self.commonInstance.commonUpdate(criteria.condition, {$set: {"MP1.subscriptionId": (counter.subscriptionId + 1)}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else {
            var counter = {
                "subscriptionId": 0
            }
        }
        var AppTerminationNotificationSubscription = {
            "subscriptionId": "subscriptionId"+(counter.subscriptionId + 1).toString(),
            "AppTerminationNotificationSubscription" : myobj
        };

        self.commonInstance.commonPOST(AppTerminationNotificationSubscription,"Mp1_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    AppTerminationNotificationSubscription: res[0]['AppTerminationNotificationSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.ApplicationsSubscription_DELETE = function (req, callback) {

    var self = this;

    var myquery = {
        "AppTerminationNotificationSubscription.subscriptionType" : req.params.subType,
        "subscriptionId":req.params.subId
    };

    self.commonInstance.commonDelete(myquery,"Mp1_API_swagger", function (err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })

};

ApiActions.prototype.Services_POST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err) {
            var counter = {
                "serviceId": 0,
            }
        }
        else if (resp1.length > 0 && resp1[0].hasOwnProperty('MP1')) {
            var counter = (resp1[0]["MP1"]);
            var criteria = {
                condition: {},
                value: { },
                options: {
                    multi: false,
                    upsert: false
                }
            };
            self.commonInstance.commonUpdate(criteria.condition, {$set: {"MP1.serviceId": (counter.serviceId + 1)}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else {
            var counter = {
                "serviceId": 0
            }
        }
        var ServiceInfo = {
            "serviceId": "serviceId"+(counter.serviceId + 1).toString(),
            "ServiceInfo": myobj
        };

        self.commonInstance.commonPOST(ServiceInfo,"Mp1_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    ServiceInfo: res[0]['ServiceInfo']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.ServicesServiceId_PUT = function (req, callback) {

    var self = this;

    var serviceId = req.params.serviceId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "Mp1_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
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
};

ApiActions.prototype.ApplicationsTrafficRules_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('TrafficRule')) {
                return {TrafficRule: value.TrafficRule};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.ApplicationsTrafficRule_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
                "TrafficRule.trafficRuleId" : req.params.trafficRuleId
        };
    self.commonInstance.commonGET(query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('TrafficRule')) {
                return {DnsRule: value.DnsRule};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            TrafficRule : data[0]['TrafficRule']
        };
        callback(null,result)
    })

};

ApiActions.prototype.Services_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {

    };
    var request = req.query;
    if (request.ser_instance_id){
        query = {
            "ServiceInfo.serInstanceId" : request.ser_instance_id
        }
    }
    if (request.ser_name){
        query = {
            "ServiceInfo.serName" : request.ser_name
        }
    }
    if (request.ser_category_id){
        query= {
            "ServiceInfo.serCategory.id" : request.ser_category_id
        }
    }
    self.commonInstance.commonGET(query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('ServiceInfo')) {
                return {ServiceInfo: value.ServiceInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        if (Object.keys(query).length <= 0) {
            var result = {
                statuscode: 200,
                res: data
            };
        }
        else{
            var result = {
                statuscode: 200,
                ServiceInfo: data[0]['ServiceInfo']
            };
        }
        callback(null,result)
    });

};

ApiActions.prototype.ServicesServiceId_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "serviceId" : req.params.serviceId
    };
    self.commonInstance.commonGET(query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('ServiceInfo')) {
                return {ServiceInfo: value.ServiceInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            ServiceInfo : data[0]['ServiceInfo']
        };
        callback(null,result)
    })

};

ApiActions.prototype.TimingCurrentTime_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('CurrentTime')) {
                return {CurrentTime: value.CurrentTime};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.TimingCaps_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('TimingCaps')) {
                return {TimingCaps: value.TimingCaps};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    })

};

ApiActions.prototype.Transports_GET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Mp1_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('TransportInfo')) {
                return {TransportInfo: value.TransportInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            res : data
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonesGet = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('zoneInfo')) {
                return value.zoneInfo;
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            zoneList: {
                "zone" : data
            }
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonesGetById = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "zoneInfo.zoneId" : req.params.zoneId
    };
    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('zoneInfo')) {
                return {zoneInfo: value.zoneInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            zoneInfo : data[0]['zoneInfo']
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonesByIdGetAps = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "zoneId" : req.params.zoneId
    };

    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('accessPointInfo')) {
                return  value.accessPointInfo;
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            accessPointList: {
                "accessPoint" : data
            }
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonesByIdGetApsById = function (req, callback) {

    var self = this;

    console.log("Actions");

    var query = {
        "accessPointInfo.zoneId" : req.params.accessPointId
    };
    console.log(query)
    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('accessPointInfo')) {
                return {accessPointInfo: value.accessPointInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            accessPointInfo : data[0]['accessPointInfo']
        };
        callback(null,result)
    });

};

ApiActions.prototype.usersGet = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('userInfo')) {
                return value.zoneInfo;
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            userList: {
                "user" : data
            }
        };
        callback(null,result)
    });

};

ApiActions.prototype.usersGetById = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "userId" : req.params.userId
    };
    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('userInfo')) {
                return {userInfo: value.userInfo};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            userInfo : data[0]['userInfo']
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonalTrafficSubGet = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('zonalTrafficSubscription')) {
                return value.zonalTrafficSubscription;
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            notificationSubscriptionList: {
                "zonalTrafficSubscription" : data
            }
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonalTrafficSubPost = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err){
            var counter = {
                "zonalTraffic" : 0,
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('Location')){
            var counter = (resp1[0]["Location"]);
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"Location.zonalTraffic":counter.zonalTraffic + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "zonalTraffic" : 0,
            }
        }
        var zonalTrafficSubscription = {
            "subscriptionId" : "zonalTraffic"+(counter.zonalTraffic + 1).toString(),
            "zonalTrafficSubscription" : myobj
        };

        self.commonInstance.commonPOST(zonalTrafficSubscription,"Location_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    zonalTrafficSubscription: res[0]['zonalTrafficSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.zonalTrafficSubGetById = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('zonalTrafficSubscription')) {
                return {zonalTrafficSubscription: value.zonalTrafficSubscription};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            zonalTrafficSubscription : data[0]['zonalTrafficSubscription']
        };
        callback(null,result)
    });

};

ApiActions.prototype.zonalTrafficSubPutById = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "Location_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
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


ApiActions.prototype.userTrackingSubGet = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('userTrackingSubscription')) {
                return value.userTrackingSubscription;
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            notificationSubscriptionList: {
                "userTrackingSubscription" : data
            }
        };
        callback(null,result)
    });

};

ApiActions.prototype.userTrackingSubPost = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err){
            var counter = {
                "userTracking" : 0,
            }
        }
        else if(resp1.length > 0 && resp1[0].hasOwnProperty('Location')){
            var counter = (resp1[0]["Location"]);
            var criteria={
                condition:{ },
                options:{
                    multi:false,
                    upsert:false
                }
            };
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"Location.userTracking":counter.userTracking + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "userTracking" : 0,
            }
        }
        var userTrackingSubscription = {
            "subscriptionId" : "userTracking"+(counter.userTracking + 1).toString(),
            "userTrackingSubscription" : myobj
        };

        self.commonInstance.commonPOST(userTrackingSubscription,"Location_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    userTrackingSubscription: res[0]['userTrackingSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.userTrackingSubGetById = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('userTrackingSubscription')) {
                return {userTrackingSubscription: value.userTrackingSubscription};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            userTrackingSubscription : data[0]['userTrackingSubscription']
        };
        callback(null,result)
    });

};

ApiActions.prototype.userTrackingSubPutById = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "Location_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
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

ApiActions.prototype.zoneStatusGet = function (req, callback) {

    var self = this;

    // console.log("Actions");

    self.commonInstance.commonGET(req.query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('zoneStatusSubscription')) {
                return value.zoneStatusSubscription;
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            notificationSubscriptionList: {
                "zoneStatusSubscription" : data
            }
        };
        callback(null,result)
    });

};

ApiActions.prototype.zoneStatusPost = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"Location.zonalStatus":counter.zonalStatus + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "zonalStatus" : 0,
            }
        }
        var zoneStatusSubscription = {
            "subscriptionId" : "zonalStatus"+(counter.zonalStatus + 1).toString(),
            "zoneStatusSubscription" : myobj
        };

        self.commonInstance.commonPOST(zoneStatusSubscription,"Location_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    zoneStatusSubscription: res[0]['zoneStatusSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.zoneStatusGetById = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"Location_API_swagger", function (err, resp) {
        var permittedValues = resp.map(function(value) {
            if (value.hasOwnProperty('zoneStatusSubscription')) {
                return {zoneStatusSubscription: value.zoneStatusSubscription};
            }
        });
        var data = permittedValues.filter(function( element ) {
            return element !== undefined;
        });
        var result = {
            statuscode : 200,
            zoneStatusSubscription : data[0]['zoneStatusSubscription']
        };
        callback(null,result)
    });

};

ApiActions.prototype.zoneStatusPutById = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "Location_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
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

ApiActions.prototype.commonDelById = function (req, callback) {

    var self = this;

    var myquery = {
        "subscriptionId":req.params.subscriptionId
    };

    self.commonInstance.commonDelete(myquery,"Location_API_swagger", function (err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })

};

ApiActions.prototype.plmn_infoGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "PlmnInfo.appInId" : req.query.app_ins_id
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0  && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('PlmnInfo')) {
                    return value.PlmnInfo;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                PlmnInfo : data[0]
            };
            callback(null,result);
        }

        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result)
        }
    });
};

ApiActions.prototype.CellChange_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err){
            var counter = {
                "cell_change_subscriptionId" : 0
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.cell_change_subscriptionId": counter.cell_change_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "cell_change_subscriptionId" : 0
            }
        }
        var CellChangeSubscription = {
            "subscriptionId" : "CellChangeSubscription"+(counter.cell_change_subscriptionId + 1).toString(),
            "CellChangeSubscription" : myobj['CellChangeSubscription']
        };

        self.commonInstance.commonPOST(CellChangeSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    CellChangeSubscription: res[0]['CellChangeSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.cell_change_subscriptionsGET = function (req, callback) {

    var self = this;

    console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('CellChangeSubscription')) {
                    return value.CellChangeSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                CellChangeSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        }
    });
};

ApiActions.prototype.CellChange_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

    var criteria={
        condition:{
            "subscriptionId" : subscriptionId
        },
        value:{
            "CellChangeSubscription" : myobj['CellChangeSubscription']
        },
        options:{
            multi:false,
            upsert:false
        }
    };

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "CellChangeSubscription" : myobj['CellChangeSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.S1BearerSubscription_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err){
            var counter = {
                "s1_bearer_subscriptionId" : 0
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.s1_bearer_subscriptionId": counter.s1_bearer_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "s1_bearer_subscriptionId" : 0
            }
        }
        var S1BearerSubscription = {
            "subscriptionId" : "S1BearerSubscription"+(counter.s1_bearer_subscriptionId + 1).toString(),
            "S1BearerSubscription" : myobj['S1BearerSubscription']
        };

        self.commonInstance.commonPOST(S1BearerSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    S1BearerSubscription: res[0]['S1BearerSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.S1BearerSubscription_subscriptionsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('S1BearerSubscription')) {
                    return value.S1BearerSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                S1BearerSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        }
    });
};

ApiActions.prototype.S1BearerSubscription_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "S1BearerSubscription" : myobj['S1BearerSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.MeasTa_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err){
            var counter = {
                "ta_subscriptionId" : 0
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.ta_subscriptionId": counter.ta_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "ta_subscriptionId" : 0
            }
        }
        var MeasTaSubscription = {
            "subscriptionId" : "MeasTaSubscription"+(counter.ta_subscriptionId + 1).toString(),
            "MeasTaSubscription" : myobj['MeasTaSubscription']
        };
        self.commonInstance.commonPOST(MeasTaSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    MeasTaSubscription: res[0]['MeasTaSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.MeasTa_subscriptionsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('MeasTaSubscription')) {
                    return value.MeasTaSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                MeasTaSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        };
    });
};

ApiActions.prototype.MeasTa_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "MeasTaSubscription" : myobj['MeasTaSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.MeasRepUe_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
        if (err){
            var counter = {
                "meas_rep_ue_subscriptionId" : 0
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.meas_rep_ue_subscriptionId": counter.meas_rep_ue_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "meas_rep_ue_subscriptionId" : 0
            }
        }
        var MeasRepUeSubscription = {
            "subscriptionId" : "MeasRepUeSubscription"+(counter.meas_rep_ue_subscriptionId + 1).toString(),
            "MeasRepUeSubscription" : myobj['MeasRepUeSubscription']
        };
        self.commonInstance.commonPOST(MeasRepUeSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    MeasRepUeSubscription: res[0]['MeasRepUeSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.MeasRepUe_subscriptionsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('MeasRepUeSubscription')) {
                    return value.MeasRepUeSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                MeasRepUeSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        };
    });
};

ApiActions.prototype.MeasRepUeReport_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "MeasRepUeSubscription" : myobj['MeasRepUeSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.RabEstSubscription_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.rab_est_subscriptionId": counter.rab_est_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "rab_est_subscriptionId" : 0
            }
        }
        var RabEstSubscription = {
            "subscriptionId" : "RabEstSubscription"+(counter.rab_est_subscriptionId + 1).toString(),
            "RabEstSubscription" : myobj['RabEstSubscription']
        };
        self.commonInstance.commonPOST(RabEstSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    RabEstSubscription: res[0]['RabEstSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.RabEstSubscription_subscriptionsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('RabEstSubscription')) {
                    return value.RabEstSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                RabEstSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        };
    });
};

ApiActions.prototype.RabEstSubscription_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "RabEstSubscription" : myobj['RabEstSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.RabModSubscription_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.rab_mod_subscriptionId": counter.rab_mod_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "rab_mod_subscriptionId" : 0
            }
        }
        var RabModSubscription = {
            "subscriptionId" : "RabModSubscription"+(counter.rab_mod_subscriptionId + 1).toString(),
            "RabModSubscription" : myobj['RabModSubscription']
        };
        self.commonInstance.commonPOST(RabModSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    RabModSubscription: res[0]['RabModSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.RabModSubscription_subscriptionsGET = function (req, callback) {

    var self = this;

    console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('RabModSubscription')) {
                    return value.RabModSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                RabModSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        };
    });
};

ApiActions.prototype.RabModSubscription_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "RabModSubscription" : myobj['RabModSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.RabRelSubscription_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.rab_rel_subscriptionId": counter.rab_rel_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "rab_rel_subscriptionId" : 0
            }
        }
        var RabRelSubscription = {
            "subscriptionId" : "RabRelSubscription"+(counter.rab_rel_subscriptionId + 1).toString(),
            "RabRelSubscription" : myobj['RabRelSubscription']
        };
        self.commonInstance.commonPOST(RabRelSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    RabRelSubscription: res[0]['RabRelSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.RabRelSubscription_subscriptionsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('RabRelSubscription')) {
                    return value.RabRelSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                RabRelSubscription : data[0]
            };
            callback(null,result);
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result);
        };
    });
};

ApiActions.prototype.RabRelSubscription_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "RabRelSubscription" : myobj['RabRelSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.CaReConfSubscription_subscriptionsPOST = function (req, callback) {

    var self = this;

    var myobj = req.body;

    self.commonInstance.commonGET({},"counter", function (err, resp1) {
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
            self.commonInstance.commonUpdate(criteria.condition, {$set:{"RNI.ca_reconf_subscriptionId": counter.ca_reconf_subscriptionId + 1}}, "counter", function (err, resp) {
                if (resp){
                    console.log("counter Updated");
                }
                else if(err){
                    console.log("counter Update Error")
                }
            })
        }
        else{
            var counter = {
                "ca_reconf_subscriptionId" : 0
            }
        }
        var CaReConfSubscription = {
            "subscriptionId" : "CaReConfSubscription"+(counter.ca_reconf_subscriptionId + 1).toString(),
            "CaReConfSubscription" : myobj['CaReConfSubscription']
        };
        self.commonInstance.commonPOST(CaReConfSubscription,"RNI_API_swagger", function (err, res) {
            if(res){
                var result = {
                    statuscode:201,
                    CaReConfSubscription: res[0]['CaReConfSubscription']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        });
    });
};

ApiActions.prototype.CaReConfSubscription_subscriptionsGET = function (req, callback) {

    var self = this;

    // console.log("Actions");

    var query = {
        "subscriptionId" : req.params.subscriptionId
    };
    self.commonInstance.commonGET(query,"RNI_API_swagger", function (err, resp) {
        if (req.headers.accept.indexOf('application/json') >= 0 && typeof(resp) == 'object') {
            var permittedValues = resp.map(function(value) {
                if (value.hasOwnProperty('CaReConfSubscription')) {
                    return value.CaReConfSubscription;
                }
            });
            var data = permittedValues.filter(function( element ) {
                return element !== undefined;
            });
            var result = {
                statuscode : 200,
                CaReConfSubscription : data[0]
            };
            callback(null,result)
        }
        else{
            var result = {
                statuscode: 406,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 406,
                    "detail": "request.headers.accept is different",
                    "instance": "string"
                }
            };
            callback(null,result)
        };
    });
};

ApiActions.prototype.CaReConfSubscription_subscriptionsPUT = function (req, callback) {

    var self = this;

    var subscriptionId = req.params.subscriptionId;
    var myobj = req.body;

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

    self.commonInstance.commonUpdate(criteria.condition, {$set:criteria.value}, "RNI_API_swagger", function (err, resp) {
        if(resp['n'] != 0){
            var result = {
                statuscode:200,
                "CaReConfSubscription" : myobj['CaReConfSubscription']
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }
    });
};

ApiActions.prototype.commonDelfrRNI = function (req, callback) {

    var self = this;

    var myquery = {
        "subscriptionId":req.params.subscriptionId
    };

    self.commonInstance.commonDelete(myquery,"RNI_API_swagger", function (err, resp) {
        if (resp) {
            callback(err, 'deleted')
        } else {
            callback(err, "Error while Deleting")
        }
    })

};