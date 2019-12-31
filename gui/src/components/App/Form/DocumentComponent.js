import _ from 'lodash';
import Validator from 'formiojs/components/Validator';
import BaseComponent from 'formiojs/components/base/Base';
import Formio from 'formiojs/Formio';

export default class DocumentComponent extends BaseComponent {
  constructor(component, options, data) {
    super(component, options, data);
  }

  elementInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'hidden';
    info.changeEvent = 'change';
    return info;
  }

  build() {
    super.build();
  }
}

if (typeof global === 'object' && global.Formio && global.Formio.registerComponent) {
  global.Formio.registerComponent('document', DocumentComponent);
}