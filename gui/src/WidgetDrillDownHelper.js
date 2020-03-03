
class WidgetDrillDownHelper {
    static OXZION_DRILL_DOWN_ATTRIBUTE = 'data-oxzion-drillDown';

    static broadcastDrillDown(widgetElement, dataContext) {
        let drillDownConfig = widgetElement.getAttribute(OXZION_DRILL_DOWN_ATTRIBUTE);
        if (!drillDownConfig) {
            let widgetId = widgetElement.getAttribute('oxzion-widget-id');
            console.warn(`"${WidgetDrillDownHelper.OXZION_DRILL_DOWN_ATTRIBUTE}" is not configured for widget id ${widgetId}.`);
            return;
        }
        drillDownConfig = JSON.parse(drillDownConfig);
        let filterExpression = drillDownConfig['filter'];

        let regex = /\${.*?}/;
        let filterString = filterExpression;
        while(true) {
            let hits = regex.exec(filterString);
            if (!hits) {
                break;
            }
            filterString = filterString.replace(regex, function(matchedSubstring, offset, string) {
                let key = matchedSubstring.substring(2, (matchedSubstring.length - 1)); //Extract string between ${ and }
                let value = dataContext[key];
                if (!value) {
                    console.log('Event data context:', dataContext);
                    throw `Key value ${key} not found in the click event data context.`;
                }
                return value;
            });
        }

        let messageContent = {
            'action':'oxzion-widget-drillDown',
            'widgetId':widgetElement.getAttribute('data-oxzion-widget-id'),
            'elementId':widgetElement.getAttribute('id'),
            'filter':filterString
        };
        if (drillDownConfig['replaceWith']) {
            messageContent['replaceWith'] = drillDownConfig['replaceWith'];
        }

        console.log('Posting message to window', messageContent);
        window.postMessage(messageContent);
    }

    static findWidgetElement(element) {
        while(true) {
            element = element.parentElement;
            if (!element) {
                console.error('Did not find widget element when moving up the node hierarchy of chart click event.');
                return null;
            }
            if (element.hasAttribute('data-oxzion-widget-id')) {
                return element;
            }
        }
    }

    static getDataContext(dataItem, propertyList) {
        let obj = {};
        propertyList.forEach(function(prop, index, array) {
            if (dataItem[prop]) {
                obj[prop] = dataItem[prop];
            }
        });
        return obj;
    }

    static setupEventHandlers(series) {
        if (!series) {
            return;
        }

        series.forEach(function(ser) {
            switch(ser.type) {
                case 'ColumnSeries':
                    if (!ser['columns']) {
                        ser['columns'] = {};
                    }
                    let columns = ser['columns'];
                    if (!columns['events']) {
                        columns['events'] = {};
                    }
                    let  columnEvts = columns['events'];
                    columnEvts['hit'] = function(evt) {
                        let dataContext = WidgetDrillDownHelper.getDataContext(evt.target.dataItem, [
                            'valueX',
                            'valueY',
                            'dateX',
                            'dateY',
                            'categoryX',
                            'categoryY',
                            'openValueX',
                            'openValueY',
                            'openDateX',
                            'openDateY',
                            'openCategoryX',
                            'openCategoryY'
                        ]);
                        WidgetDrillDownHelper.broadcastDrillDown(
                            WidgetDrillDownHelper.findWidgetElement(evt.event.originalTarget), dataContext);
                    };
                break;
                case 'LineSeries':
                    if (!ser['segments']) {
                        ser['segments'] = {};
                    }
                    let segments = ser['segments'];
                    segments['interactionsEnabled'] = true;
                    if (!segments['events']) {
                        segments['events'] = {};
                    }
                    let segmentEvts = segments['events'];
                    segmentEvts['hit'] = function(evt) {
                        let dataContext = evt.target.dataItem.component.tooltipDataItem.dataContext;
                        WidgetDrillDownHelper.broadcastDrillDown(
                            WidgetDrillDownHelper.findWidgetElement(evt.event.originalTarget), dataContext);
                    };
    
                    if (!ser['bullets']) {
                        ser['bullets'] = [];
                    }
                    let bullets = ser['bullets'];
                    bullets.forEach(function(bul) {
                        if (!bul['events']) {
                            bul['events'] = {};
                        }
                        let bulletEvts = bul['events'];
                        bulletEvts['hit'] = function(evt) {
                            let dataContext = evt.target.dataItem.dataContext;
                            WidgetDrillDownHelper.broadcastDrillDown(
                                WidgetDrillDownHelper.findWidgetElement(evt.event.originalTarget), dataContext);
                        };
                    });
                break;
                case 'FunnelSeries':
                    if (!ser['events']) {
                        ser['events'] = {};
                    }
                    let evts = ser['events'];
                    evts['hit'] = function(evt) {
console.log('Hit function', evt);
                    };
                break;
            }
        });
    }

    static retrieveDrillDownConfiguration(element) {
        let jsonString = element.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_ATTRIBUTE);
        if (!jsonString) {
            return null;
        }
        return JSON.parse(jsonString);
    }

    static persistDrillDownConfiguration(element, configuration) {
        let meta = configuration['oxzion-meta'];
        if (!meta) {
            return false;
        }
        let drillDown = meta['drillDown'];
        if (!drillDown) {
            return false;
        }
        let jsonString = JSON.stringify(drillDown);
        element.setAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_ATTRIBUTE, jsonString);
        return true;
    }
}

export default WidgetDrillDownHelper;

