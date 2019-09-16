import {Login as defaultLogin} from '../../osjs-client/index.js';
import {h, app} from 'hyperapp';
import '../assets/scss/login.scss';

export default class Login extends defaultLogin {

  render(startHidden) {
    // Set a custom class name
    this.$container.className = 'ox-login';
    var container = this.$container;
    var root = container.parentElement;
    root.className = 'login';
    const login = this.core.config('auth.login', {});
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
      }
    }

    // Add your HTML content
    const view = (state,actions) => 
    h("main",{id: 'login-container ', className: 'loginContainer row lighten-3 '},[
      h('div',{id: 'ox-login-form', className: 'form-wrapper'},[
      h('div',{ className: 'form-wrapper__inner'},[
        h("form",{action:"#",className: 'form-signin form-row-layout',loading: false,method: "post",onsubmit: actions.submit, className:'ox-form '},[
          h('div',{id: 'ox-img', className: 'ox-imgDiv'},[
            h('img',{id:'ox-logo', className: 'ox-img',src:require('../assets/images/eox.png')}),
            ]),
            h('div',{className: 'floating-label'},[
            h("input",{type: "text",name:"username",className:'validate',id:'username', placeholder:"Username"}),
            h('label',{for:'username'},'Username')
          ]),
          h('div',{className: 'floating-label'},[
            h("input",{type: "password",name:"password",className:'validate',id:'password', placeholder:"Password"}),
            h('label',{for:'password'},'Password')
          ]),
          h('div', {
            class: 'osjs-login-error',
            style: {display: state.error ? 'block' : 'none'}
          }, h('span', {}, "The username and/or password is incorrect! Please try again.")),
          h('div',{className: 'form-signin__footer'},[
          h("button",{type:"submit",value:"login",className: 'btn waves-effect waves-light'},'Login'),
          //h('a',{href: '#'},'Forgot your password?'),
        ]),
        ]),
      ]),
      h('div',{className:'footer-links'},[
        h('a',{href:'https://eoxvantage.com',className:'footer-link', target:'_blank'},'About Us'),
      ]),
      h('div',{className:'login-copyright'},'Copyright © 2019 EOX Vantage. All rights reserved.'),
      ])
    ])
    const a = app(Object.assign({hidden: startHidden},login),actions,view,document.body);
    this.on('login:start', () => {
      a.setLoading(true)
    });
    this.on('login:stop', () => {
      a.setLoading(false);
    });
    this.on('login:error', err => a.setError(err));
   }
}