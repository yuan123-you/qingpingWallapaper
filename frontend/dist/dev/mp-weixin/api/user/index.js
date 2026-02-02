"use strict";
const utils_request = require("../../utils/request.js");
function getBannerList() {
  return utils_request.request.get("/api/user/banner/list");
}
function getNoticeList(type = "") {
  return utils_request.request.get("/api/user/notice/list", { type });
}
function getWallpaperList(params) {
  return utils_request.request.get("/api/user/wallpaper/list", params);
}
function getWallpaperDetail(id) {
  return utils_request.request.get("/api/user/wallpaper/detail", { id });
}
function addUserBehavior(data) {
  return utils_request.request.post("/api/user/behavior/add", data);
}
function getHotSearch() {
  return utils_request.request.get("/api/user/search/hot");
}
function searchWallpaper(params) {
  return utils_request.request.get("/api/user/search", params);
}
exports.addUserBehavior = addUserBehavior;
exports.getBannerList = getBannerList;
exports.getHotSearch = getHotSearch;
exports.getNoticeList = getNoticeList;
exports.getWallpaperDetail = getWallpaperDetail;
exports.getWallpaperList = getWallpaperList;
exports.searchWallpaper = searchWallpaper;
