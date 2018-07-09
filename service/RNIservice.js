var RNIservice = function (app) {
    this.app = app;
};

module.exports = RNIservice;

RNIservice.prototype.rab_infoGET = function (req,callback) {

    console.log("RNI Method1");
    callback(null,"DONE rab_infoGET");
};

RNIservice.prototype.plmn_infoGET = function (req,callback) {

    console.log("RNI Method2");
    callback(null,"DONE plmn_infoGET");
};

RNIservice.prototype.s1_bearer_infoGET = function (req,callback) {

    console.log("RNI Method3");
    callback(null,"DONE s1_bearer_infoGET");
};

RNIservice.prototype.SubscriptionLinkList_subscriptionsGET = function (req,callback) {

    console.log("RNI Method4");
    callback(null,"DONE SubscriptionLinkList_subscriptionsGET");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_cc_GET = function (req,callback) {

    console.log("RNI Method5");
    callback(null,"DONE SubscriptionLinkList_subscriptions_cc_GET");
};

RNIservice.prototype.CellChange_subscriptionsPOST = function (req,callback) {

    console.log("RNI Method6");
    callback(null,"DONE CellChange_subscriptionsPOST");
};

RNIservice.prototype.CellChange_subscriptionsGET = function (req,callback) {

    console.log("RNI Method7");
    callback(null,"DONE CellChange_subscriptionsGET");
};

RNIservice.prototype.CellChange_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method8");
    callback(null,"DONE CellChange_subscriptionsPUT");
};

RNIservice.prototype.CellChange_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method9");
    callback(null,"DONE CellChange_subscriptionsSubscrIdDELETE");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_s1_GET = function (req,callback) {

    console.log("RNI Method10");
    callback(null,"DONE SubscriptionLinkList_subscriptions_s1_GET");
};

RNIservice.prototype.S1BearerSubscription_subscriptionsPOST = function (req,callback) {

    console.log("RNI Method11");
    callback(null,"DONE S1BearerSubscription_subscriptionsPOST");
};

RNIservice.prototype.S1BearerSubscription_subscriptionsGET = function (req,callback) {

    console.log("RNI Method12");
    callback(null,"DONE S1BearerSubscription_subscriptionsGET");
};

RNIservice.prototype.S1BearerSubscription_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method13");
    callback(null,"DONE S1BearerSubscription_subscriptionsPUT");
};

RNIservice.prototype.S1Bearer_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method14");
    callback(null,"DONE S1Bearer_subscriptionsSubscrIdDELETE");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_ta_GET = function (req,callback) {

    console.log("RNI Method15");
    callback(null,"DONE SubscriptionLinkList_subscriptions_ta_GET");
};

RNIservice.prototype.MeasTa_subscriptionsPOST = function (req,callback) {

    console.log("RNI Method16");
    callback(null,"DONE MeasTa_subscriptionsPOST");
};

RNIservice.prototype.MeasTa_subscriptionsGET = function (req,callback) {

    console.log("RNI Method17");
    callback(null,"DONE MeasTa_subscriptionsGET");
};

RNIservice.prototype.MeasTa_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method18");
    callback(null,"DONE MeasTa_subscriptionsPUT");
};

RNIservice.prototype.MeasTa_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method19");
    callback(null,"DONE MeasTa_subscriptionsSubscrIdDELETE");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_mr_GET = function (req,callback) {

    console.log("RNI Method20");
    callback(null,"DONE SubscriptionLinkList_subscriptions_mr_GET");
};

RNIservice.prototype.MeasRepUe_subscriptionsPOST = function (req,callback) {

    console.log("RNI Method21");
    callback(null,"DONE MeasRepUe_subscriptionsPOST");
};

RNIservice.prototype.MeasRepUe_subscriptionsGET = function (req,callback) {

    console.log("RNI Method22");
    callback(null,"DONE MeasRepUe_subscriptionsGET");
};

RNIservice.prototype.MeasRepUeReport_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method23");
    callback(null,"DONE MeasRepUeReport_subscriptionsPUT");
};

RNIservice.prototype.MeasRepUe_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method24");
    callback(null,"DONE MeasRepUe_subscriptionsSubscrIdDELETE");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_re_GET = function (req,callback) {

    console.log("RNI Method25");
    callback(null,"DONE SubscriptionLinkList_subscriptions_re_GET");
};

RNIservice.prototype.RabEstSubscription_subscriptionsPOST= function (req,callback) {

    console.log("RNI Method26");
    callback(null,"DONE RabEstSubscription_subscriptionsPOST");
};


RNIservice.prototype.RabEstSubscription_subscriptionsGET = function (req,callback) {

    console.log("RNI Method27");
    callback(null,"DONE RabEstSubscription_subscriptionsGET");
};


RNIservice.prototype.RabEstSubscription_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method28");
    callback(null,"DONE RabEstSubscription_subscriptionsPUT");
};

RNIservice.prototype.RabEst_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method29");
    callback(null,"DONE RabEst_subscriptionsSubscrIdDELETE");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_rm_GET = function (req,callback) {

    console.log("RNI Method30");
    callback(null,"DONE SubscriptionLinkList_subscriptions_rm_GET");
};

RNIservice.prototype.RabModSubscription_subscriptionsPOST = function (req,callback) {

    console.log("RNI Method31");
    callback(null,"DONE RabModSubscription_subscriptionsPOST");
};

RNIservice.prototype.RabModSubscription_subscriptionsGET = function (req,callback) {

    console.log("RNI Method32");
    callback(null,"DONE RabModSubscription_subscriptionsGET");
};

RNIservice.prototype.RabModSubscription_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method33");
    callback(null,"DONE RabModSubscription_subscriptionsPUT");
};

RNIservice.prototype.RabMod_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method34");
    callback(null,"DONE RabMod_subscriptionsSubscrIdDELETE");
};

RNIservice.prototype.SubscriptionLinkList_subscriptions_rr_GET = function (req,callback) {

    console.log("RNI Method35");
    callback(null,"DONE SubscriptionLinkList_subscriptions_rr_GET");/////////////////////////////////////////
};

RNIservice.prototype.RabRelSubscription_subscriptionsPOST= function (req,callback) {

    console.log("RNI Method36");
    callback(null,"DONE RabRelSubscription_subscriptionsPOST");
};

RNIservice.prototype.RabRelSubscription_subscriptionsGET = function (req,callback) {

    console.log("RNI Method37");
    callback(null,"DONE RabRelSubscription_subscriptionsGET");
};

RNIservice.prototype.RabRelSubscription_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method38");
    callback(null,"DONE RabRelSubscription_subscriptionsPUT");
};

RNIservice.prototype.RabRel_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method39");
    callback(null,"DONE RabRel_subscriptionsSubscrIdDELETE");
};


RNIservice.prototype.SubscriptionLinkList_subscriptions_cr_GET = function (req,callback) {

    console.log("RNI Method40");
    callback(null,"DONE SubscriptionLinkList_subscriptions_cr_GET");
};


RNIservice.prototype.CaReConfSubscription_subscriptionsPOST = function (req,callback) {

    console.log("RNI Method41");
    callback(null,"DONE CaReConfSubscription_subscriptionsPOST");
};

RNIservice.prototype.CaReConfSubscription_subscriptionsGET = function (req,callback) {

    console.log("RNI Method42");
    callback(null,"DONE CaReConfSubscription_subscriptionsGET");
};

RNIservice.prototype.CaReConfSubscription_subscriptionsPUT = function (req,callback) {

    console.log("RNI Method43");
    callback(null,"DONE CaReConfSubscription_subscriptionsPUT");
};

RNIservice.prototype.CaReConf_subscriptionsSubscrIdDELETE = function (req,callback) {

    console.log("RNI Method44");
    callback(null,"DONE CaReConf_subscriptionsSubscrIdDELETE");
};






