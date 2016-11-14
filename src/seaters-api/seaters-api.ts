import * as api from '../api';
import { AppApi } from './app/app-api';
import { FanApi } from './fan/fan-api';
import { AuthenticationApi } from './authentication/authentication-api';

export class SeatersApi extends api.ApiContext {

    public app: AppApi;
    public fan: FanApi;

    public authentication: AuthenticationApi;

    constructor (private prefix: string) {
        super(prefix);
        this.app = new AppApi(this);
        this.fan = new FanApi(this);
        this.authentication = new AuthenticationApi(this);
    }

}
