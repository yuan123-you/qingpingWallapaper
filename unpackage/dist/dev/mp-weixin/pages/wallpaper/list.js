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
const pageSize = 10;
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const classifyId = common_vendor.ref("");
    const classifyName = common_vendor.ref("");
    const type = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const pageNum = common_vendor.ref(1);
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const options = pages[pages.length - 1].options;
      classifyId.value = options.id || "";
      classifyName.value = options.name || "";
      type.value = options.type || "";
      loadData(true);
    });
    async function loadData(reload = false) {
      if (loading.value)
        return;
      if (reload) {
        pageNum.value = 1;
        hasMore.value = true;
        list.value = [];
      }
      if (!hasMore.value)
        return;
      loading.value = true;
      try {
        const res = await api_user_index.getWallpaperList({
          categoryId: classifyId.value,
          type: type.value,
          pageNum: pageNum.value,
          pageSize
        });
        if (pageNum.value === 1) {
          list.value = res.list;
        } else {
          list.value = [...list.value, ...res.list];
        }
        if (list.value.length >= res.total || res.list.length < pageSize) {
          hasMore.value = false;
        } else {
          pageNum.value++;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/wallpaper/list.vue:115", "Loader error:", e);
      } finally {
        loading.value = false;
      }
    }
    function loadMore() {
      if (!loading.value && hasMore.value) {
        loadData();
      }
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({
        url: `/pages/preview/preview?id=${item.id}&type=${type.value}&categoryId=${classifyId.value}`
      });
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "24",
          color: "#1a1a1a"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.t(classifyName.value || (type.value === "hot" ? "热门排行" : "发现壁纸")),
        d: statusBarHeight.value + "px",
        e: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.score),
            d: item.id,
            e: index % 10 * 0.05 + "s",
            f: common_vendor.o(($event) => goToPreview(item), item.id)
          };
        }),
        f: loading.value
      }, loading.value ? {} : {}, {
        g: !hasMore.value && list.value.length > 0
      }, !hasMore.value && list.value.length > 0 ? {} : {}, {
        h: !loading.value && list.value.length === 0
      }, !loading.value && list.value.length === 0 ? {} : {}, {
        i: common_vendor.o(loadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-788c456f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wallpaper/list.js.map
