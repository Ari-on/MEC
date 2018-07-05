var IdentitytService = function (app) {
    this.app = app;
};

module.exports = IdentitytService;

IdentitytService.prototype.appInstanceIdUe_identity_tag_infoGET = function (req,callback) {

    console.log("ID Method1");
    callback(null,"DONE appInstanceIdUe_identity_tag_infoGET");
};

IdentitytService.prototype.appInstanceIdUe_identity_tag_infoPUT = function (req,callback) {

    console.log("ID Method2");
    callback(null,"DONE appInstanceIdUe_identity_tag_infoPUT");
};
