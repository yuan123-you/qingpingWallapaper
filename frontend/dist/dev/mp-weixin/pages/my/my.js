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
        common_vendor.index.getUserProfile({
          desc: "用于完善用户资料",
          success: (res) => {
            userStore.setUserInfo(res.userInfo);
          },
          fail: () => {
            console.log("获取用户信息失败");
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
    function contactService() {
      common_vendor.index.showModal({
        title: "联系客服",
        content: "客服微信：qingping_service",
        showCancel: false
      });
    }
    function showAdminEntry() {
      common_vendor.index.showModal({
        title: "管理员入口",
        content: "请输入管理员密码",
        editable: true,
        placeholderText: "请输入密码",
        success: (res) => {
          if (res.confirm && res.content) {
            if (res.content === "admin123") {
              common_vendor.index.navigateTo({
                url: "/pages/admin/login"
              });
            } else {
              common_vendor.index.showToast({
                title: "密码错误",
                icon: "none"
              });
            }
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatarUrl || "/static/images/default-avatar.png",
        b: common_vendor.t(userInfo.value.nickName || "未登录"),
        c: common_vendor.t(userInfo.value.openid || "---"),
        d: common_vendor.t(favorites.value.length),
        e: common_vendor.o(goToFavorites, "3f"),
        f: common_vendor.t(history.value.length),
        g: common_vendor.o(goToHistory, "e9"),
        h: common_vendor.o(goToFavorites, "a6"),
        i: common_vendor.o(goToHistory, "d9"),
        j: common_vendor.o(clearHistory, "dc"),
        k: common_vendor.o(contactService, "b0"),
        l: common_vendor.o(showAdminEntry, "cf")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d3687551"]]);
wx.createPage(MiniProgramPage);
