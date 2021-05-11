import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'
import $ from 'jquery'
export default class SliderComponent extends Base {
	constructor(component, options, data) {
		component.label = 'Slider'
		super(component, options, data);
		this.data = data;
		this.form = this.getRoot();
		
	}
	static schema(...extend) {
		return Base.schema({
		type: 'slider',
		label : 'slider'
		}, ...extend );
	}

	static builderInfo = {
		title: 'slider',
		group: 'Custom',
		icon: 'fa fa-sliders',
		weight: 70,
		schema: SliderComponent.schema()
	}
	build() {
		// console.log(this);
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
		console.log(this.component.sliderRange)
		let content = '';
		let list = "<ul class='ticks' id='tickmarks'>";
		var max = this.component.sliderRange.length-1,
			min = 0,
			value = this.component.sliderRange.indexOf(this.dataValue);
		for(let i = min; i<= max ;i++) {
			let cell = `<li id="${this.component.key}-${i}" value="${this.component.sliderRange[i]}">`;
			// cell += `${i}`
			cell += '</li>';
			list += cell
		}
		list += "</ul>"
		content += list;

		// Calling super.render will wrap it html as a component.

		return super.render(`
			<div class="range">
				<input type="range" min="${min}" id="${this.component.key}" name='${this.component.key}' max="${max}" list="tickmarks" value="${value}">
				<span class="range-thumb">$</span>
				<!-- You could generate the ticks based on your min, max & step values. -->
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
		var sheet = document.createElement('style'),
			$rangeInput = $('input[type="range"][name='+this.component.key+']'),
			prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'],
			min = 0,
			max = this.component.sliderRange.length-1,
			sliderRange = this.component.sliderRange;
		element.addEventListener("change", (e) => this.updateValue(sliderRange[e.target.value]))
		if(this.data["sliderValue"]){
			var value = this.component.sliderRange.indexOf(this.data["sliderValue"]);
			document.getElementById("slider").value = value;
			this.updateValue(this.data["sliderValue"]);
		}
		$rangeInput.each(function() {

			var $thumb = $(this).next('.range-thumb');
			var tw = 80; // Thumb width. See CSS
			$(this).on('input', function(el) {
				sheet.textContent = getTrackStyle(this);
				var curVal = el.target.value ;
				var w = $(this).width();
				var val = (curVal - min)/(max-min) * (w - tw);
				$thumb.css({left: val}).attr("data-val", sliderRange[curVal]);
			});
			$(document).ready(function() {
				sheet.textContent = getTrackStyle($rangeInput[0]);
				var tw = 80; // Thumb width. See CSS
				var curVal = $rangeInput[0].value ;
				var w = $rangeInput.width();
				var val = (curVal - min)/(max-min) * (w - tw);
				$thumb.css({left: val}).attr("data-val", sliderRange[curVal]);

			})
		});
			
		
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
   * Get the value of the component from the dom elements.
   *
   * @returns {Array}
   */

   getValue() {
	   var value= [];

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



