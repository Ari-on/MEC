'use strict';
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

// exports.use(bodyParser.json());
// exports.use(bodyParser.urlencoded({extented:true}))

/**
 * Remove a specific bandwidthAllocation resource. DELETE method is typically used in \"Unregister from Bandwidth Management Service\" procedure
 *
 * allocationId String Represents a bandwidth allocation instance
 * no response value expected for this operation
 **/
exports.bw_allocationsAllocationIdDELETE = function(allocationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * This method retrieves information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * returns inline_response_200
 **/
exports.bw_allocationsAllocationIdGET = function(allocationId) {
  console.log("This is bw_allocationsAllocationIdGET method!!!")
  return new Promise(function(resolve, reject) {
    MongoClient.connect("mongodb://localhost:27017/MEC", function(err,db) {
    	if(err) {
    		return console.log(err);
    	}
    	else{
    		console.log("allocationId............", allocationId)
    		if (allocationId != null){
    			var collection = db.collection('bwInfo')
    			collection.aggregate([
    				{
    					$match:
    					{
    						allocation_Id : allocationId
    					}
    				},
    				{
    					$lookup:
    					{
    						from : "timeStamp",
    						localField : "timeStamp_Id",
    						foreignField : "timeStamp_Id",
    						as : "timeStamp"
    					}
    				},
    				{
    					$unwind : "$timeStamp"
    				},

    				{
    					$lookup:
    					{
    						from : "reqstType",
    						localField : "reqstType",
    						foreignField : "reqstType_Id",
    						as : "requestType"
    					}
    				},
    				{
    					$unwind : "$requestType"
    				},

    				{
    					$lookup:
    					{
    						from : "sessionFilter",
    						localField : "appIns_Id",
    						foreignField : "appIns_Id",
    						as : "sessionFiltedInfo"
    					}
    				},

    				{
    					$lookup:
    					{
    						from : "ports",
    						localField : "session_Id",
    						foreignField : "session_Id",
    						as : "ports"
    					}
    				},
    				{
    					$unwind : "$ports"
    				},

    				{
    					$project:
    					{
    						_id : 0,
                requestType : 1,
                fixedBWPriority : 1,
                fixedAllocation : 1,
                allocationDirection : 1,
                appIns_Id : 1,
                "timeStamp.seconds" : 1 ,
                "timeStamp.nanoSeconds" : 1,

                "sessionFiltedInfo.session_Id" : 1,
                "sessionFiltedInfo.sourceIP" : 1,
                "ports" : 1,
                // "srcPort" : 1,
                // "dstPort" : 1,
                "sessionFiltedInfo.destAddress" : 1,
                "sessionFiltedInfo.protocol" : 1,
    					}
    				}
    			]).toArray(function(err, item) {
              if(err){
                console.log(err)
              }
              else{
	              var finalItem = [];
	              var finalItemArrObj = [];
	              var bwInfo = {};
            	  // console.log('item is ----', item)
                // return false;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                for(var i = 0 ; item.length > i; i++){
                  // console.log(item[i], "item printing")
                  // console.log("\n")
                  finalItemArrObj.push({
                      bwInfo :{ 
                      'timeStamp' : item[i]['timeStamp'],
                      'appIns_Id' : item[i]['appIns_Id'],
                      'requestType' : item[i].requestType['reqstTypeDescription'],
                      'sessionFilter' : item[i]['sessionFiltedInfo'],                   
                      'sourcePort' : item[i].ports['srcPort'],                  
                      'dstPort' : item[i].ports['dstPort'],
                      // 'sourcePort' : item[i]['ports.srcPort'],                  
                      // 'dstPort' : item[i]['ports.dstPort'],
                      'fixedBWPriority' : item[i]['fixedBWPriority'],
                      'fixedAllocation' : item[i]['fixedAllocation'],
                      'allocationDirection' : item[i]['allocationDirection']
                    }
                  })
                }
               resolve(finalItemArrObj); 
              }
            });
    		}
    	}
    })
  });
}


/**
 * This method updates the information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * bwInfoDeltas BwInfoDeltas Description of the changes to instruct the server how to modify the resource representation. 
 * returns inline_response_200
 **/
exports.bw_allocationsAllocationIdPATCH = function(allocationId,bwInfoDeltas) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect("mongodb://localhost:27017/MEC", function(err, db){
      if (err){
        return console.log (err);
      }
      else{
        console.log("allocationId............", allocationId)
        var myobj = bwInfoDeltas
        console.log(">>>>>>>>>>>>>>>>>>>>>>bwInfoDeltas<<<<<<<<<<<<<<<<<<<<\n", myobj)
        console.log("#########################################################")

        var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
        var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
        var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
        var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
        var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]

        db.collection('bwInfo').findOneAndUpdate(
          {"allocation_Id" : allocationId},
          {
            $set :
            {
              "bwInfo_Id" : "bwInfo_4",
              "fixedBWPriority" : myobj.fixedBWPriority,
              "fixedAllocation" : myobj.fixedAllocation,
              "allocationDirection" : myobj.allocationDirection,
              "appIns_Id" : myobj.appInsId,
              "session_Id" : "session_3",
              "appInfo_Id" : "appInfo_3"
            }
          }
        )

        db.collection('sessionFilter').findOneAndUpdate(
          {"session_Id" : "session_3"},
          {
            $set :
            {
              "sourceIP" : sessionFilter_sourceIp, 
              "destAddress" : sessionFilter_dstAddress, 
              "protocol" : sessionFilter_protocol,
              "appIns_Id" : myobj.appInsId,
            }
          }
        )

        if (myobj['reqstType'] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || myobj['reqstType'] == "application_specific_bw_allocation"){
          console.log(myobj['reqstType'])
          db.collection('bwInfo').findOneAndUpdate(
            {"bwInfo_Id" : "bwInfo_4"},
            {
              $set:
              {
                "reqstType" : "0"
              }
            }
          )   
        }

        else if (myobj['reqstType'] == "SESSION_SPECIFIC_BW_ALLOCATION" || myobj['reqstType'] == "session_specific_bw_allocation"){
          console.log(myobj['reqstType'])
          db.collection('bwInfo').findOneAndUpdate(
            {"bwInfo_Id" : "bwInfo_4"},
            {
              $set:
              {
                "reqstType" : "1"
              }
            }
          )   
        }

        var mainLength;
        if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
          mainLength = sessionFilter_sourcePort.length
        }
        else{
          mainLength = sessionFilter_dstPort.length
        }
        var sourcePort, destPort;
        for(var i = 0; i < mainLength; i++){
          console.log(sessionFilter_sourcePort[i],"sessionFilter_sourcePort[i]")
          console.log(sessionFilter_dstPort[i],"sessionFilter_dstPort[i]")

          if(sessionFilter_dstPort[i]){
            destPort = sessionFilter_dstPort[i]
          } 
          else{
            destPort = ''
          }
          if(sessionFilter_sourcePort[i]){
            sourcePort = sessionFilter_sourcePort[i]
          } 
          else{
            sourcePort = ''
          }
          db.collection('ports').findOneAndUpdate(
            {"session_Id" : "session_3"},
            {
              $set:
              {
                 "port_Id" : "port_5",
                "srcPort" : sourcePort,
                "dstPort" : destPort,
              }
            }
          )  
        }
        console.log("Refresh and check the DB")
      }
    })
  });
}


/*
 *
 * This method updates the information about a specific bandwidthAllocation resource. 
 *
 * allocationId String Represents a bandwidth allocation instance
 * bwInfo BwInfo BwInfo with updated information is included as entity body of the request
 * returns inline_response_200
 *
*/
exports.bw_allocationsAllocationIdPUT = function(allocationId,bwInfo) {
  console.log("This is bw_allocationsAllocationIdPUT method!!!")
  return new Promise(function(resolve, reject) {
    MongoClient.connect("mongodb://localhost:27017/MEC", function(err, db){
      if (err){
        return console.log (err);
      }
      else{
        console.log("allocationId............", allocationId)
        var myobj = bwInfo
        console.log(">>>>>>>>>>>>>>>>>>>>>>bwInfo<<<<<<<<<<<<<<<<<<<<\n", myobj)
        console.log("#########################################################")

        var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
        var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
        var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
        var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
        var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]

        db.collection('bwInfo').findOneAndUpdate(
          {"allocation_Id" : allocationId},
          {
            $set :
            {
              "bwInfo_Id" : "bwInfo_4",
              "fixedBWPriority" : myobj.fixedBWPriority,
              "fixedAllocation" : myobj.fixedAllocation,
              "allocationDirection" : myobj.allocationDirection,
              "timeStamp_Id" : "timeStamp_3",
              "appIns_Id" : myobj.appInsId,
              "session_Id" : "session_3",
              "appInfo_Id" : "appInfo_3"
            }
          }
        )

        db.collection('timeStamp').findOneAndUpdate(
          {"timeStamp_Id": "timeStamp_3"},
          {
            $set: 
            {
              "seconds" : myobj.timeStamp["seconds"], 
              "nanoSeconds": myobj.timeStamp["nanoSeconds"], 
              "bwInfo_Id" : "bwInfo_4"
            }
          }
        )

        db.collection('sessionFilter').findOneAndUpdate(
          {"session_Id" : "session_3"},
          {
            $set:
            {
              "sourceIP" : sessionFilter_sourceIp, 
              "destAddress" : sessionFilter_dstAddress, 
              "protocol" : sessionFilter_protocol,
              "appIns_Id" : myobj.appInsId,
            }
          }
        )

        if (myobj["reqstType"] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || myobj["reqstType"] == "application_specific_bw_allocation"){    
          console.log(myobj["reqstType"])
          db.collection('bwInfo').findOneAndUpdate(
            {"bwInfo_Id" : "bwInfo_4"},
            {
              $set:
              {
                "reqstType" : "0"
              }
            }
          )
          console.log("updated for ", myobj["reqstType"])
        }
          
        else if(myobj["reqstType"] == "SESSION_SPECIFIC_BW_ALLOCATION" || myobj["reqstType"] == "session_specific_bw_allocation"){
          console.log(myobj["reqstType"])

          db.collection('bwInfo').findOneAndUpdate(
            {"bwInfo_Id" : "bwInfo_4"},
            {
              $set:
              {
                "reqstType" : "1"
              }
            }
          )
          console.log("updated for ", myobj["reqstType"])
        }

        var mainLength;
        if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
          mainLength = sessionFilter_sourcePort.length
        }
        else{
          mainLength = sessionFilter_dstPort.length
        }
        var sourcePort, destPort;
        for(var i = 0; i < mainLength; i++){
          console.log(sessionFilter_sourcePort[i],"sessionFilter_sourcePort[i]")
          console.log(sessionFilter_dstPort[i],"sessionFilter_dstPort[i]")

          if(sessionFilter_dstPort[i]){
            destPort = sessionFilter_dstPort[i]
          } 
          else{
            destPort = ''
          }
          if(sessionFilter_sourcePort[i]){
            sourcePort = sessionFilter_sourcePort[i]
          } 
          else{
            sourcePort = ''
          }
          db.collection('ports').findOneAndUpdate(
            {"session_Id" : "session_3"},
            {
              $set:
              {
                 "port_Id" : "port_5",
                "srcPort" : sourcePort,
                "dstPort" : destPort,
              }
            }
          )  
        }
        console.log("Refresh db and check")
      }
    })
  });
}


/**
 * This method retrieves information about a list of bandwidthAllocation resources
 *
 * app_instance_id List A mobile edge application instance may use multiple app_instance_ids as an input parameter to query the bandwidth allocation of a list of mobile edge application instances.  (optional)
 * app_name List A mobile edge application instance may use multiple ser_names as an input parameter to query the bandwidth allocation of a list of mobile edge application instances.  (optional)
 * session_id List A mobile edge application instance may use session_id as an input parameter to query the bandwidth allocation of a list of sessions.  (optional)
 * returns inline_response_200
 **/
exports.bw_allocationsGET = function(app_instance_id,app_name,session_Id) {
  console.log("This is bw_allocationsGET method!!!")
  return new Promise(function(resolve, reject) {
  
    MongoClient.connect("mongodb://localhost:27017/MEC", function(err, db) {
      if(err) { 
      	return console.log(err); 
      }
      else{
          console.log(app_instance_id)
        if(app_instance_id!= null && session_Id == null && app_name == null ){
              var collection = db.collection('bwInfo')
          
                collection.aggregate([

                    { $lookup : 
                      {
                        from : "timeStamp", 
                        localField : "timeStamp_Id", 
                        foreignField : "timeStamp_Id", 
                        as : "timeStamp"
                    }
                      },
                       {
                        $unwind : "$timeStamp" 
                       },
                    { $lookup : 
                      {
                        from : "reqstType", 
                        localField : "reqstType", 
                        foreignField : "reqstType_Id", 
                        as : "requestType"
                      }
                    },
                
                       {
                        $unwind : "$requestType" 
                       },
                        
                    {
                      $lookup:
                      {
                        from : "sessionFilter",
                        localField : "appIns_Id",
                        foreignField : "appIns_Id",
                        as : "sessionFiltedInfo"
                      }
                    },
                    { 
                      $match : 
                      {
                        appIns_Id : {$in : app_instance_id}
                        // $or : [{appIns_Id : {$in : app_instance_id}} , {session_Id :{$in : session_Id}}]
                      } 
                    },
                    {
                      $lookup:
                      {
                        from : "appInfo",
                        localField : "appInfo_Id",
                        foreignField : "appInfo_Id",
                        as : "appInfo"
                      }
                    },
                       {
                        $unwind : "$appInfo" 
                       },
            
                    {
                      $project : 
                      {
                        requestType : 1
                        ,fixedBWPriority : 1
                        ,fixedAllocation : 1
                        ,allocationDirection : 1
                        ,appIns_Id : 1
                        ,"timeStamp.seconds" : 1 
                        ,"timeStamp.nanoSeconds" : 1

                        ,"sessionFiltedInfo.session_Id" : 1 
                        ,"sessionFiltedInfo.sourceIP" : 1 
                        ,"sessionFiltedInfo.sourcePort" : 1                 
                        ,"sessionFiltedInfo.destAddress" : 1 
                        ,"sessionFiltedInfo.destPort" : 1 
                        ,"sessionFiltedInfo.protocol" : 1

                      } 
                    },


                ]).toArray(function(err, item) {
                  if(err){
                    console.log(err)
                  }else{
               
                    var finalItem = [];
                    var finalItemArrObj = [];
                    var bwInfo = {};
                   
                    for(var i = 0 ; item.length > i; i++){
                      finalItemArrObj.push({
                          bwInfo :{ 
                          'timeStamp' : item[i]['timeStamp'],
                          'appIns_Id' : item[i]['appIns_Id'],
                          'requestType' : item[i].requestType['reqstTypeDescription'],
                          'sessionFilter' : item[i]['sessionFiltedInfo'],
                          'fixedBWPriority' : item[i]['fixedBWPriority'],
                          'fixedAllocation' : item[i]['fixedAllocation'],
                          'allocationDirection' : item[i]['allocationDirection']
                          
                        }
                      })

                    }

                    resolve(finalItemArrObj); 
                  }
                });
        }

        else if (app_instance_id == null && session_Id != null && app_name == null){

                  var collection = db.collection('bwInfo')
              
                    collection.aggregate([

                       { $lookup : 
                          {
                            from : "timeStamp", 
                            localField : "timeStamp_Id", 
                            foreignField : "timeStamp_Id", 
                            as : "timeStamp"
                          }
                        },


                        {
                            $unwind : "$timeStamp" 
                        },
                        { $lookup : 
                          {
                            from : "reqstType", 
                            localField : "reqstType", 
                            foreignField : "reqstType_Id", 
                            as : "requestType"
                          }
                        },
                    
                        {
                            $unwind : "$requestType" 
                        },
                            
                        {
                          $lookup:
                          {
                            from : "sessionFilter",
                            localField : "appIns_Id",
                            foreignField : "appIns_Id",
                            as : "sessionFiltedInfo"
                          }
                        },
                        { 
                            $match : 
                            {
                              session_Id : {$in : session_Id}
                              // $or : [{appIns_Id : {$in : app_instance_id}} , {session_Id :{$in : session_Id}}]
                            } 
                        },
                        {
                          $lookup:
                          {
                            from : "appInfo",
                            localField : "appInfo_Id",
                            foreignField : "appInfo_Id",
                            as : "appInfo"
                          }
                        },
                       {
                        $unwind : "$appInfo" 
                       },
                  
                        {
                          $project : 
                          {
                            requestType : 1
                            ,fixedBWPriority : 1
                            ,fixedAllocation : 1
                            ,allocationDirection : 1
                            ,appIns_Id : 1
                            ,"timeStamp.seconds" : 1 
                            ,"timeStamp.nanoSeconds" : 1

                            ,"sessionFiltedInfo.session_Id" : 1 
                            ,"sessionFiltedInfo.sourceIP" : 1 
                            ,"sessionFiltedInfo.sourcePort" : 1                 
                            ,"sessionFiltedInfo.destAddress" : 1 
                            ,"sessionFiltedInfo.destPort" : 1 
                            ,"sessionFiltedInfo.protocol" : 1

                          } 
                        },
                    ]).toArray(function(err, item) {
                      if(err){
                        console.log(err)
                      }else{
                   
                        var finalItem = [];
                        var finalItemArrObj = [];
                        var bwInfo = {};
                       
                        for(var i = 0 ; item.length > i; i++){
                          finalItemArrObj.push({
                              bwInfo :{ 
                              'timeStamp' : item[i]['timeStamp'],
                              'appIns_Id' : item[i]['appIns_Id'],
                              'requestType' : item[i].requestType['reqstTypeDescription'],
                              'sessionFilter' : item[i]['sessionFiltedInfo'],
                              'fixedBWPriority' : item[i]['fixedBWPriority'],
                              'fixedAllocation' : item[i]['fixedAllocation'],
                              'allocationDirection' : item[i]['allocationDirection']
                              
                            }
                          })

                        }

                       resolve(finalItemArrObj); 
                      }
                    });
 
        }

        else if (app_instance_id == null && session_Id == null && app_name != null){

              var collection = db.collection('appInfo')
          
                collection.aggregate([

                    { $lookup : 
                      {
                        from : "bwInfo", 
                        localField : "appInfo_Id", 
                        foreignField : "appInfo_Id", 
                        as : "appInfo"
                      }
                    },
                     {
                        $unwind : "$appInfo" 
                    },
                    { $lookup : 
                      {
                        from : "sessionFilter", 
                        localField : "appInfo.session_Id", 
                        foreignField : "session_Id", 
                        as : "sessionFiltedInfo"
                      }
                    },

                    {
                        $unwind : "$sessionFiltedInfo" 
                    },

                    { $lookup : 
                      {
                        from : "timeStamp", 
                        localField : "appInfo.timeStamp_Id", 
                        foreignField : "timeStamp_Id", 
                        as : "timeStamp"
                      }
                    },

                    {
                        $unwind : "$timeStamp" 
                    },

                    { $lookup : 
                      {
                        from : "reqstType", 
                        localField : "appInfo.reqstType", 
                        foreignField : "reqstType_Id", 
                        as : "requestType"
                      }
                    },
                     {
                        $unwind : "$requestType" 
                    },
                       

                    { $match : 
                      {
                        appName : {$in : app_name}  
                      }
                    },
              
                    {
                      $project : 
                      {
                        requestType : 1
                        ,"appInfo.fixedBWPriority" : 1
                        ,"appInfo.fixedAllocation" : 1
                        ,"appInfo.allocationDirection" : 1
                        ,"appInfo.appIns_Id" : 1
                        ,"timeStamp.seconds" : 1 
                        ,"timeStamp.nanoSeconds" : 1

                        ,"sessionFiltedInfo.session_Id" : 1 
                        ,"sessionFiltedInfo.sourceIP" : 1 
                        ,"sessionFiltedInfo.sourcePort" : 1                 
                        ,"sessionFiltedInfo.destAddress" : 1 
                        ,"sessionFiltedInfo.destPort" : 1 
                        ,"sessionFiltedInfo.protocol" : 1

                      } 
                    },
              
                ]).toArray(function(err, item) {
                  if(err){
                    console.log(err)
                  }else{
               
                    var finalItem = [];
                    var finalItemArrObj = [];
                    var bwInfo = {};
                   
                    for(var i = 0 ; item.length > i; i++){
                      finalItemArrObj.push({
                          bwInfo :{ 
                          'timeStamp' : item[i]['timeStamp'],
                          'appIns_Id' : item[i].appInfo['appIns_Id'],
                          'requestType' : item[i].requestType['reqstTypeDescription'],
                          'sessionFilter' : item[i]['sessionFiltedInfo'],
                          'fixedBWPriority' : item[i].appInfo['fixedBWPriority'],
                          'fixedAllocation' : item[i].appInfo['fixedAllocation'],
                          'allocationDirection' : item[i].appInfo['allocationDirection']
                          
                        }
                      })

                    }

                   resolve(finalItemArrObj); 
                  }
                });
        }
          
        else if (app_instance_id != null && session_Id != null && app_name != null){

              var collection = db.collection('appInfo')
          
                collection.aggregate([

                    { $lookup : 
                      {
                        from : "bwInfo", 
                        localField : "appInfo_Id", 
                        foreignField : "appInfo_Id", 
                        as : "appInfo"
                      }
                    },
                    {
                      $unwind : "$appInfo" 
                    },

                    { $lookup : 
                      {
                        from : "sessionFilter", 
                        localField : "appInfo.session_Id", 
                        foreignField : "session_Id", 
                        as : "sessionFiltedInfo"
                      }
                    },

                    {
                      $unwind : "$sessionFiltedInfo" 
                    },


                    { $lookup : 
                      {
                        from : "timeStamp", 
                        localField : "appInfo.timeStamp_Id", 
                        foreignField : "timeStamp_Id", 
                        as : "timeStamp"
                      }
                    },

                    {
                      $unwind : "$timeStamp" 
                    },

                    { $lookup : 
                      {
                        from : "reqstType", 
                        localField : "appInfo.reqstType", 
                        foreignField : "reqstType_Id", 
                        as : "requestType"
                      }
                    },
                    {
                        $unwind : "$requestType" 
                    },
                    { $match : 
                      {
                        appName : {$in : app_name}  
                      }
                    },
              
                    {
                      $project : 
                      {
                        requestType : 1
                        ,"appInfo.fixedBWPriority" : 1
                        ,"appInfo.fixedAllocation" : 1
                        ,"appInfo.allocationDirection" : 1
                        ,"appInfo.appIns_Id" : 1
                        ,"timeStamp.seconds" : 1 
                        ,"timeStamp.nanoSeconds" : 1

                        ,"sessionFiltedInfo.session_Id" : 1 
                        ,"sessionFiltedInfo.sourceIP" : 1 
                        ,"sessionFiltedInfo.sourcePort" : 1                 
                        ,"sessionFiltedInfo.destAddress" : 1 
                        ,"sessionFiltedInfo.destPort" : 1 
                        ,"sessionFiltedInfo.protocol" : 1
                    	} 
                  	},
                ]).toArray(function(err, item) {
                  if(err){
                    console.log(err)
                  }
                  else{
                    var finalItem = [];
                    var finalItemArrObj = [];
                    var bwInfo = {};
                   
                    for(var i = 0 ; item.length > i; i++){
                      finalItemArrObj.push({
                          bwInfo :{ 
                          'timeStamp' : item[i]['timeStamp'],
                          'appIns_Id' : item[i].appInfo['appIns_Id'],
                          'requestType' : item[i].requestType['reqstTypeDescription'],
                          'sessionFilter' : item[i]['sessionFiltedInfo'],
                          'fixedBWPriority' : item[i].appInfo['fixedBWPriority'],
                          'fixedAllocation' : item[i].appInfo['fixedAllocation'],
                          'allocationDirection' : item[i].appInfo['allocationDirection']
                        }
                      })
                    }
                   	resolve(finalItemArrObj); 
                  }
                });
        }
          
        else if (app_instance_id == null && session_Id == null && app_name == null){
            var collection = db.collection('bwInfo')
            
            collection.aggregate([
              { $lookup : 
                {
                  from : "timeStamp", 
                  localField : "timeStamp_Id", 
                  foreignField : "timeStamp_Id", 
                  as : "timeStamp"
                }
              },
              {
                $unwind : "$timeStamp" 
              },

              { $lookup : 
                {
                  from : "reqstType", 
                  localField : "reqstType", 
                  foreignField : "reqstType_Id", 
                  as : "requestType"
                }
              },
              {
                $unwind : "$requestType" 
              },

              {
                $lookup:
                {
                  from : "sessionFilter",
                  localField : "appIns_Id",
                  foreignField : "appIns_Id",
                  as : "sessionFiltedInfo"
                }
              },
                        
              {
                $lookup:
                {
                  from : "ports",
                  localField : "session_Id",
                  foreignField : "session_Id",
                  as : "ports"
                }
              },
              {
                $unwind : "$ports" 
              },
		          // {
		          //   $group : { _id : "$ports.session_Id", srcPort : {$push : "$ports.srcPort" },dstPort : {$push : "$ports.dstPort" }  } 
		          // },
                            
              {
                $project : 
                {
                  _id : 0,
                  requestType : 1,
                  fixedBWPriority : 1,
                  fixedAllocation : 1,
                  allocationDirection : 1,
                  appIns_Id : 1,
                  "timeStamp.seconds" : 1 ,
                  "timeStamp.nanoSeconds" : 1,

                  "sessionFiltedInfo.session_Id" : 1,
                  "sessionFiltedInfo.sourceIP" : 1,
                  "ports" : 1,
                  // "srcPort" : 1,
                  // "dstPort" : 1,
                  "sessionFiltedInfo.destAddress" : 1,
                  "sessionFiltedInfo.protocol" : 1,
                } 
              },
            ]).toArray(function(err, item) {
              if(err){
                console.log(err)
              }
              else{
	              var finalItem = [];
	              var finalItemArrObj = [];
	              var bwInfo = {};
            	   console.log('item is ----', item)
               // return false;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                for(var i = 0 ; item.length > i; i++){
                  // console.log(item[i], "item printing")
                  console.log("\n")
                  finalItemArrObj.push({
                      bwInfo :{ 
                      'timeStamp' : item[i]['timeStamp'],
                      'appIns_Id' : item[i]['appIns_Id'],
                      'requestType' : item[i].requestType['reqstTypeDescription'],
                      'sessionFilter' : item[i]['sessionFiltedInfo'],                   
                      'sourcePort' : item[i].ports['srcPort'],                  
                      'dstPort' : item[i].ports['dstPort'],
                      // 'sourcePort' : item[i]['ports.srcPort'],                  
                      // 'dstPort' : item[i]['ports.dstPort'],
                      'fixedBWPriority' : item[i]['fixedBWPriority'],
                      'fixedAllocation' : item[i]['fixedAllocation'],
                      'allocationDirection' : item[i]['allocationDirection']
                    }
                  })
                }
               resolve(finalItemArrObj); 
              }
            });  
        }

        else{
        	console.log("ELSE BLOCK")
					var examples = {};
    			examples['application/json'] = {
					  "bwInfo" : {
					    "timeStamp" : {
					      "seconds" : { },
					      "nanoSeconds" : { }
					    },
					    "fixedBWPriority" : { },
					    "allocationDirection" : { },
					    "requestType" : { },
					    "sessionFilter" : "",
					    "appInsId" : { },
					    "fixedAllocation" : { }
					  }
        	}
        }
      }
    });
  });
}
  


/**
 * This method is used to create a bandwidthAllocation resource.
 *
 * bwInfo BwInfo BwInfo with updated information is included as entity body of the request
 * returns inline_response_200
 **/
exports.bw_allocationsPOST = function(bwInfo) {
  console.log("This is bw_allocationsPOST method!!!")
  return new Promise(function(resolve, reject) {
    MongoClient.connect("mongodb://localhost:27017/MEC", function(err, db) {
        if(err) { 
          return console.log(err); 
        }
        var myobj = bwInfo
       
        var sessionFilter_sourceIp = myobj.sessionFilter[0]["sourceIp"]
        var sessionFilter_sourcePort = myobj.sessionFilter[0]["sourcePort"]
        var sessionFilter_dstAddress = myobj.sessionFilter[0]["dstAddress"]
        var sessionFilter_dstPort = myobj.sessionFilter[0]["dstPort"]
        var sessionFilter_protocol = myobj.sessionFilter[0]["protocol"]

        
        var insertquery = {
          "bwInfo_Id" : "bwInfo_4",
          "reqstType" : myobj.requestType,
          "fixedBWPriority" : myobj.fixedBWPriority,
          "fixedAllocation" : myobj.fixedAllocation,
          "allocationDirection" : myobj.allocationDirection,
          "timeStamp_Id" : "timeStamp_3",
          "appIns_Id" : myobj.appInsId,
          "session_Id" : "session_3",
          "appInfo_Id" : "appInfo_3",
          "allocation_Id" : "alloc_3"
        }   

      db.collection('bwInfo').insertOne(insertquery, function(err, res) {
        if (err) {
          throw err;
        }
        else {
          db.collection('timeStamp').insertOne(
            {
              "timeStamp_Id" : "timeStamp_3", 
              "seconds": myobj.timeStamp["seconds"], 
              "nanoSeconds": myobj.timeStamp["nanoSeconds"], 
              "bwInfo_Id" : "bwInfo_4"
            } 
          );
          
          db.collection('sessionFilter').insertOne( 
            {
              "session_Id" : "session_3", 
              "sourceIP" : sessionFilter_sourceIp, 
              "destAddress" : sessionFilter_dstAddress, 
              "protocol" : sessionFilter_protocol,
              "appIns_Id" : myobj.appInsId,
            }
          );

          var port_Id = 0
          var mainLength;
          if(sessionFilter_sourcePort.length >= sessionFilter_dstPort.length){
            mainLength = sessionFilter_sourcePort.length
          }else{
            mainLength = sessionFilter_dstPort.length
          }
          var sourcePort, destPort;
          for(var i = 0; i < mainLength; i++){

            if(sessionFilter_dstPort[i]){
              destPort = sessionFilter_dstPort[i]
            } 
            else{
              destPort = ''
            }
            if(sessionFilter_sourcePort[i]){
              sourcePort = sessionFilter_sourcePort[i]
            } 
            else{
              sourcePort = ''
            }
            db.collection('ports').insertOne({
              "port_Id" : i+1,
              "srcPort" : sourcePort,
              "dstPort" : destPort,
              "session_Id" : insertquery["session_Id"]
            })  
          }

          if (insertquery["reqstType"] == "APPLICATION_SPECIFIC_BW_ALLOCATION" || insertquery["reqstType"] == "application_specific_bw_allocation"){
            
            var myquery = {"reqstType" : "APPLICATION_SPECIFIC_BW_ALLOCATION"}
            var newvalues = {$set: {"reqstType" : "0"} };

            db.collection("bwInfo").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
            });
          }
          
          else if(insertquery["reqstType"] == "SESSION_SPECIFIC_BW_ALLOCATION" || insertquery["reqstType"] == "session_specific_bw_allocation"){
            
            var myquery = {"reqstType" : "SESSION_SPECIFIC_BW_ALLOCATION"}
            var newvalues = {$set: {"reqstType" : "1"} };

            db.collection("bwInfo").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
            });
          }
          else{
            console.log("final else case --")
          }
          console.log("Refresh and check db!!!")
        }
      })    
    });
  })
};