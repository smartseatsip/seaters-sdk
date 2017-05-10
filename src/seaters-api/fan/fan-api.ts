/* tslint:disable:no-floating-promises */

import { SeatersApiContext } from '../../seaters-api';
import { PagedResult } from '../paged-result';
import { PagingOptions } from '../paging-options';
import { TranslationMap } from '../translation-map';
import {
  Fan, FanGroup, WaitingList, FanGroupRequest, Position,
  Price, PaymentInfo, BraintreeToken, FanGroupLook,
  PositionSalesTransactionInput, PositionSalesTransaction,
  AttendeesInfo
} from './fan-types';

export class FanApi {

  constructor (private apiContext: SeatersApiContext) {

  }

  fan (): Promise<Fan> {
    return this.apiContext.get('/fan');
  }

  updateFan (fan: Fan): Promise<Fan> {
    return this.apiContext.put('/fan', fan);
  }

  fanGroup (fanGroupId: string): Promise<FanGroup> {
    return this.apiContext.get(
      '/fan/groups/:fanGroupId',
      { fanGroupId: fanGroupId }
    );
  }

  fanGroups (groupIds: string[]): Promise<FanGroup[]> {
    return this.apiContext.get('/fan/groups', {}, SeatersApiContext.convertArrayToQueryParams('groupIds', groupIds));
  }

  fanGroupLook (slug: string): Promise<FanGroupLook> {
    return this.apiContext.get(
      '/fan/fangroups-by-slug/:slug/look',
      { slug: slug }
    );
  }

  joinFanGroup (fanGroupId: string): Promise<FanGroup> {
    return this.apiContext.post(
      '/fan/groups/:fanGroupId',
      null,
      { fanGroupId: fanGroupId }
    );
  }

  joinProtectedFanGroup (fg: FanGroup, code: string): Promise<FanGroupRequest> {
    let data = {
      code: code
    };
    let endpointParams = { fanGroupId: fg.id };

    if (!fg.membership.request) {
      let endpoint1 = '/fan/groups/:fanGroupId/request-with-data';
      return this.apiContext.post(endpoint1, data, endpointParams);
    } else {
      let endpoint2 = '/fan/groups/:fanGroupId/request';
      return this.apiContext.put(endpoint2, data, endpointParams);
    }
  }

  leaveFanGroup (fanGroupId: string): Promise<void> {
    return this.apiContext.delete(
      '/fan/groups/:fanGroupId',
      { fanGroupId: fanGroupId }
    )
      .then(() => undefined);
  }

  waitingListsInFanGroup (fanGroupId: string, pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    let endpointParams = { fanGroupId: fanGroupId };
    let queryParams = SeatersApiContext.buildPagingQueryParams(pagingOptions);
    return this.apiContext.get(
      '/fan/groups/:fanGroupId/waiting-lists',
      endpointParams,
      queryParams
    );
  }

  joinedFanGroups (pagingOptions: PagingOptions): Promise<PagedResult<FanGroup>> {
    return this.apiContext.get(
      '/fan/joined-groups',
      null,
      SeatersApiContext.buildPagingQueryParams(pagingOptions)
    );
  }

  joinedWaitingListsWithoutSeat (pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    return this.apiContext.get(
      '/fan/joined-waiting-lists',
      null,
      SeatersApiContext.buildPagingQueryParams(pagingOptions)
    );
  }

  joinedWaitingListsWithSeat (pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    return this.apiContext.get(
      '/fan/active-waiting-lists-with-seat',
      null,
      SeatersApiContext.buildPagingQueryParams(pagingOptions)
    );
  }

  waitingList (waitingListId: string): Promise<WaitingList> {
    let endpoint = '/fan/waiting-lists/:waitingListId';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  waitingLists (waitingListIds: string[]): Promise<WaitingList[]> {
    let endpoint = '/fan/waiting-lists';
    return this.apiContext.put(endpoint, {
      waitingListIds: waitingListIds
    });
  }

  waitingListPrice (waitingListId: string, numberOfSeats: number): Promise<Price> {
    let endpoint = '/fan/waiting-lists/:waitingListId/price/:numberOfSeats';
    let endpointParams = {
      waitingListId: waitingListId,
      numberOfSeats: numberOfSeats
    };
    return this.apiContext.get(endpoint, endpointParams);
  }

  joinWaitingList (waitingListId: string, numberOfSeats: number): Promise<WaitingList> {
    let endpoint = '/fan/waiting-lists/:waitingListId/position';
    let endpointParams = { waitingListId: waitingListId };
    let data = { numberOfSeats: numberOfSeats };
    return this.apiContext.post(endpoint, data, endpointParams);
  }

  leaveWaitingList (waitingListId: string): Promise<void> {
    let endpoint = '/fan/waiting-lists/:waitingListId/position';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.delete(endpoint, endpointParams)
      .then(() => undefined);
  }

  acceptSeats (waitingListId: string): Promise<WaitingList> {
    let endpoint = '/fan/waiting-lists/:waitingListId/accept';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.post(endpoint, null, endpointParams);
  }

  rejectSeats (waitingListId: string): Promise<WaitingList> {
    let endpoint = '/fan/waiting-lists/:waitingListId/reject';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.post(endpoint, null, endpointParams);
  }

  exportSeats (waitingListId: string): Promise<void> {
    let endpoint = '/fan/waiting-lists/:waitingListId/export-seat';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.put(endpoint, null, endpointParams);
  }

  positionPaymentInfo (waitingListId: string): Promise<PaymentInfo> {
    let endpoint = '/fan/waiting-lists/:waitingListId/position/payment-info';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  positionBraintreeToken (waitingListId: string): Promise<BraintreeToken> {
    let endpoint = '/fan/waiting-lists/:waitingListId/position/braintree-token';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  getPositionSalesTransaction (waitingListId: string): Promise<PositionSalesTransaction> {
    let endpoint = '/fan/waiting-lists/:waitingListId/transaction';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  createPositionSalesTransaction (
    waitingListId: string,
    transaction: PositionSalesTransactionInput
  ): Promise<PositionSalesTransaction> {
    let endpoint = '/fan/waiting-lists/:waitingListId/transaction';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.post(endpoint, transaction, endpointParams);
  }

  deletePositionSalesTransaction (waitingListId: string): Promise<any> {
    let endpoint = '/fan/waiting-lists/:waitingListId/transaction';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.delete(endpoint, endpointParams);
  }

  updateAttendeesInfo (waitingListId: string, attendeesInfo: AttendeesInfo): Promise<Position> {
    let endpoint = '/v2/fan/waiting-lists/:waitingListId/position/attendees-info';
    let endpointParams = { waitingListId: waitingListId };
    return this.apiContext.put(endpoint, attendeesInfo, endpointParams);
  }

  getEventDescription (waitingListId: string): Promise<TranslationMap> {
    return this.apiContext.get(
      '/fan/waiting-lists/:waitingListId/event-description',
      { waitingListId: waitingListId }
    );
  }

  getVenueConditions (waitingListId: string): Promise<TranslationMap> {
    return this.apiContext.get(
      '/fan/waiting-lists/:waitingListId/venue-conditions',
      { waitingListId: waitingListId }
    );
  }

}

/* tslint:enable:no-floating-promises */
