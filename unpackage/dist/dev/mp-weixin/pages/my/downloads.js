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
  __name: "downloads",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const list = common_vendor.computed(() => userStore.downloads);
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=downloads` });
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
            b: item.id,
            c: index * 0.05 + "s",
            d: common_vendor.o(($event) => goToPreview(item), item.id)
          };
        })
      } : {
        h: common_vendor.p({
          type: "download-filled",
          size: "100",
          color: "#e0e0e0"
        }),
        i: common_vendor.o(goHome)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eac953e8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/downloads.js.map
