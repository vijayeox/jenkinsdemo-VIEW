import merge from "deepmerge";
import moment from "moment";
class Requests {
    static async getDashboardHtmlDataByUuid(core,uuid) {
        let helper = core.make("oxzion/restClient");
        let response = await helper.request("v1","analytics/dashboard/" + uuid,{},"get");
        return response;
    }

    static async getWidgetByUuid(core, uuid, filterParams) {
        let helper = core.make("oxzion/restClient");
        let filterParameter = (filterParams && filterParams != []) ? ("&filter=" + JSON.stringify(filterParams)) : ''
        let response = await helper.request("v1","analytics/widget/" + uuid + '?data=true' + filterParameter,{},"get");
        return response;
    }
    static async getDocumentsListService(core,appId,url) {
        let helper = core.make("oxzion/restClient");
        let response = await helper.request("v1", "/app/" + appId + "/" + url,{},"get");
        return response;
    }
    
    static async deleteFile(core,appId,fileId,attachementId) {
        let helper = core.make("oxzion/restClient");
        let response = await helper.request("v1","/app/" +appId +"/file/" +fileId +"/attachment/" +attachementId +"/remove",{},"delete");
        return response;
    }

    static async renameFile(core,appId,fileId,attachementId, name) {
        let helper = core.make("oxzion/restClient");
        let response = await helper.request("v1","/app/" + appId + "/file/" + fileId + "/attachment/" + attachementId,{ name: name },"post");
        return response;
    }
    static async getMenulist(core,appId) {
      let helper = core.make("oxzion/restClient");
      let menulist = await helper.request("v1","/app/" + appId + "/menu",{},"get");
      return menulist;
    }
}
export default Requests;