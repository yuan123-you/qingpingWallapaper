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
  __name: "index",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const bannerList = common_vendor.ref([]);
    const recommendList = common_vendor.ref([]);
    const classifyList = common_vendor.ref([]);
    const noticeList = common_vendor.ref([]);
    const currentBanner = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      loadData();
    });
    async function loadData() {
      try {
        const [banners, walls, categories, notices] = await Promise.all([
          api_user_index.getBannerList(),
          api_user_index.getWallpaperList({ type: "today", pageSize: 12 }),
          api_user_index.getClassifyList(),
          api_user_index.getNoticeList()
        ]);
        bannerList.value = banners.bannerList;
        recommendList.value = walls.list;
        classifyList.value = categories.classifyList;
        noticeList.value = notices.list;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:166", "Data load failed:", error);
      }
    }
    function onBannerChange(e) {
      currentBanner.value = e.detail.current;
    }
    function getNoticeTag(type) {
      const map = {
        "system": "系统",
        "update": "更新",
        "activity": "活动"
      };
      return map[type] || "公告";
    }
    function showNoticeDetail(item) {
      common_vendor.index.showModal({
        title: item.title,
        content: item.content,
        showCancel: false,
        confirmText: "我知道了"
      });
    }
    const handleAction = utils_common.throttle((type, data) => {
      switch (type) {
        case "banner":
          common_vendor.index.navigateTo({ url: data.jump_url });
          break;
        case "random":
          common_vendor.index.navigateTo({ url: `/pages/preview/preview?type=random` });
          break;
        case "hot":
          common_vendor.index.navigateTo({ url: `/pages/wallpaper/list?type=hot` });
          break;
        case "classify":
          common_vendor.index.switchTab({ url: "/pages/classify/classify" });
          break;
        case "today_more":
          common_vendor.index.navigateTo({ url: `/pages/wallpaper/list?type=today` });
          break;
      }
    }, 800);
    function goToPreview(item) {
      common_vendor.index.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=today` });
    }
    function goToSearch() {
      common_vendor.index.navigateTo({ url: "/pages/search/search" });
    }
    function goToClassifyItem(item) {
      common_vendor.index.navigateTo({ url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}` });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: common_vendor.o(goToSearch),
        c: statusBarHeight.value + "px",
        d: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title),
            c: currentBanner.value === index ? 1 : "",
            d: common_vendor.o(($event) => common_vendor.unref(handleAction)("banner", item), item.id),
            e: item.id
          };
        }),
        e: common_vendor.o(onBannerChange),
        f: noticeList.value.length > 0
      }, noticeList.value.length > 0 ? {
        g: common_vendor.p({
          type: "notification-filled",
          size: "18",
          color: "#28b389"
        }),
        h: common_vendor.f(noticeList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(getNoticeTag(item.type)),
            b: common_vendor.n(item.type),
            c: common_vendor.t(item.content),
            d: common_vendor.o(($event) => showNoticeDetail(item), item.id),
            e: item.id
          };
        }),
        i: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        })
      } : {}, {
        j: common_vendor.p({
          type: "refresh",
          size: "24",
          color: "#fff"
        }),
        k: common_vendor.o(($event) => common_vendor.unref(handleAction)("random")),
        l: common_vendor.p({
          type: "fire",
          size: "24",
          color: "#fff"
        }),
        m: common_vendor.o(($event) => common_vendor.unref(handleAction)("hot")),
        n: common_vendor.p({
          type: "list",
          size: "24",
          color: "#fff"
        }),
        o: common_vendor.o(($event) => common_vendor.unref(handleAction)("classify")),
        p: common_vendor.o(($event) => common_vendor.unref(handleAction)("today_more")),
        q: common_vendor.f(recommendList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.score),
            d: item.id,
            e: index * 0.05 + "s",
            f: common_vendor.o(($event) => goToPreview(item), item.id)
          };
        }),
        r: common_vendor.f(classifyList.value, (item, index, i0) => {
          return {
            a: item.cover_url,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.wall_count),
            d: item.id,
            e: common_vendor.o(($event) => goToClassifyItem(item), item.id)
          };
        }),
        s: common_vendor.o((...args) => _ctx.onReachBottom && _ctx.onReachBottom(...args))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
