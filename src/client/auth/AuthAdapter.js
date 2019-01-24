/*
For more information about authentication adapters, visit:
- https://manual.os-js.org/v3/tutorial/auth/
- https://manual.os-js.org/v3/guide/auth/
- https://manual.os-js.org/v3/development/
*/

import LocalStorageAdapter from '../localStorageAdapter.js';


const loginAdapter = (core, config) => ({
  login: (req, res) => {

    const username = req.username;
    var lsHelper = new LocalStorageAdapter;


    var reqData = new FormData();
    reqData.append("username", req.username);
    reqData.append("password", req.password);


    var request = new XMLHttpRequest();
    
    // call to login API
    request.open('POST', 'http://jenkins.oxzion.com:8080/auth', false);
    request.send(reqData);
    if (request.status === 200) {
      const resp = JSON.parse(request.responseText);
      
      if (resp["status"] == "success") {
        if(lsHelper.supported() || lsHelper.cookieEnabled()){
          lsHelper.set('JWT',resp["data"]["jwt"]);

          console.log(lsHelper.get('JWT'));
          console.log(lsHelper.get('JT'));
          return Promise.resolve({jwt:resp["data"]["jwt"]}); 
        }
        else if() {
          console.log('login failed.');
          return Promise.reject(new Error(resp.message));
        }
        
      } else {
        return Promise.reject(new Error(resp.message));
      }
    }

    
  },

  logout: (req, res) => {
    return Promise.resolve(true);
  }
});

export default loginAdapter;