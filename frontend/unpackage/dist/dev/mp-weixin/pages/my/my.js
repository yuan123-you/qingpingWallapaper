"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo || {});
    const favorites = common_vendor.computed(() => userStore.favorites || []);
    const history = common_vendor.computed(() => userStore.history || []);
    common_vendor.onMounted(() => {
      loadUserInfo();
    });
    function loadUserInfo() {
      if (!userStore.userInfo) {
        userStore.initUserInfo();
      }
    }
    function handleAvatarClick() {
      if (!userStore.userInfo || !userStore.userInfo.openid) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      } else {
        common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            userStore.updateAvatar(tempFilePath);
            common_vendor.index.showToast({
              title: "头像更新成功",
              icon: "success"
            });
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/my/my.vue:111", "选择图片失败", err);
          }
        });
      }
    }
    function goToFavorites() {
      common_vendor.index.navigateTo({
        url: "/pages/my/favorites"
      });
    }
    function goToHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/my/history"
      });
    }
    function clearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除所有缓存吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.clearHistory();
            common_vendor.index.showToast({
              title: "清除成功",
              icon: "success"
            });
          }
        }
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatarUrl
      }, userInfo.value.avatarUrl ? {
        b: userInfo.value.avatarUrl
      } : {}, {
        c: common_vendor.o(handleAvatarClick),
        d: common_vendor.t(userInfo.value.nickName || "点击登录"),
        e: common_vendor.t(userInfo.value.openid || "---"),
        f: common_vendor.t(favorites.value.length),
        g: common_vendor.o(goToFavorites),
        h: common_vendor.t(history.value.length),
        i: common_vendor.o(goToHistory),
        j: common_vendor.o(goToFavorites),
        k: common_vendor.o(goToHistory),
        l: common_vendor.o(clearHistory),
        m: userInfo.value.openid
      }, userInfo.value.openid ? {
        n: common_vendor.o(handleLogout)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
