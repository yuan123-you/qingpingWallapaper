"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_user_index = require("../../api/user/index.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    async function handleLogin() {
      try {
        common_vendor.index.showLoading({
          title: "登录中..."
        });
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        if (loginRes.code) {
          const res = await api_user_index.userLogin({
            code: loginRes.code,
            userInfo: {}
          });
          if (res && res.token) {
            userStore.setToken(res.token);
            userStore.setUserInfo({
              openid: res.openid,
              nickName: "微信用户",
              avatarUrl: ""
            });
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index"
              });
            }, 1500);
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录失败，请重试",
              icon: "none"
            });
          }
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "获取登录凭证失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:92", "登录失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
      }
    }
    function goToAgreement() {
      common_vendor.index.showToast({
        title: "用户协议",
        icon: "none"
      });
    }
    function goToPrivacy() {
      common_vendor.index.showToast({
        title: "隐私政策",
        icon: "none"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(handleLogin),
        c: common_vendor.o(goToAgreement),
        d: common_vendor.o(goToPrivacy)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
