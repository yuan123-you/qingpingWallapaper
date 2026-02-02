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
  __name: "favorites",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const list = common_vendor.computed(() => userStore.favorites);
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=favorites` });
    }
    function doRemove(item) {
      common_vendor.index.showModal({
        title: "移出收藏",
        content: "确定要从收藏夹移除这张壁纸吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.removeFavorite(item.id);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "24",
          color: "#1a1a1a"
        }),
        b: common_vendor.o(goBack),
        c: list.value.length
      }, list.value.length ? {
        d: common_vendor.t(list.value.length)
      } : {}, {
        e: statusBarHeight.value + "px",
        f: list.value.length
      }, list.value.length ? {
        g: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: "1a2a9709-1-" + i0,
            c: common_vendor.o(($event) => doRemove(item), item.id),
            d: item.id,
            e: index * 0.05 + "s",
            f: common_vendor.o(($event) => goToPreview(item), item.id)
          };
        }),
        h: common_vendor.p({
          type: "trash",
          size: "16",
          color: "#ff4757"
        })
      } : {
        i: common_vendor.p({
          type: "heart-filled",
          size: "100",
          color: "#e0e0e0"
        }),
        j: common_vendor.o(goHome)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1a2a9709"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/favorites.js.map
