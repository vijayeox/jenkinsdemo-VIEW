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

const nullAdapter = require('./adapters/settings/null');
const fsAdapter = require('./adapters/settings/fs');

/**
 * OS.js Settings Manager
 */
class Settings {

  /**
   * Create new instance
   * @param {Core} core Core reference
   * @param {object} [options] Instance options
   */
  constructor(core, options = {}) {
    this.core = core;
    this.options = Object.assign({
      adapter: nullAdapter
    }, options);

    if (this.options.adapter === 'fs') {
      this.options.adapter = fsAdapter;
    }

    try {
      this.adapter = this.options.adapter(core, this.options.config);
    } catch (e) {
      this.core.logger.warn(e);
      this.adapter = nullAdapter(core, this.options.config);
    }
  }

  /**
   * Destroy instance
   */
  destroy() {
    if (this.adapter.destroy) {
      this.adapter.destroy();
    }
  }

  /**
   * Initializes adapter
   */
  async init() {
    if (this.adapter.init) {
      return this.adapter.init();
    }

    return true;
  }

  /**
   * Sends save request to adapter
   * @param {Request} req Express request
   * @param {Response} res Express response
   */
  async save(req, res) {
    const result = await this.adapter.save(req, res);
    res.json(result);
  }

  /**
   * Sends load request to adapter
   * @param {Request} req Express request
   * @param {Response} res Express response
   */
  async load(req, res) {
    const result = await this.adapter.load(req, res);
    res.json(result);
  }
}


module.exports = Settings;
