var AppService = function (app) {
    this.app = app;
};

module.exports = AppService;

AppService.prototype.app_listGET = function (req,callback) {
    callback(null,"app_listGET")
};

AppService.prototype.app_contextsPOST = function (req, callback) {
    console.log("This is app_contextsPOST method!!!");
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

        var collection = db.collection("UE_Application_Interface_API_swagger");
        var AppContext = {
            "AppContext" : myobj
        };
        collection.insert(AppContext,function(err,resp) {
            if(resp){
                var result = {
                    statuscode:201,
                    AppContext: resp['ops'][0]['AppContext']
                };
                callback(err,result);
            }
            else{
                callback(err,'inserterror');
            }
        })
    // }
};

AppService.prototype.app_contextsContextIdPUT = function (req, callback) {

    console.log("This is app_contextsContextIdPUT method!!!");
    var self = this;
    var db = self.app.db;
    var contextId = req.params.contextID;
    var myobj = req.body;
    var collection = db.collection("UE_Application_Interface_API_swagger");

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
            "AppContext.contextId" : contextId
        },
        value:{
            "AppContext" : myobj
        },
        options:{
            multi:false,
            upsert:false
        }
    };
    collection.update(criteria.condition,{$set:criteria.value},function (err,resp) {

        if(resp){
            callback(err,'updated');
        }
        else{
            callback('updateError',resp);
        }

    });
    // collection.update(criteria.condition,{$set:criteria.value},function(err,resp) {
    //     if(resp){
    //         var result = {
    //             statuscode:200,
    //             AppContext: myobj
    //         };
    //         callback(err,result);
    //     }
    //     else{
    //         callback('updateError',null);
    //     }
    //
    // });

};

AppService.prototype.app_contextsContextIdDELETE = function (req, callback) {

  console.log("This is app_contextsContextIdDELETE method!!!");
  var self = this;
  var db = self.app.db;

  var myquery = {
      "AppContext.contextId" : req.params.contextID
  };
  var collation = db.collection('UE_Application_Interface_API_swagger');

  collation.removeOne(myquery, function(err, resp) {
      if (resp) {
          callback(err, '')
      } else {
          callback(err, "Error while Deleting")
      }
  })
};