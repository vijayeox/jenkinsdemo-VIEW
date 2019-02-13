import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import {icon } from './metadata.json'

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

  // Create  a new Window instance
  
    const win = (proc) => {
      proc.createWindow({
      id: 'MyTodoWindow',
      title: metadata.title.en_EN,
      icon: proc.resource(icon),
      dimension: {width: 700, height: 400},
      position: {left: 700, top: 200}
    }).render();
  }

    let Count=0 ;
    if (core.has('osjs/tray')) {
      const tray = core.make('osjs/tray').create({
        icon: proc.resource(metadata.icon),
        badge: 'badgeCheck',
        count: Count
      }, (ev) => {
        core.make('osjs/contextmenu').show({
          position: ev,
          menu: [
            {label: 'Show', onclick: () => win(proc)}
          ]
        });
      });
    }
  
  win(proc);
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
