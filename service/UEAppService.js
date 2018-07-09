var AppService = function (app) {
    this.app = app;
};

module.exports = AppService;

AppService.prototype.app_listGET = function (req,callback) {
    console.log("service.js - app_listGET method is called")
    var self = this;
    var db = self.app.db;

    var appName, appProvider, appSoftVersion, serviceCont, vendorId;

    // Assigning values got from the URL to a variable
    if (req.appName) {
        appName = req.appName;
    }
    else {
        appName = null
    }

    if (req.appProvider) {
        appProvider = req.appProvider;
    }
    else {
        appProvider = null
    }

    if (req.appSoftVersion) {
        appSoftVersion = req.appSoftVersion;
    }
    else {
        appSoftVersion = null
    }

    if (req.serviceCont) {
        serviceCont = req.serviceCont;
    }
    else {
        serviceCont = null
    }

    if (req.vendorId) {
        vendorId = req.vendorId;
    }
    else {
        vendorId = null
    }

    //Performing the Join operation and printing as JSON
    if (appName == null && appProvider == null && appSoftVersion == null && serviceCont == null && vendorId == null) {
        var collection = db.collection('applicationList')
        collection.aggregate([
            {
                $lookup:
                {
                    from: "appInfo",
                    localField: "appInfo_Id",
                    foreignField: "appInfo_Id",
                    as: "appInfoData"
                }
            },
            {
                $unwind: "$appInfoData"
            },

            {
                $lookup:
                {
                    from: "appCharcs",
                    localField: "appInfo_Id",
                    foreignField: "appInfo_Id",
                    as: "appCharcs"
                }
            },
            {
                $unwind: "$appCharcs"
            },

            {
                $lookup:
                {
                    from: "vendorSpecificExt",
                    localField: "vendorSpecificExt_Id",
                    foreignField: "vendorSpecificExt_Id",
                    as: "vendorSpecificExt"
                }
            },

            {
                $project:
                {
                    "appInfoData.appInfo_Id": 1,
                    "appInfoData.appName": 1,
                    "appInfoData.appProvider": 1,
                    "appInfoData.appSoftVersion": 1,
                    "appInfoData.appDescription": 1,
                    "appCharcs.appInfo_Id": 1,
                    "appCharcs.memory": 1,
                    "appCharcs.storage": 1,
                    "appCharcs.latency": 1,
                    "appCharcs.bandwidth": 1,
                    "appCharcs.serviceCont": 1,
                    "vendorSpecificExt.vendorId": 1,
                }
            }
        ]).toArray(function (err, item) {
            if (err) {
                console.log(err);
                callback(null, err)
            }
            else {
                var finalItem = [];
                var finalItemArrObj = [];
                var ApplicationList = {};
                var appInfo = {};
                var appCharcsData = {};

                for (var i = 0; item.length > i; i++) {
                    appInfo = {
                        'appName': item[i]['appInfoData']['appName'],
                        'appProvider': item[i]['appInfoData']['appProvider'],
                        'appSoftVersion': item[i]['appInfoData']['appSoftVersion'],
                        'appDescription': item[i]['appInfoData']['appDescription'],
                        'appCharcs': {
                            'memory': item[i]['appCharcs']['memory'],
                            'storage': item[i]['appCharcs']['storage'],
                            'latency': item[i]['appCharcs']['latency'],
                            'bandwidth': item[i]['appCharcs']['bandwidth'],
                            'serviceCont': item[i]['appCharcs']['serviceCont']
                        },
                    }

                    finalItemArrObj.push({
                        ApplicationList: {
                            "appInfo": [appInfo],
                            "vendorSpecificExt": item[i]['vendorSpecificExt'],
                        }
                    })
                }
                callback(null, finalItemArrObj)
            }
            console.log("Found the data!!!")
        })
    }
};

AppService.prototype.app_contextsPOST = function (req, appContext, callback) {
console.log("app_contextsPOST method is called")
  var self = this;
  var db = self.app.db;

  MongoClient.connect("mongodb://localhost:27017/MEC", function(err, db) {
    if(err) { 
      return console.log(err); 
    }
    else{
      var body = appContext;

      if (body !== undefined){
        var appInfo_appName = body.appInfo['appName']
        var appInfo_appProvider = body.appInfo['appProvider']
        var appInfo_appSoftVersion = body.appInfo['appSoftVersion']
        var appInfo_appDescription = body.appInfo['appDescription']
        var appInfo_referenceURL = body.appInfo['referenceURL']
        var appInfo_appPackageSource = body.appInfo['appInfo_appPackageSource']

        var insertQuery = {
          "applicationList_Id" : "applicationList_3",
          "contextId": body.contextId,
          "associateUeAppId": body.associateUeAppId,
          "callbackReference": body.callbackReference,
          "appInfo_Id" : "appInfo_3"
        }
        db.collection('applicationList').insertOne(insertQuery, function(err, res) {
          if (err) {
            throw err;
          }
          else {
            db.collection('appInfo').insertOne({
              "appInfo_Id" : "appInfo_3",
              "appName": appInfo_appName,
              "appProvider": appInfo_appProvider,
              "appSoftVersion": appInfo_appSoftVersion,
              "appDescription": appInfo_appDescription,
              "referenceURL": appInfo_referenceURL,
              "appPackageSource": appInfo_appPackageSource,
              "applicationList_Id" : "applicationList_3"
            });
            
            //Displaying the data after updation
            var collection = db.collection('applicationList')
            collection.aggregate([
              {
                $lookup:
                {
                  from : "appInfo",
                  localField : "appInfo_Id",
                  foreignField : "appInfo_Id",
                  as : "appInfoData"
                }
              },
              {
                $unwind : "$appInfoData"
              },
              
              {
                $project:
                {
                  "appInfoData.appInfo_Id" : 1,
                  "appInfoData.appName" : 1,
                  "appInfoData.appProvider" : 1,
                  "appInfoData.appSoftVersion" : 1,
                  "appInfoData.appDescription" : 1,
                }
              }
            ]).toArray(function(err,item){
              if(err){
                console.log(err);
                callback(null, err)
              }
              else{
                var finalItem = [];
                var finalItemArrObj = [];
                var ApplicationList = {};
                var appInfo = {};
                var appCharcsData  = {};

                for (var i = 0; item.length > i; i++){
                  appInfo = {
                    'appName' : item[i]['appInfoData']['appName'],
                    'appProvider' : item[i]['appInfoData']['appProvider'],
                    'appSoftVersion' : item[i]['appInfoData']['appSoftVersion'],
                    'appDescription' : item[i]['appInfoData']['appDescription'],
                  }
                  
                  finalItemArrObj.push({
                    ApplicationList: {
                      "contextId" : item[i].contextId,
                      "associateUeAppId" : item[i].associateUeAppId,
                      "callbackReference" : item[i].callbackReference,
                      "appInfo" : [appInfo],
                    }
                  })
                }
                callback(null,finalItemArrObj)
              }
            })
            console.log("Refresh and check db!!!")
          }
        })
      }
      else{
        console.log("No Body is passed")
        // var errorbody = {
        //   "Problem Details" : {
        //     "type": "string",
        //     "title": "string",
        //     "status": 0,
        //     "detail": "string",
        //     "instance": "string"
        //   }
        // }
        // resolve(errorbody)
      }
    }
  })
};

AppService.prototype.app_contextsContextIdPUT = function (req,callback) {

    console.log("APP Method3");
    callback(null,"DONE app_contextsContextIdPUT");
};

AppService.prototype.app_contextsContextIdDELETE = function (req,callback) {

    console.log("APP Method4");
    callback(null,"DONE app_contextsContextIdDELETE");
};
