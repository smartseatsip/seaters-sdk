import { normalizeLondonTimezoneDate, uuidv4 } from '../util';
import { SeatersApi } from '../../seaters-api';
import { session } from './session-types';
import { AuthenticationSuccess, MobilePhoneValidationData } from '../../seaters-api/authentication';
import { IUpdatePasswordDTO } from '../../seaters-api/fan/fan';

const AUTH_HEADER = 'Authorization';
const AUTH_BEARER = 'SeatersBearer';
const MS_TO_EXTEND_BEFORE_SESSION_EXPIRES = 60;

export enum SESSION_STRATEGY {
  EXPIRE,
  EXTEND
}

export class SessionService {
  private currentFan: session.Fan;

  private sessionStrategy: SESSION_STRATEGY;
  private sessionToken: string = '';

  constructor(private seatersApi: SeatersApi, sessionStrategy?: SESSION_STRATEGY) {
    this.sessionStrategy = sessionStrategy || SESSION_STRATEGY.EXTEND;
  }

  /**
   * Configure the given session to be used. This method is intended for transitional
   * phase where the SDK is not the one doing the login process (Seaters FanWebApp)
   *
   * @param session a valid session that is not expired
   * @param fan a valid fan object
   */
  configureSession(s: session.SessionToken, fan: session.Fan) {
    this.setSession(s);
    this.currentFan = fan;
  }

  /**
   * Manually configure the fan (in case the current fan was changed / retrieved externally)
   *
   * @param fan latest fan object
   */
  updateCurrentFan(fan: session.Fan): Promise<session.Fan> {
    this.currentFan = fan;
    return Promise.resolve<session.Fan>(this.currentFan);
  }

  /**
   * Update password
   *
   * @param fan latest fan object
   */
  updatePassword(data: IUpdatePasswordDTO): Promise<session.Fan> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication.updatePassword(data);
    });
  }

  /**
   * Log in using an email/password
   * Log in using an email/password
   *
   * @param email valid email or seaters username
   * @param password plain text password
   * @param mfaToken authenticator token
   */
  doEmailPasswordLogin(email: string, password: string, mfaToken?: string): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .emailPasswordLogin({
          email,
          password,
          mfaToken
        })
        .then(r => this.finishLogin(r))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  /**
   * Log in using a stored token (long term validity)
   *
   * @param storedToken long term token
   * @param mfaToken authenticator token
   */
  doStoredTokenLogin(storedToken: string, mfaToken?: string): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .storedTokenLogin({
          token: storedToken,
          mfaToken
        })
        .then(r => this.finishLogin(r))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  /**
   * @deprecated Use doOAuthCodeLoginV2 instead to retrieve the session
   * @param oauthProvider
   * @param code
   * @returns {Promise<TResult2|TResult1>}
   */
  doOAuthCodeLogin(oauthProvider: string, code: string): Promise<session.Fan> {
    console.warn(
      '[SessionService] doOAuthCodeLogin is deprecated and will be removed soon, use doOAuthCodeLoginV2 instead to retrieve the session'
    );

    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .loginWithOAuthCode(oauthProvider, code)
        .then(r => this.finishLogin(r))
        .then(updatedSession => resolve(updatedSession.identity))
        .catch(r => reject(r));
    });
  }

  doOAuthCodeLoginV2(oauthProvider: string, code: string): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .loginWithOAuthCode(oauthProvider, code)
        .then(r => this.finishLogin(r))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  doVerifyOAuth(input: any): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .verifyOAuth(input)
        .then(r => this.finishLogin(r))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  doLogout() {
    console.log('[SessionService] doLogout'); // DEBUG
    this.seatersApi.apiContext.unsetHeader(AUTH_HEADER);
    this.currentFan = undefined;
    this.sessionToken = undefined;
  }

  // TODO: handle error case
  doEmailPasswordSignUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    language: string,
    redirect: string,
    fanGroupReference: string
  ): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .signup({
          email,
          password,
          firstName: firstname,
          lastName: lastname,
          language: language || 'en',
          confirmationReturnURLPath: redirect,
          registeredFromFanGroupId: fanGroupReference
        })
        .then(() => this.doEmailPasswordLogin(email, password))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  doEmailSignUp(email: string, fanGroupId: string, language?: string, origin?: string): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .signupAnonymous({
          email,
          fanGroupId,
          language: language || 'en',
          origin
        })
        .then(authSuccess => this.finishLogin(authSuccess))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  /**
   * Validate an email by providing a confirmation code
   *
   * @param email The email that you want to validate
   * @param code The code that validates the email
   * @returns a Promise that resolves with an updated fan or rejects with a VALIDATION_ERRORS
   * @see VALIDATION_ERRORS
   */
  doEmailValidation(email: string, code: string): Promise<session.Fan> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .validate({
          email,
          code
        })
        .then(() => this.setCurrentFan())
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  /**
   * Validate a phone number by providing a confirmation code
   *
   * @param phone The phone number that you want to validate
   * @param code The code that validates the email
   * @returns a Promise that resolves with an updated fan or rejects with a VALIDATION_ERRORS
   * @see VALIDATION_ERRORS
   */
  doMobilePhoneNumberValidation(phone: session.PhoneNumber, code: string): Promise<session.Fan> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .validate({
          mobile: phone,
          code
        } as MobilePhoneValidationData)
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  /**
   * Reset the user password based on the email
   * @param email email address
   */
  doPasswordReset(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .resetPassword({ email })
        .then(r => resolve())
        .catch(r => reject(r));
    });
  }

  /**
   * Change the email associated to the current user
   * @param email new email address
   */
  doEmailReset(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .resetEmail({
          email,
          token: this.sessionToken
        })
        .then(r => resolve())
        .catch(r => reject(r));
    });
  }

  checkStoredTokenValidity(
    authToken: session.StoredToken,
    applicationName: string,
    deviceId?: string,
    applicationId?: string
  ): boolean {
    // ensure the expiration date is in the future
    const expirationDate = new Date(normalizeLondonTimezoneDate(authToken.expirationDate));
    const diff = expirationDate.getTime() - new Date().getTime();
    if (diff < 0) {
      return false;
    }

    // check if application name, device id and application id matches
    if (authToken.applicationName !== applicationName) {
      return false;
    }

    if (deviceId && authToken.deviceId !== deviceId) {
      return false;
    }

    if (applicationId && authToken.applicationId !== applicationId) {
      return false;
    }

    // the token is valid
    return true;
  }

  /**
   * Checks if there are any valid stored tokens and returns the first one. If there are none
   * it will create a new token and return this
   * @param applicationName the name of the application, e.g. "Seaters Embedded"
   * @param deviceId defaults to "SDK-device-<random UUID>"
   * @param applicationId defaults to "SDK-app-<random UUID>"
   */
  obtainStoredToken(applicationName: string, deviceId?: string, applicationId?: string): Promise<session.StoredToken> {
    if (!applicationName) {
      throw new Error('[SessionService] applicationName is mandatory to obtain a stored token');
    }
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .getStoredTokens()
        .then(storedTokens => {
          // find the existing stored token, using the provided data to match
          const storedToken = storedTokens.find(t =>
            this.checkStoredTokenValidity(t, applicationName, deviceId, applicationId)
          );
          if (storedToken) {
            return storedToken;
          } else {
            // if no acceptable token was found, create a new token
            const input = {
              applicationName,
              deviceId: deviceId || 'SDK-device-' + uuidv4(),
              applicationId: applicationId || 'SDK-application-' + uuidv4()
            };
            return this.seatersApi.authentication.createStoredToken(input);
          }
        })
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  public whoami(): session.Fan {
    return this.currentFan;
  }

  public setSession(s: session.SessionToken): void {
    this.seatersApi.apiContext.setHeader(AUTH_HEADER, AUTH_BEARER + ' ' + s.token);
    this.sessionToken = s.token;
    switch (this.sessionStrategy) {
      case SESSION_STRATEGY.EXTEND:
        return this.applyExtendSessionStrategy(s);
      case SESSION_STRATEGY.EXPIRE:
        return this.applyExpireSessionStrategy(s);
      default:
        throw new Error('Unknown session strategy: ' + JSON.stringify(this.sessionStrategy));
    }
  }

  public setCurrentFan(): Promise<session.Fan> {
    return new Promise((resolve, reject) => {
      this.seatersApi.fan
        .fan()
        .then(fan => (this.currentFan = fan))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  private waitUntilMillisBeforeSessionExpires(s: session.SessionToken, msBefore: number): Promise<any> {
    const expirationDate = normalizeLondonTimezoneDate(s.expirationDate);
    const diff = new Date(expirationDate).getTime() - new Date().getTime();
    console.log('session expires on %s (in %s minutes)', expirationDate, Math.round(diff / (1000 * 60)));
    return new Promise((resolve, reject) => setTimeout(() => resolve(), diff - msBefore));
  }

  private applyExpireSessionStrategy(s: session.SessionToken): void {
    this.waitUntilMillisBeforeSessionExpires(s, 0).then(() => {
      console.log('[SessionService] session expired');
      this.doLogout();
    });
  }

  private applyExtendSessionStrategy(s: session.SessionToken): void {
    this.waitUntilMillisBeforeSessionExpires(s, MS_TO_EXTEND_BEFORE_SESSION_EXPIRES).then(() => {
      console.log('[SessionService] session about to expire, renewing');
      this.doRefreshTokenLogin(s.token);
    });
  }

  private finishLogin(authSuccess: AuthenticationSuccess): Promise<session.Session> {
    const expirationDate = normalizeLondonTimezoneDate(authSuccess.token.expirationDate);
    console.log('TOKEN: ' + expirationDate);
    this.setSession({
      expirationDate,
      token: authSuccess.token.value
    });
    return new Promise((resolve, reject) => {
      this.setCurrentFan()
        .then(identity => {
          return {
            expiresOn: expirationDate,
            identity,
            token: authSuccess.token.value
          };
        })
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }

  private doRefreshTokenLogin(refreshToken: string, mfaToken?: string): Promise<session.Session> {
    return new Promise((resolve, reject) => {
      this.seatersApi.authentication
        .refreshTokenLogin({
          token: refreshToken,
          mfaToken
        })
        .then(r => this.finishLogin(r))
        .then(r => resolve(r))
        .catch(r => reject(r));
    });
  }
}
