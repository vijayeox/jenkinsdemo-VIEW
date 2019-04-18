import './index.scss';
import osjs from "osjs";
import {
  name as applicationName
} from "./metadata.json";
import React from "react";
import ReactDOM from "react-dom";
import {
  icon
} from "./metadata.json";
import App from "./App";

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make("osjs/application", {
    args,
    options,
    metadata
  });

  // Create  a new Window instance
  proc
    .createWindow({
      id: "AppBuilderWindow",
      title: metadata.title.en_EN,
      icon: proc.resource(icon),
      dimension: {
        width: 800,
        height: 570
      },
      position: {
        left: 150,
        top: 60
      }
    })
    .on("destroy", () => proc.destroy())
    .render($content => ReactDOM.render(<App args={core} />, $content));

  return proc;
};

osjs.register(applicationName, register);