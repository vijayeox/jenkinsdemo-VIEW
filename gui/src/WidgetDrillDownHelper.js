
class WidgetDrillDownHelper {
    static OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE = 'data-oxzion-drilldownctx';
    static OXZION_WIDGET_ID_ATTRIBUTE = 'data-oxzion-widget-id';

    static bindDrillDownDataContext(templateString, dataContext) {
        if (!templateString || ('' === templateString) || !dataContext) {
            return templateString;
        }
        let regex = /\${.*?}/;
        while(true) {
            let hits = regex.exec(templateString);
            if (!hits) {
                break;
            }
            templateString = templateString.replace(regex, function(matchedSubstring, offset, string) {
                let key = matchedSubstring.substring(2, (matchedSubstring.length - 1)); //Extract string between ${ and }
                let value = dataContext[key];
                if (!value) {
                    console.error('Filter string:', templateString);
                    console.error('Event data context:', dataContext);
                    throw `Value for key "${key}" not found in the event data context logged above.`;
                }
                return value;
            });
        }
        return templateString;
    }

    static drillDownClicked(widgetElement, dataContext) {
        function bindProperty(context, messageContent, propName) {
            let property = context ? context[propName] : null;
            if (property) {
                let boundProperty = WidgetDrillDownHelper.bindDrillDownDataContext(property, dataContext);
                messageContent[propName] = boundProperty;
                context[propName] = boundProperty;
            }
        }

        let widgetId = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE);
        if (!widgetElement.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            throw(`Drill down conetxt attribute is not found for widget id ${widgetId}.`);
        }

        let elementId = widgetElement.getAttribute('id');
        let messageContent = {
            'action':'oxzion-widget-drillDown',
            'widgetId':widgetId,
            'elementId':elementId
        };

        let newWidgetId = widgetId;
        let strAttribute = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
        let drillDownContext = JSON.parse(strAttribute);
        if (!drillDownContext || (0 === drillDownContext.length)) {
            throw(`Drill down conetxt is not found for widget id ${widgetId}.`);
        }
        let context = drillDownContext[drillDownContext.length - 1];
        let replaceWith = context['replaceWith'];
        if (replaceWith) {
            messageContent['newWidgetId'] = replaceWith;
            widgetElement.setAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE, replaceWith);
        }
        let target = context['target'];
        if (target) {
            messageContent['target'] = target;
        }

        bindProperty(context, messageContent, 'filter');
        bindProperty(context, messageContent, 'widgetTitle');
        bindProperty(context, messageContent, 'widgetFooter');

        context['isBound'] = true;
        //Update the widget element attribute containing drill down context stack.
        widgetElement.setAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE, JSON.stringify(drillDownContext));

        console.log('Posting drillDown message to window.', messageContent);
        window.postMessage(messageContent);
    }

    static findWidgetElement(element) {
        if (element.topParent) {
            element = element.topParent.htmlContainer;
        }
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
                            WidgetDrillDownHelper.findWidgetElement(evt.event ? evt.event.originalTarget : evt.target), dataContext);
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
                            WidgetDrillDownHelper.findWidgetElement(evt.event ? evt.event.originalTarget : evt.target), dataContext);
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
                                WidgetDrillDownHelper.findWidgetElement(evt.event ? evt.event.originalTarget : evt.target), dataContext);
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
        let context = JSON.parse(JSON.stringify(drillDown)); //Clone drillDown context.
        delete context['maxDepth'];
        context['widgetId'] = element.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE);
        context['isBound'] = false;

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
        if (!element.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            return false;
        }

        let strAttribute = element.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
        let drillDownContext = JSON.parse(strAttribute);
        for (let i=0; i < drillDownContext.length; i++) {
            let context = drillDownContext[i];
            if (context['isBound']) {
                return true;
            }
        }
        return false;
    }

    static rollUpClicked(widgetElement) {
        let widgetId = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE);
        if (!widgetElement.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            throw(`Drill down conetxt attribute is not found for widget id ${widgetId}.`);
        }

        let context = WidgetDrillDownHelper.unwindDrillDownContextStack(widgetElement);
        let elementId = widgetElement.getAttribute('id');
        let messageContent = {
            'action':'oxzion-widget-rollUp',
            'widgetId':widgetId,
            'elementId':elementId,
            'filter':context['filter']
        };
        let newWidgetId = context['widgetId'];
        if (newWidgetId !== widgetId) {
            messageContent['newWidgetId'] = newWidgetId;
            widgetElement.setAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE, newWidgetId);  
        }

        console.log('Posting rollUp message to window.', messageContent);
        window.postMessage(messageContent);
    }

    static unwindDrillDownContextStack(widgetElement) {
        let widgetId = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE);
        if (!widgetElement.hasAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE)) {
            throw(`Drill down conetxt attribute is not found for widget id ${widgetId}.`);
        }

        let strAttribute = widgetElement.getAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE);
        let drillDownContext = JSON.parse(strAttribute);
        if (!drillDownContext || (0 === drillDownContext.length)) {
            throw(`Drill down conetxt is not found for widget id ${widgetId}.`);
        }

        let context = drillDownContext.pop();
        if (!context['isBound']) {
            context = drillDownContext.pop();
        }        
        if (!context['isBound']) {
            throw(`Unbound context not found neither at top nor at 2nd position from top of drill down stack for widget id ${widgetId}.`);
        }
        //Update the widget element attribute containing drill down context stack.
        widgetElement.setAttribute(WidgetDrillDownHelper.OXZION_DRILL_DOWN_CONTEXT_ATTRIBUTE, JSON.stringify(drillDownContext));

        //Clone the context.
        context = JSON.parse(JSON.stringify(context));
        delete context['filter']; //Filter should be picked up from the context at the top of the drill down stack.

        //Filter should be picked up from the context at the top of the drill down stack.
        let tempContext = null;
        if (drillDownContext.length > 0) {
            tempContext = drillDownContext[drillDownContext.length - 1];
            let filter = tempContext['filter'];
            if (filter) {
                context['filter'] = filter;
            }
        }

        return context;
    }
}

export default WidgetDrillDownHelper;

