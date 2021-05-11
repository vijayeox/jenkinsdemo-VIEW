import './index.scss';
import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
const sourceUrl = process.env.SOURCE;
const serverUrl = process.env.SERVER;

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});
  this.loader = core.make("oxzion/splash");
  this.loader.show();
  let session = core.make('osjs/settings').get('osjs/session');
  let sessions = Object.entries(session);
  var i, finalposition, finalDimension,finalMaximised,finalMinimised;
  for (i = 0; i < sessions.length; i++) {
    if (Object.keys(session[i].windows).length && session[i].name == metadata.name){
      finalposition = session[i].windows[0].position;
      finalDimension = session[i].windows[0].dimension;
      finalMaximised = session[i].windows[0].maximized;
      finalMinimised = session[i].windows[0].minimized;
    }
  }
  // Create  a new Window instance
  proc.createWindow({
    id: 'TimesheetWindow',
    title: metadata.title.en_EN,
    dimension: finalDimension ? finalDimension : {
      width: 900,
      height: 570
    },
    minDimension: {
      width: 900,
      height: 570
    },
    position: finalposition ? finalposition : {
      left: 150,
      top: 50
    }
  })
  .on('destroy', () => proc.destroy())
  .render(($content, win) => {
    // Add our process and window id to iframe URL
    if(finalMinimised){
      win.minimize();
    }
    if(finalMaximised){
      win.maximize();
    }
    // win.maximize();
    win.attributes.maximizable = false;
    const profile = core.make("oxzion/profile");
    const details = profile.get();
    const suffix = `?pid=${proc.pid}&wid=${win.wid}`;
    const user = core.make('osjs/auth').user();

    // Create an iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    // var dev = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2MDk4MzM0NzQsImp0aSI6ImZzb0pIZDZBNk83RWRLYlhrenZGaklCaFJ0VmZsdUxWUFwva01xejNvajQwPSIsIm5iZiI6MTYwOTgzMzQ3NCwiZXhwIjoxNjA5OTA1NDc0LCJkYXRhIjp7InVzZXJuYW1lIjoia2FyYW5hIiwib3JnaWQiOiIzIn19.l9CJvuUq-vM3XD_vyXAAJir_DqxlS9MOl02nGoQ52bZ_n9oIaAp6qUBPV7ipEpQfkL6lA_U8vnMUT2BZZT6ZOQ';
    // var jwt = dev || user.jwt;

    iframe.src = proc.resource(sourceUrl+'/login/iframelogin/eosFrame/1?lasturl=commatrix/timesheet/hive/moduleid/28/client/56/instanceform&url='+serverUrl+'/user/me&user=username&m=GET&h=Authorization&Authorization=Authorization: Bearer '+user.jwt);
    iframe.setAttribute('border', '0');

    // Bind window events to iframe
    win.on('blur', () => iframe.contentWindow.blur());
    win.on('focus', () => iframe.contentWindow.focus());
    win.on('iframe:post', msg => iframe.contentWindow.postMessage(msg, window.location.href));

    // Listen for messages from iframe
    win.on('iframe:get', msg => {
      // We should get "Ping" here
      console.warn('Message from Iframe', msg);

      // In this case we just send "Pong" back
      win.emit('iframe:post', 'Pong');
    });

    $content.appendChild(iframe);
  });

  // Creates a new WebSocket connection (see server.js)
  //const sock = proc.socket('/socket');
  //sock.on('message', (...args) => console.log(args))
  //sock.on('open', () => sock.send('Ping'));

  // Use the internally core bound websocket
  //proc.on('ws:message', (...args) => console.log(args))
  //proc.send('Ping')

  // Creates a HTTP call (see server.js)
  //proc.request('/test', {method: 'post'})
  //.then(response => console.log(response));

  return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);
