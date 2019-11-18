import './index.scss';
import osjs from 'osjs';
import React from 'react';
import ReactDOM from 'react-dom';
import {name as applicationName} from './metadata.json';
import { icon_white } from './metadata.json';
import Body from './body'

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});
  // Create  a new Window instance
  const win = proc.createWindow({
    id: applicationName + 'Window',
    title: metadata.title.en_EN,
    icon: proc.resource(icon_white),
    dimension: {width: 800, height: 400},
    position: {left: 0, top: 0}
  })
    .on('destroy', () => proc.destroy())
    .on('render', () => { win.maximize(); })
    .render($content => ReactDOM.render(<Body args={core}/>, $content));

  return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);

