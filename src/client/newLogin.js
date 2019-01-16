import {Login} from '../osjs-client/index.js';
import {h, app} from 'hyperapp';

export default class oxLogin extends Login {
  render(startHidden) {
    // Set a custom class name
    this.$container.className = 'ox-login';
    var container = this.$container;
    var root = container.parentElement;
    root.className = 'login';


    const login = this.core.config('auth.login', {});
    console.log(login);



    const actions = {
      setLoading: loading => state => ({loading}),
      setError: error => state => ({error, hidden: false}),
      submit: ev => state => {
        ev.preventDefault();

        if (state.loading) {
          return;
        }

        const values = Array.from(ev.target.elements)
          .filter(el => el.type !== 'submit')
          .reduce((o, el) => Object.assign(o, {[el.name] : el.value}), {});
        console.log(ev);
        console.log(values);
        this.emit('login:post', values);
      }
    }	

    // Add your HTML content
    const view = (state,actions) => 
    h("main",{id: 'login-container ', className: 'row  deep-purple lighten-3 '},[
      
      h('div',{id:'ox-content', className: 'col s8  deep-purple lighten-3 ' ,style: 'padding: 0px;'},[
        h("br"),
        h('div',{id:'content-container'}),
        h("br"),
        h('div',{id:'footer',className:'ox-content-footer purple darken-4 footer'},[
          h('span',{className:'footer-CR'},'Copyright © 2004-2019 Vantage Agora. All rights reserved.'),
          h('span',{className:'footer-links'},[
            h('a',{  href:'#'},'Terms and Conditions'),
            h('a',{href:'#'},'Privacy'),
            h('a',{href:'#'},'About Us'),
            h('a',{href:'#'},'FAQ')
          ])
        ])
      ]), // left panel content
      
      h('div',{id: 'ox-login-form', className: 'col s4 grey lighten-5 right-align'},[
        h("form",{action:"#",method: "post",onsubmit: actions.submit, className:'ox-form '},[
          h('img',{id:'ox-logo',src:require('../../dist/OXZion.png')}),
          h("br"),
          h('div',{className: 'input-field'},[
            h("input",{type: "text",name:"username",className:'validate',id:'username'}),
            h('label',{for:'username'},'Username')
          ]),
          h('div',{className: 'input-field'},[
            h("input",{type: "password",name:"password",className:'validate',id:'password'}),
            h('label',{for:'Password'},'Password')
          ]),
          h("br"),
          h("br"),

          h("input",{type:"submit",value:"login",className: 'btn waves-effect waves-light'}),
          h("br"),
          h('a',{href: '#'},'Forgot your password?')
        ]),
        h('div',{id:'filler',className:'form-filler grey lighten-5'})
      ])

    ])

    // basic form
    /*h("form",{action:"#",method: "post",onsubmit: actions.submit},[
        h("input",{type: "text",name:"username"}),
        h("input",{type:"password",name: "password"}),
        h("input",{type:"submit",value:"login",})
      ])
    */    

    const a = app(Object.assign({hidden: startHidden},login),actions,view,document.body);

    // Bind the events
     this.on('login:start', () => a.setLoading(true));
    this.on('login:stop', () => a.setLoading(false));
    this.on('login:error', err => a.setError(err));
    // To submit a login form (ex when you press a button):
    /*
    this.emit('login:post', {
      username: 'foo',
      password: 'bar'
    });
    */
  }
}