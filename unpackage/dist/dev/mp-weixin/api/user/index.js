"use strict";
const common_vendor = require("../../common/vendor.js");
const api_mockData = require("../mockData.js");
const CACHE_KEY_TODAY = "lightscreen_today_cache";
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));
async function getClassifyList() {
  await delay();
  return {
    classifyList: api_mockData.categories
  };
}
async function getBannerList() {
  await delay();
  return {
    bannerList: api_mockData.banners
  };
}
async function getNoticeList(type = "", pageNum = 1, pageSize = 10) {
  await delay();
  return {
    list: api_mockData.notices
  };
}
async function getWallpaperList(params = {}) {
  await delay();
  let list = [...api_mockData.wallpapers];
  if (params.type === "favorites") {
    const saved = common_vendor.index.getStorageSync("favorites") || [];
    list = saved;
  } else if (params.type === "history") {
    const saved = common_vendor.index.getStorageSync("history") || [];
    list = saved;
  } else if (params.type === "downloads") {
    const saved = common_vendor.index.getStorageSync("downloads") || [];
    list = saved;
  } else if (params.type === "banner") {
    list = api_mockData.banners.map((b) => ({
      id: b.id,
      pic_url: b.pic_url,
      title: b.title,
      score: "9.9",
      description: "轮播精选壁纸"
    }));
  } else if (params.categoryId) {
    list = list.filter((item) => item.category_id === Number(params.categoryId));
  }
  if (params.type === "hot") {
    list = [...list].sort((a, b) => b.score - a.score);
  } else if (params.type === "today") {
    const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" });
    const cachedData = common_vendor.index.getStorageSync(CACHE_KEY_TODAY);
    if (cachedData && cachedData.date === todayStr && cachedData.list && cachedData.list.length > 0) {
      list = cachedData.list;
    } else {
      const shuffled = [...api_mockData.wallpapers].sort(() => Math.random() - 0.5);
      list = shuffled.slice(0, 12);
      common_vendor.index.setStorageSync(CACHE_KEY_TODAY, {
        date: todayStr,
        list
      });
    }
  } else if (params.type === "random") {
    list = [...list].sort(() => Math.random() - 0.5);
  }
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 12;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const safeList = list.slice(Math.max(0, start), Math.min(list.length, end));
  return {
    list: safeList,
    total: list.length
  };
}
async function getHotSearch() {
  await delay();
  return {
    list: api_mockData.hotSearch
  };
}
async function searchWallpaper(params) {
  await delay();
  const keyword = params.keyword ? params.keyword.toLowerCase() : "";
  const list = api_mockData.wallpapers.filter(
    (item) => item.title.toLowerCase().includes(keyword) || item.tags.some((tag) => tag.toLowerCase().includes(keyword))
  );
  return {
    list
  };
}
exports.getBannerList = getBannerList;
exports.getClassifyList = getClassifyList;
exports.getHotSearch = getHotSearch;
exports.getNoticeList = getNoticeList;
exports.getWallpaperList = getWallpaperList;
exports.searchWallpaper = searchWallpaper;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/api/user/index.js.map
