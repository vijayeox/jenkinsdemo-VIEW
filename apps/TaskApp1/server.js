// Methods OS.js server requires

require('@babel/register')({
  ignore: [ /(node_modules)/ ],
  presets: ['@babel/env','@babel/react']
});
module.exports = (core, proc) => ({

// When server initializes
init: async () => {
  // HTTP Route example (see index.js)
  core.app.post(proc.resource('/test'), (req, res) => {
    res.json({hello: 'World'});
  });
},

// When server starts
start: () => {},

// When server goes down
destroy: () => {},

// When using an internally bound websocket, messages comes here
onmessage: (ws, respond, args) => {
  respond('Pong');
}
});
