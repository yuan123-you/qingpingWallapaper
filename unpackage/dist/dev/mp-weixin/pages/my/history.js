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
  __name: "history",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const history = common_vendor.computed(() => userStore.history);
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=history` });
    }
    function doClear() {
      common_vendor.index.showModal({
        title: "清空历史",
        content: "确定要删除所有浏览记录吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.clearHistory();
          }
        }
      });
    }
    function formatTime(ts) {
      if (!ts)
        return "";
      const d = new Date(ts);
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "24",
          color: "#1a1a1a"
        }),
        b: common_vendor.o(goBack),
        c: history.value.length
      }, history.value.length ? {
        d: common_vendor.o(doClear)
      } : {}, {
        e: statusBarHeight.value + "px",
        f: history.value.length
      }, history.value.length ? {
        g: common_vendor.f(history.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title),
            c: common_vendor.t(formatTime(item.viewTime)),
            d: "afcf0627-1-" + i0,
            e: item.id + index,
            f: index * 0.05 + "s",
            g: common_vendor.o(($event) => goToPreview(item), item.id + index)
          };
        }),
        h: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        })
      } : {
        i: common_vendor.p({
          type: "calendar",
          size: "100",
          color: "#e0e0e0"
        }),
        j: common_vendor.o(goHome)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-afcf0627"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/history.js.map
