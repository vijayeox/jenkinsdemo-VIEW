import { ServiceProvider } from "@osjs/common";

export class GlobalLinkAdapter extends ServiceProvider {
  constructor(core, options = {}) {
    super(core, options || {});
    this.core = core;
    this.metadata = [];
  }

  providers() {
    return ["oxzion/link"];
  }
  async init() {
    this.core.instance('oxzion/link', () => ({
        launchApp: (attibutes,application) => this.launchApp(attibutes,application)
    }));


}
  launchApp(attibutes,application){
    let checkRunning = this.core.make("osjs/packages").running().some((app) => app == application);
    if(checkRunning){
        const packages = this.core.make("osjs/packages").getPackages((m) => m.type === "application");
        let selectedApplicationProps = packages.filter((e) => e.name == application)[0];
        var appNavElement = "navigation_" + selectedApplicationProps.appId;
        let ev = new CustomEvent("addPage", {
            detail: {
                page: attibutes.pageId,
                pageTitle: attibutes.title,
                pageIcon: attibutes.icon,
                fileId: attibutes.fileId,
              },bubbles: true,});
          document.getElementById(appNavElement).dispatchEvent(ev);
    } else {
        this.core.run(application, {
            page: attibutes.pageId,
            pageTitle: attibutes.title,
            pageIcon: attibutes.icon,
            fileId: attibutes.fileId
          });
    }
  }
}