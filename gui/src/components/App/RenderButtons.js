import React from "react";
import merge from "deepmerge";
import moment from "moment";

class RenderButtons extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.pageId = this.props.pageId;
    this.fileData = this.props.currentRow;
    this.appNavigationDiv = "navigation_"+this.appId;
  }

  createTiles = () => {
    let adminItems = [];
    this.props.content.buttonList.map((currentValue, index) => {
      var showButton;
      if(currentValue.rule){
        var string = this.replaceParams(currentValue.rule, this.fileData);
          showButton = eval(string);
      } else {
        showButton = true;
      }
      var copyPageContent = [];
      var that = this;
      var rowData = this.fileData;
      if(currentValue.details && currentValue.details.length > 0){
        currentValue.details.every(async (item, index) => {
            if (item.params && item.params.page_id) {
              copyPageContent.pageId =item.params.page_id;
            } else if(item.pageId){
              copyPageContent.pageId =item.page_id;
            } else {
              var url;
              var workflowInstanceId;
              var workflowId;
              var cacheId;
              var activityInstanceId;
              var isDraft;
              var pageContentObj=item;
              if (item.url) {
                pageContentObj.url = that.replaceParams(item.url, rowData);
              }
              if(item.params && item.params.url){
                pageContentObj.url = that.replaceParams(item.params.url, rowData);
              }
              if(item.workflowInstanceId){
                workflowInstanceId = that.replaceParams(item.workflowInstanceId, rowData);
                if(workflowInstanceId != "null"){
                  pageContentObj.workflowInstanceId = workflowInstanceId;
                }
              }
              if(item.workflowId){
                workflowId = that.replaceParams(item.workflowId, rowData);
                if(workflowId == "null" && item.workFlowId){
                  workflowId = item.workFlowId;
                }
                if(workflowId != "null"){
                  pageContentObj.workflowId = workflowId;
                }
              }
              if(item.cacheId){
                pageContentObj.cacheId = that.replaceParams(item.cacheId, rowData);
              }
              if(item.activityInstanceId){
                pageContentObj.activityInstanceId = that.replaceParams(item.activityInstanceId, rowData);
              }
              if(item.isDraft){
                pageContentObj.isDraft = item.isDraft;
              }
              if (item.urlPostParams) {
                pageContentObj.urlPostParams = that.replaceParams(item.urlPostParams,rowData);
              }
              if(item.content){
                  pageContentObj.content = item.content;
              }
              copyPageContent.push(pageContentObj);
            }
        });
      }
      var pageDetails = {title:currentValue.name,pageContent:copyPageContent,pageId:currentValue.pageId,icon:currentValue.icon,parentPage:this.pageId}
      if(showButton){
        adminItems.push(
          <div
            key={index}
            className="moduleBtn"
            onClick={() => {
              let p_ev = new CustomEvent("addPage", {
                detail: pageDetails,
                bubbles: true
              });
              document.getElementById(this.appNavigationDiv).dispatchEvent(p_ev);
            }}
          >
            <div className="block">
              {currentValue.icon ? (
                <i className={currentValue.icon}></i>
              ) : (
                currentValue.name
              )}
            </div>
            {currentValue.icon ? (
              <div className="titles">{currentValue.name}</div>
            ) : null}
          </div>
        );
      }
    });
    return adminItems;
  };
  replaceParams(route) {
    var finalParams = merge(this.fileData ? this.fileData : {}, {
      current_date: moment().format("YYYY-MM-DD"),
      appId: this.appId
    });
    if (typeof route == "object") {
      var final_route = JSON.parse(JSON.stringify(route));
      Object.keys(route).map((item) => {
        if (/\{\{.*?\}\}/g.test(route[item])) {
          if (finalParams[item]) {
            final_route[item] = finalParams[item];
          } else {
            if (item == "appId") {
              final_route[item] = this.appId;
            }else {
              final_route[item] = null;
            }
          }
        } else {
          final_route[item] = route[item];
        }
      });
      return final_route;
    } else {
      var regex = /\{\{.*?\}\}/g;
      let m;
      var matches=[];
      do {
        m = regex.exec(route)
        if(m){
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          // The result can be accessed through the `m`-variable.
        matches.push(m);
        }
      } while (m);
      matches.forEach((match, groupIndex) => {
        var param = match[0].replace("{{", "");
        param = param.replace("}}", "");
        if(finalParams[param] !=undefined){
          route = route.replace(
            match[0],
            finalParams[param]
          );
        } else {
          route = route.replace(
            match[0],
            null
          );
        }
      });
      return route;
    }
  }
  updateActionHandler(details, rowData) {
    var that = this;
    return new Promise((resolve) => {
      var queryRoute = that.replaceParams(details.params.url, rowData);
      that.updateCall(queryRoute, rowData).then((response) => {
        that.setState({
          showLoader: false
        });
        resolve(response);
      });
    });
  }
  render() {
    return <div className="appButtons">{this.createTiles()}</div>;
  }
}

export default RenderButtons;
