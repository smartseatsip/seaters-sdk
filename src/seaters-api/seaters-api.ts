import { RequestDriver } from '../api';
import { AppApi } from './app/app-api';
import { FanApi } from './fan/fan-api';
import { ProfilingApi } from './profiling/profiling-api';
import { AdminApi } from './admin';
import { HealthApi } from './health';
import { AuthenticationApi } from './authentication/authentication-api';

import { SeatersApiException } from './seaters-api-exception';
import { SeatersApiContext } from './seaters-api-context';

export class SeatersApi {

  public apiContext: SeatersApiContext;

  public app: AppApi;
  public fan: FanApi;
  public profiling: ProfilingApi;
  public authentication: AuthenticationApi;
  public admin: AdminApi;
  public health: HealthApi;

  constructor (prefix: string, requestDriver: RequestDriver) {
    this.apiContext = new SeatersApiContext(prefix, requestDriver);

    this.app = new AppApi(this.apiContext);
    this.fan = new FanApi(this.apiContext);
    this.profiling = new ProfilingApi(this.apiContext);
    this.admin = new AdminApi(this.apiContext);
    this.health = new HealthApi(this.apiContext);
    this.authentication = new AuthenticationApi(this.apiContext);
  }

}
