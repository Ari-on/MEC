var AppService = function (app) {
    this.app = app;
};

module.exports = AppService;

AppService.prototype.app_listGET = function (req,callback) {

    console.log("APP Method1");
    callback(null,"DONE app_listGET");
};

AppService.prototype.app_contextsPOST = function (req,callback) {

    console.log("APP Method2");
    callback(null,"DONE app_contextsPOST");
};

AppService.prototype.app_contextsContextIdPUT = function (req,callback) {

    console.log("APP Method3");
    callback(null,"DONE app_contextsContextIdPUT");
};

AppService.prototype.app_contextsContextIdDELETE = function (req,callback) {

    console.log("APP Method4");
    callback(null,"DONE app_contextsContextIdDELETE");
};
