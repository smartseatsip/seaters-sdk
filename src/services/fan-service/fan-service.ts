import { SeatersApi, PagedResult as ApiPagedResult } from '../../seaters-api';
import { WaitingListService } from './waiting-list-service';
import { FanGroupService } from './fan-group-service';
import { fan } from './fan-types';
import { LocalizableText } from '../util';

import { PagedResult, PagingOptions } from '../../shared-types';
import { SessionService } from '../session-service';
import { PublicService } from '../public-service';
import { Fan, PositionSalesTransactionInput, AttendeeInfo } from '../../seaters-api/fan/fan-types';
import { BraintreeToken } from '../../seaters-api/fan/braintree-token';
import { PhoneNumber } from '../../seaters-api/fan/fan';
import { StringMap } from '../../api/string-map';

export class FanService {
  public waitingListService: WaitingListService;
  public fanGroupService: FanGroupService;

  constructor(
    private seatersApi: SeatersApi,
    private sessionService: SessionService,
    private publicService: PublicService
  ) {
    this.waitingListService = new WaitingListService(seatersApi);
    this.fanGroupService = new FanGroupService(seatersApi);
  }

  /**
   *  FAN GROUPS
   */
  getFanGroups(fanGroupIds: string[]): Promise<fan.FanGroup[]> {
    return this.fanGroupService.getFanGroups(fanGroupIds);
  }

  getFanGroup(fanGroupId: string): Promise<fan.FanGroup> {
    return this.fanGroupService.getFanGroup(fanGroupId);
  }

  getFanGroupBySlug(slug: string): Promise<fan.FanGroup> {
    return this.fanGroupService.getFanGroupBySlug(slug);
  }

  getFanGroupLookBySlug(slug: string): Promise<fan.FanGroupLook> {
    return this.fanGroupService.getFanGroupLookBySlug(slug);
  }

  getFanGroupTranslatedDescription(fanGroupId: string): Promise<string> {
    return this.fanGroupService.getFanGroupTranslatedDescription(fanGroupId);
  }

  joinFanGroup(fanGroupId: string): Promise<fan.FanGroup> {
    return this.fanGroupService.joinFanGroup(fanGroupId);
  }

  joinProtectedFanGroup(fanGroupId: string, code: string): Promise<fan.FanGroup> {
    return this.fanGroupService.joinProtectedFanGroup(fanGroupId, code);
  }

  requestToJoinPrivateFanGroup(fanGroupId: string): Promise<fan.FanGroup> {
    return this.fanGroupService.requestToJoinPrivateFanGroup(fanGroupId);
  }

  leaveFanGroup(fanGroupId: string): Promise<fan.FanGroup> {
    return this.fanGroupService.leaveFanGroup(fanGroupId);
  }

  shareFanGroup(fanGroupId: string): Promise<fan.FanGroupShare> {
    return this.fanGroupService.shareFanGroup(fanGroupId);
  }

  getJoinedFanGroups(pagingOptions: PagingOptions): Promise<PagedResult<fan.FanGroup>> {
    return this.fanGroupService.joinedFanGroups(pagingOptions).then(r => this.convertPagedResult(r));
  }

  /**
   *  WAITING LISTS
   */
  getWaitingList(waitingListId: string): Promise<fan.WaitingList> {
    return this.waitingListService.getWaitingList(waitingListId);
  }

  getWaitingLists(waitingListIds: string[]): Promise<fan.WaitingList[]> {
    return this.waitingListService.getWaitingLists(waitingListIds);
  }

  getWaitingListsInFanGroup(fanGroupId: string, pagingOptions: PagingOptions): Promise<PagedResult<fan.WaitingList>> {
    return this.waitingListService
      .getWaitingListsInFanGroup(fanGroupId, pagingOptions)
      .then(r => this.convertPagedResult(r));
  }

  getWaitingListsInFanGroups(
    fanGroupIds: string[],
    pagingOptions: PagingOptions
  ): Promise<PagedResult<fan.WaitingList>> {
    return this.waitingListService
      .getWaitingListsInFanGroups(fanGroupIds, pagingOptions)
      .then(r => this.convertPagedResult(r));
  }

  getMyWaitingListsWithoutSeat(page: PagingOptions): Promise<PagedResult<fan.WaitingList>> {
    return this.waitingListService.getMyWaitingListsWithoutSeat(page).then(r => this.convertPagedResult(r));
  }

  getMyWaitingListsWithSeat(page: PagingOptions): Promise<PagedResult<fan.WaitingList>> {
    return this.waitingListService.getMyWaitingListsWithSeat(page).then(r => this.convertPagedResult(r));
  }

  //TODO: cleanup duplicate method (see getTranslatedVenueConditionsForWaitingList)
  getWaitingListTranslatedVenueDescription(waitingListId: string): Promise<string> {
    return this.waitingListService.getWaitingListTranslatedVenueDescription(waitingListId);
  }

  getPositionBraintreePaymentInfo(waitingListId: string): Promise<fan.BraintreePaymentInfo> {
    return this.waitingListService.getPositionBraintreePaymentInfo(waitingListId);
  }

  joinWaitingList(
    waitingListId: string,
    numberOfSeats: number,
    additionalQueryParams?: StringMap
  ): Promise<fan.WaitingList> {
    return this.waitingListService.joinWaitingList(waitingListId, numberOfSeats, { ...additionalQueryParams });
  }

  joinProtectedWaitingList(
    waitingListId: string,
    code: string,
    numberOfSeats: number,
    additionalQueryParams?: StringMap
  ): Promise<fan.WaitingList> {
    return this.waitingListService.joinProtectedWaitingList(waitingListId, code, numberOfSeats, {
      ...additionalQueryParams
    });
  }

  shareWaitingList(waitingListId: string): Promise<fan.WaitingListShare> {
    return this.waitingListService.shareWaitingList(waitingListId);
  }

  leaveWaitingList(waitingListId: string): Promise<fan.WaitingList> {
    return this.waitingListService.leaveWaitingList(waitingListId);
  }

  getPositionPaymentInfo(waitingListId: string): Promise<fan.PaymentInfo> {
    return this.waitingListService.getPositionPaymentInfo(waitingListId);
  }

  payPosition(waitingListId: string, transaction: PositionSalesTransactionInput): Promise<fan.WaitingList> {
    return this.waitingListService.payPosition(waitingListId, transaction);
  }

  preauthorizePosition(waitingListId: string, transaction: PositionSalesTransactionInput): Promise<fan.WaitingList> {
    return this.waitingListService.preauthorizePosition(waitingListId, transaction);
  }

  saveAttendeesInfo(waitingListId: string, attendeesInfo: AttendeeInfo[]): Promise<fan.WaitingList> {
    return this.waitingListService.saveAttendeesInfo(waitingListId, attendeesInfo);
  }

  acceptSeats(waitingListId: string): Promise<fan.WaitingList> {
    return this.waitingListService.acceptSeats(waitingListId);
  }

  rejectSeats(waitingListId: string): Promise<fan.WaitingList> {
    return this.waitingListService.rejectSeats(waitingListId);
  }

  exportSeats(waitingListId: string): Promise<fan.WaitingList> {
    return this.waitingListService.exportSeats(waitingListId);
  }

  getEventDescriptionForWaitingList(waitingListId: string): Promise<LocalizableText> {
    return this.waitingListService
      .getEventDescriptionForWaitingList(waitingListId)
      .then(translationMap => new LocalizableText(translationMap));
  }

  getTranslatedEventDescriptionForWaitingList(waitingListId: string): Promise<string> {
    return this.waitingListService.getTranslatedEventDescriptionForWaitingList(waitingListId);
  }

  getVenueConditionsForWaitingList(waitingListId: string): Promise<LocalizableText> {
    return this.waitingListService
      .getVenueConditionsForWaitingList(waitingListId)
      .then(translationMap => new LocalizableText(translationMap));
  }

  getTranslatedVenueConditionsForWaitingList(waitingListId: string): Promise<string> {
    return this.waitingListService.getTranslatedVenueConditionsForWaitingList(waitingListId);
  }

  positionBraintreeToken(waitingListId: string): Promise<BraintreeToken> {
    return this.waitingListService.positionBraintreeToken(waitingListId);
  }

  getWaitingListPrice(waitingListId: string, numberOfSeats: number): Promise<fan.Price> {
    return this.waitingListService.getWaitingListPrice(waitingListId, numberOfSeats);
  }

  /**
   * FANS
   */

  /**
   * Send a new SMS containing the code needed to validate email / phone.
   * @param phone
   * @returns {any}
   */
  sendValidationCodeViaSMS(phone: PhoneNumber): Promise<Fan> {
    return this.seatersApi.apiContext.put('/fan/mobile-phone-number', phone);
  }

  /**
   *  COMBINATIONS
   */
  updateFan(f: Fan): Promise<Fan> {
    return this.seatersApi.fan.updateFan(f).then(updatedFan => this.sessionService.updateCurrentFan(updatedFan));
  }

  getWaitingListsByKeywords(keywords: string[], page: PagingOptions): Promise<PagedResult<fan.WaitingList>> {
    return this.publicService.getWaitingListsByKeywords(keywords, page).then(pagedPublicWls => {
      const waitingListIds = pagedPublicWls.items.map(wl => wl.waitingListId);
      return this.getWaitingLists(waitingListIds).then(wls => {
        return {
          items: wls,
          itemOffset: pagedPublicWls.itemOffset,
          maxPageSize: pagedPublicWls.maxPageSize,
          page: pagedPublicWls.page,
          totalSize: pagedPublicWls.totalSize
        } as PagedResult<fan.WaitingList>;
      });
    });
  }

  /**
   *  HELPERS
   */

  private convertPagedResult<T>(result: ApiPagedResult<T>): PagedResult<T> {
    return {
      items: result.items,
      itemOffset: result.itemOffset,
      maxPageSize: result.maxPageSize,
      page: Math.round(result.itemOffset / result.maxPageSize),
      totalSize: result.totalSize
    };
  }
}
