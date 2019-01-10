/*
For more information about authentication adapters, visit:
- https://manual.os-js.org/v3/tutorial/auth/
- https://manual.os-js.org/v3/guide/auth/
- https://manual.os-js.org/v3/development/
*/
const loginAdapter = (core, config) => ({
  login: (req, res) => {
    
    const username = req.username;
    
    var reqData = new FormData();
    reqData.append("username",req.username);
    reqData.append("password",req.password);
    

    var request = new XMLHttpRequest();
    console.log("login call")
    request.onreadystatechange = function(){
    	if(this.readyState == 4 && this.status == 200){
    		const resp = JSON.parse(this.responseText);
    		if(resp["status"] == "success"){
    			return Promise.resolve({id: 666, username, groups: ['admin']});
    		}
    	}
    };
    // call to login API
    request.open('POST','http://jenkins.oxzion.com:8080/auth',false);
    request.send(reqData);
    if (request.status === 200) {
  		console.log(request.responseText);
    	return Promise.resolve({id: 666, username, groups: ['admin']});
	}


    /*
		var data = new FormData();
    data.append('username',req.username);
    data.append('password',req.password);
    const resp = fetch('http://jenkins.oxzion.com:8080/auth',{
    	method: 'POST',
    	body: data
    });
	const respData = await resp.json()
    console.log(respData);

    return Promise.resolve({id: 666, username, groups: ['admin']});
      if (req.username === 'test' && req.password === 'demo') {
      return Promise.resolve({id: 666, username, groups: ['admin']});
    }*/
  },

  logout: (req, res) => {
    return Promise.resolve(true);
  }
});

export default loginAdapter;
