import { Promise } from 'es6-promise';
import { Object as coreObject } from 'core-js/library';

import { SeatersApi } from '../../seaters-api';
import { FanGroup } from '../../seaters-api/fan';
import { retryUntil } from './../util';
import { fan } from './fan-types';

var FAN_GROUP_ACTION_STATUS = fan.FAN_GROUP_ACTION_STATUS;

export class FanGroupService {

    constructor (
        private api: SeatersApi
    ) {

    }

    private getFanGroup (fanGroupId: string): Promise<FanGroup> {
        return this.api.fan.fanGroup(fanGroupId);
    }

    private getFanGroupActionStatus (fanGroup: FanGroup): fan.FAN_GROUP_ACTION_STATUS {
        var membership = fanGroup.membership;

        if (membership.member) {
            return FAN_GROUP_ACTION_STATUS.CAN_LEAVE;
        } else if (
            fanGroup.accessMode === 'PUBLIC' ||
            (membership.request && membership.request.status === 'ACCEPTED')
        ) {
            return FAN_GROUP_ACTION_STATUS.CAN_JOIN;
        } else if (
            membership.request &&
            membership.request.status === 'PENDING'
        ) {
            return FAN_GROUP_ACTION_STATUS.WAITING_FOR_APPROVAL;
        } else if (
            fanGroup.accessMode === 'CODE_PROTECTED' ||
            fanGroup.accessMode === 'PRIVATE'
        ) {
            return FAN_GROUP_ACTION_STATUS.CAN_UNLOCK;
        }
        // state that was not implemented
        console.error('GroupService - unhandled group status', JSON.stringify(fanGroup));
    }

    getExtendedFanGroup (fanGroupId: string): Promise<fan.FanGroup> {
        return this.getFanGroup(fanGroupId)
        .then(fg => coreObject.assign(fg, {
            actionStatus: this.getFanGroupActionStatus(fg)
        }));
    }

    joinFanGroup (fanGroupId: string): Promise<fan.FanGroup> {
        return this.api.fan.joinFanGroup(fanGroupId)
        .then(() => {
            return retryUntil(
                () => this.getExtendedFanGroup(fanGroupId),
                (fg) => fg.actionStatus === FAN_GROUP_ACTION_STATUS.CAN_LEAVE,
                10,
                1000
            );
        });
    }


    checkUnlockStatus(fg) {
      if(!fg.membership.request) {
        console.error('[FanGroupService] checkUnlockStatus - no request made');
        throw 'strs.api.servererror';
      }
      else if(fg.membership.request.status === 'PENDING') {
        return false;
      }
      else if(fg.membership.request.status === 'ACCEPTED') {
        return true;
      }
      else if(fg.membership.request.status === 'REJECTED') {
        console.warn('[FanGroupService] checkUnlockStatus - code rejected');
        throw 'strs.api.fg.invalidcode'
      }
      else {
        console.error('[FanGroupService] checkUnlockStatus - unknown status');
        throw 'strs.api.servererror';
      }
    }


    joinProtectedFanGroup (fanGroupId: string, code: string): Promise<fan.FanGroup> {

      return this.getExtendedFanGroup(fanGroupId)
        .then(fg => this.api.fan.joinProtectedFanGroup(fg, code))
        // wait for request to be ACCEPTED
        .then(() => this.pollFanGroup(fanGroupId, (fg) => this.checkUnlockStatus(fg)))
        // wait for action status CAN_LEAVE
        .then(() => this.pollFanGroup(fanGroupId, (fg) => fg.actionStatus === FAN_GROUP_ACTION_STATUS.CAN_LEAVE));

    }

    leaveFanGroup (fanGroupId: string): Promise<fan.FanGroup> {
        return this.api.fan.leaveFanGroup(fanGroupId)
        .then(() => this.pollFanGroup(fanGroupId, (fg) => fg.actionStatus === FAN_GROUP_ACTION_STATUS.CAN_JOIN));
    }

    private pollFanGroup (fanGroupId: string, condition: (fg: fan.FanGroup) => boolean): Promise<fan.FanGroup> {
        return retryUntil<fan.FanGroup> (
            () => this.getExtendedFanGroup(fanGroupId),
            condition,
            10,
            1000
        );
    }



}