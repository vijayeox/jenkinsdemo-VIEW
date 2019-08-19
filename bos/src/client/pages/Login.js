import {Login as defaultLogin} from '../../osjs-client/index.js';
import {h, app} from 'hyperapp';
import '../assets/scss/login.scss';

export default class Login extends defaultLogin {
  render(startHidden) {
    // Set a custom class name
    var queryObj;
        this.$container.className = 'ox-login';
    var container = this.$container;
    var root = container.parentElement;
    root.className = 'login';
    const login = this.core.config('auth.login', {});
    const baseUrl = this.core.config('wrapper.url', {});
    const actions = {
      setLoading: loading => state => ({loading}),
      setError: error => state => ({error, hidden: false}),
      submit: ev => state => {
        ev.preventDefault();
        state.error = false;
        if (state.loading) {
          return;
        }
        
        const values = Array.from(ev.target.elements)
          .filter(el => el.type !== 'submit')
          .reduce((o, el) => Object.assign(o, {[el.name] : el.value}), {});
        this.emit('login:post', values);
      },
    }

    const forgotPasswordService = () => {
      var username = document.getElementById("forgotPasswordUsername").value;
      var reqData = new FormData();
      reqData.append("username",username);
        var request = new XMLHttpRequest();
          // call to email API
        request.open('POST', baseUrl + 'user/me/forgotpassword',false);
        request.send(reqData);
        if (request.status === 200) {
          console.log(request.responseText);
          const resp = JSON.parse(request.responseText);
          console.log(resp["status"])
          if(resp["status"]=="success")
          { 
            // return Promise.resolve({id:forgotPasswordUsername,username,groups:['admin']});
           // alert("Verfication Mail Sent");
           document.getElementById('errorDiv').style.display="block";
           document.getElementById('resetPasswordError').innerHTML="Verification Mail Sent";
        
          }
          else
            { 
             // alert("Incorrect Username"); 
             document.getElementById('errorDiv').style.display="block";
             document.getElementById('resetPasswordError').innerHTML="Incorrect Username";
          
            }
        }
        else {
          alert("Request status:" + request.status);
        }
      }

      const showForgotPassScreen = () => {
        document.getElementById('loginPage').style.display="none";
        document.getElementById('forgotPasswordPage').style.display="block";
      }
      const cancel = () => {
        document.getElementById('loginPage').style.display="block";
        document.getElementById('forgotPasswordPage').style.display="none";
        document.getElementById('resetPasswordPage').style.display="none";
      }
      
      //let error = true;
     
      const ResetPasswordService = (password) => {
    
        var reqData = new FormData();
        reqData.append("token",queryObj["resetpassword"]);
        reqData.append("password",password);
          var request = new XMLHttpRequest();
            // call to email API
          request.open('POST',baseUrl + 'user/me/resetpassword',false);
          request.send(reqData);
          if (request.status === 200) {
            console.log(request.responseText);
            const resp = JSON.parse(request.responseText);
            console.log(resp["status"])
            if(resp["status"]=="success")
            { 
              // return Promise.resolve({id:forgotPasswordUsername,username,groups:['admin']});
              alert("Password has been reset Successfully");
              window.location.href=window.location.origin;
            }
            else
              { 
                alert("Error!!"); 
              }
          }
          else {
            alert("Request status:" + request.status);
          }
        }
       
      const verify = () => {
        var newPassword = document.getElementById("enterNewPassword").value;
        var reEnterPassword = document.getElementById("reEnterPassword").value;
        var n = newPassword.localeCompare(reEnterPassword);
        if(n==0)
        {
           //alert("abc");
           document.getElementById('errorDiv').style.display="block";
         document.getElementById('resetPasswordError').innerHTML="password reset successfully";
      
           ResetPasswordService(newPassword);

         }
        else
        {
         document.getElementById('errorDiv').style.display="block";
         document.getElementById('resetPasswordError').innerHTML="password mismatch";
        
        }
       }

      

    // Add your HTML content
    const view = (state,actions) => 
    h("main",{id: 'login-container ', className: 'loginContainer row lighten-3 '},[
      h('div',{id: 'ox-login-form', className: 'form-wrapper'},[
      h('div',{ className: 'form-wrapper__inner', id: 'loginPage', style: {display: 'block'}},
      [
        h("form",{action:"#",className: 'form-signin form-row-layout',loading: false,method: "post",onsubmit: actions.submit, className:'ox-form '},[
          h('div',{id: 'ox-img', className: 'ox-imgDiv'},[
            h('img',{id:'ox-logo', className: 'ox-img',src:require('../assets/images/OXZion.png')}),
            ]),
            h('div',{className: 'floating-label'},[
            h("input",{type: "text",name:"username",className:'validate',id:'username', placeholder:"Username"}),
            h('label',{for:'username'},'Username')
          ]),
          h('div',{className: 'floating-label'},[
            h("input",{type: "password",name:"password",className:'validate',id:'password', placeholder:"Password"}),
            h('label',{for:'password'},'Password'),
            ]),
          h('div', {
            class: 'osjs-login-error',
            style: {display: state.error ? 'block' : 'none'}
          }, h('span', {}, "The username and/or password is incorrect! Please try again.")),
          h('div',{className: 'form-signin__footer'},[
          h("button",{type:"submit",value:"login",className: 'btn waves-effect waves-light'},'Login'),
          h('a',{href:"#", onclick: () => showForgotPassScreen()},'Forgot your password?'),
        ]),
        ]),
 ]),

      h('div',{ className: 'form-wrapper__inner', id: 'forgotPasswordPage', style: {display: 'none'}},
      [
        h("form",{action:"#",className: 'form-signin form-row-layout',loading: false, className:'ox-form '},[
          h('div',{id: 'ox-img', className: 'ox-imgDiv'},[
            h('img',{id:'ox-logo', className: 'ox-img',src:require('../assets/images/OXZion.png')}),
            ]),
            h('div',{className: 'floating-label'},[
            h("input",{type: "text",name:"username",className:'validate',id:'forgotPasswordUsername', placeholder:"Username"}),
            h('label',{for:'username'},'Username')

          ]),
          
          
          h('div',{className: 'form-signin__footer'},[
            h("button",{type:"button",value:"Submit",className:'btn waves-effect waves-light', onclick: () => {forgotPasswordService()}},'Submit'),
            h("button",{type:"button", className:'btn waves-effect waves-light', onclick: () => {cancel()}},'Cancel'),
          
         
        ]),
      ]), 
    ]),

      h('div',{ className: 'form-wrapper__inner', id: 'resetPasswordPage',style:{display: 'none'}},
      [
        h("form",{action:"#",className: 'form-signin form-row-layout',loading: false, className:'ox-form '},[
          h('div',{id: 'ox-img', className: 'ox-imgDiv'},[
            h('img',{id:'ox-logo', className: 'ox-img',src:require('../assets/images/OXZion.png')}),
            ]),
            h('div',{className: 'floating-label'},[
              h("input",{type: "password",name:"password",className:'validate',id:'enterNewPassword', placeholder:" Enter Password"}),
              h('label',{for:'password'},'Enter Password'),
              ]),
              h('div',{className: 'floating-label'},[
                h("input",{type: "password",name:"password",className:'validate',id:'reEnterPassword', placeholder:" Re-enter Password"}),
                h('label',{for:'password'},'Re-Enter Password'),
                ]),
                h('div', {
                  class: 'osjs-login-error',
                  id: 'errorDiv',
                  style: {display: 'none'}
                }, h('span', {id:"resetPasswordError"}, "Pass")),
          
          
          h('div',{className: 'form-signin__footer'},[
            
          h("button",{type:"button",value:"Reset",className:'btn waves-effect waves-light', onclick: () => {verify()}},'Submit'),
          h("button",{type:"button", className:'btn waves-effect waves-light', onclick: () => {cancel()}},'Cancel'),
        ]),
          ]), 
       ]),
      
      h('div',{className:'footer-links'},[
        h('a',{href:'https://www.vantageagora.com'},'About Us'),
      ]),
      h('div',{className:'login-copyright'},'Copyright © 2019 Vantage Agora. All rights reserved.'),
      ])
    ])
    const a = app(Object.assign({hidden: startHidden},login),actions,view,document.body);
    this.on('login:start', () => a.setLoading(true));
    this.on('login:stop', () => {
      a.setLoading(false);
    });
    this.on('login:error', err => a.setError(err));
    window.onload = () => {
       queryObj = window.location.search.substr(1);
      queryObj = queryObj.split("&").reduce(function(prev, curr, i, arr) {
          var p = curr.split("=");
          prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
          return prev;
      }, {});
      console.log(queryObj);
      if(queryObj["resetpassword"]){
        console.log("true");
         document.getElementById('loginPage').style.display="none";
          document.getElementById('forgotPasswordPage').style.display="none";
          document.getElementById('resetPasswordPage').style.display="block";
        
      }
      else{
        console.log("false");
      }
    };
  }
}
