import "./index.scss";
import osjs from "osjs";
import { icon } from "./metadata.json";
import { name as applicationName } from "./metadata.json";
import Home from "./home";
import ReactDOM from "react-dom";
import React from "react";


const register = (core, args, options, metadata) => {
  const proc = core.make('osjs/application', {args, options, metadata});

  proc.createWindow({
    id: 'GUITestAppWindow',
    icon: proc.resource(icon),
    title: metadata.title.en_EN,
    dimension: {width: 400, height: 400},
    position: {left: 700, top: 200}
  })
    .on('destroy', () => proc.destroy())
    .render($content => ReactDOM.render(<Home args={core} />, $content));

  return proc;
};

osjs.register(applicationName, register);
