/* tslint:disable:no-floating-promises */

import { SeatersApiContext } from '../../seaters-api';
import { PagedResult } from '../paged-result';
import { PagingOptions } from '../paging-options';
import { TranslationMap } from '../translation-map';

import {
  ProfilingCategory,
  ProfilingCategoryOrder,
  UserInterestCreateDTO,
  UserInterestUpdateDTO,
  ProfilingFanAttribute,
  UserFanAttribute,
  UserFanAttributeCreateDTO,
  UserFanAttributeUpdateDTO,
  Fan,
  FanGroup,
  WaitingList,
  FanGroupRequest,
  Position,
  Price,
  PaymentInfo,
  BraintreeToken,
  FanGroupLook,
  PositionSalesTransactionInput,
  PositionSalesTransaction,
  AttendeeInfo,
  FanGroupShare,
  WaitingListShare
} from './fan-types';

import { WaitingListRequest } from './waiting-list';
import { StringMap } from '../../api/string-map';
import { UserInterest } from './profiling';

export class FanApi {
  constructor(private apiContext: SeatersApiContext) {}

  fan(): Promise<Fan> {
    return this.apiContext.get('/fan');
  }

  updateFan(fan: Fan): Promise<Fan> {
    return this.apiContext.put('/fan', fan);
  }

  fanGroup(fanGroupId: string): Promise<FanGroup> {
    return this.apiContext.get('/fan/groups/:fanGroupId', { fanGroupId });
  }

  fanGroupBySlug(slug: string): Promise<FanGroup> {
    return this.apiContext.get('/fan/fangroups-by-slug/:slug', { slug });
  }

  fanGroupLookBySlug(slug: string): Promise<FanGroupLook> {
    return this.apiContext.get('/fan/fangroups-by-slug/:slug/look', { slug });
  }

  fanGroupTranslatedDescription(fanGroupId: string): Promise<string> {
    return this.apiContext.get('/fan/groups/:fanGroupId/translated-description', { fanGroupId });
  }

  fanGroups(fanGroupIds: string[]): Promise<FanGroup[]> {
    return this.apiContext.get(
      '/fan/groups',
      {},
      {
        groupIds: fanGroupIds
      }
    );
  }

  fanGroupLook(slug: string): Promise<FanGroupLook> {
    return this.apiContext.get('/fan/fangroups-by-slug/:slug/look', { slug });
  }

  joinFanGroup(fanGroupId: string): Promise<FanGroup> {
    return this.apiContext.post('/fan/groups/:fanGroupId', null, { fanGroupId });
  }

  joinProtectedFanGroup(fg: FanGroup, code: string): Promise<FanGroupRequest> {
    const data = {
      code
    };
    const endpointParams = { fanGroupId: fg.id };

    if (!fg.membership.request) {
      const endpoint1 = '/fan/groups/:fanGroupId/request-with-data';
      return this.apiContext.post(endpoint1, data, endpointParams);
    } else {
      const endpoint2 = '/fan/groups/:fanGroupId/request';
      return this.apiContext.put(endpoint2, data, endpointParams);
    }
  }

  leaveFanGroup(fanGroupId: string): Promise<void> {
    return this.apiContext.delete('/fan/groups/:fanGroupId', { fanGroupId });
  }

  shareFanGroup(fanGroupId: string): Promise<FanGroupShare> {
    return this.apiContext.get('/fan/groups/:fanGroupId/share', { fanGroupId });
  }

  waitingListsInFanGroup(fanGroupId: string, pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    const endpointParams = { fanGroupId };
    const queryParams = SeatersApiContext.buildPagingQueryParams(pagingOptions);
    return this.apiContext.get('/fan/groups/:fanGroupId/waiting-lists', endpointParams, queryParams);
  }

  waitingListsInFanGroups(fanGroupIds: string[], pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    const endpointParams = {};
    let queryParams = SeatersApiContext.buildPagingQueryParams(pagingOptions);
    queryParams = {
      ...queryParams,
      groupIds: fanGroupIds
    };
    return this.apiContext.get('/fan/groups/waiting-lists', endpointParams, queryParams);
  }

  joinedFanGroups(pagingOptions: PagingOptions): Promise<PagedResult<FanGroup>> {
    return this.apiContext.get('/fan/joined-groups', null, SeatersApiContext.buildPagingQueryParams(pagingOptions));
  }

  joinedWaitingListsWithoutSeat(pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    return this.apiContext.get(
      '/fan/joined-waiting-lists',
      null,
      SeatersApiContext.buildPagingQueryParams(pagingOptions)
    );
  }

  joinedWaitingListsWithSeat(pagingOptions: PagingOptions): Promise<PagedResult<WaitingList>> {
    return this.apiContext.get(
      '/fan/active-waiting-lists-with-seat',
      null,
      SeatersApiContext.buildPagingQueryParams(pagingOptions)
    );
  }

  waitingListTranslatedVenueDescription(waitingListId: string): Promise<string> {
    return this.apiContext.get('/fan/waiting-lists/:waitingListId/translated-venue-conditions', { waitingListId });
  }

  waitingList(waitingListId: string): Promise<WaitingList> {
    const endpoint = '/fan/waiting-lists/:waitingListId';
    const endpointParams = { waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  waitingLists(waitingListIds: string[]): Promise<WaitingList[]> {
    const endpoint = '/fan/waiting-lists';
    return this.apiContext.put(endpoint, {
      waitingListIds
    });
  }

  waitingListPrice(waitingListId: string, numberOfSeats: number): Promise<Price> {
    const endpoint = '/fan/waiting-lists/:waitingListId/price/:numberOfSeats';
    const endpointParams = {
      waitingListId,
      numberOfSeats
    };
    return this.apiContext.get(endpoint, endpointParams);
  }

  joinWaitingList(
    waitingListId: string,
    numberOfSeats: number,
    additionalQueryParams: StringMap
  ): Promise<WaitingList> {
    const endpoint = '/fan/waiting-lists/:waitingListId/position';
    const endpointParams = { waitingListId };
    const queryParams = additionalQueryParams;
    const data = { numberOfSeats };

    return this.apiContext.post(endpoint, data, endpointParams, queryParams);
  }

  joinProtectedWaitingList(
    wl: WaitingList,
    code: string,
    numberOfSeats: number,
    additionalQueryParams: StringMap
  ): Promise<WaitingListRequest> {
    const data = {
      code,
      numberOfSeats
    };

    const endpointParams = { waitingListId: wl.waitingListId };
    const endpoint = '/fan/waiting-lists/:waitingListId/request';
    const queryParams = additionalQueryParams;

    if (!wl.request) {
      return this.apiContext.post(endpoint, data, endpointParams, queryParams);
    } else {
      return this.apiContext.put(endpoint, data, endpointParams, queryParams);
    }
  }

  shareWaitingList(waitingListId: string): Promise<WaitingListShare> {
    return this.apiContext.get('/fan/waiting-lists/:waitingListId/share', { waitingListId });
  }

  leaveWaitingList(waitingListId: string): Promise<void> {
    const endpoint = '/fan/waiting-lists/:waitingListId/position';
    const endpointParams = { waitingListId };
    return this.apiContext.delete(endpoint, endpointParams);
  }

  acceptSeats(waitingListId: string): Promise<WaitingList> {
    const endpoint = '/fan/waiting-lists/:waitingListId/accept';
    const endpointParams = { waitingListId };
    return this.apiContext.post(endpoint, null, endpointParams);
  }

  rejectSeats(waitingListId: string): Promise<WaitingList> {
    const endpoint = '/fan/waiting-lists/:waitingListId/reject';
    const endpointParams = { waitingListId };
    return this.apiContext.post(endpoint, null, endpointParams);
  }

  exportSeats(waitingListId: string): Promise<void> {
    const endpoint = '/fan/waiting-lists/:waitingListId/export-seat';
    const endpointParams = { waitingListId };
    return this.apiContext.put(endpoint, null, endpointParams);
  }

  positionPaymentInfo(waitingListId: string): Promise<PaymentInfo> {
    const endpoint = '/fan/waiting-lists/:waitingListId/position/payment-info';
    const endpointParams = { waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  positionBraintreeToken(waitingListId: string): Promise<BraintreeToken> {
    const endpoint = '/fan/waiting-lists/:waitingListId/position/braintree-token';
    const endpointParams = { waitingListId };
    return this.apiContext.get(endpoint, endpointParams);
  }

  createPositionSalesTransaction(
    waitingListId: string,
    transaction: PositionSalesTransactionInput
  ): Promise<PositionSalesTransaction> {
    const endpoint = '/fan/waiting-lists/:waitingListId/transaction';
    const endpointParams = { waitingListId };
    return this.apiContext.post(endpoint, transaction, endpointParams);
  }

  deletePositionSalesTransaction(waitingListId: string): Promise<any> {
    const endpoint = '/fan/waiting-lists/:waitingListId/transaction';
    const endpointParams = { waitingListId };
    return this.apiContext.delete(endpoint, endpointParams);
  }

  updateAttendeesInfo(waitingListId: string, attendeesInfo: AttendeeInfo[]): Promise<Position> {
    const data = {
      attendees: attendeesInfo
    };
    const endpoint = '/v2/fan/waiting-lists/:waitingListId/position/attendees-info';
    const endpointParams = { waitingListId };
    return this.apiContext.put(endpoint, data, endpointParams);
  }

  getEventDescription(waitingListId: string): Promise<TranslationMap> {
    return this.apiContext.get('/fan/waiting-lists/:waitingListId/event-description', { waitingListId });
  }

  getVenueConditions(waitingListId: string): Promise<TranslationMap> {
    return this.apiContext.get('/fan/waiting-lists/:waitingListId/venue-conditions', { waitingListId });
  }

  getTranslatedEventDescription(waitingListId: string): Promise<string> {
    return this.apiContext.get('/fan/waiting-lists/:waitingListId/translated-event-description', { waitingListId });
  }

  getTranslatedVenueConditions(waitingListId: string): Promise<string> {
    return this.apiContext.get('/fan/waiting-lists/:waitingListId/translated-venue-conditions', { waitingListId });
  }

  // Profiling (public)

  getProfilingCategories(): Promise<ProfilingCategory[]> {
    return this.apiContext.get('/profiling/v1/categories', {}, {});
  }

  getProfilingCategoriesOrder(): Promise<ProfilingCategoryOrder[]> {
    return this.apiContext.get('/profiling/v1/categories/order', {}, {});
  }

  getProfilingCategoryById(categoryId): Promise<ProfilingCategory> {
    return this.apiContext.get(`/profiling/v1/category/${categoryId}`, {}, {});
  }

  getProfilingFanAttributes(query: string, validated: boolean): Promise<ProfilingFanAttribute[]> {
    return this.apiContext.get(
      '/profiling/v1/fan_attributes',
      {},
      {
        query,
        validated: validated ? 'true' : 'false'
      }
    );
  }

  getProfilingFanAttributeById(fanAttributeId: string): Promise<ProfilingFanAttribute> {
    return this.apiContext.get(`/profiling/v1/fan_attribute/${fanAttributeId}`, {}, {});
  }

  // User (fan)

  getUserInterests(): Promise<UserInterest[]> {
    return this.apiContext.get(`/profiling/v1/user/interests`, {}, {});
  }

  createUserInterest(userInterestCreateDTO: UserInterestCreateDTO): Promise<UserInterest> {
    return this.apiContext.post('/profiling/v1/user/interest', userInterestCreateDTO, {});
  }

  updateUserInterest(userInterestUpdateDTO: UserInterestUpdateDTO): Promise<UserInterest> {
    return this.apiContext.put('/profiling/v1/user/interest', userInterestUpdateDTO, {});
  }

  getUserFanAttributes(): Promise<UserFanAttribute[]> {
    return this.apiContext.get(`/profiling/v1/user/fan_attributes`, {}, {});
  }

  createUserFanAttribute(
    userFanAttributeCreateDTO: UserFanAttributeCreateDTO,
    relationsValidation: string
  ): Promise<UserFanAttribute> {
    return this.apiContext.post(
      `/profiling/v1/user/fan_attribute`,
      userFanAttributeCreateDTO,
      {},
      { relations_validation: relationsValidation ? 'true' : 'false' }
    );
  }

  updateUserFanAttribute(
    userFanAttributeId: string,
    userFanAttributeUpdateDTO: UserFanAttributeUpdateDTO
  ): Promise<UserFanAttribute> {
    return this.apiContext.post(
      `/profiling/v1/user/fan_attribute/${userFanAttributeId}`,
      userFanAttributeUpdateDTO,
      {}
    );
  }

  removeUserFanAttribute(userFanAttributeId: string): Promise<UserFanAttribute> {
    return this.apiContext.delete(`/profiling/v1/user/fan_attribute/${userFanAttributeId}`, {}, {});
  }
}

/* tslint:enable:no-floating-promises */
