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

    console.log("Mp1 Method11");
    callback(null,"DONE Mp1 Services_GET");
};

Mp1Service.prototype.Services_PUT = function (req,callback) {

    console.log("Mp1 Method12");
    callback(null,"DONE Mp1 Services_PUT");
};

Mp1Service.prototype.ServicesServiceId_GET = function (req,callback) {

    console.log("Mp1 Method13");
    callback(null,"DONE Mp1 ServicesServiceId_GET");
};

Mp1Service.prototype.ServicesServiceId_PUT = function (req,callback) {

    console.log("Mp1 Method14");
    callback(null,"DONE Mp1 ServicesServiceId_PUT");
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


