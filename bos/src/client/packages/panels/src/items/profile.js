/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2019, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
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
import {h} from 'hyperapp';
import PanelItem from '../panel-item';
const logoutIcon = require('../../../../assets/images/logout.png');
const profileIcon = require('../../../../assets/images/profile.png');
const settingsIcon = require('../../../../assets/images/settings.png');
import Swal from 'sweetalert2';
// const profileIcon = require('../../../../assets/images/profile_pic.png');
/**
 * Profile
 *
 * @desc Profile Panel Item
 */
export default class ProfilePanelItem extends PanelItem {    
  init() {
    if (this.inited) {
      return;
    }
    super.init();
  }
  destroy() {
    this.interval = clearInterval(this.interval);
    super.destroy();
  }
  render(state, actions) {
    let profileDetails = this.core.make('oxzion/profile').get();
    let profileIcon = profileDetails['key'];
    console.log(profileIcon);
    const logout = async () => {
      await this.core.make('osjs/session').save();
      await this.core.make('oxzion/usersession').set();
      this.core.make('osjs/auth').logout();
    };
    const openProfile= () =>{
      this.core.run("Preferences");
    }
    const confirm = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to logout now?',
        imageUrl: "https://image.flaticon.com/icons/svg/529/529873.svg",
        imageWidth: 75,
        imageHeight: 75,
        confirmButtonText: 'Logout',
        confirmButtonColor: '#d33',
        showCancelButton: true,
        cancelButtonColor: '#66bb6a'
      }).then((result) => {
        if (result.value) {
          logout();
        }
      })  
    }
    return super.render('profile', [
      h('div', {
        className: 'osjs-panel-profile'
      }, [
      h('div', {
        className: 'profile-content'
      },[
      h('a', {
        className: 'myprofile'},[
        h('div', {
        onclick: openProfile,
        className: 'profile-dropdown-div'
      }, [
          h('img', {
            src: profileIcon.icon + "?" + new Date(),
            alt: 'My Profile',
            className: 'profile-dropdown-image',
            title: 'My Profile'
          }),
          h('span', {
            title: 'Profile',
            innerHTML : 'My Profile',
            className: 'profile-dropdown-text'
          })
          ]
          )
        ]
      ),
      h('a', {
        className: 'logout'},[
        h('div', {
        onclick: confirm,
        className: 'profile-dropdown-div'
      }, [
          h('img', {
            src: logoutIcon,
            alt: 'Log Out',
            className: 'profile-dropdown-image',
            title: 'Logout'
          }),
          h('span', {
            title: 'Logout',
            innerHTML : 'Log out',
            className: 'profile-dropdown-text'
          })
          ]
          )
        ]
      ),
      ]),
        h('img', {
          className:'profileicon',
          src: profileIcon['icon'] + '?' + (new Date()).getTime(),
          alt: profileIcon['firstname'],
          title:'My Profile'
        })])
    ]);
  }
}
