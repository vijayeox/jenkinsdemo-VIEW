import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'

export default class SliderComponent extends Base {
	constructor(component, options, data) {
		component.label = 'Slider'
		super(component, options, data);
		window.addEventListener('paymentPlan', function (e) { 
			e.stopPropagation();
			document.getElementById("Slider").addEventListener("change",function() {
				var SliderValue = document.getElementById("Slider").value;
				console.log(SliderValue)
			})
			
		},true)
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
	handle(e) {
		console.log("e.target.value")
	}
	render(children) {
		console.log("Slidercomponent loaded")
		// To make this dynamic, we could call this.renderTemplate('templatename', {}).
		let content = '';
		let list = "<ul class='ticks'>"
		let range = (this.component.max - this.component.min)/this.component.step
		let max = this.component.max
		console.log(range)
		
		for(let i = this.component.min; i<= max ;i += this.component.step) {
			if( i === this.component.min){
				let cell = `<li id="${this.component.key}-${i}" class="active selected">`;
				cell += `${i}`
				cell += '</li>';
				list += cell
			}
			else {
				let cell = `<li id="${this.component.key}-${i}" >`;
				cell += `${i}`
				cell += '</li>';
				list += cell
			}
		
			
		}
		list += "</ul>"
		content += list;
		
		
		// let maxRange = max - this.component.max
		
		// Calling super.render will wrap it html as a component.
		return super.render(`

			<div class="range">
				<span class="inputRange">
					<input type="range" min=${this.component.min} max=${max} step=${this.component.step} value=${this.component.min} }>
				</span>
				<!-- You could generate the ticks based on your min, max & step values. -->
			
				${content}
			</div>
			
		`);
		
	}
	static editForm = editForm
	/**
	 * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
	 * elements to attach functionality to.
	 *
	 * @param element
	 * @returns {Promise}
	 */
	attach(element) {
		var sheet = document.createElement('style'),  
			rangeInput = document.querySelectorAll("input[type=range]"),
			prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];
	  
		document.body.appendChild(sheet);
		var min = this.component.min ,
			max = this.component.max,
			step = this.component.step
	
	
		// document.querySelector("input[type=range]").appendChild(rangeTrack);

		document.querySelector("input[type=range]").addEventListener("input", function () {
			
			sheet.textContent = getTrackStyle(this);
			
		});
		var getTrackStyle = function (el) { 
			
			var curVal = el.value,
				val = ((curVal - min)/(max-min))*100,
				style = '';
				
		
			
			
			//Change background gradient
			
			for (var i = 0; i < prefs.length; i++) {
				style += '.inputRange  {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
				style += '.inputRange  input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
			  }
			// console.log(style)
			return style;
		}
	
	
		
		// Change input value on label click
		// $('.range-labels li').on('click', function () {
		// 	var index = $(this).index();
			
		// 	$rangeInput.val(index + 1).trigger('input');
			
		// });
	
	}
}