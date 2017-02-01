import { Promise } from 'es6-promise';
import { Object } from 'core-js/library';

import { RequestDriver, REQUEST_DRIVER_TYPE, getRequestDriver } from './api';
import { SeatersApi } from './seaters-api';
import { SessionService } from './services/session-service';
import { WaitingListService } from './services/waiting-list/waiting-list-service';
import { FanGroupService } from './services/fan-group/fan-group-service';
import { AppService } from './services/app-service';
import { AlgoliaForSeatersService } from './services/algolia-for-seaters/algolia-for-seaters-service';

export interface SeatersClientOptions {
  apiPrefix: string,
  requestDriver?: REQUEST_DRIVER_TYPE
}

export class SeatersClient {

  private static DEFAULT_OPTIONS = <SeatersClientOptions> {
    apiPrefix: '${api.location}',
    requestDriver: 'BROWSER'
  }

  public api: SeatersApi;

  public sessionService : SessionService;

  public waitingListService: WaitingListService;

  public fanGroupService: FanGroupService;

  public appService: AppService;

  public algoliaForSeatersService: AlgoliaForSeatersService;

  constructor (options?: SeatersClientOptions) {
    options = Object.assign({}, SeatersClient.DEFAULT_OPTIONS, options);

    var requestDriver = getRequestDriver(options.requestDriver);
    
    this.api = new SeatersApi(options.apiPrefix, requestDriver);
    
    this.sessionService = new SessionService(this.api);
    this.waitingListService = new WaitingListService(this.api);
    this.fanGroupService = new FanGroupService(this.api);
    this.appService = new AppService(this.api);
    this.algoliaForSeatersService = new AlgoliaForSeatersService(this.appService, requestDriver);
  }

}

export var getSeatersClient = (() => {
  var client: SeatersClient = undefined;
  return (options?: SeatersClientOptions) => {
    if(client === undefined) {
      client = new SeatersClient(options);
    }
    return client;
  };
})();
