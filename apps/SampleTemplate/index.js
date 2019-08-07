import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import React from "react";
import ReactDOM from "react-dom";
import RenderTemplate from "../../gui/src/rendertemplate.js";
import LeftMenuTemplate from "../../gui/src/leftmenutemplate.js";
import Template from "../../gui/src/template.js";
// import Inbox from './inbox';
// import Outbox from './outbox';
// import Activity from './activity';
// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

  const menu = [
    {
      "icon": "fa fa-fw fa-dashboard",
      "title": "Dashboard"      
    },
    {
      "icon": "fa fa-fw fa-download",
      "title": "Inbox"      
    },
   {
      "icon": "fa fa-fw fa-upload",
      "title": "Outbox"
   },
   {
    "icon": "fa fa-fw fa-lg",
    "title": "New Position"
 },
 {
  "icon": "fa fa-fw fa-book",
  "title": "Pending Positions"
}
  ];

  // Create  a new Window instance
  proc.createWindow({
    id: 'SampleTemplateWindow',
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 400},
    position: {left: 700, top: 200}
  })
    .on('destroy', () => proc.destroy())
    .render($content => ReactDOM.render(<RenderTemplate args={core} menu={menu}/>, $content));

  return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);
