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
        if (noticeRes && noticeRes.noticeList) {
          noticeList.value = noticeRes.noticeList;
        }
        await loadRecommend();
        await loadClassify();
      } catch (error) {
        console.error("加载数据失败:", error);
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
        console.error("加载推荐失败:", error);
      }
    }
    async function loadClassify() {
      try {
        const res = await api_user_index.getWallpaperList({
          pageNum: 1,
          pageSize: 10,
          groupBy: "classify"
        });
        if (res && res.list) {
          classifyList.value = res.list;
        }
      } catch (error) {
        console.error("加载分类失败:", error);
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
      common_vendor.index.navigateTo({
        url: `/pages/classify/classify?id=${item.id}`
      });
    }
    function goToNotice(item) {
      common_vendor.index.navigateTo({
        url: `/pages/notice/notice?id=${item.id}`
      });
    }
    function refreshRecommend() {
      loadRecommend();
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
        d: common_vendor.o(refreshRecommend, "ae"),
        e: common_vendor.f(recommendList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title || "壁纸"),
            c: index,
            d: common_vendor.o(($event) => goToPreview(item), index)
          };
        }),
        f: common_vendor.f(classifyList.value, (item, index, i0) => {
          return {
            a: item.cover_url,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.wall_count),
            d: index,
            e: common_vendor.o(($event) => goToClassify(item), index)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
