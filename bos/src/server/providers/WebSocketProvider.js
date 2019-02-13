/*
For more information about service providers, visit:
- https://manual.os-js.org/v3/tutorial/provider/
- https://manual.os-js.org/v3/guide/provider/
- https://manual.os-js.org/v3/development/
*/
class WebSocketServiceProvider {

  /**
   * Constructor
   * @param {Core} core Core reference
   */
  constructor(core, options = {}) {
    /**
     * Core instance reference
     * @type {Core}
     */
    this.core = core;
    this.options = options;
  }

  /**
   * A list of services this provider can create
   * @desc Used for resolving a dependency graph
   * @return {string[]}
   */
  provides() {
    return [
      'oxzion/websockets'
    ];
  }

  /**
   * Initializes provider
   */
  async init() {
    this.core.singleton('oxzion/websockets', () => new WebSocket());
  }

  /**
   * Starts provider
   */
   start() {
    const {app, session, configuration} = this.core;
    app.ws('/notification', (ws, req) => {
      ws.on('message', msg => {
        try {
          core.make('osjs/notification', {
            message: msg,
            icon: 'icon.src',
            onclick: () => console.log('Clicked!')
          });
        } catch (e) {
          console.warn(e);
        }
      });
    });

  }

  /**
   * Destroys provider
   */
  destroy() {
  }

}

module.exports = WebSocketServiceProvider;