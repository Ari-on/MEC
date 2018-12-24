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


var UIRoutes = function(app) {

    this.app = app;
    this.seviceInstance = new service(app);//for BWM
    this.IdserviceInstance = new Idservice(app);//for UE Identity
    this.AppserviceInstance = new Appservice(app);//for  UE Application
    this.Mp1serviceInstance = new Mp1service(app);//for  Mp1
    this.LocationServiceInstance = new LocationService(app);//for Location
    this.RNIserviceInstance = new RNIservice(app);//for RNI
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

        // var rowNo = parseInt(req.params.rowno, 10)+1;
        // var list = [];
        //
        // var stream = fs.createReadStream("/home/w5rtc/Downloads/BWM_API_swagger1.csv");
        //
        // var csvStream = csv()
        //     .on("data", function(data){
        //         list.push(data)
        //     })
        //     .on("end", function(){
        //         req = {};
        //         headings = list[0];
        //         data = list[rowNo];
        //         for (i = 0;i<headings.length;i++)
        //         {
        //             req[headings[i]] = data[i]
        //         }
        //         res.send([req]);
        //     });
        //
        // stream.pipe(csvStream);
        self.seviceInstance.read_dbGET(req, function (err, result) {
            res.send([result]);
        })
    });



    /* BWM API */

    app.get("/bwm/v1/bw_allocations/",function (req,res) {

        self.seviceInstance.bw_allocationsGET(req.query, function (err, result) {
            res.status(200).send(result);
        })
    });

    app.post("/bwm/v1/bw_allocations/",function (req,res) {

        self.seviceInstance.bw_allocationsPOST(req, function (err, result) {
            res.status(201).send(result);
        })
    });

    app.get("/bwm/v1/bw_allocations/:allocationID",function (req,res) {

        self.seviceInstance.bw_allocationsAllocationIdGET(req.params.allocationID, function (err, result) {
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

        self.AppserviceInstance.app_listGET(req, function (err, result) {
            res.send(result);
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
                res.status(204).send('');
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

        self.IdserviceInstance.appInstanceIdUe_identity_tag_infoGET(req, function (err, result) {
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

        console.log('GET Method', req.params);

        self.Mp1serviceInstance.ApplicationsDnsRules_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules/:dnsRulesId",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsDnsRule_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/applications/:appInstId/dns_rules/:dnsRulesId",function (req,res) {

        console.log('PUT Method',req.params);
        console.log('PUT Method',req.body);

        self.Mp1serviceInstance.ApplicationsDnsRule_PUT(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsSubscriptions_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.post("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        console.log('POST Method',req.params);
        console.log('POST Method',req.body);

        self.Mp1serviceInstance.ApplicationsSubscriptions_POST(req, function (err, result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions/:subType/:subId",function (req,res) {

        console.log('GET Method',req.params);

        self.Mp1serviceInstance.ApplicationsSubscription_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.delete("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions/:subType/:subId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.Mp1serviceInstance.ApplicationsSubscription_DELETE(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules",function (req,res) {

        console.log('GET Method', req.params);

        self.Mp1serviceInstance.ApplicationsTrafficRules_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules/:trafficRuleId",function (req,res) {

        console.log('GET Method', req.params);

        self.Mp1serviceInstance.ApplicationsTrafficRule_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/applications/:appInstId/traffic_rules/:trafficRuleId",function (req,res) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.Mp1serviceInstance.ApplicationsTrafficRules_PUT(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/services",function (req,res) {

        console.log('GET Method', req.query);

        self.Mp1serviceInstance.Services_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/services",function (req,res) {

        console.log('PUT Method', req.body);

        self.Mp1serviceInstance.Services_PUT(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/services/:serviceId",function (req,res) {

        console.log('GET Method', req.params);

        self.Mp1serviceInstance.ServicesServiceId_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.put("/exampleAPI/mp1/v1/services/:serviceId",function (req,res) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.Mp1serviceInstance.ServicesServiceId_PUT(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/timing/current_time",function (req,res) {

        console.log('GET Method', req.query);

        self.Mp1serviceInstance.TimingCurrentTime_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/timing/timing_caps",function (req,res) {

        console.log('GET Method', req.query);

        self.Mp1serviceInstance.TimingCaps_GET(req, function (err, result) {
            res.send(result);
        })
    });

    app.get("/exampleAPI/mp1/v1/transports",function (req,res) {

        console.log('GET Method', req.query);

        self.Mp1serviceInstance.Transports_GET(req, function (err, result) {
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
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/zonalTraffic",function (req,res) {

        self.LocationServiceInstance.zonalTrafficSubPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zonalTraffic/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.zonalTrafficSubGetById(req, function (err,result) {
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

        self.LocationServiceInstance.userTrackingSubGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/userTracking",function (req,res) {

        self.LocationServiceInstance.userTrackingSubPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/userTracking/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.userTrackingSubGetById(req, function (err,result) {
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

        self.LocationServiceInstance.zoneStatusGet(req, function (err,result) {
            res.status(200).send(result);
        })
    });

    app.post("/exampleAPI/location/v1/subscriptions/zonalStatus",function (req,res) {

        self.LocationServiceInstance.zoneStatusPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });

    app.get("/exampleAPI/location/v1/subscriptions/zoneStatus/:subscriptionId",function (req,res) {

        self.LocationServiceInstance.zoneStatusGetById(req, function (err,result) {
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

        console.log('GET Method', req.query);

        self.RNIserviceInstance.rab_infoGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });
    app.get("/rni/v1/queries/plmn_info",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.plmn_infoGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.get("/rni/v1/queries/s1_bearer_info",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.s1_bearer_infoGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

//////////////////////////////////

/////////subscriptions///////////

    app.get("/rni/v1/subscriptions/",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.get("/rni/v1/subscriptions/cell_change",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_cc_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/cell_change",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {
            self.RNIserviceInstance.CellChange_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/cell_change/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.CellChange_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/cell_change/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);


        self.RNIserviceInstance.CellChange_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/cell_change/:subscriptionId",function (req,res) {

        console.log('DELETE Method', req.params);

        self.RNIserviceInstance.CellChange_subscriptionsSubscrIdDELETE(req, function (err, result) {
            res.send(result);
        })

    });

    app.get("/rni/v1/subscriptions/s1_bearer",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_s1_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        });
    });

    app.post("/rni/v1/subscriptions/s1_bearer",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {
            self.RNIserviceInstance.S1BearerSubscription_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
                ;
            })
        }
    });


    app.get("/rni/v1/subscriptions/s1_bearer/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.S1BearerSubscription_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/s1_bearer/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.RNIserviceInstance.S1BearerSubscription_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/s1_bearer/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.RNIserviceInstance.S1Bearer_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/rni/v1/subscriptions/ta",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_ta_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/ta",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {
            self.RNIserviceInstance.MeasTa_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/ta/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.MeasTa_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            };
        })
    });

    app.put("/rni/v1/subscriptions/ta/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.RNIserviceInstance.MeasTa_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/ta/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.RNIserviceInstance.MeasTa_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/rni/v1/subscriptions/meas_rep_ue",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_mr_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/meas_rep_ue",function (req,res,next) {

        console.log('POST Method', req.params);
        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {
            self.RNIserviceInstance.MeasRepUe_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/meas_rep_ue/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.MeasRepUe_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/meas_rep_ue/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.RNIserviceInstance.MeasRepUeReport_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/meas_rep_ue/:subscriptionId",function (req,res) {

        console.log('DELETE Method', req.params);

        self.RNIserviceInstance.MeasRepUe_subscriptionsSubscrIdDELETE(req, function (err, result) {
            res.send(result);
        })

    });

    app.get("/rni/v1/subscriptions/rab_est",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_re_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/rab_est",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {
            self.RNIserviceInstance.RabEstSubscription_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/rab_est/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.RabEstSubscription_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/rab_est/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.RNIserviceInstance.RabEstSubscription_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/rab_est/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.query);

        self.RNIserviceInstance.RabEst_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/rni/v1/subscriptions/rab_mod",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_rm_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/rab_mod",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {

            self.RNIserviceInstance.RabModSubscription_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/rab_mod/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.RabModSubscription_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/rab_mod/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.RNIserviceInstance.RabModSubscription_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/rab_mod/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.RNIserviceInstance.RabMod_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/rni/v1/subscriptions/rab_rel",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_rr_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/rab_rel",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {

            self.RNIserviceInstance.RabRelSubscription_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/rab_rel/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.RabRelSubscription_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/rab_rel/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.params);
        console.log('GET Method', req.body);

        self.RNIserviceInstance.RabRelSubscription_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/rab_rel/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.RNIserviceInstance.RabRel_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/rni/v1/subscriptions/ca_reconf",function (req,res,next) {

        console.log('GET Method', req.query);

        self.RNIserviceInstance.SubscriptionLinkList_subscriptions_cr_GET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.post("/rni/v1/subscriptions/ca_reconf",function (req,res,next) {

        console.log('POST Method', req.body);

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
            res.send(result);
        }
        else {

            self.RNIserviceInstance.CaReConfSubscription_subscriptionsPOST(req, function (err, result) {
                if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                    res.send(result);
                }
                else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
                    res.send(result);
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
                    res.send(result);
                }
            })
        }
    });

    app.get("/rni/v1/subscriptions/ca_reconf/:subscriptionId",function (req,res,next) {

        console.log('GET Method', req.query);
        console.log('GET Method', req.params);

        self.RNIserviceInstance.CaReConfSubscription_subscriptionsGET(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.put("/rni/v1/subscriptions/ca_reconf/:subscriptionId",function (req,res,next) {

        console.log('PUT Method', req.params);
        console.log('PUT Method', req.body);

        self.RNIserviceInstance.CaReConfSubscription_subscriptionsPUT(req, function (err, result) {
            if (request.headers.accept == 'application/json' && typeof(result) == 'object') {
                res.send(result);
            }
            else if (request.headers.accept == 'text/plain' && typeof(result) == 'string') {
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
                res.send(result);
            }
        })
    });

    app.delete("/rni/v1/subscriptions/ca_reconf/:subscriptionId",function (req,res) {

        console.log('DELETE Method',req.params);

        self.RNIserviceInstance.CaReConf_subscriptionsSubscrIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

};