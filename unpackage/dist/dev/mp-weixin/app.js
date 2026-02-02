"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_user = require("./stores/user.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/classify/classify.js";
  "./pages/preview/preview.js";
  "./pages/my/my.js";
  "./pages/search/search.js";
  "./pages/wallpaper/list.js";
  "./pages/my/history.js";
  "./pages/my/favorites.js";
  "./pages/my/downloads.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    common_vendor.onLaunch(() => {
      userStore.initUserInfo();
    });
    common_vendor.onShow(() => {
    });
    common_vendor.onHide(() => {
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
