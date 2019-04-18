import React from 'react';
import ReactDOM from 'react-dom';

class LoadingPanel extends React.Component {
    render() {
        const loadingPanel = (
            <div class="k-loading-mask">
                <span class="k-loading-text">Loading</span>
                <div class="k-loading-image"></div>
                <div class="k-loading-color"></div>
            </div>
        );

        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}
export default LoadingPanel;