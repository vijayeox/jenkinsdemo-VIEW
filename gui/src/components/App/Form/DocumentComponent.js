import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form';

export default class DocumentComponent extends Base {
  constructor(component, options, data) {
    super(component, options, data);
  }
  static schema(...extend) {
    return Base.schema({
      label: 'document',
      type: 'document'
    }, ...extend);
  }
  get defaultSchema() {
    return DocumentComponent.schema();
  }
  static builderInfo = {
    title: 'Document',
    group: 'basic',
    icon: 'fa fa-file',
    weight: 70,
    schema: DocumentComponent.schema()
  }

  render(children) {
    let input = this.renderTemplate('input', {
      input: {
        type: 'input',
        ref: `${this.component.key}`,
        attr: {
          id: `${this.component.key}`,
          class: 'form-control',
          type: 'hidden',
        }
      }
    });
    return super.render(`${input}`);
  }
  attach(element) {
    return super.attach(element);
  }
  static editForm = editForm

  elementInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'hidden';
    info.changeEvent = 'change';
    return info;
  }
  build(element) {
    super.build(element);
  }
}