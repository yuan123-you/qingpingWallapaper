"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const wechatLoading = common_vendor.ref(false);
    async function handleWechatLogin() {
      if (wechatLoading.value)
        return;
      wechatLoading.value = true;
      try {
        common_vendor.index.showLoading({ title: "安全登录中..." });
        const loginRes = await new Promise((resolve, reject) => {
          common_vendor.index.login({
            provider: "weixin",
            success: resolve,
            fail: reject
          });
        });
        common_vendor.index.hideLoading();
        const code = loginRes.code;
        userStore.setUserInfo({
          nickname: "微信用户",
          avatarUrl: "/static/default_avatar.png"
        });
        userStore.setToken("wechat_token_" + code);
        common_vendor.index.showToast({ title: "欢迎回来", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/index/index" });
        }, 1500);
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/login/login.vue:62", err);
        common_vendor.index.showToast({ title: "登录服务异常", icon: "none" });
      } finally {
        wechatLoading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "weixin",
          size: "24",
          color: "#fff"
        }),
        b: common_vendor.o(handleWechatLogin),
        c: wechatLoading.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
