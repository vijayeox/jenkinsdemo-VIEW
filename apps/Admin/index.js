import osjs from "osjs";
import { name as applicationName } from "./metadata.json";
import React from "react";
import ReactDOM from "react-dom";
import { icon } from "./metadata.json";
import Home from "./home";

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
      id: "AdminWindow",
      title: metadata.title.en_EN,
      icon: proc.resource(icon),
      dimension: {
        width: 860,
        height: 555
      },
      minDimension: {
        width: 860,
        height: 555
      },
      position: {
        left: 150,
        top: 50
      }
    })
    .on("destroy", () => proc.destroy())
    .on("resized", config => {
        event = new CustomEvent("windowResize", {
          detail: config,
          bubbles: true,
          cancelable: true
        });
        window.setTimeout(
          () =>
            document
              .getElementsByClassName("Window_Admin")[0]
              .dispatchEvent(event),
          0
        );
    })
    .on("maximize", config => {
        event = new CustomEvent("windowResize", {
          detail: config.state.dimension,
          bubbles: true,
          cancelable: true
        });
        window.setTimeout(
          () =>
            document
              .getElementsByClassName("Window_Admin")[0]
              .dispatchEvent(event),
          0
        );
    })
    .render($content => ReactDOM.render(<Home args={core} />, $content));

  return proc;
};

osjs.register(applicationName, register);
