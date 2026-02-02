"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const pageSize = 20;
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const classifyId = common_vendor.ref("");
    const classifyName = common_vendor.ref("");
    const wallpaperList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const pageNum = common_vendor.ref(1);
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      classifyId.value = currentPage.options.id || "";
      classifyName.value = currentPage.options.name || "";
      loadWallpaperList();
    });
    async function loadWallpaperList(refresh = false) {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const params = {
          pageNum: refresh ? 1 : pageNum.value,
          pageSize
        };
        if (classifyId.value) {
          params.class_id = classifyId.value;
        }
        const res = await api_user_index.getWallpaperList(params);
        if (res && res.list) {
          if (refresh) {
            wallpaperList.value = res.list;
            pageNum.value = 1;
          } else {
            wallpaperList.value = [...wallpaperList.value, ...res.list];
          }
          hasMore.value = res.list.length >= pageSize;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/wallpaper/list.vue:93", "加载壁纸列表失败:", error);
      } finally {
        loading.value = false;
      }
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({
        url: `/pages/preview/preview?id=${item.id}`
      });
    }
    function loadMore() {
      if (!hasMore.value || loading.value)
        return;
      pageNum.value++;
      loadWallpaperList();
    }
    function formatNumber(num) {
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "万";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "k";
      }
      return num.toString();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(classifyName.value || "壁纸列表"),
        b: common_vendor.t(wallpaperList.value.length),
        c: common_vendor.f(wallpaperList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title || "壁纸"),
            c: common_vendor.t(item.score || "0.0"),
            d: common_vendor.t(formatNumber(item.download_count || 0)),
            e: index,
            f: common_vendor.o(($event) => goToPreview(item), index)
          };
        }),
        d: loading.value
      }, loading.value ? {} : {}, {
        e: !hasMore.value && wallpaperList.value.length > 0
      }, !hasMore.value && wallpaperList.value.length > 0 ? {} : {}, {
        f: wallpaperList.value.length === 0 && !loading.value
      }, wallpaperList.value.length === 0 && !loading.value ? {} : {}, {
        g: common_vendor.o(loadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-788c456f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wallpaper/list.js.map
