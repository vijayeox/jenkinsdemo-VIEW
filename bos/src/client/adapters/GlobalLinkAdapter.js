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
    this.core.run(application, {
        page: attibutes.pageId,
        pageTitle: attibutes.title,
        pageIcon: attibutes.icon,
        fileId: attibutes.fileId,
      });
  }
}