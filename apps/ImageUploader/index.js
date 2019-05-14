import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import React from 'react';
import { icon } from "./metadata.json";
import ReactDOM from 'react-dom';
import Imagewindow from './Imagewindow.js';
// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});
  let contentDom = '';
  // Create  a new Window instance
  const win = proc.createWindow({
    id: 'ImageUploaderWindow',
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 400},
    position: {left: 700, top: 200},
    attributes:{  
    visibility: 'restricted',
          resizable: false,
          maximizable: false,
          minimizable: false
  }
  })
    .on('destroy', () => {
      try {
        ReactDOM.unmountComponentAtNode(contentDom);
      } catch (e) {
        console.error(e);
      }
      proc.destroy()
    })
    .render($content => {
        contentDom = $content;
        ReactDOM.render(<Imagewindow args={core}/>, $content);
      });
    if(win.$element.className.indexOf('Window_'+applicationName) == -1){
      win.$element.className += " Window_"+applicationName;
    }
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