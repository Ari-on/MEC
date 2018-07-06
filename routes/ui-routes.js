
var service  = require ('../service/DefaultService.js');
var Idservice  = require ('../service/UEIdentityService.js');
var Appservice  = require ('../service/UEAppService.js');
var Mp1service  = require ('../service/Mp1Service.js');
var LocationService  = require ('../service/LocationService.js');


var UIRoutes = function(app) {

    this.app = app;
    this.seviceInstance = new service(app);//for BWM
    this.IdserviceInstance = new Idservice(app);//for UE Identity
    this.AppserviceInstance = new Appservice(app);//for  UE Application
    this.Mp1serviceInstance = new Mp1service(app);//for  Mp1
    this.LocationServiceInstance = new LocationService(app);//for Location
};


module.exports    = UIRoutes;

UIRoutes.prototype.init = function() {
    var self = this;
    var app = this.app;


    /* BWM API */

    app.get("/bwm/v1/bw_allocations/",function (req,res) {

        self.seviceInstance.bw_allocationsGET(req.query, function (err,result) {
            res.send(result);

        })

    });

    app.post("/bwm/v1/bw_allocations/",function (req,res) {

        self.seviceInstance.bw_allocationsPOST(req, function (err,result) {
            res.send(result);
        })

    });

    app.get("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdGET(req.params.allocationID, function (err,result) {
            res.send(result);
        })

    });

    app.patch("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdPATCH(req, function (err,result) {
            res.send(result);
        })

    });

    app.put("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdPUT(req, function (err,result) {
            res.send(result);
        })

    });

    app.delete("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdDELETE(req.params.allocationID, function (err,result) {
            res.send(result);
        })

    });

    /* UE Application API */

    app.get("/mx2/v1/app_list",function (req,res) {

        console.log("ui-routes - app_listGET method is called");

        self.AppserviceInstance.app_listGET(req, function (err,result) {
            res.send(result);
        })
    });

    app.post("/mx2/v1/app_contexts",function (req,res) {

        console.log('POST Method',req.body);

        self.AppserviceInstance.app_contextsPOST(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/mx2/v1/app_contexts/:contextID",function (req,res) {

        console.log('PUT Method',req.params);

        self.AppserviceInstance.app_contextsContextIdPUT(req, function (err,result) {
            res.send(result);
        })
    });

    app.delete("/mx2/v1/app_contexts/:contextID",function (req,res) {

        console.log('DELETE Method',req.params);

        self.AppserviceInstance.app_contextsContextIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    /* UE Identity API */

    app.get("/ui/v1/:appInstId/ue_identity_tag_info",function (req,res) {

        console.log('GET Method',req.params);
        console.log('GET Method',req.query);

        self.IdserviceInstance.appInstanceIdUe_identity_tag_infoGET(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/ui/v1/:appInstId/ue_identity_tag_info",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.IdserviceInstance.appInstanceIdUe_identity_tag_infoPUT(req, function (err,result) {
            res.send(result);
        })
    });

    /* Mp1 API */

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsDnsRules_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules/:dnsRulesId",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsDnsRule_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules/:dnsRulesId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.Mp1serviceInstance.ApplicationsDnsRule_PUT(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsSubscriptions_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.post("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        console.log('POST Method',req.params);
        console.log('POST Method',req.body);

        self.Mp1serviceInstance.ApplicationsSubscriptions_POST(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions/:subType/:subId",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsSubscription_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.delete("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions/:subType/:subId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.Mp1serviceInstance.ApplicationsSubscription_DELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsTrafficRules_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules/:trafficRuleId",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsTrafficRule_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules/:trafficRuleId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.Mp1serviceInstance.ApplicationsTrafficRules_PUT(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/services",function (req,res) {

        console.log('GET Method',req.query);

        self.Mp1serviceInstance.Services_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/services",function (req,res) {

        console.log('PUT Method',req.body);

        self.Mp1serviceInstance.Services_PUT(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/services/:serviceId",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ServicesServiceId_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/services/:serviceId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.Mp1serviceInstance.ServicesServiceId_PUT(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/timing/current_time",function (req,res) {

        console.log('GET Method',req.query);

        self.Mp1serviceInstance.TimingCurrentTime_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/timing/timing_caps",function (req,res) {

        console.log('GET Method',req.query);

        self.Mp1serviceInstance.TimingCaps_GET(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/transports",function (req,res) {

        console.log('GET Method',req.query);

        self.Mp1serviceInstance.Transports_GET(req, function (err,result) {
            res.send(result);
        })
    });

    /* Location API*/

/////// ZONES //////

    app.get("/exampleAPI/location/v1/zones",function (req,res) {

        console.log("GET METHOD",req.query);

        self.LocationServiceInstance.zonesGet(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/zones/:zoneId",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET Method',req.params);

        self.LocationServiceInstance.zonesGetById(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/zones/:zoneId/accessPoints",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET METHOD',req.params);

        self.LocationServiceInstance.zonesByIdGetAps(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/zones/:zoneId/accessPoints/:accessPointId",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET METHOD',req.params);

        self.LocationServiceInstance.zonesByIdGetApsById(req, function (err,result) {
            res.send(result);
        })
    });

//////////////////////


////////////USERS/////////////

    app.get("/exampleAPI/location/v1/users",function (req,res) {

        console.log('GET Method',req.query);

        self.LocationServiceInstance.usersGet(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/users/:userId",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET Method',req.params);

        self.LocationServiceInstance.usersGetById(req, function (err,result) {
            res.send(result);
        })
    });

///////////////////////////////

//////////SUBSCRIPTIONS////////

    app.get("/exampleAPI/location/v1/subscriptions/zonalTraffic",function (req,res) {

        console.log('GET Method',req.query);

        self.LocationServiceInstance.zonalTrafficSubGet(req, function (err,result) {
            res.send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/zonalTraffic",function (req,res) {

        console.log('POST Method',req.body);

        self.LocationServiceInstance.zonalTrafficSubPost(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET Method',req.params);

        self.LocationServiceInstance.zonalTrafficSubGetById(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.LocationServiceInstance.zonalTrafficSubPutById(req, function (err,result) {
            res.send(result);
        })
    });

    app.delete("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.LocationServiceInstance.zonalTrafficSubDelById(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/userTracking",function (req,res) {

        console.log('GET Method',req.query);

        self.LocationServiceInstance.userTrackingSubGet(req, function (err,result) {
            res.send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/userTracking",function (req,res) {

        console.log('POST Method',req.body);

        self.LocationServiceInstance.userTrackingSubPost(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET Method',req.params);

        self.LocationServiceInstance.userTrackingSubGetById(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.LocationServiceInstance.userTrackingSubPutById(req, function (err,result) {
            res.send(result);
        })
    });

    app.delete("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.LocationServiceInstance.userTrackingSubDelById(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zonalStatus",function (req,res) {

        console.log('GET Method',req.query);

        self.LocationServiceInstance.zoneStatusGet(req, function (err,result) {
            res.send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/zonalStatus",function (req,res) {

        console.log('POST Method',req.body);

        self.LocationServiceInstance.zoneStatusPost(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zonalStatus/:subscriptionId",function (req,res) {

        console.log('GET Method',req.query);
        console.log('GET Method',req.params);

        self.LocationServiceInstance.zoneStatusGetById(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/location/v1/subscriptions/zonalStatus/:subscriptionId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.LocationServiceInstance.zoneStatusPutById(req, function (err,result) {
            res.send(result);
        })
    });

    app.delete("/exampleAPI/location/v1/subscriptions/zonalStatus/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.LocationServiceInstance.zoneStatusDelById(req, function (err,result) {
            res.send(result);
        })
    });

/////////////////////////

};
