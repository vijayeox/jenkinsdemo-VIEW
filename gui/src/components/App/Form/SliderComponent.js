import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'

export default class SliderComponent extends Base {
	constructor(component, options, data) {
		component.label = 'Slider'
		super(component, options, data);
	}
	static schema(...extend) {
		return Base.schema({
		type: 'slider',
		label : 'slider'   
		}, ...extend );
	}

	static builderInfo = {
		title: 'Payment',
		group: 'basic',
		icon: 'fa fa-calender',
		weight: 70,
		schema: SliderComponent.schema()
	}
	build() {
		console.log(this);
		// super.build(element);
	}
	rebuild(){
		super.rebuild();
	}

	/**
	 * Render returns an html string of the fully rendered component.
	 *
	 * @param children - If this class is extendended, the sub string is passed as children.
	 * @returns {string}
	 */

	render(children) {

		// To make this dynamic, we could call this.renderTemplate('templatename', {}).
		let content = '';
		let list = "<ul class='ticks'>"
		let range = (this.component.max - this.component.min)/this.component.step
		let max = this.component.max
		console.log(range)
		
		for(let i = this.component.min; i<= max ;i += this.component.step) {
		
				let cell = `<li id="${this.component.key}-${i}" >`;
				cell += `${i}`
				cell += '</li>';
				list += cell
			
	
		}
		list += "</ul>"
		content += list;
		
		// Calling super.render will wrap it html as a component.
		return super.render(`

			<div class="range">
				<div class="inputRange">
					<input type="range" min=${this.component.min} max=${max} step=${this.component.step} value=${this.dataValue} }>
				</div>
				<!-- You could generate the ticks based on your min, max & step values. -->
			
				${content}
			</div>
			
		`);
		
	}
	 /**
   * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
   * elements to attach functionality to.
   *
   * @param element
   * @returns {Promise}
   */
	attach(element) { 
		window.addEventListener("input", (e) => this.updateValue(e.target.value))
		return super.attach(element);
	}
	/**
   * Set the value of the component into the dom elements.
   *
   * @param value
   * @returns {boolean}
   */
	
	setValue(value) {
		console.log(value)
	}
	static editForm = editForm;

}