"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const pageSize = 10;
const _sfc_main = {
  __name: "notice",
  setup(__props) {
    const noticeList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const pageNum = common_vendor.ref(1);
    common_vendor.onMounted(() => {
      loadNotice();
    });
    async function loadNotice(refresh = false) {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const currentPageNum = refresh ? 1 : pageNum.value;
        const res = await api_user_index.getNoticeList("", currentPageNum, pageSize);
        if (res && res.list) {
          if (refresh) {
            noticeList.value = res.list;
            pageNum.value = 1;
          } else {
            noticeList.value = [...noticeList.value, ...res.list];
          }
          hasMore.value = res.list.length >= pageSize;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/notice/notice.vue:68", "加载公告失败:", error);
      } finally {
        loading.value = false;
      }
    }
    function goToNoticeDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/notice/detail?id=${item.id}`
      });
    }
    function loadMore() {
      if (!hasMore.value || loading.value)
        return;
      pageNum.value++;
      loadNotice();
    }
    function formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      } else if (diff < 36e5) {
        return `${Math.floor(diff / 6e4)}分钟前`;
      } else if (diff < 864e5) {
        return `${Math.floor(diff / 36e5)}小时前`;
      } else if (diff < 2592e6) {
        return `${Math.floor(diff / 864e5)}天前`;
      } else {
        return `${Math.floor(diff / 2592e6)}个月前`;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(noticeList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(formatTime(item.create_time)),
            c: index,
            d: common_vendor.o(($event) => goToNoticeDetail(item), index)
          };
        }),
        b: loading.value
      }, loading.value ? {} : {}, {
        c: !hasMore.value && noticeList.value.length > 0
      }, !hasMore.value && noticeList.value.length > 0 ? {} : {}, {
        d: noticeList.value.length === 0 && !loading.value
      }, noticeList.value.length === 0 && !loading.value ? {} : {}, {
        e: common_vendor.o(loadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1c2e4c1e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notice/notice.js.map
