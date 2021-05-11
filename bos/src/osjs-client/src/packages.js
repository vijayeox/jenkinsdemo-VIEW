/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2019, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

import Application from './application';
import Preloader from './utils/preloader';

/**
* A registered package reference
* @property {Object} metadata Package metadata
* @property {Function} callback Callback to instanciate
* @typedef PackageReference
*/

/**
* A package metadata
* @property {String} name The package name
* @property {String} [category] Package category
* @property {String} [icon] Package icon
* @property {Boolean} [singleton] If only one instance allowed
* @property {Boolean} [autostart] Autostart on boot
* @property {Boolean} [hidden] Hide from launch menus etc.
* @property {String} [server] Server script filename
* @property {String[]} [groups] Only available for users in this group
* @property {String[]} [files] Files to preload
* @property {Map<String, String>} title A map of locales and titles
* @property {Map<String, String>} description A map of locales and titles
* @typedef PackageMetadata
*/

/**
* Package Manager
*
* @desc Handles indexing, loading and launching of OS.js packages
*/
export default class Packages {

  /**
   * Create package manage
   *
   * @param {Core} core Core reference
   */
  constructor(core) {
    /**
     * Core instance reference
     * @type {Core}
     */
    this.core = core;

    /**
     * A list of registered packages
     * @type {PackageReference[]}
     */
    this.packages = [];

    /**
     * The lost of loaded package metadata
     * @type {PackageMetadata[]}
     */
    this.metadata = [];

    /**
     * A list of running application names
     * @desc Mainly used for singleton awareness
     * @type {String[]}
     */
    this.running = [];

    /**
     * Preloader
     * @type {Preloader}
     */
    this.preloader = new Preloader(core.$resourceRoot);

    /**
     * If inited
     * @type {boolean}
     */
    this.inited = false;
  }

  /**
   * Destroy package manager
   */
  destroy() {
    this.packages = [];
    this.metadata = [];

    this.preloader.destroy();
  }

  /**
   * Initializes package manager
   */
  init() {
    console.debug('Packages::init()');

    if (!this.inited) {
      this.core.on('osjs/core:started', () => this._autostart());
    }
    this.metadata = this.core.config('packages.metadata', [])
    .map(iter => ({type: 'application', ...iter}));
    this.inited = true;

    let helper = this.core;
    let jwttoken = this.core.make('oxzion/profile').getAuth();
    setInterval(function () { CheckAuthToken(helper, jwttoken.key); }, 300000);
    const manifest = this.core.config('packages.manifest');

    return manifest
      ? this.core.request(manifest, {}, 'json', true)
        .then(metadata => this.addPackages(metadata))
        .then(() => true)
        .catch(error => logger.error(error))
      : Promise.resolve(true);
  }

  /**
   * Launches a (application) package
   *
   * @param {String} name Package name
   * @param {Object} [args] Launch arguments
   * @param {Object} [options] Launch options
   * @param {Boolean} [options.forcePreload=false] Force preload reloading
   * @see PackageServiceProvider
   * @throws {Error}
   * @return {Promise<Application, Error>}
   */
  launch(name, args = {}, options = {}) {
    console.debug('Packages::launch()', name, args, options);

    const _ = this.core.make('osjs/locale').translate;
    const metadata = this.metadata.find(pkg => pkg.name === name);
    if (!metadata) {
      throw new Error(_('ERR_PACKAGE_NOT_FOUND', name));
    }

    if (['theme', 'icons', 'sounds'].indexOf(metadata.type) !== -1) {
      return this._launchTheme(name, metadata.type);
    }

    return this._launchApplication(name, metadata, args, options);
  }

  /**
   * Launches an application package
   *
   * @param {String} name Application package name
   * @param {Metadata} metadata Application metadata
   * @param {Array} args Launch arguments
   * @param {Object} options Launch options
   */
  _launchApplication(name, metadata, args, options) {
    let signaled = false;

    if (metadata.singleton) {
      const foundApp = Application.getApplications()
        .find(app => app.metadata.name === metadata.name);

      if (foundApp) {
        foundApp.emit('attention', args, options);
        signaled = true;

        return Promise.resolve(foundApp);
      }

      const found = this.running.filter(n => n === name);

      if (found.length > 0) {
        return new Promise((resolve, reject) => {
          this.core.once(`osjs/application:${name}:launched`, a => {
            if (signaled) {
              resolve(a);
            } else {
              a.emit('attention', args, options);
              resolve(a);
            }
          });
        });
      }
    }

    this.core.emit('osjs/application:launch', name, args, options);

    this.running.push(name);

    return this._launch(name, metadata, args, options);
  }

  /**
   * Launches a (theme) package
   *
   * @param {String} name Package name
   * @param {String} type Package type
   * @throws {Error}
   * @return {Promise<Object, Error>}
   */
  _launchTheme(name, type) {
    const _ = this.core.make('osjs/locale').translate;

    const metadata = this
      .getPackages(iter => ['theme', 'icons', 'sounds'].indexOf(iter.type) !== -1)
      .find(pkg => pkg.name === name);

    if (!metadata) {
      throw new Error(_('ERR_PACKAGE_NOT_FOUND', name));
    }

    const preloads = (metadata.files || [])
      .map(f => this.core.url(f, {}, Object.assign({ type }, metadata)));

    return this.preloader.load(preloads)
      .then(result => {
        return Object.assign(
          { elements: {} },
          result,
          this.packages.find(pkg => pkg.metadata.name === name) || {}
        );
      });
  }

  /**
   * Wrapper for launching a (application) package
   *
   * @param {String} name Package name
   * @param {Object} args Launch arguments
   * @param {Object} options Launch options
   * @return {Application}
   */
  _launch(name, metadata, args, options) {
    const _ = this.core.make('osjs/locale').translate;

    const dialog = e => {
      if (this.core.has('osjs/dialog')) {
        this.core.make('osjs/dialog', 'alert', {
          type: 'error',
          title: _('ERR_PACKAGE_EXCEPTION', name),
          message: _('ERR_PACKAGE_EXCEPTION', name),
          error: e
        }, () => { /* noop */ });
      } else {
        alert(`${_('ERR_PACKAGE_EXCEPTION', name)}: ${e.stack || e}`);
      }
    };

    const fail = err => {
      this.core.emit('osjs/application:launched', name, false);
      this.core.emit(`osjs/application:${name}:launched`, false);

      dialog(err);

      throw new Error(err);
    };

    const preloads = metadata.files
      .map(f => this.core.url(f, {}, Object.assign({ type: 'apps' }, metadata)));

    const create = found => {
      let app;

      try {
        console.group('Packages::_launch()');
        app = found.callback(this.core, args, options, found.metadata);

        if (app instanceof Application) {
          app.on('destroy', () => {
            const foundIndex = this.running.findIndex(n => n === name);
            if (foundIndex !== -1) {
              this.running.splice(foundIndex, 1);
            }
          });
        } else {
          console.warn('The application', name, 'did not return an Application instance from registration');
        }
      } catch (e) {
        dialog(e);

        console.warn('Exception when launching', name, e);
      } finally {
        this.core.emit('osjs/application:launched', name, app);
        this.core.emit(`osjs/application:${name}:launched`, app);
        console.groupEnd();
      }

      return app;
    };

    return this.preloader.load(preloads, options.forcePreload === true)
      .then(({ errors }) => {
        if (errors.length) {
          fail(_('ERR_PACKAGE_LOAD', name, errors.join(', ')));
        }

        const found = this.packages.find(pkg => pkg.metadata.name === name);
        if (!found) {
          fail(_('ERR_PACKAGE_NO_RUNTIME', name));
        }

        return create(found);
      });
  }

  /**
   * Autostarts tagged packages
   */
  _autostart() {
    this.getPackages()
      .filter(pkg => pkg.autostart === true)
      .forEach((pkg) => {
        // OXZION START CHANGE
        let params = {};
        let queryString = window.location.search.substr(1);
        if (queryString) {
          let queryObj = queryString.split('&').reduce((prev, curr, i, arr) => {
            let p = curr.split('=');
            prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
            return prev;
          }, {});
          const appName = queryObj.app;
          if (appName === pkg.name) {
            if (queryObj.params) {
              params = queryObj.params;
            }
          }
        }
        // OXZION END CHANGE
        this.launch(pkg.name, params);
      });
  }

  /**
   * Registers a package
   *
   * @param {String} name Package name
   * @param {Function} callback Callback function to construct application instance
   * @throws {Error}
   */
  register(name, callback) {
    console.info('Packages::register()', name);

    const _ = this.core.make('osjs/locale').translate;
    const metadata = this.metadata.find(pkg => pkg.name === name);
    if (!metadata) {
      throw new Error(_('ERR_PACKAGE_NO_METADATA', name));
    }

    const foundIndex = this.packages.findIndex(pkg => pkg.metadata.name === name);
    if (foundIndex !== -1) {
      this.packages.splice(foundIndex, 1);
    }

    this.packages.push({
      metadata,
      callback
    });
  }

  /**
   * Adds a set of packages
   * @param {PackageMetadata[]} list Package list
   */
  addPackages(list) {
    if (list instanceof Array) {
      const append = list
        .map(iter => ({
          type: 'application',
          files: [],
          ...iter
        }));

      this.metadata = [...this.metadata, ...append];
    }

    return this.getPackages();
  }

  /**
   * Gets a list of packages (metadata)
   * @param {Function} [filter] A filter function
   * @return {PackageMetadata[]}
   */
  getPackages(filter) {
    filter = filter || (() => true);

    const user = this.core.getUser();
    const details = this.core.make("oxzion/profile").get();
    let metadata = this.core.make("oxzion/profile").getMetadata();
    if (!metadata) {
      metadata = this.metadata;
    }

    const filterBlacklist = iter => details.key.blackListedApps instanceof Object
    ? !details.key.blackListedApps[iter.name]
    : true;

    return metadata
      .filter(filterBlacklist)
      .filter(filter);
  }

  /**
   * Gets a list of packages compatible with the given mime type
   * @param {string} mimeType MIME Type
   * @see PackageManager#getPackages
   * @return {PackageMetadata[]}
   */
  getCompatiblePackages(mimeType) {
    return this.getPackages(meta => {
      if (meta.mimes) {
        return !!meta.mimes.find(mime => {
          try {
            const re = new RegExp(mime);
            return re.test(mimeType);
          } catch (e) {
            console.warn('Compability check failed', e);
          }

          return mime === mimeType;
        });
      }

      return false;
    });
  }
}

function CheckAuthToken(helper, jwttoken) {
  let response = ValidateTokenJWT(helper, jwttoken).then((response) => {
    if (response["status"] != "success") {
      let response = RefreshTokenJWT(helper, jwttoken).then((response) => {
        if (response["status"] != "success") {
          logout(helper).then((response) => {
          });
        }
      });
    }
  });
  return true;
}
const ValidateTokenJWT = async (helper, jwttoken) => {
  let helpers = helper.make("oxzion/restClient");
  let result = await helpers.request("v1", "/validatetoken", { jwt: jwttoken }, "filepost");
  return result;
};
const logout = async (helper) => {
  alert("session expired!. Please log in again");
  await helper.make('osjs/session').save();
  await helper.make('oxzion/usersession').set();
  helper.make('osjs/auth').logout();
};
const RefreshTokenJWT = async (helper, jwttoken) => {
  let helpers = helper.make("oxzion/restClient");
  let result = await helpers.request("v1", "/refreshtoken", { jwt: jwttoken }, "filepost");
  return result;
};