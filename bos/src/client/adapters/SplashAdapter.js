import { ServiceProvider } from '@osjs/common';

export class SplashServiceProvider extends ServiceProvider {

	constructor(core, options = {}) {
		super(core, options || {});
		this.core = core;
		this.$loading = document.createElement('div');
		this.$loading.className = 'osjs-boot-splash';
	}
	providers() {
		return [
			'oxzion/splash'
		];
	}
	init() {
		this.core.instance('oxzion/splash', () => ({
			show: (ele) => this.show(ele),
			destroy: (ele) => this.destroy(ele),
			showGrid: () => this.showGrid(),
			renderHtml: () => this.renderHtml(),
			destroyGrid:()=>this.destroyGrid()
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
		const child =gridContent.querySelectorAll('.osjs-boot-splash')
		console.log(child)
		if(child.length==0)
		if(gridContent){
			//show loader only if the parent doesnt have an existing loader
			child.length==0 && this.show(gridContent)
		} else {
			this.show();
		}
	}
	destroyGrid() {
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
			gridContent ? this.destroy(gridContent) : this.destroy();
	}

	renderHtml() {
		this.$loading.innerHTML = '<img src="./load.svg" height="150" width="150" align="center">';
		return '<img src="./load.svg" height="150" width="150" align="center">'
	}

	show(ele) {

		if (!this.$loading.parentNode) {
			if (ele) {
				//to check if a spinner already exists
				// console.log(ele)
				// console.log(ele.querySelector('.osjs-boot-splash'))
				// var element = ele.querySelector('.osjs-boot-splash')
				// console.log(element)
			
					//replacing this.$loading with loader as there may be multiple instance of loader running at the same time
					let loader = document.createElement('div');
					loader.className = 'osjs-boot-splash';
					loader.innerHTML = '<img src="./load.svg" height="150" width="150" align="center">';
					// loader.innerHTML= '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'
					ele.appendChild(loader);
				
			}
			else {
				this.$loading.innerHTML = '<img src="./load.svg" height="300" width="300" align="center">';
				// this.$loading.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'

				ele = this.core.$root;
				ele.appendChild(this.$loading);
			}
		}
	}

	destroy(ele) {
		if (ele) {
			var childLoader = ele.querySelector('.osjs-boot-splash')
			childLoader.remove()
		}
		else {
			if (this.$loading.parentNode) {
				this.$loading.innerHTML = ""
				this.$loading.remove()
			} else {
				var loader = document.querySelector('.osjs-boot-splash')
				loader ? loader.remove() : null;
			}
		}
	}
}