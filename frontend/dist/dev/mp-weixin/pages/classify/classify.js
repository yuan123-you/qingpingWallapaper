"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const pageSize = 10;
const _sfc_main = {
  __name: "classify",
  setup(__props) {
    const classifyList = common_vendor.ref([]);
    const searchKeyword = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const pageNum = common_vendor.ref(1);
    common_vendor.onMounted(() => {
      loadClassify();
    });
    async function loadClassify(refresh = false) {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const res = await api_user_index.getWallpaperList({
          pageNum: refresh ? 1 : pageNum.value,
          pageSize,
          groupBy: "classify",
          keyword: searchKeyword.value
        });
        if (res && res.list) {
          if (refresh) {
            classifyList.value = res.list;
            pageNum.value = 1;
          } else {
            classifyList.value = [...classifyList.value, ...res.list];
          }
          hasMore.value = res.list.length >= pageSize;
        }
      } catch (error) {
        console.error("加载分类失败:", error);
      } finally {
        loading.value = false;
      }
    }
    function handleSearch() {
      loadClassify(true);
    }
    function goToWallpaperList(item) {
      common_vendor.index.navigateTo({
        url: `/pages/index/index?classifyId=${item.id}`
      });
    }
    function loadMore() {
      if (!hasMore.value || loading.value)
        return;
      pageNum.value++;
      loadClassify();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch, "3d"),
        b: searchKeyword.value,
        c: common_vendor.o(($event) => searchKeyword.value = $event.detail.value, "41"),
        d: common_vendor.f(classifyList.value, (item, index, i0) => {
          return {
            a: item.cover_url,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.desc || ""),
            d: common_vendor.t(item.wall_count),
            e: index,
            f: common_vendor.o(($event) => goToWallpaperList(item), index)
          };
        }),
        e: loading.value
      }, loading.value ? {} : {}, {
        f: !hasMore.value && classifyList.value.length > 0
      }, !hasMore.value && classifyList.value.length > 0 ? {} : {}, {
        g: classifyList.value.length === 0 && !loading.value
      }, classifyList.value.length === 0 && !loading.value ? {} : {}, {
        h: common_vendor.o(loadMore, "96")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1dc03156"]]);
wx.createPage(MiniProgramPage);
