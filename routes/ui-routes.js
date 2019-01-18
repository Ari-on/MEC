var jwt = require('jsonwebtoken');
// var xlsx = require('node-xlsx');
// var fs = require('fs');
// var csv = require("fast-csv");

var service  = require ('../service/BwAllocService.js');
var Idservice  = require ('../service/UEIdentityService.js');
var Appservice  = require ('../service/UEAppService.js');
var Mp1service  = require ('../service/Mp1Service.js');
var LocationService  = require ('../service/LocationService.js');
var RNIservice  = require ('../service/RNIservice.js');
var commonservice  = require ('../service/commonservice.js');
var ApiAction = require('../actions/actions.js')


var UIRoutes = function(app) {

    this.app = app;
    this.seviceInstance = new service(app);//for BWM
    this.IdserviceInstance = new Idservice(app);//for UE Identity
    this.AppserviceInstance = new Appservice(app);//for  UE Application
    this.Mp1serviceInstance = new Mp1service(app);//for  Mp1
    this.LocationServiceInstance = new LocationService(app);//for Location
    this.RNIserviceInstance = new RNIservice(app);//for RNI
    this.commonInstance = new commonservice(app);//for RNI
    this.ActionInstance = new ApiAction(app);//for RNI
};

module.exports    = UIRoutes;

var user = {
    id : "MEC",
    email : 'mec@email.com',
    name : 'mecProjectkey@1243'
};
var secret = 'mecsuperSecretGenerateKey!qwert';

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];

    if (!token) {
        res.status(401).send({
            "statuscode" : 401,
            "ProblemDetails": {
                "type": "string",
                "title": "string",
                "status": 401,
                "detail": "No Token Provided!",
                "instance": "string"
            }
        });
    }

    else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                console.log('First status ---');
                return res.status(403).send({
                    "statuscode" : 403,
                    "ProblemDetails": {
                        "type": "string",
                        "title": "string",
                        "status": 403,
                        "detail": "Forbidden - You don't have permission to access [directory] on this server",
                        "instance": "string"
                    }
                });
            }else{
                next()
                // var userCheck = decoded.id
                // console.log(userCheck,'userCheck')
                // console.log('user.email', user.email)
                // if(userCheck.email === user.email){
                //     console.log('success status ---')
                //     next()
                // }
                // else{
                //     console.log('second status ---')
                //     return res.status(403).send({
                //         "ProblemDetails": {
                //             "type": "string",
                //             "title": "string",
                //             "status": 403,
                //             "detail": "Forbidden - You don't have permission to access [directory] on this server",
                //             "instance": "string"
                //         }
                //     });
                // }
            }

        });
    }
}


UIRoutes.prototype.init = function() {
    var self = this;
    var app = this.app;


    /* Creating Token */

    app.get("/createToken", function (req, res) {

        var token = jwt.sign({ id : user }, secret, {
            expiresIn: 3600 // expires in 1 hours
        });

        var result = {
            token : token
        };

        res.status(200).send(result)
    });

    app.get("/read_Excel/:rowno",function (req,res) {

        var url = req.query.query;
        if (url.includes('/bwm/v1')){
            self.seviceInstance.read_db(req, function (err, result) {
                res.send([result]);
            })
        }
        else if (url.includes('/ui/v1')){
            self.IdserviceInstance.read_db(req, function (err, result) {
                res.send([result]);
            })
        }
        else if (url.includes('/mx2/v1')){
            self.AppserviceInstance.read_db(req, function (err, result) {
                res.send([result]);
            })
        }
        else if (url.includes('/exampleAPI/mp1')){
            self.Mp1serviceInstance.read_db(req, function (err, result) {
                res.send([result]);
            })
        }
        else if (url.includes('/exampleAPI/location')){
            self.LocationServiceInstance.read_db(req, function (err, result) {
                res.send([result]);
            })
        }
        else if (url.includes('/rni/v1')){
            self.RNIserviceInstance.read_db(req, function (err, result) {
                res.send([result]);
            })
        }
    });



    /* BWM API */

    app.get("/bwm/v1/bw_allocations/",function (req,res) {

        self.ActionInstance.bw_allocationsGET(req.query, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.post("/bwm/v1/bw_allocations/",function (req,res) {


        self.seviceInstance.bw_allocationsPOST(req, function (err, result) {
            res.status(201).send(result);
        })
    });

    app.get("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.ActionInstance.bw_allocationsAllocationIdGET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.patch("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdPATCH(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.put("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdPUT(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.delete("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdDELETE(req, function (err, result) {
            res.status(204).send(result);
        })
    });

    /* UE Application API */

    app.get("/mx2/v1/app_list",function (req,res) {

        self.ActionInstance.app_listGET(req, function (err, result) {
            res.status(200).send(result);
        })

    });

    app.post("/mx2/v1/app_contexts",function (req,res) {

        self.AppserviceInstance.app_contextsPOST(req, function (err, result) {
            res.status(201).send(result)
        });
    });

    app.put("/mx2/v1/app_contexts/:contextID",function (req,res) {

        self.AppserviceInstance.app_contextsContextIdPUT(req, function (err, result) {
            if (result) {
                res.status(204).send(result);
            }
            else{
                res.send("Update Error")
            }
        })
    });

    app.delete("/mx2/v1/app_contexts/:contextID",function (req,res) {

        self.AppserviceInstance.app_contextsContextIdDELETE(req, function (err, result) {
            res.status(204).send(result);
        })
    });

    /* UE Identity API */

    app.get("/ui/v1/:appInstId/ue_identity_tag_info",function (req,res) {

        self.ActionInstance.appInstanceIdUe_identity_tag_infoGET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.put("/ui/v1/:appInstId/ue_identity_tag_info",function (req,res) {

        self.IdserviceInstance.appInstanceIdUe_identity_tag_infoPUT(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    /* Mp1 API */

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules",function (req,res) {

        self.ActionInstance.ApplicationsDnsRules_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules/:dnsRulesId",function (req,res) {

        self.ActionInstance.ApplicationsDnsRule_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules/:dnsRulesId",function (req,res) {

        self.Mp1serviceInstance.ApplicationsDnsRule_PUT(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        self.ActionInstance.ApplicationsSubscriptions_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        self.Mp1serviceInstance.ApplicationsSubscriptions_POST(req, function (err, result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions/:subType/:subId",function (req,res) {

        self.Mp1serviceInstance.ApplicationsSubscription_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.delete("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions/:subType/:subId",function (req,res) {

        self.Mp1serviceInstance.ApplicationsSubscription_DELETE(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules",function (req,res) {

        self.ActionInstance.ApplicationsTrafficRules_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules/:trafficRuleId",function (req,res) {

        self.Mp1serviceInstance.ApplicationsTrafficRule_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules/:trafficRuleId",function (req,res) {

        self.Mp1serviceInstance.ApplicationsTrafficRules_PUT(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/services",function (req,res) {

        self.ActionInstance.Services_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/mp1/v1/services",function (req,res) {

        self.Mp1serviceInstance.Services_POST(req, function (err, result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/services/:serviceId",function (req,res) {

        self.ActionInstance.ServicesServiceId_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/services/:serviceId",function (req,res) {

        self.Mp1serviceInstance.ServicesServiceId_PUT(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/timing/current_time",function (req,res) {

        self.ActionInstance.TimingCurrentTime_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/timing/timing_caps",function (req,res) {

        self.ActionInstance.TimingCaps_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/transports",function (req,res) {

        self.ActionInstance.Transports_GET(req, function (err, result) {
            res.status(200).send(result);
        })
    });

    /* Location API*/

/////// ZONES //////

    app.get("/exampleAPI/location/v1/zones",function (req,res) {

        self.ActionInstance.zonesGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/zones/:zoneId",function (req,res) {

        self.ActionInstance.zonesGetById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/zones/:zoneId/accessPoints",function (req,res) {

        self.ActionInstance.zonesByIdGetAps(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/zones/:zoneId/accessPoints/:accessPointId",function (req,res) {

        self.ActionInstance.zonesByIdGetApsById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

//////////////////////


////////////USERS/////////////

    app.get("/exampleAPI/location/v1/users",function (req,res) {

        self.ActionInstance.usersGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/users/:userId",function (req,res) {

        self.ActionInstance.usersGetById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

///////////////////////////////

//////////SUBSCRIPTIONS////////

    app.get("/exampleAPI/location/v1/subscriptions/zonalTraffic",function (req,res) {

        self.ActionInstance.zonalTrafficSubGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/zonalTraffic",function (req,res) {

        self.LocationServiceInstance.zonalTrafficSubPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        self.ActionInstance.zonalTrafficSubGetById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.put("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.zonalTrafficSubPutById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.delete("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.zonalTrafficSubDelById(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/userTracking",function (req,res) {

        self.ActionInstance.userTrackingSubGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/userTracking",function (req,res) {

        self.LocationServiceInstance.userTrackingSubPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        self.ActionInstance.userTrackingSubGetById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.put("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.userTrackingSubPutById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.delete("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.userTrackingSubDelById(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zonalStatus",function (req,res) {

        self.ActionInstance.zoneStatusGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/zonalStatus",function (req,res) {

        self.LocationServiceInstance.zoneStatusPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zoneStatus/:subscriptionId",function (req,res) {

        self.ActionInstance.zoneStatusGetById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.put("/exampleAPI/location/v1/subscriptions/zoneStatus/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.zoneStatusPutById(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.delete("/exampleAPI/location/v1/subscriptions/zoneStatus/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.zoneStatusDelById(req, function (err,result) {
            res.status(204).send(result);
        })
    });

/////////////////////////


    /*RNI API*/

///////////Query//////////

    app.get("/rni/v1/queries/rab_info",function (req,res) {

        self.RNIserviceInstance.rab_infoGET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });
    app.get("/rni/v1/queries/plmn_info",function (req,res) {

        self.ActionInstance.plmn_infoGET(req, function (err,resp) {
            res.status(resp.statuscode).send(resp);
        });
    });

    app.get("/rni/v1/queries/s1_bearer_info",function (req,res) {

        self.RNIserviceInstance.s1_bearer_infoGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

//////////////////////////////////

/////////subscriptions///////////

    app.get("/rni/v1/subscriptions/",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.get("/rni/v1/subscriptions/cell_change",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_cc_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/cell_change",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {
            self.RNIserviceInstance.CellChange_subscriptionsPOST(req, function (err, result) {
                if ( req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(201).send(result);
                }
                else if ( req.headers.accept.indexOf('text/plain') && typeof(result) == 'string') {
                    res.status(201).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/cell_change/:subscriptionId",function (req,res) {

        self.ActionInstance.cell_change_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp);
        })
    });

    app.put("/rni/v1/subscriptions/cell_change/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.CellChange_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/cell_change/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.CellChange_subscriptionsSubscrIdDELETE(req, function (err, result) {
            res.status(204).send(result);
        })

    });

    app.get("/rni/v1/subscriptions/s1_bearer",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_s1_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        });
    });

    app.post("/rni/v1/subscriptions/s1_bearer",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {
            self.RNIserviceInstance.S1BearerSubscription_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(201).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(201).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
                ;
            })
        }
    });

    app.get("/rni/v1/subscriptions/s1_bearer/:subscriptionId",function (req,res) {

        self.ActionInstance.S1BearerSubscription_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp);
        })
    });

    app.put("/rni/v1/subscriptions/s1_bearer/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.S1BearerSubscription_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/s1_bearer/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.S1Bearer_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/rni/v1/subscriptions/ta",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_ta_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/ta",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {
            self.RNIserviceInstance.MeasTa_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(201).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(201).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/ta/:subscriptionId",function (req,res) {

        self.ActionInstance.MeasTa_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp);
        })
    });

    app.put("/rni/v1/subscriptions/ta/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.MeasTa_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/ta/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.MeasTa_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/rni/v1/subscriptions/meas_rep_ue",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_mr_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/meas_rep_ue",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {
            self.RNIserviceInstance.MeasRepUe_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(201).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(201).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/meas_rep_ue/:subscriptionId",function (req,res) {

        self.ActionInstance.MeasRepUe_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp)
        })
    });

    app.put("/rni/v1/subscriptions/meas_rep_ue/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.MeasRepUeReport_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/meas_rep_ue/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.MeasRepUe_subscriptionsSubscrIdDELETE(req, function (err, result) {
            res.status(204).send(result);
        })

    });

    app.get("/rni/v1/subscriptions/rab_est",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_re_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/rab_est",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {
            self.RNIserviceInstance.RabEstSubscription_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(201).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(201).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/rab_est/:subscriptionId",function (req,res) {

        self.ActionInstance.RabEstSubscription_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp)
        })
    });

    app.put("/rni/v1/subscriptions/rab_est/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.RabEstSubscription_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/rab_est/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.RabEst_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/rni/v1/subscriptions/rab_mod",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_rm_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/rab_mod",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {

            self.RNIserviceInstance.RabModSubscription_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(201).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(201).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/rab_mod/:subscriptionId",function (req,res) {

        self.ActionInstance.RabModSubscription_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp)
        })
    });

    app.put("/rni/v1/subscriptions/rab_mod/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.RabModSubscription_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/rab_mod/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.RabMod_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/rni/v1/subscriptions/rab_rel",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_rr_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/rab_rel",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {

            self.RNIserviceInstance.RabRelSubscription_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(200).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(200).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/rab_rel/:subscriptionId",function (req,res) {

        self.ActionInstance.RabRelSubscription_subscriptionsGET(req, function (err, resp) {
            res.status(resp.statuscode).send(resp)
        })
    });

    app.put("/rni/v1/subscriptions/rab_rel/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.RabRelSubscription_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/rab_rel/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.RabRel_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.status(204).send(result);
        })
    });

    app.get("/rni/v1/subscriptions/ca_reconf",function (req,res) {

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_cr_GET(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/ca_reconf",function (req,res) {

        var content_Type = req.headers['content-type'];

        if (content_Type != 'application/json'){

            var result = {
                statuscode: 415,
                ProblemDetails: {
                    "type": "string",
                    "title": "string",
                    "status": 415,
                    "detail": "Unsupported Media Type",
                    "instance": "string"
                }
            };
            res.status(415).send(result);
        }
        else {

            self.RNIserviceInstance.CaReConfSubscription_subscriptionsPOST(req, function (err, result) {
                if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                    res.status(200).send(result);
                }
                else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                    res.status(200).send(result);
                }
                else {
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
                    res.status(406).send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/ca_reconf/:subscriptionId",function (req,res) {

        self.ActionInstance.CaReConfSubscription_subscriptionsGET(req, function (err, resp) {
            res.status(200).send(resp)
        })
    });

    app.put("/rni/v1/subscriptions/ca_reconf/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.CaReConfSubscription_subscriptionsPUT(req, function (err, result) {
            if (req.headers.accept.indexOf('application/json') >= 0 && typeof(result) == 'object') {
                res.status(200).send(result);
            }
            else if (req.headers.accept.indexOf('text/plain') >= 0 && typeof(result) == 'string') {
                res.status(200).send(result);
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
                res.status(406).send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/ca_reconf/:subscriptionId",function (req,res) {

        self.RNIserviceInstance.CaReConf_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.status(204).send(result);
        })
    });

};