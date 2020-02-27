import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'
import $ from 'jquery'
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
		let content = '';
		let list = "<ul class='ticks'>"
		let range = (this.component.max - this.component.min)/this.component.step
		let max = this.component.max
		
		for(let i = this.component.min; i<= max ;i += this.component.step) {
			let cell = `<li id="${this.component.key}-${i}" value="${i}">`;
			// cell += `${i}`
			cell += '</li>';
			list += cell
		}
		list += "</ul>"
		content += list;
		
		// Calling super.render will wrap it html as a component.
		return super.render(`
			<div class="range">
				
					<input type="range" min=${this.component.min} max=${max} step=${this.component.step} value=${this.dataValue} }>
					<span class="range-thumb">$</span>
			
				<!-- You could generate the ticks based on your min, max & step values. -->
				${content}
			</div><br/>
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

		element.addEventListener("input", (e) => this.updateValue(e.target.value))
		var sheet = document.createElement('style'),  
			$rangeInput = $('input[type="range"]'),
			prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'],
			min = this.component.min,
			max = this.component.max;
	  
			$rangeInput.each(function() {
				
				var $thumb = $(this).next('.range-thumb');
				var tw = 80; // Thumb width. See CSS
				$(this).on('input', function(el) {
					sheet.textContent = getTrackStyle(this);
					var curVal = el.target.value ;
					var w = $(this).width();
					var val = (curVal - min)/(max-min) * (w - tw);
				  $thumb.css({left: val}).attr("data-val", curVal);
				});
				$(document).ready(function() {
					sheet.textContent = getTrackStyle($rangeInput[0]);
					var tw = 80; // Thumb width. See CSS
					var curVal = $rangeInput[0].value ;
					var w = $rangeInput.width();
					var val = (curVal - min)/(max-min) * (w - tw);
					
					$thumb.css({left: val}).attr("data-val", curVal);
	
				})
			});
			  
      	document.body.appendChild(sheet);
		
		var getTrackStyle = function (el) {  
			var curVal = el.value,
				val = (curVal - min)/(max-min) * 100,
				style = '';
			// Change background gradient
			for (var i = 0; i < prefs.length; i++) {
				style += 'input[type="range"]::-' + prefs[i] + '{background: linear-gradient(to right, #005eb8 0%, #005eb8 ' + val + '%, #002855 ' + val + '%, #002855 100%)}';
			}
			return style;
		}
			return super.attach(element);
	}
	/**
   * Set the value of the component into the dom elements.
   *
   * @param value
   * @returns {boolean}
   */
	
	setValue(value) {
		
	}
	static editForm = editForm;

}


    
    