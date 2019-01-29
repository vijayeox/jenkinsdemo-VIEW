/*
For more information about authentication adapters, visit:
- https://manual.os-js.org/v3/tutorial/auth/
- https://manual.os-js.org/v3/guide/auth/
- https://manual.os-js.org/v3/development/
*/

import LocalStorageAdapter from './localStorageAdapter.js';


const loginAdapter = (core, config) => ({
  login: (req, res) => {

    const username = req.username;
    var lsHelper = new LocalStorageAdapter;


    var reqData = new FormData();
    reqData.append("username", username);
    reqData.append("password", req.password);

    // making request using the rest client
    //var caller =  core.make('oxzion/restClient')
    //console.log(caller.request('test call','http://jenkins.oxzion.com:8080/auth',reqData,'POST'));

    var request = new XMLHttpRequest();
    let url = core.config('auth.url');
    console.log("login call - " + url);

    // call to login API
    request.open('POST', url, false);
    request.send(reqData);
    if (request.status === 200) {
      const resp = JSON.parse(request.responseText);
      
      if (resp["status"] == "success") {
        if(lsHelper.supported() || lsHelper.cookieEnabled()){
          lsHelper.set('OX_JWT',resp["data"]["jwt"]);

          return Promise.resolve({jwt:resp["data"]["jwt"], username : username}); 
        }
        else {
          console.log('login failed.');
          return Promise.reject(new Error(resp.message));
        }
        
      } else {
        return Promise.reject(new Error(resp.message));
      }
    }

    
  },

  logout: (req, res) => {
    var lsHelper = new LocalStorageAdapter;
    if(lsHelper.supported() || lsHelper.cookieEnabled()){
      lsHelper.purge('OX_JWT');
      return Promise.resolve(true); 
    }
  }
});

export default loginAdapter;