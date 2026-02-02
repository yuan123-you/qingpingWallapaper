"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const noticeDetail = common_vendor.ref({});
    const noticeId = common_vendor.ref("");
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      noticeId.value = currentPage.options.id;
      loadNoticeDetail();
    });
    async function loadNoticeDetail() {
      try {
        const res = await api_user_index.getNoticeList();
        if (res && res.noticeList) {
          const notice = res.noticeList.find((item) => item.id === noticeId.value);
          if (notice) {
            noticeDetail.value = notice;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/notice/detail.vue:44", "加载公告详情失败:", error);
      }
    }
    function formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(noticeDetail.value.title || "公告详情"),
        b: common_vendor.t(formatTime(noticeDetail.value.create_time)),
        c: noticeDetail.value.content || "暂无内容",
        d: common_vendor.o(goBack)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f737f11"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/notice/detail.js.map
