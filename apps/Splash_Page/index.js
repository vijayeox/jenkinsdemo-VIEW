import './index.scss';
import osjs from 'osjs';
import {name as applicationName} from './metadata.json';

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

    const getSplashContent = async () => {
      let helper = core.make('oxzion/restClient');
      let splash = await helper.request('v1','/splashpage', {}, 'get' ); 
      return splash; 
    }

    getSplashContent().then(response => {    
      var allSplashContent='';
      for (var i = 0; i < response.data.length; i++) {  
        if (i!=0) { allSplashContent = allSplashContent + "<br>"; }
        allSplashContent = allSplashContent + response.data[i].content;
      }

      console.log(response.data[0]);
      if (response.data[0].enabled === '1'){

        const win = proc.createWindow({
          id: 'Splash_PageWindow',
          title: metadata.title.en_EN,
          dimension: {width: 800, height: 800},
          position: {left: 700, top: 200}
        })
        .on('destroy', () => proc.destroy());

        var node = document.createElement("DIV");                 
        node.innerHTML = allSplashContent;
        win.render($content => $content.appendChild( node ));

      }
    })
    .catch((err) => {
      // Handle any error that occurred in any of the previous
      // promises in the chain.;
      var node = document.createElement("DIV");                 
      node.innerHTML = "An Error occured when retrieving splash content.<br>The error message is:<br>'" + err.message + "'";
      win.render($content => $content.appendChild( node ));
    });


    // const win = proc.createWindow({
    //   id: 'Splash_PageWindow',
    //   title: metadata.title.en_EN,
    //   dimension: {width: 800, height: 800},
    //   position: {left: 700, top: 200}
    // })
    // .on('destroy', () => proc.destroy());

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
  //win(proc);
  return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);
