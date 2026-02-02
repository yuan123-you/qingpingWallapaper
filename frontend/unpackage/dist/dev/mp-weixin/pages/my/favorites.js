"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "favorites",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const favoritesList = common_vendor.computed(() => userStore.favorites || []);
    common_vendor.onMounted(() => {
      userStore.initUserInfo();
    });
    function goToPreview(item) {
      common_vendor.index.navigateTo({
        url: `/pages/preview/preview?id=${item.id}`
      });
    }
    function removeFavorite(item) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消收藏吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.removeFavorite(item.id);
            common_vendor.index.showToast({
              title: "已取消收藏",
              icon: "success"
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(favoritesList.value.length),
        b: favoritesList.value.length === 0
      }, favoritesList.value.length === 0 ? {} : {
        c: common_vendor.f(favoritesList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title || "壁纸"),
            c: common_vendor.o(($event) => removeFavorite(item), index),
            d: index,
            e: common_vendor.o(($event) => goToPreview(item), index)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1a2a9709"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/favorites.js.map
