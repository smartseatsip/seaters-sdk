# Seaters SDK

## Installation

The SDK is published as an NPM and Bower package. To install it, run either:

```
npm install seaters --save      // Stable version
npm install seaters@beta --save // Beta version
```

or

```
bower install seaters --save // Stable version, no beta available
```

## Usage

### Node

Install the SDK through NPM, then include the `node_modules/seaters/dist/seaters.module.js` file in your build.

### CommonJS

Install the SDK through NPM or Bower, then include the `node_modules|bower_components/seaters/dist/seaters.bundle.js` file in your build.
You are then able to access the SDK via the `window.SeatersSDK` variable.

## For Developers

### Build

To build a production package, install the dependencies first using $ `npm install`, then run $ `npm run build`.

### Develop locally

To test a packaged version of the SDK in your app:

- `npm run build` the SDK locally
- Create a symbolic link between the SDK's bundle and your app's bower_components/node_modules folder
  - `ln /path/to/sdk/ /path/to/your/bower/components/or/node/modules/folder`
    - This created a 'seaters' folder in the desired folder
  - Re-run this command after building the SDK to update the SDK it in your app

This way you don't have to publish the SDK to test it.

### API Documentation

#### Typescript

```typescript
import { getSeatersClient, version } from 'seaters';

console.log('Using SeatersSDK v%s', version);

let client = getSeatersClient();
console.log('Seaters is %s', client.appService.isInMaintenance() ? 'down' : 'up');
```

#### node.js
```javascript
var seaters = require('seaters');

console.log('Using SeatersSDK v%s', seaters.version);
var client = seaters.getSeatersClient({requestDriver:'NODE'});
console.log('Seaters is %s', client.appService.isInMaintenance() ? 'down' : 'up');
```

#### html + javascript
```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="https://sdk.dev-seaters.com/seaters.bundle.min.js"></script>
  </head>
  <body>
    <script type="text/javascript">
      console.log('Using SeatersSDK v%s', SeatersSDK.version);
      var client = SeatersSDK.getSeatersClient({requestDriver:'NODE'});
      console.log('Seaters is %s', client.appService.isInMaintenance() ? 'down' : 'up');
    </script>
  </body>
</html>
```

#### SeatersClient

There are two ways to obtain a [SeatersClient](classes/seatersclient.html) instance. Both allow you to specify optional [SeatersClientOptions](classes/seatersclientoptions.html).

* `getSeatersClient()` [[link](globals.html#getseatersclient)]
  Use this if you want to instantiate the client only once. It will create the instance with the options specified. Any subsequent calls to getSeatersClient will return the same instance.

* `new SeatersClient()` [[link](classes/seatersclient.html)]
  Use this if you want to have multiple instances of the client, for example for load tests when you want to have multiple simultanious sessions, as each client keeps track of a session.


The client exposes a number of services. Each service bundles calls for a certain part of the seaters backend.

##### client.appService [[link](classes/appservice.html)]

This service provides abstractions that can be used most applications. For example seaters service status, backend version, public web API keys and more.

##### client.sessionService [[link](classes/sessionservice.html)]

Authentication is handled by this service. Signing in, signing up, using stored long-term tokens and more.

##### client.publicService [[link](classes/publicservice.html)]

All seaters data that is publicly available can be fetched and searched through via this service.

##### client.fanService [[link](classes/fanservice.html)]

All seaters data that can only be accessed by fans can be fetched and search through this service. It also provides abstractions to perform fan operations such as joining FanGroups and WaitingLists. You have to be logged in with a user that has the 'FAN' role to use this service.
