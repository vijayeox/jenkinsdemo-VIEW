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

import PanelItem from './panel-item';
import * as languages from './locales';
import {EventEmitter} from '@osjs/event-emitter';
import 'materialize-css/dist/css/materialize.min.css';
/**
 * Panel
 *
 * @desc Base Panel Class
 */
export default class Panel extends EventEmitter {
  /**
   * Create panel
   *
   * @param {Core} core Core reference
   * @param {Object} options Options
   */
  constructor(core, options = {}) {
    super('Panel');

    this.core = core;
    this.options = Object.assign(
      {},
      {
        ontop: true,
        position: 'top',
        items: [],
      },
      options
    );

    this.dateString = '';
    this.dob= '';
    this.items = [];
    this.inited = false;
    this.destroyed = false;
    this.$element = null;

    this.options.items.forEach(({name, options}) => {
      const c = core.make('osjs/panels').get(name);
      this.addItem(new c(this.core, this, options || {}));
    });
    this.formatDate = this.formatDate.bind(this);
  }

  /**
   * Destroys the panel
   */
  destroy() {
    if (this.destroyed) {
      return;
    }

    this.items = this.items.filter(item => {
      try {
        item.destroy();
      } catch (e) {
        console.warn(e);
      }
      return false;
    });

    this.destroyed = true;
    this.inited = false;
    this.emit('destroy');
    this.core.emit('osjs/panel:destroy', this);

    this.$element.remove();
    this.$element = null;
  }


  formatDate(string) {
    let options = {day: 'numeric', month: 'long'};
    return new Date(string).toLocaleDateString([], options);
  }

  /**
   * Initializes the panel
   */
  init() {
    if (this.inited) {
      return;
    }
    this.destroyed = false;
    this.inited = true;

    const _ = this.core.make('osjs/locale').translate;
    const __ = this.core.make('osjs/locale').translatable(languages);

    this.$element = document.createElement('div');
    this.$element.classList.add('osjs-panel');
    // this.$element.classList.add('osjs__contextmenu');
    this.$element.addEventListener('contextmenu', ev => {
      ev.preventDefault();

      const disabled = this.core.config('desktop.lock');
      if (disabled) {
        return;
      }

      this.core.make('osjs/contextmenu').show({
        position: ev,
        menu: [
          {
            label: __('LBL_PANEL_POSITION'),
            items: [
              {
                label: _('LBL_TOP'),
                onclick: () => this.setPosition('top'),
              },
              {
                label: _('LBL_BOTTOM'),
                onclick: () => this.setPosition('bottom'),
              },
            ],
          },
        ],
      });
    });
    this.$element.setAttribute('data-position', this.options.position);
    this.$element.setAttribute('data-ontop', String(this.options.ontop));
    this.core.$root.appendChild(this.$element);
    let appmenuElement = document.createElement('div');
    appmenuElement.classList.add('appmenu');
    appmenuElement.id = 'appmenu';
    this.core.$root.appendChild(appmenuElement);
    if (this.options.position === 'top') {
      appmenuElement.style['margin-top'] = '3.5em';
    } else {
      appmenuElement.style['margin-top'] = '0';
    }


    let profileElement = document.createElement('div');
    profileElement.classList.add('profile');
    let profileDetails = this.core.make('oxzion/profile').get();
    let profileInfo = profileDetails['key'];
    this.dateString = profileInfo['date_of_birth'];
    this.dob= this.formatDate(this.dateString);

   let profileCard = document.createElement('div');
		profileCard.innerHTML = 
								'<br/> <a '
										+'class="btn-floating btn-small waves-effect waves-light red" '
										+'onclick={OSjs.run("Preferences");document.getElementById("profile").classList.remove("profile-visible");}; '
										+'id="editbutton">'
										+'<i class="material-icons">edit</i>'
										+'style="transition-delay:10s;"'
										+'</a>'+

									
									'<img id="imgprofile" '
										+'src='+profileInfo['icon']+" "
										+'height="130" '
										+'width="130" '
										+'className="circle img-responsive"'
										+'style="border-radius:50%;cursor:pointer;"'
										+'onclick={OSjs.run("ImageUploader");document.getElementById("profile").classList.remove("profile-visible");}; />'+

									'<label '
										+'className="name" '
										+'style="position: absolute;padding-top: 58px;padding-left: 25px;">'+profileInfo['firstname']+' '+profileInfo['lastname']+'</label>'+
										
									'<label '
										+'className="name" '
										+'style="position: absolute;padding-top: 82px;padding-left: 26px;">'+profileInfo['designation']+'</label> ';
										
		profileElement.appendChild(profileCard);

		let emailElement = document.createElement('div');
		emailElement.innerHTML = '<i class="fa-lg fa fa-envelope" id="iconi1" />'
								+' <label id="info">'+profileInfo['email']+'</label> <br/>';
		profileElement.appendChild(emailElement);


		let phoneElement = document.createElement('div');
		phoneElement.innerHTML = '<i class="fa-lg fa fa-phone" id="iconi" />'
								+' <label id="info">'+profileInfo['phone']+'</label> <br/>';
		profileElement.appendChild(phoneElement);


		let addressElement = document.createElement('div');
		addressElement.innerHTML = '<i class="fa-lg fa fa-location-arrow" id="iconi" />'
								+' <label id="addresic">'+profileInfo['address']+'</label> <br/>';
		profileElement.appendChild(addressElement);


		let countryElement = document.createElement('div');
		countryElement.innerHTML = '<i class="fa-lg fa fa-map-marker" id="iconi" />'
								+' <label id="info">'+profileInfo['country']+'</label> <br/>';
		profileElement.appendChild(countryElement);


		let dobElement = document.createElement('div');
		dobElement.innerHTML = '<i class="fa-lg fa fa-birthday-cake" id="iconi" />'
								+' <label id="info">'+this.dob+'</label> <br/>';
		profileElement.appendChild(dobElement);


		let interestElement = document.createElement('div');
		interestElement.innerHTML = '<i class="fa-lg fa fa-heart" id="iconi" />'
								+' <label id="info">'+profileInfo['interest']+'</label> <br/>';
		profileElement.appendChild(interestElement);
		
		
		
		profileElement.id = 'profile';
		this.core.$root.appendChild(profileElement);

    if (this.options.position === 'top') {
      profileElement.style['margin-top'] = '3.5em';
    } else {
      profileElement.style['margin-top'] = '0';
    }
    this.items.forEach(item => item.init());
    this.emit('create');
  }

  /**
   * Add an item to the panel
   * @param {PanelItem} item The panel item instance
   */
  addItem(item) {
    if (!(item instanceof PanelItem)) {
      throw new TypeError('Invalid panel item specified');
    }

    this.items.push(item);

    if (this.inited) {
      item.init();
    }
  }

  setPosition(position) {
    this.options.position = position;
    let appMenu = document.getElementById('appmenu');
    if (position === 'top') {
      appMenu.style['margin-top'] = '3.5em';
    } else {
      appMenu.style['margin-top'] = '0';
    }
    return this.core
      .make('osjs/panels')
      .save()
      .then(() => {
        const desktop = this.core.make('osjs/desktop');
        return desktop.applySettings();
      });
  }

}
