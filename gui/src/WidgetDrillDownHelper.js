
class WidgetDrillDownHelper {
    static OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE = 'data-oxzion-drilldownctx';
    static OXZION_WIDGET_ID_ATTRIBUTE = 'data-oxzion-widget-id';

    static bindDrillDownDataContext(widgetElement, dataContext) {
        let widgetId = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE);
        let elementId = widgetElement.getAttribute('id');

        let strAttribute = null;
        if (widgetElement.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            strAttribute = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
        }
        else {
            throw(`Drill down conetxt attribute is not found for widget id ${widgetId}, element id ${elementId}.`);
        }

        let drillDownContext = JSON.parse(strAttribute);
        let context = null;
        if (drillDownContext.length > 0) {
            context = drillDownContext[drillDownContext.length - 1];
            let regex = /\${.*?}/;
            let filterString = context['filter'];
            while(true) {
                let hits = regex.exec(filterString);
                if (!hits) {
                    break;
                }
                filterString = filterString.replace(regex, function(matchedSubstring, offset, string) {
                    let key = matchedSubstring.substring(2, (matchedSubstring.length - 1)); //Extract string between ${ and }
                    let value = dataContext[key];
                    if (!value) {
                        console.error('Event data context:', dataContext);
                        throw `Value for key "${key}" not found in the event data context (logged above) for widget id ${widgetId}, element id ${elementId}.`;
                    }
                    return value;
                });
            }
            context['filter'] = filterString;
            context['isBound'] = true;

            let jsonString = JSON.stringify(drillDownContext);
            widgetElement.setAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE, jsonString);
        }
        else {
            throw(`Drill down conetxt value is not found for widget id ${widgetId}, element id ${elementId}.`);
        }
    }

    static drillDownClicked(widgetElement, dataContext) {
        WidgetDrillDownHelper.bindDrillDownDataContext(widgetElement, dataContext);
        let messageContent = {
            'action':'oxzion-widget-drillDown',
            'widgetId':widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE),
            'elementId':widgetElement.getAttribute('id')
        };
        console.log('Posting message to window.', messageContent);
        window.postMessage(messageContent);
    }

    static prepareWidgetForDrillDown(elementId, widgetId) {
        let widgetElement = document.getElementById(elementId);
        let strAttribute = null;
        if (widgetElement.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            strAttribute = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
        }
        else {
            throw(`Drill down conetxt attribute is not found for widget id ${widgetId}.`);
            return;
        }

        let drillDownContext = JSON.parse(strAttribute);
        let context = null;
        if (drillDownContext.length > 0) {
            let returnObject = {};
            context = drillDownContext[drillDownContext.length - 1];
            let replaceWith = context['replaceWith'];
            if (replaceWith) {
                widgetElement.setAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE, replaceWith);
                returnObject['widgetId'] = replaceWith;
            }
            else {
                returnObject['widgetId'] = widgetId;
            }
            returnObject['filter'] = context['filter'];
            return returnObject;
        }
        else {
            throw(`Drill down conetxt value is not found for widget id ${widgetId}.`);
        }
    }

    static findWidgetElement(element) {
        while(true) {
            element = element.parentElement;
            if (!element) {
                throw('Did not find widget element when moving up the node hierarchy of chart click event.');
            }
            if (element.hasAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE)) {
                return element;
            }
        }
    }

    static getAmchartsDataContext(dataItem, propertyList) {
        let obj = {};
        propertyList.forEach(function(prop, index, array) {
            if (dataItem[prop]) {
                obj[prop] = dataItem[prop];
            }
        });
        return obj;
    }

    static setupAmchartsEventHandlers(series) {
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
                        let dataContext = WidgetDrillDownHelper.getAmchartsDataContext(evt.target.dataItem, [
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
                        WidgetDrillDownHelper.drillDownClicked(
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
                        WidgetDrillDownHelper.drillDownClicked(
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
                            WidgetDrillDownHelper.drillDownClicked(
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

    static setupDrillDownContextStack(element, configuration) {
        let meta = configuration['oxzion-meta'];
        if (!meta) {
            return false;
        }
        let drillDown = meta['drillDown'];
        if (!drillDown) {
            return false;
        }

        let maxDepth = drillDown['maxDepth'];
        let context = JSON.parse(JSON.stringify(drillDown));
        delete context['maxDepth'];
        context['widgetId'] = element.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE);
        content['isBound'] = false;

        let drillDownContext = null;
        if (element.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            let strAttribute = element.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
            drillDownContext = JSON.parse(strAttribute);
        }

        if (!drillDownContext) {
            drillDownContext = [];
        }
        if (maxDepth) {
            if (drillDownContext.length >= maxDepth) {
                return false;
            }
        }
        drillDownContext.push(context);
        let jsonString = JSON.stringify(drillDownContext);
        element.setAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE, jsonString);
        return true;
    }

    static isDrilledDown(element) {
        if (element.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            let strAttribute = element.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
            let isDrilledDown = false;
            let drillDownContext = JSON.parse(strAttribute);
            for (let i=0; i < drillDownContext.length; i++) {
                let context = drillDownContext[i];
                if (context['isBound']) {
                    return true;
                }
            }
            return false;
        }
        else {
            return false;
        }
    }

    static backButtonClicked(event) {
        let widgetElement = findWidgetElement(event.target);
        let messageContent = {
            'action':'oxzion-widget-rollUp',
            'widgetId':widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE),
            'elementId':widgetElement.getAttribute('id')
        };
        console.log('Posting message to window.', messageContent);
        window.postMessage(messageContent);
    }

    static prepareWidgetForRollUp(elementId, widgetId) {
        let newContext = WidgetDrillDownHelper.prepareWidgetForDrillDown(elementId, widgetId);
        widgetId = newContext['widgetId'];
    }

    static unwindWidgetDrillDownStack() {
    }
}

export default WidgetDrillDownHelper;

