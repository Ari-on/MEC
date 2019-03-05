var jwt = require('jsonwebtoken');
// var xlsx = require('node-xlsx');
 var fs = require('fs');
 var csv = require("fast-csv");

var commonservice  = require ('../service/commonservice.js');

var UIRoutes = function(app) {

    this.app = app;
    this.commonInstance = new commonservice(app);//for RNI
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
/*
    app.get("/createToken", function (req, res) {

        var token = jwt.sign({ id : user }, secret, {
            expiresIn: 3600 // expires in 1 hours
        });

        var result = {
            token : token
        };

        res.status(200).send(result)
    });
*/
    var collectionName = ''
    var getParams = [];
    var finalQuery = {}

    app.get("/read_db/:rowno",function (req,res) {
        console.log('read_db API called ---')
        var url = req.query.query;
        var db = self.app.db;

        console.log(url,"url -----")
//        console.log(db,"DB details -----")

//        url = "/bwm/v1/bw_allocations/:allocationId"
//        url = "/bwm/v1/bw_allocations?app_instance_id={{app_instance_id}}?app_name={{app_name}}?session_id={{session_id}}"

        if(url.includes(':')){
            var str = url.split('/')
            for(var i=0; i < str.length; i++){

                if(str[i].includes(':')){
                    console.log('url.indexOf(str[i] ----',str.indexOf(str[i]) )
                    var finalWord = str[i].replace(':','')
//                     getParams.push(finalWord)
                    getParams.push({ key : str.indexOf(str[i]) - 1, value : finalWord})
                }
            }
            console.log('getParams ---', getParams)
        }
        else{

            var str = url.split('?')
console.log("str is ---", str.length)
            for(var i=0; i<str.length; i++){
                  if(str[i].includes('{{')){
                    console.log(str[i],"str[i] {{ symbol is their")
                        var finalWord = str[i].split('=')
                        console.log("finalWord[0] -----", finalWord[0])
                        getParams.push(finalWord[0])
                  }
            }
//            console.log("getParams ====", getParams)
        }


        if (url.includes('/bwm/v1')){
//             collectionNameBWM = "BWM_test1"

               collectionName = "BWM_API_swagger"
               console.log("collectionName", collectionName)
//            self.seviceInstance.read_db(req, function (err, result) {
//                res.send([result]);
//            })
        }
        else if (url.includes('/ui/v1')){
            collectionName = "UE_Identity_API_swagger"
//            self.IdserviceInstance.read_db(req, function (err, result) {
//                res.send([result]);
//            })
        }
        else if (url.includes('/mx2/v1')){
            collectionName = "UE_Application_Interface_API_swagger"
//            self.AppserviceInstance.read_db(req, function (err, result) {
//                res.send([result]);
//            })
        }
        else if (url.includes('/exampleAPI/mp1')){
            collectionName = "Mp1_API_swagger"
//            self.Mp1serviceInstance.read_db(req, function (err, result) {
//                res.send([result]);
//            })
        }
        else if (url.includes('/exampleAPI/location')){
            collectionName = "Location_API_swagger"
//            self.LocationServiceInstance.read_db(req, function (err, result) {
//                res.send([result]);
//            })
        }
        else if (url.includes('/rni/v1')){
            collectionName = "RNI_API_swagger"
//            self.RNIserviceInstance.read_db(req, function (err, result) {
//                res.send([result]);
//            })
        }


        var myobj = parseInt(req.params.rowno)-1;
        // console.log("myobj ----",myobj)
        // console.log("collectionName", collectionName)
        var collection = db.collection(collectionName);

        collection.find().toArray(function(err,resp) {
            if(resp){
//                console.log(resp[myobj])
                res.send(resp[myobj]);
            }
            else{
                console.log('Error is', err)
                res.send('finderror');
            }
        })


    });


    app.get("/read_csv/:rowno", function (req, res) {

        var url = req.query.query;

        if (url.includes('/bwm/v1')){
               collectionName = "BWM_API_swagger"
        }
        else if (url.includes('/ui/v1')){
            collectionName = "UE_Identity_API_swagger"
        }
        else if (url.includes('/mx2/v1')){
            collectionName = "UE_Application_Interface_API_swagger"
        }
        else if (url.includes('/exampleAPI/mp1')){
            collectionName = "Mp1_API_swagger"
        }
        else if (url.includes('/exampleAPI/location')){
            collectionName = "Location_API_swagger"
        }
        else if (url.includes('/rni/v1')){
            collectionName = "RNI_API_swagger"
        }


//        if (url.includes('/bwm/v1')) {
            var rowNo = parseInt(req.params.rowno, 10);
            var list = [];

            var stream = fs.createReadStream(__dirname+"/../outputFiles/"+collectionName+".csv");

            var csvStream = csv()
                .on("data", function(data){
                    list.push(data)
                })
                .on("end", function(){
                    req = {};
                    headings = list[0];
                    data = list[rowNo];
                    for (i = 0;i<headings.length;i++)
                    {
                        req[headings[i]] = data[i]
                    }
                    res.send([req]);
                });

            stream.pipe(csvStream);
//        }
    });
    /* BWM API */

//    app.get("/bwm/v1/bw_allocations/",function (req,res) {
//        self.ActionInstance.bw_allocationsGET(req, function (err, result) {
//            res.status(200).send(result);
//        })
//    });


    app.post("/*", function(req, res){
        console.log("Entered into Common Post Method")
         self.commonInstance.commonPOST(req.body,collectionName, function (err, res) {
         console.log('Post response is',res)
            if(res){
                var result = {
                    statuscode:201,
                    bwInfo: res[0]
                };
                res.send(result)
            }
            else{
                console.log('Post Method error is', err)
                res.send(err)
            }
        });
    })

    app.get("/*", function (req, res){

console.log('req.query ----',req.query)
console.log('req.query ----',req.params)
            if(getParams.length > 0){
                var query = {}
                var parameters = []
                parameters = getParams
//                console.log('req.params.allocationId',req.params)

                if (req.query === '' || req.query === undefined || req.query === 'undefined'){
                     var str = req.params[0].split('/')
                     for(var i=0; i < getParams.length; i++){
                        console.log(getParams[i].key, "getParams[i].key --")
                        query[getParams[i].value] = str[getParams[i].key]
                     }
                    finalQuery = query
                }
                else{
                    finalQuery = req.query
                }

            }
            else{
                finalQuery = req.query;
            }
            console.log(finalQuery)
            self.commonInstance.commonGET(finalQuery,collectionName, function (err, resp) {

                var permittedValues = resp.map(function(value) {
                    if (value.hasOwnProperty('bwInfo')) {
                        return {bwInfo: value.bwInfo};
                    }else{
                        return value;
                    }
//                    return {bwInfo: value};
                });

                var data = permittedValues.filter(function( element ) {
                    return element !== undefined;
                });

                var result = {
                    statuscode : 200,
                    res : data
                };
//              res.write("result is :",result);
                res.send(result)
//              callback(null,result);
            })
    })

    app.delete('/*', function(req,res){

        console.log('common delete method ----')
         var url = req.params;
         var reqBody = req.body;

        var query = {}
        var parameters = []

        console.log("myquery ---- ", req.params)

        if (req.query === '' || req.query === undefined || req.query === 'undefined'){
            var str = req.params[0].split('/')
            for(var i=0; i < getParams.length; i++){
//                console.log(getParams[i].key, "getParams[i].key --")
                query[getParams[i].value] = str[getParams[i].key]
            }
            finalQuery = query
        } else{
            finalQuery = req.query
        }

        self.commonInstance.commonDelete(finalQuery,collectionName, function (err, resp) {
//        console.log('response is ---',resp)
            if (resp) {
                res.send('Record deleted Successfully')
            } else {
                console.log(err)
                res.send("Error while Deleting")
            }
        })

    })

    app.put("/*", function(req, res){
        console.log('common put routes called -- ')

        var query = {}
        var parameters = []
        console.log('getParams ----',getParams)

//        if (req.params !== ''){
        if (req.query === '' || req.query === undefined || req.query === 'undefined'){
            var str = req.params[0].split('/')
             for(var i=0; i < getParams.length; i++){
//                console.log(getParams[i].key, "getParams[i].key --")
                query[getParams[i].value] = str[getParams[i].key]
              }
            finalQuery = query
        }
        else{
            finalQuery = req.query
        }

        console.log("myquery ---- ", query)

         self.commonInstance.commonUpdate(finalQuery, {$set:req.body}, collectionName, function (err, resp) {
            if(resp['n'] != 0){
                var result = {
                    statuscode:200,
                    result: req.body
                };
                res.send(result);
            }
            else{
                console.log('Error is', err)
                res.send(err);
            }
         });
    })

    app.patch("/*", function(req, res){
        console.log("Emtered into patch Method")

    })

/*
    app.post("/bwm/v1/bw_allocations/",function (req,res) {

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

            self.commonInstance.commonPOST(bwInfo, collectionName, function (err, res) {
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

    });




    app.patch("/bwm/v1/bw_allocations/:allocationID",function (req,res) {


        var query = {}
        var parameters = []
        console.log('getParams ----',getParams)

        parameters = getParams

        console.log(parameters.length,"parameters.length ---")
        for(var i=0; i < parameters.length; i++){
//            console.log(parameters[i],"getParams[i] =======")
            query[parameters[i]] = 'req.params.'+parameters[i]

        }

        console.log("myquery ---- ", query)



            var myobj = req.body;

            var criteria={
                condition: query,
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




//        self.ActionInstance.bw_allocationsAllocationIdPATCH(req, function (err, result) {
//            res.status(200).send(result);
//        })
    });



    app.post("/mx2/v1/app_contexts",function (req,res) {

        // self.AppserviceInstance.app_contextsPOST(req, function (err, result) {
        //     res.status(201).send(result)
        // });

        self.ActionInstance.app_contextsPOST(req, function (err, result) {
            res.status(201).send(result)
        });
    });




    app.post("/exampleAPI/mp1/v1/applications/:appInstId/subscriptions",function (req,res) {

        // self.Mp1serviceInstance.ApplicationsSubscriptions_POST(req, function (err, result) {
        //     res.status(201).send(result);
        // })

        self.ActionInstance.ApplicationsSubscriptions_POST(req, function (err, result) {
            res.status(201).send(result);
        })
    });

//    app.post("/exampleAPI/mp1/v1/services",function (req,res) {
//        self.ActionInstance.Services_POST(req, function (err, result) {
//            res.status(201).send(result);
//        })
//    });


    app.post("/exampleAPI/location/v1/subscriptions/zonalTraffic",function (req,res) {

        // self.LocationServiceInstance.zonalTrafficSubPost(req, function (err,result) {
        //     res.status(201).send(result);
        // })

        self.ActionInstance.zonalTrafficSubPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });


    app.post("/exampleAPI/location/v1/subscriptions/userTracking",function (req,res) {

        // self.LocationServiceInstance.userTrackingSubPost(req, function (err,result) {
        //     res.status(201).send(result);
        // })

        self.ActionInstance.userTrackingSubPost(req, function (err,result) {
            res.status(201).send(result);
        })
    });


    app.post("/exampleAPI/location/v1/subscriptions/zonalStatus",function (req,res) {

        // self.LocationServiceInstance.zoneStatusPost(req, function (err,result) {
        //     res.status(201).send(result);
        // })

        self.ActionInstance.zoneStatusPost(req, function (err,result) {
            res.status(201).send(result);
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
            self.ActionInstance.CellChange_subscriptionsPOST(req, function (err, result) {
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
            self.ActionInstance.S1BearerSubscription_subscriptionsPOST(req, function (err, result) {
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
            self.ActionInstance.MeasTa_subscriptionsPOST(req, function (err, result) {
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
            self.ActionInstance.MeasRepUe_subscriptionsPOST(req, function (err, result) {
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
            self.ActionInstance.RabEstSubscription_subscriptionsPOST(req, function (err, result) {
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

            self.ActionInstance.RabModSubscription_subscriptionsPOST(req, function (err, result) {
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

            self.ActionInstance.RabRelSubscription_subscriptionsPOST(req, function (err, result) {
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

            self.ActionInstance.CaReConfSubscription_subscriptionsPOST(req, function (err, result) {
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

 */

};