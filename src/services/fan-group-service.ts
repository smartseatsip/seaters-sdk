import { SeatersApi } from '../seaters-api';
import { Promise } from 'es6-promise';
import { FanGroup } from '../seaters-api/fan/fan-group';

export enum FAN_GROUP_ACTION_STATUS {
    CAN_JOIN, CAN_LEAVE, CAN_UNLOCK, CAN_REQUEST, WAITING_FOR_APPROVAL
}

export interface ExtendedFanGroup extends FanGroup {
    /**
     * FanGroup Fan's action status
     */
    actionStatus: FAN_GROUP_ACTION_STATUS,
}

export class FanGroupService {

    constructor (
        private api: SeatersApi
    ) { 

    }

    getFanGroup (fanGroupId: string): Promise<FanGroup> {
        return this.api.fan.fanGroup(fanGroupId);
    }

    getFanGroupStatus (fanGroup: FanGroup): FAN_GROUP_ACTION_STATUS {
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

    getExtendedFanGroup (fanGroupId: string): Promise<ExtendedFanGroup> {
        return this.getFanGroup(fanGroupId)
        .then(fg => core.Object.assign(fg, {
            actionStatus: this.getFanGroupStatus(fg)
        }));
    }
    
}