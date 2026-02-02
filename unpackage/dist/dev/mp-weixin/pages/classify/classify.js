"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "classify",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const classifyList = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      loadData();
    });
    async function loadData() {
      const res = await api_user_index.getClassifyList();
      classifyList.value = res.classifyList;
    }
    function goToWallpaperList(item) {
      common_vendor.index.navigateTo({
        url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}`
      });
    }
    function goToSearch() {
      common_vendor.index.navigateTo({ url: "/pages/search/search" });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#666"
        }),
        b: common_vendor.o(goToSearch),
        c: statusBarHeight.value + "px",
        d: common_vendor.f(classifyList.value, (item, index, i0) => {
          return {
            a: item.cover_url,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.wall_count),
            d: item.id,
            e: index * 0.05 + "s",
            f: common_vendor.o(($event) => goToWallpaperList(item), item.id)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bcfa975"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/classify/classify.js.map
