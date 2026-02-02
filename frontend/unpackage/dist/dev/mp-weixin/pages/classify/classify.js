"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const _sfc_main = {
  __name: "classify",
  setup(__props) {
    const classifyList = common_vendor.ref([]);
    const searchKeyword = common_vendor.ref("");
    common_vendor.onMounted(() => {
      loadClassify();
    });
    async function loadClassify() {
      try {
        const res = await api_user_index.getClassifyList();
        if (res && res.classifyList) {
          classifyList.value = res.classifyList;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/classify/classify.vue:58", "加载分类失败:", error);
      }
    }
    function handleSearch() {
      if (!searchKeyword.value.trim()) {
        loadClassify();
        return;
      }
      classifyList.value = classifyList.value.filter(
        (item) => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    }
    function goToWallpaperList(item) {
      common_vendor.index.navigateTo({
        url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: searchKeyword.value,
        c: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        d: common_vendor.f(classifyList.value, (item, index, i0) => {
          return {
            a: item.cover_url,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.desc || ""),
            d: common_vendor.t(item.wall_count || 0),
            e: index,
            f: common_vendor.o(($event) => goToWallpaperList(item), index)
          };
        }),
        e: classifyList.value.length === 0
      }, classifyList.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bcfa975"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/classify/classify.js.map
