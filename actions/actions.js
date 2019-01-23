
var service  = require ('../service/BwAllocService.js');
var Idservice  = require ('../service/UEIdentityService.js');
var Appservice  = require ('../service/UEAppService.js');
var Mp1service  = require ('../service/Mp1Service.js');
var LocationService  = require ('../service/LocationService.js');
var RNIservice  = require ('../service/RNIservice.js');
var commonservice  = require ('../service/commonservice.js');


var ApiActions = function(app) {

    this.app = app;
    // this.seviceInstance = new service(app);//for BWM
    // this.IdserviceInstance = new Idservice(app);//for UE Identity
    // this.AppserviceInstance = new Appservice(app);//for  UE Application
    // this.Mp1serviceInstance = new Mp1service(app);//for  Mp1
    // this.LocationServiceInstance = new LocationService(app);//for Location
    // this.RNIserviceInstance = new RNIservice(app);//for RNI
    this.commonInstance = new commonservice(app);//for RNI
};

module.exports = ApiActions;

ApiActions.prototype.bw_allocationsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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

ApiActions.prototype.app_listGET = function (req, callback) {

    var self = this;
    var app = this.app;

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
    var app = this.app;

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

ApiActions.prototype.appInstanceIdUe_identity_tag_infoGET = function (req, callback) {

    var self = this;
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

    var myobj = req.body;

    var AppTerminationNotificationSubscription = {
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
};

ApiActions.prototype.Services_POST = function (req, callback) {

    var self = this;
    var app = this.app;

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
                value: {
                    "serviceId": (counter.serviceId + 1)
                },
                options: {
                    multi: false,
                    upsert: false
                }
            };
            self.commonInstance.commonUpdate(criteria.condition, {$set: {MP1: criteria.value}}, "counter", function (err, resp) {
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
            "serviceId": (counter.serviceId + 1).toString(),
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

ApiActions.prototype.ApplicationsTrafficRules_GET = function (req, callback) {

    var self = this;
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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
    var app = this.app;

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

ApiActions.prototype.zonalTrafficSubGetById = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.userTrackingSubGet = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.userTrackingSubGetById = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.zoneStatusGet = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.zoneStatusGetById = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.plmn_infoGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.cell_change_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.S1BearerSubscription_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.MeasTa_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.MeasRepUe_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.RabEstSubscription_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.RabModSubscription_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.RabRelSubscription_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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

ApiActions.prototype.CaReConfSubscription_subscriptionsGET = function (req, callback) {

    var self = this;
    var app = this.app;

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