/**
 * Join a FanGroup, then join a WaitingList of this FanGroup.
 * Then leave the WaitingList and finally leave the FanGroup.
 * 
 * minimum SDK version: 1.4.1
 */

var shared = require('../shared');

var sdk = shared.sdk;
var fgId = shared.fgId;
var wlId = shared.wlId;

shared.fanClient().then(client => {

    return client.fanService.getWaitingListsInFanGroup(fgId, { page: 0, maxPageSize: 10})
    .then(wls => {
        console.log('WaitingLists in FanGroup', wls);
    });

})
.then(shared.exitOK, shared.exitFail);