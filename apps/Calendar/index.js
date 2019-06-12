/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
   * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
import {name as applicationName} from './metadata.json';
const baseUrl = process.env.SERVER;
const trayOptions = {};
let tray = null;
//import {icon} from './metadata.json';
const createIframe = (core, proc, win, cb) => {
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.setAttribute('border', '0');
  iframe.addEventListener('load', () => {
    const ref = iframe.contentWindow;
    win.on('focus', () => ref.focus());
    win.on('blur', () => ref.blur());
    win.on('iframe:post', msg => ref.postMessage(msg, baseUrl));
    win.on('iframe:get', msg => {
      console.warn('Message from Iframe', msg);
      switch(msg){
        case 'Ping':
        win.emit('iframe:post', 'Pong');
        break;
      }
    });
    win.on('message', data => {
      console.warn('[Application', 'Iframe sent', data);
      win.emit(data.method, sendMessage, ...data.args);
    });
  });
  return iframe;
};

// Creates the internal callback function when OS.js launches an application
// Note the first argument is the 'name' taken from your metadata.json file
OSjs.make('osjs/packages').register('Calendar', (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {
    args,
    options,
    metadata 
  });
 // Chat Header Icons are interchanged purposefully. Do not change this.
  const HeaderIcon = () => {
    let parent = document.getElementsByClassName('osjs-window-header')[0];
    if(parent.childNodes[2].getAttribute('data-action') == 'minimize'){
      let maximize = parent.insertBefore(parent.childNodes[3],parent.childNodes[2]);
    }
  }
  const getEmails = async () => {
    let helper  = core.make('oxzion/restClient');
    let res = await helper.request('v1','/email',{},'get');
    return res;
  }

  let trayInitialized = false;
  const createProcWindow = () => {
      let win = proc.createWindow({
      id: 'CalendarWindow',
      icon: proc.resource(proc.metadata.icon_white),
      title: metadata.title.en_EN,
      state: {
        maximized : true
      },
      attributes: {
        visibility: "restricted",
        closeable: false,
        minimizable: true,
        resizable: false
      },
      dimension: {width: 640, height: 480},
      position: {left: 200, top: 400}
    })
      .on('close', () => {
          win.state.minimized == true;
          win.minimize = true;
          win.attributes.minimized = true;
          console.log("close event");
        })
      .render(($content, win) => {
        HeaderIcon();
          // Context menu is hidden
          win.$icon.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            core.make('osjs/contextmenu').hide();
          });
          win.$icon.addEventListener('dblclick', (ev) =>{
            ev.stopPropagation();
            ev.preventDefault();
          }); 
        // console.log(maximize);
        win.minimize();
        win.attributes.maximizable = false;
        const user = core.make('osjs/auth').user();
        const suffix = `?pid=${proc.pid}&wid=${win.wid}`;
        // Get path to iframe content
        const src = proc.resource(baseUrl + suffix +'&oxauth=' + user.jwt);
        // Create DOM element
        const iframe = createIframe(core, proc, win, send => {});
        // Finally set the source and attach
        iframe.src = src;
        // Tray Icon
        if (core.has('osjs/tray') && !trayInitialized) {
          trayInitialized = true;
          trayOptions.title = "Calendar";
          trayOptions.icon = proc.resource(metadata.icon);
          trayOptions.onclick = () => {
            win.raise();
            HeaderIcon();
            win.focus();
          }
          tray = core.make('osjs/tray').create(trayOptions, (ev) => {
            core.make('osjs/contextmenu').show({
              position: ev
            });
          });
        }
        // Attach
        $content.appendChild(iframe);
      });
    };
    createProcWindow(); 
    return proc;
});