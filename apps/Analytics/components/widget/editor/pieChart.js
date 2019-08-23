import React from 'react';
import ReactDOM from 'react-dom';

class PieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    static getTemplate() {
        return {
            'series':[{
                'type':'PieSeries',
                'name':'Economy',
                'dataFields': {
                    'value':'economy',
                    'category':'country'
                },
                'slices': {
                    'template': {
                        'stroke':'#fff',
                        'strokeWidth':2,
                        'strokeOpacity':1,
                        'cursorOverStyle':[{
                            'property': 'cursor',
                            'value': 'pointer'
                        }],
                        'tooltipText':'{name}:[bold]{category} - {value}[/]'
                    }
                }
            }],
            'cursor': {
                'type':'XYCursor'
            }
        };
    }

    render() {
        return (
            <h3>Pie chart</h3>
        );
    }
}

export default PieChart;

