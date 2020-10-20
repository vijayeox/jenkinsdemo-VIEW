import osjs from "osjs";
import { React, ReactDOM, FormBuilder } from "oxziongui";
import { name as applicationName } from "./metadata.json";
import { icon_white } from "./metadata.json";

var i, finalposition, finalDimension, finalMaximised, finalMinimised;
// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make("osjs/application", {
    args,
    options,
    metadata
  });
  let session = core.make("osjs/settings").get("osjs/session");
  let sessions = Object.entries(session);
  for (i = 0; i < sessions.length; i++) {
    if (
      Object.keys(session[i].windows).length &&
      session[i].name == "AppBuilder"
    ) {
      finalposition = session[i].windows[0].position;
      finalDimension = session[i].windows[0].dimension;
      finalMaximised = session[i].windows[0].maximized;
      finalMinimised = session[i].windows[0].minimized;
    }
  }
  // Create  a new Window instance
  const createProcWindow = () => {
    var win = proc
      .createWindow({
        id: "FormioWindow",
        title: metadata.title.en_EN,
        icon: proc.resource(icon_white),
        attributes: {
          dimension: finalDimension
            ? finalDimension
            : {
                width: 900,
                height: 570
              },
          minDimension: {
            width: 900,
            height: 570
          },
          position: finalposition
            ? finalposition
            : {
                left: 150,
                top: 50
              }
        }
      })
      .on("destroy", () => proc.destroy())
      .render(($content) =>
        ReactDOM.render(
          <div className="formbuilder-warpper">
            <FormBuilder args={core} />
          </div>,
          $content
        )
      );
  };
  createProcWindow(proc);

  return proc;
};

osjs.register(applicationName, register);
