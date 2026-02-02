"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    stores_user.useUserStore();
    const bannerList = common_vendor.ref([]);
    const noticeList = common_vendor.ref([]);
    const recommendList = common_vendor.ref([]);
    const classifyList = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      loadData();
    });
    async function loadData() {
      try {
        const [bannerRes, noticeRes] = await Promise.all([
          api_user_index.getBannerList(),
          api_user_index.getNoticeList()
        ]);
        if (bannerRes && bannerRes.bannerList) {
          bannerList.value = bannerRes.bannerList;
        }
        if (noticeRes && noticeRes.list) {
          noticeList.value = noticeRes.list;
        }
        await loadRecommend();
        await loadClassify();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:94", "加载数据失败:", error);
      }
    }
    async function loadRecommend() {
      try {
        const res = await api_user_index.getWallpaperList({
          pageNum: 1,
          pageSize: 10
        });
        if (res && res.list) {
          recommendList.value = res.list;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:109", "加载推荐失败:", error);
      }
    }
    async function loadClassify() {
      try {
        const res = await api_user_index.getClassifyList();
        if (res && res.classifyList) {
          classifyList.value = res.classifyList;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:121", "加载分类失败:", error);
      }
    }
    function handleBannerClick(item) {
      goToPreview(item);
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({
        url: `/pages/preview/preview?id=${item.id}`
      });
    }
    function goToClassify(item) {
      if (item && item.id) {
        common_vendor.index.navigateTo({
          url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}`
        });
      } else {
        common_vendor.index.switchTab({
          url: "/pages/classify/classify"
        });
      }
    }
    function goToWallpaperList() {
      common_vendor.index.navigateTo({
        url: "/pages/wallpaper/list"
      });
    }
    function goToNotice(item) {
      common_vendor.index.navigateTo({
        url: `/pages/notice/detail?id=${item.id}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: index,
            c: common_vendor.o(($event) => handleBannerClick(item), index)
          };
        }),
        b: noticeList.value.length > 0
      }, noticeList.value.length > 0 ? {
        c: common_vendor.f(noticeList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: index,
            c: common_vendor.o(($event) => goToNotice(item), index)
          };
        })
      } : {}, {
        d: common_vendor.o(goToWallpaperList),
        e: common_vendor.f(recommendList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title || "壁纸"),
            c: index,
            d: common_vendor.o(($event) => goToPreview(item), index)
          };
        }),
        f: common_vendor.o(goToClassify),
        g: common_vendor.f(classifyList.value, (item, index, i0) => {
          return {
            a: item.cover_url,
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.o(($event) => goToClassify(item), index)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
