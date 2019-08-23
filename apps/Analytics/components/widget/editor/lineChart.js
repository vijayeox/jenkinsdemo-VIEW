import React from 'react';
import ReactDOM from 'react-dom';

class LineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    static getTemplate() {
        return {
            'series':[{
                'type':'LineSeries',
                'name':'Height',
                'dataFields': {
                    'valueY':'height',
                    'categoryX':'age'
                },
                'bullets':[{
                    'type':'CircleBullet',
                    'circle':{
                        'radius':4,
                        'fill':'#fff',
                        'strokeWidth':'2'
                    }
                }],
                'tooltipText':'Age {categoryX}:[bold]{valueY} cm[/]'
            }],
            'xAxes':[{
                'type':'CategoryAxis',
                'dataFields':{
                    'category':'age'
                },
                'title':{
                    'text':'Age (years)'
                },
                'renderer':{
                    'minGridDistance':1,
                    'labels':{
                        'template':{
                            'rotation':270
                        }
                    },
                    'grid': {
                        'template': {
                            'location':0
                        }
                    }
                }
            }],
            'yAxes': [{
                'type':'ValueAxis',
                'title':{
                    'text':'Height (cm)'
                }
            }],
            'cursor': {
                'type':'XYCursor'
            }
        };
    }

    render() {
        return (
            <h3>Line chart</h3>
        );
    }
}

export default LineChart;

