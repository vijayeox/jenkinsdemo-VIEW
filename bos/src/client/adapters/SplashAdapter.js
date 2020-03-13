import { ServiceProvider } from '@osjs/common';

export class SplashServiceProvider extends ServiceProvider {

	constructor(core, options = {}) {
		super(core, options || {});
		this.core = core;
		this.$loading = document.createElement('div');
		this.$loading.className = 'osjs-boot-splash';
		this.$loading.innerHTML = '';
	}
	providers() {
		return [
			'oxzion/splash'
		];
	}
	init() {
		this.core.instance('oxzion/splash', () => ({
			show: (ele) => this.show(ele),
			destroy: () => this.destroy(),
			showGrid: () => this.showGrid(),
			renderHtml:()=> this.renderHtml()
		}));
	}
	showGrid() {
		//get active window and get the window class
		let focusedWindows = document.querySelectorAll('[data-focused="true"]')
		let classes = focusedWindows[1] && focusedWindows[1].classList
		let grid_class = ""
		classes && classes.forEach(css_class => {
			css_class !== "osjs-window" ?
				(grid_class = grid_class + (grid_class == "" ? "." : " .") + css_class)
				: null
		})
		grid_class = (grid_class !== "" ? grid_class + " .k-grid-content" : ".k-grid-content")
		const gridContent = document && document.querySelector(grid_class);
		gridContent ? this.show(gridContent) : this.show();
	}

	renderHtml(){
		this.$loading.innerHTML = '<img src="./load.svg" height="150" width="150" align="center">';
		return '<img src="./load.svg" height="150" width="150" align="center">'
	}
	show(ele) {
		if (ele) {
			this.$loading.innerHTML = '<img src="./load.svg" height="150" width="150" align="center">';
			ele.appendChild(this.$loading);
		}
		if (!this.$loading.parentNode) {
			if (ele) {
				this.$loading.innerHTML = '<img src="./load.svg" height="150" width="150" align="center">';
				ele.appendChild(this.$loading);
			}
			else {
				this.$loading.innerHTML = '<img src="./load.svg" height="300" width="300" align="center">';
				ele = this.core.$root;
				ele.appendChild(this.$loading);
			}
		}
	}
	destroy() {
		if (this.$loading.parentNode) {
			this.$loading.remove();
		}
	}
}