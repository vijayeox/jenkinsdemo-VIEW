import React from 'react';

class LoadingPanel extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.core;
        this.loader = this.core.make("oxzion/splash");
    }
    getActiveWindowClass() {
        let focusedWindows = document.querySelectorAll('[data-focused="true"]')
        let classes = focusedWindows[1] && focusedWindows[1].classList
        let grid_class = ""
        classes && classes.forEach(css_class => {
            css_class !== "osjs-window" ?
                (grid_class = grid_class + (grid_class == "" ? "." : " .") + css_class)
                : null
        })
        grid_class = (grid_class !== "" ? grid_class + " .k-grid-content" : ".k-grid-content")
        return grid_class
    }
    render() {
        let grid_class = this.getActiveWindowClass()
        const gridContent = document && document.querySelector(grid_class);
        gridContent ? this.loader.show(gridContent) : this.loader.show();
        return <></>
    }
}
export default LoadingPanel;