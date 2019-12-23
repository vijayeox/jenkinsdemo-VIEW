import osjs from 'osjs';
import { name as applicationName } from './metadata.json';
import { icon_white } from './metadata.json';
import Slider from './slider.js';
import React from 'react';
import ReactDOM from 'react-dom';

// adding font awesome
//import 'font-awesome/css/font-awesome.min.css';
const trayOptions = {};
  let tray = null;
// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', { args, options, metadata });
  const HeaderIcon = () => {
  let parent = document.querySelectorAll(".osjs-window[data-id=annoucementsWindow] div.osjs-window-header")[0];
  if(parent.childNodes[2].getAttribute('data-action') == 'minimize'){
    let maximize = parent.insertBefore(parent.childNodes[3],parent.childNodes[2]);
    }
  }
   let trayInitialized = false;
  // Create  a new Window instance
  const createProcWindow = () => {
    let win = proc.createWindow({
        id: 'annoucementsWindow',
        title: metadata.title.en_EN,
        icon: proc.resource(icon_white),
        dimension: {width: 800, height: 450},
        position: {left: 700, top: 200}, 
        attributes : {
          visibility: 'restricted',
          resizable: false,
          maximizable: false,
            closeable: false
        }
      })
     .on('close', () => {
          console.log("close event");
        })

    .render($content => ReactDOM.render(<Slider  args = {core} />, $content));
    
    const getAnnouncements = async () => {
        let helper = core.make('oxzion/restClient');
        let announ = await helper.request('v1','/announcement', {}, 'get' );
        return announ;
    };
    
    let announcementsCount=0 ;
    getAnnouncements().then(response => {
      announcementsCount = response["data"].length;
      
      if (core.has('osjs/tray') && !trayInitialized) {
            trayInitialized = true;
            trayOptions.title = "AnnouncementsWindow";
            trayOptions.icon = proc.resource(metadata.icon_white);
            trayOptions.badge = 'badgeCheck';
            trayOptions.count = announcementsCount;
            trayOptions.onclick = () => {
                      console.log(proc);
                      win.raise();
                      win.focus(); 
                      HeaderIcon();
            }
            tray = core.make('osjs/tray').create(trayOptions, (ev) => {
              core.make('osjs/contextmenu').show({
                position: ev
              });
            });
          }

      // if (core.has('osjs/tray')) {
      //   const tray = core.make('osjs/tray').create({
      //     icon: proc.resource(metadata.icon_white),
      //     title: applicationName,
      //     badge: 'badgeCheck',
      //     count: announcementsCount,
      //     onclick: () => {
              
      //                 win.raise();
      //                 win.focus();
      //                 win.on('focus', (...args) => console.log(focus));
      //       },
      //   });
      // }
    
    })
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

      }
      createProcWindow(proc); 
      return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);

