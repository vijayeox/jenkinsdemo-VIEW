import Select from 'formiojs/components/select/Select'
import * as _utils from 'formiojs/utils/utils'
import * as _Formio from 'formiojs/Formio'
import * as _lodash from "lodash";
import * as _nativePromiseOnly from "native-promise-only";

export default class SelectComponent extends Select { 

    constructor(component, options, data) {
        super(component, options, data);
        component.core = null;
        component.appId = null;
        component.uiUrl = null;
        this.form = this.getRoot();
        var that = this;
        if(that.form && that.form.element){
            that.form.element.addEventListener("appDetails", function(e) {
              component.core = e.detail.core;
              component.appId = e.detail.appId;
              component.uiUrl = e.detail.uiUrl;
              component.wrapperUrl = e.detail.wrapperUrl;
          },true);
          var evt = new CustomEvent("getAppDetails", { detail: {} });
          that.form.element.dispatchEvent(evt);
        }
    }
    loadItems(url, search, headers, options, method, body){
    var evt = new CustomEvent("getAppDetails", { detail: {} });
    this.form.element.dispatchEvent(evt);
    var _this3 = this;
    options = options || {}; // See if they have not met the minimum search requirements.

    var minSearch = parseInt(this.component.minSearch, 10);

    if (this.component.searchField && minSearch > 0 && (!search || search.length < minSearch)) {
      // Set empty items.
      return this.setItems([]);
    } // Ensure we have a method and remove any body if method is get


    method = method || 'GET';

    if (method.toUpperCase() === 'GET') {
      body = null;
    }
    var limit = this.component.limit || 100;
    var skip = this.isScrollLoading ? this.selectOptions.length : 0;
    var query = this.component.dataSrc === 'url' ? {} : {
      limit: limit,
      skip: skip
    }; // Allow for url interpolation.

    url = this.interpolate(url, {
      formioBase: this.component.wrapperUrl,
      search: search,
      limit: limit,
      skip: skip,
      page: Math.abs(Math.floor(skip / limit))
    }); // Add search capability.

    if (this.component.searchField && search) {
      if (Array.isArray(search)) {
        query["".concat(this.component.searchField)] = search.join(',');
      } else {
        query["".concat(this.component.searchField)] = search;
      }
    } // If they wish to return only some fields.


    if (this.component.selectFields) {
      query.select = this.component.selectFields;
    } // Add sort capability


    if (this.component.sort) {
      query.sort = this.component.sort;
    }

    if (!_lodash.default.isEmpty(query)) {
      // Add the query string.
      url += (!url.includes('?') ? '?' : '&') + _Formio.default.serialize(query, function (item) {
        return _this3.interpolate(item);
      });
    } // Add filter capability


    if (this.component.filter) {
      url += (!url.includes('?') ? '?' : '&') + this.interpolate(this.component.filter);
    } // Make the request.


    options.header = headers;
    this.loading = true;
    var helper = _this3.component.core.make("oxzion/restClient");
    helper.request("v1",(_this3.component.properties['absoluteUrl'] ? url : "/app/"+_this3.component.appId +url),body,method).then(function (response) {
      _this3.loading = false;
      if(response.status=='success'){
      _this3.setItems(response, !!search);
      } else {
        _this3.setItems([]);
      }
    }).catch(function (err) {
      if (_this3.isInfiniteScrollProvided) {
        _this3.setItems([]);

        _this3.disableInfiniteScroll();
      }

      _this3.isScrollLoading = false;
      _this3.loading = false;

      _this3.itemsLoadedResolve();

      _this3.emit('componentError', {
        component: _this3.component,
        message: err.toString()
      });

      console.warn("Unable to load resources for ".concat(_this3.key));
    });
    }
    render(){
        var evt = new CustomEvent("getAppDetails", { detail: {} });
        if(this.form.element){
          this.form.element.dispatchEvent(evt);
        }
        return super.render();
    }
    updateItems(searchInput, forceUpdate){
      var _this4 = this;

      this.itemsLoaded = new _nativePromiseOnly.default(function (resolve) {
        _this4.itemsLoadedResolve = resolve;
      });

      if (!this.component.data) {
        console.warn("Select component ".concat(this.key, " does not have data configuration."));
        this.itemsLoadedResolve();
        return;
      } // Only load the data if it is visible.


      if (!this.checkConditions()) {
        this.itemsLoadedResolve();
        return;
      }

      switch (this.component.dataSrc) {
        case 'values':
          this.setItems(this.component.data.values);
          break;

        case 'json':
          this.setItems(this.component.data.json);
          break;

        case 'custom':
          this.updateCustomItems();
          break;

        case 'resource':
          {
            // If there is no resource, or we are lazyLoading, wait until active.
            if (!this.component.data.resource || !forceUpdate && !this.active) {
              return;
            }

            var resourceUrl = this.options.formio ? this.options.formio.formsUrl : "".concat(_Formio.default.getProjectUrl(), "/form");
            resourceUrl += "/".concat(this.component.data.resource, "/submission");

            if (forceUpdate || this.additionalResourcesAvailable || this.dataValue.length && !this.serverCount) {
              try {
                this.loadItems(resourceUrl, searchInput, this.requestHeaders);
              } catch (err) {
                console.warn("Unable to load resources for ".concat(this.key));
              }
            } else {
              this.setItems(this.downloadedResources);
            }

            break;
          }

        case 'url':
          {
            if (!forceUpdate && !this.active && !this.calculatedValue) {
              // If we are lazyLoading, wait until activated.
              return;
            }

            var url = this.component.data.url;
            var method;
            var body;

            if (!this.component.data.method) {
              method = 'GET';
            } else {
              method = this.component.data.method;

              if (method.toUpperCase() === 'POST') {
                body = this.component.data.body;
              } else {
                body = null;
              }
            }

            var options = this.component.authenticate ? {} : {
              noToken: true
            };
            this.loadItems(url, searchInput, this.requestHeaders, options, method, body);
            break;
          }

        case 'indexeddb':
          {
            if (!window.indexedDB) {
              window.alert("Your browser doesn't support current version of indexedDB");
            }

            if (this.component.indexeddb && this.component.indexeddb.database && this.component.indexeddb.table) {
              var request = window.indexedDB.open(this.component.indexeddb.database);

              request.onupgradeneeded = function (event) {
                if (_this4.component.customOptions) {
                  var db = event.target.result;
                  var objectStore = db.createObjectStore(_this4.component.indexeddb.table, {
                    keyPath: 'myKey',
                    autoIncrement: true
                  });

                  objectStore.transaction.oncomplete = function () {
                    var transaction = db.transaction(_this4.component.indexeddb.table, 'readwrite');

                    _this4.component.customOptions.forEach(function (item) {
                      transaction.objectStore(_this4.component.indexeddb.table).put(item);
                    });
                  };
                }
              };

              request.onerror = function () {
                window.alert(request.errorCode);
              };

              request.onsuccess = function (event) {
                var db = event.target.result;
                var transaction = db.transaction(_this4.component.indexeddb.table, 'readwrite');
                var objectStore = transaction.objectStore(_this4.component.indexeddb.table);
                new _nativePromiseOnly.default(function (resolve) {
                  var responseItems = [];

                  objectStore.getAll().onsuccess = function (event) {
                    event.target.result.forEach(function (item) {
                      responseItems.push(item);
                    });
                    resolve(responseItems);
                  };
                }).then(function (items) {
                  if (!_lodash.default.isEmpty(_this4.component.indexeddb.filter)) {
                    items = _lodash.default.filter(items, _this4.component.indexeddb.filter);
                  }

                  _this4.setItems(items);
                });
              };
            }
          }
      }
    }
}