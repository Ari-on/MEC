
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

ApiActions.prototype.bw_allocationsAllocationIdGET = function (req, callback) {

    var self = this;
    var app = this.app;

    // console.log("Actions");

    var query = {
        "allocationId" : req.params.allocationID
    };
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
            bwInfo : data[0]['bwInfo']
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

