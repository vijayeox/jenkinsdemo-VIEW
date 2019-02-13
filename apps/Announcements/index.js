import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import {icon } from './metadata.json'
import Slider from './slider.js';
import React from 'react';
import ReactDOM from 'react-dom';

// adding font awesome
//import 'font-awesome/css/font-awesome.min.css';

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

  // Create  a new Window instance
    const win = (proc) => {
        proc.createWindow({
        id: 'annoucementsWindow',
        title: metadata.title.en_EN,
        icon: proc.resource(icon),
        dimension: {width: 700, height: 400},
        position: {left: 700, top: 200}, 
        attributes : {
          visibility: 'restricted'
        }
      }).render($content => ReactDOM.render(<Slider  args = {core} />, $content));
    }

    console
    const getAnnouncements = 
    async () => {
        let helper = core.make('oxzion/restClient');
        let announ = await helper.request('v1','/announcement', {}, 'get' );
        console.log(announ);
        return announ;
    };
    
    let announcementsCount=0 ;
    getAnnouncements().then(response => {
      console.log(response);
      announcementsCount = response["data"].length;
      
      if (core.has('osjs/tray')) {
        const tray = core.make('osjs/tray').create({
          icon: proc.resource(metadata.icon),
          badge: 'badgeCheck',
          count: announcementsCount
        }, (ev) => {
          core.make('osjs/contextmenu').show({
            position: ev,
            menu: [
              {label: 'Show', onclick: () => win(proc)}
            ]
          });
        });
      }
    
    })


   
  win(proc)

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
