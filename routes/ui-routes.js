
var service  = require ('../service/DefaultService.js');
var Idservice  = require ('../service/UEIdentityService.js');
var Appservice  = require ('../service/UEAppService.js');


var UIRoutes = function(app) {

    this.app = app;
    this.seviceInstance = new service(app);
    this.IdserviceInstance = new Idservice(app);
    this.AppserviceInstance = new Appservice(app);
};


module.exports    = UIRoutes;

UIRoutes.prototype.init = function() {
    var self = this;
    var app = this.app;

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

    app.get("/mx2/v1/app_list",function (req,res) {

        console.log('GET Method',req.query)

        self.AppserviceInstance.app_listGET(req, function (err,result) {
            res.send(result);
        })
    });

    app.post("/mx2/v1/app_contexts",function (req,res) {

        console.log('POST Method',req.body)

        self.AppserviceInstance.app_contextsPOST(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/mx2/v1/app_contexts/:contextID",function (req,res) {

        console.log('PUT Method',req.params)

        self.AppserviceInstance.app_contextsContextIdPUT(req, function (err,result) {
            res.send(result);
        })
    });

    app.delete("/mx2/v1/app_contexts/:contextID",function (req,res) {

        console.log('DELETE Method',req.params)

        self.AppserviceInstance.app_contextsContextIdDELETE(req, function (err,result) {
            res.send(result);
        })
    });

    app.get("/ui/v1/:appInstId/ue_identity_tag_info",function (req,res) {

        console.log('GET Method',req.params)
        console.log('GET Method',req.query)

        self.IdserviceInstance.appInstanceIdUe_identity_tag_infoGET(req, function (err,result) {
            res.send(result);
        })
    });

    app.put("/ui/v1/:appInstId/ue_identity_tag_info",function (req,res) {

        console.log('PUT Method',req.params)
        console.log('PUT Method',req.body)

        self.IdserviceInstance.appInstanceIdUe_identity_tag_infoPUT(req, function (err,result) {
            res.send(result);
        })
    });

}

