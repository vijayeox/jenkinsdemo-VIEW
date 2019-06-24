import './index.scss';
import osjs from 'osjs';
import React from "react";
import ReactDOM from "react-dom";
import {name as applicationName} from './metadata.json';
import Body from "./body"

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

  // Create  a new Window instance
  proc.createWindow({
    id: 'QueryBuilderWindow',
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 400},
    position: {left: 700, top: 200}
  })
    .on('destroy', () => proc.destroy())
    .render($content => ReactDOM.render(< Body />, $content));

  return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);
