var IdentitytService = function (app) {
    this.app = app;
};

module.exports = IdentitytService;

IdentitytService.prototype.read_db = function (req, callback) {
    console.log("This is read_db method!!!");
    var self = this;
    var db = self.app.db;

    var myobj = parseInt(req.params.rowno)-1;
    var collection = db.collection("UE_Identity_API_swagger");

    collection.find().toArray(function(err,resp) {
        if(resp){
            callback(err,resp[myobj]);
        }
        else{
            callback(err,'finderror');
        }
    })
};

IdentitytService.prototype.appInstanceIdUe_identity_tag_infoGET = function (req,callback) {
    console.log("This is appInstanceIdUe_identity_tag_infoGET method!!!");
    var self = this;
    var db = self.app.db;
    var ueIdentityTag = req.query.ueIdentityTag;

    var collection = db.collection('UE_Identity_API_swagger');
    collection.find({ueIdentityTag:ueIdentityTag},{'_id':0,'TestCaseUrl':0,'Result':0}).toArray(function (err,resp) {
        if (resp){
            var UeIdentityTagInfo = {
                "ueIdentityTags" :[
                    {
                        "ueIdentityTag": resp[0]["ueIdentityTags.UeIdentityTag"] ,
                        "State": resp[0]["ueIdentityTags.State"]
                    }
                ]
            };
            var result = {
                statuscode: 200,
                UeIdentityTagInfo: UeIdentityTagInfo
            };
            callback(err,result)
        }
        else{
            callback(err,"can't find")
        }
    })
};

IdentitytService.prototype.appInstanceIdUe_identity_tag_infoPUT = function (req,callback) {

    console.log("This is appInstanceIdUe_identity_tag_infoPUT method!!!");
    var self = this;
    var db = self.app.db;
    var appInstId = req.params.appInstId;
    var myobj = req.body;
    var collection = db.collection("UE_Identity_API_swagger");

    // if (myobj.sessionFilter === undefined || myobj.sessionFilter === '') {
    //     console.log("Parameters are INCORRECT")
    //     var errorbody = {
    //         "Problem Details": {
    //             "type": "string",
    //             "title": "string",
    //             "status": 400,
    //             "detail": "Incorrect parameters",
    //             "instance": "string"
    //         }
    //     };
    //
    //     var result = {
    //         statuscode: 400,
    //         res: errorbody
    //     };
    //     callback(null, result)
    // } else {
    var criteria={
        condition:{
            "appInstId" : appInstId
        },
        value:{
            "ueIdentityTags.UeIdentityTag" :  myobj['ueIdentityTags'][0]['UeIdentityTag'],
            "ueIdentityTags.State" : myobj['ueIdentityTags'][0]['State']
        },
        options:{
            multi:false,
            upsert:false
        }
    };
    collection.update(criteria.condition,{$set:criteria.value},function(err,resp) {
        if(resp){
            var result = {
                statuscode:200,
                UeIdentityTagInfo: myobj
            };
            callback(err,result);
        }
        else{
            callback(err,'updateError');
        }

    });

    // }//main Else;
};
