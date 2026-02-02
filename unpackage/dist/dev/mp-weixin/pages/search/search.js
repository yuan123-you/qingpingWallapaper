"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const keyword = common_vendor.ref("");
    const searched = common_vendor.ref(false);
    const results = common_vendor.ref([]);
    const history = common_vendor.ref([]);
    const hotTags = common_vendor.ref(["雪山", "极简", "赛博朋克", "星空", "猫咪", "森林"]);
    common_vendor.onMounted(() => {
      history.value = common_vendor.index.getStorageSync("search_history") || [];
      loadHot();
    });
    async function loadHot() {
      const res = await api_user_index.getHotSearch();
      if (res.list)
        hotTags.value = res.list;
    }
    const doSearch = utils_common.throttle(async () => {
      if (!keyword.value.trim())
        return;
      searched.value = true;
      if (!history.value.includes(keyword.value)) {
        history.value.unshift(keyword.value);
        history.value = history.value.slice(0, 10);
        common_vendor.index.setStorageSync("search_history", history.value);
      }
      const res = await api_user_index.searchWallpaper({ keyword: keyword.value });
      results.value = res.list;
    }, 500);
    function quickSearch(t) {
      keyword.value = t;
      doSearch();
    }
    function clearHistory() {
      history.value = [];
      common_vendor.index.setStorageSync("search_history", []);
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({ url: `/pages/preview/preview?id=${item.id}` });
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
        c: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        d: common_vendor.o((...args) => common_vendor.unref(doSearch) && common_vendor.unref(doSearch)(...args)),
        e: keyword.value,
        f: common_vendor.o(($event) => keyword.value = $event.detail.value),
        g: keyword.value
      }, keyword.value ? {
        h: common_vendor.o(($event) => keyword.value = "")
      } : {}, {
        i: common_vendor.o((...args) => common_vendor.unref(doSearch) && common_vendor.unref(doSearch)(...args)),
        j: statusBarHeight.value + "px",
        k: !searched.value
      }, !searched.value ? common_vendor.e({
        l: history.value.length
      }, history.value.length ? {
        m: common_vendor.o(clearHistory),
        n: common_vendor.p({
          type: "trash",
          size: "16",
          color: "#ccc"
        }),
        o: common_vendor.f(history.value, (h, k0, i0) => {
          return {
            a: common_vendor.t(h),
            b: h,
            c: common_vendor.o(($event) => quickSearch(h), h)
          };
        })
      } : {}, {
        p: common_vendor.f(hotTags.value, (t, k0, i0) => {
          return {
            a: common_vendor.t(t),
            b: t,
            c: common_vendor.o(($event) => quickSearch(t), t)
          };
        })
      }) : common_vendor.e({
        q: results.value.length
      }, results.value.length ? {
        r: common_vendor.f(results.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.score),
            d: item.id,
            e: index * 0.05 + "s",
            f: common_vendor.o(($event) => goToPreview(item), item.id)
          };
        })
      } : {
        s: common_vendor.p({
          type: "info",
          size: "60",
          color: "#eee"
        })
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
