'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');


module.exports.bw_allocationsAllocationIdDELETE = function bw_allocationsAllocationIdDELETE (req, res, next) {
  var allocationId = req.swagger.params['allocationId'].value;
  Default.bw_allocationsAllocationIdDELETE(allocationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.bw_allocationsAllocationIdGET = function bw_allocationsAllocationIdGET (req, res, next) {
  var allocationId = req.swagger.params['allocationId'].value;
  Default.bw_allocationsAllocationIdGET(allocationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.bw_allocationsAllocationIdPATCH = function bw_allocationsAllocationIdPATCH (req, res, next) {
  var allocationId = req.swagger.params['allocationId'].value;
  var bwInfoDeltas = req.swagger.params['bwInfoDeltas'].value;
  Default.bw_allocationsAllocationIdPATCH(allocationId,bwInfoDeltas)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.bw_allocationsAllocationIdPUT = function bw_allocationsAllocationIdPUT (req, res, next) {
  var allocationId = req.swagger.params['allocationId'].value;
  var bwInfo = req.swagger.params['bwInfo'].value;
  Default.bw_allocationsAllocationIdPUT(allocationId,bwInfo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.bw_allocationsGET = function bw_allocationsGET (req, res, next) {
  var app_instance_id = req.swagger.params['app_instance_id'].value;
  var app_name = req.swagger.params['app_name'].value;
  var session_id = req.swagger.params['session_id'].value;
  Default.bw_allocationsGET(app_instance_id,app_name,session_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.bw_allocationsPOST = function bw_allocationsPOST (req, res, next) {
  var bwInfo = req.swagger.params['bwInfo'].value;
  Default.bw_allocationsPOST(bwInfo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
