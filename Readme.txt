## Requirements

Node 8 (or newer) and any modern web-browser.

## Installation

> `localhost:8000` by default.

### Demo

You can run a demo using docker without checkout out any source-code:

```
docker run -p 8000:8000 osjs/osjs:v3
```

# Install dependencies
npm install

# It's recommended that you keep your dependencies (including OS.js) up-to-date
npm update

# Optionally install extra packages:
# For a list of packages, see https://manual.os-js.org/v3/resource/official/
npm install --production @osjs/example-application
npm install --production @osjs/freedesktop-sounds
npm install --production @osjs/gnome-icons
npm install --production @osjs/settings-application
npm install --production @osjs/standard-theme

# Discover installed packages
npm run package:discover

# Build your client
npm run build

# Start serving
npm run serve
```

#### Docker

You can also build a Docker image yourself or use docker-compose:

```
cp .env.example .env
docker-compose up
```

Configuration
==============
To add new configuration to the client side add new properties in src/client/config.js
To override configuration copy the contents of src/client/config.js to src/client/local.js
Then update the properties to suit your environment.