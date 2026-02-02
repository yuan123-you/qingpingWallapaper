"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "history",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const historyList = common_vendor.computed(() => userStore.history || []);
    common_vendor.onMounted(() => {
      userStore.initUserInfo();
    });
    function goToPreview(item) {
      common_vendor.index.navigateTo({
        url: `/pages/preview/preview?id=${item.id}`
      });
    }
    function handleClearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清空所有浏览记录吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.clearHistory();
            common_vendor.index.showToast({
              title: "清空成功",
              icon: "success"
            });
          }
        }
      });
    }
    function toggleFavorite(item) {
      if (isFavorite(item.id)) {
        userStore.removeFavorite(item.id);
        common_vendor.index.showToast({
          title: "已取消收藏",
          icon: "none"
        });
      } else {
        userStore.addFavorite(item);
        common_vendor.index.showToast({
          title: "已收藏",
          icon: "success"
        });
      }
    }
    function isFavorite(id) {
      return userStore.favorites.some((fav) => fav.id === id);
    }
    function formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      } else if (diff < 36e5) {
        return `${Math.floor(diff / 6e4)}分钟前`;
      } else if (diff < 864e5) {
        return `${Math.floor(diff / 36e5)}小时前`;
      } else if (diff < 6048e5) {
        return `${Math.floor(diff / 864e5)}天前`;
      } else {
        return `${date.getMonth() + 1}-${date.getDate()}`;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleClearHistory),
        b: historyList.value.length === 0
      }, historyList.value.length === 0 ? {} : {
        c: common_vendor.f(historyList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title || "壁纸"),
            c: common_vendor.t(formatTime(item.viewTime)),
            d: common_vendor.t(isFavorite(item.id) ? "♥" : "♡"),
            e: common_vendor.o(($event) => toggleFavorite(item), index),
            f: index,
            g: common_vendor.o(($event) => goToPreview(item), index)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-afcf0627"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/history.js.map
