"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const defaultUserInfo = {
    nickname: "光影拾荒者",
    avatarUrl: "/static/default_avatar.png",
    bio: "在这个视觉至上的时代，寻找那一抹属于自己的色彩。"
  };
  const userInfo = common_vendor.ref(null);
  const favorites = common_vendor.ref([]);
  const history = common_vendor.ref([]);
  const downloads = common_vendor.ref([]);
  const token = common_vendor.ref("");
  function initUserInfo() {
    const savedUserInfo = common_vendor.index.getStorageSync("userInfo");
    if (savedUserInfo) {
      userInfo.value = {
        ...defaultUserInfo,
        ...savedUserInfo
      };
      if (!userInfo.value.avatarUrl || userInfo.value.avatarUrl.includes("unsplash")) {
        userInfo.value.avatarUrl = defaultUserInfo.avatarUrl;
      }
      common_vendor.index.setStorageSync("userInfo", userInfo.value);
    } else {
      userInfo.value = { ...defaultUserInfo };
      common_vendor.index.setStorageSync("userInfo", userInfo.value);
    }
    const savedFavorites = common_vendor.index.getStorageSync("favorites");
    if (savedFavorites)
      favorites.value = savedFavorites;
    const savedHistory = common_vendor.index.getStorageSync("history");
    if (savedHistory)
      history.value = savedHistory;
    const savedDownloads = common_vendor.index.getStorageSync("downloads");
    if (savedDownloads)
      downloads.value = savedDownloads;
    const savedToken = common_vendor.index.getStorageSync("token");
    if (savedToken)
      token.value = savedToken;
  }
  function setUserInfo(data) {
    const newData = { ...userInfo.value || defaultUserInfo, ...data };
    userInfo.value = newData;
    common_vendor.index.setStorageSync("userInfo", newData);
  }
  function updateAvatar(avatarUrl) {
    if (userInfo.value) {
      userInfo.value.avatarUrl = avatarUrl;
      common_vendor.index.setStorageSync("userInfo", userInfo.value);
    }
  }
  function updateNickname(nickname) {
    if (userInfo.value) {
      userInfo.value.nickname = nickname;
      common_vendor.index.setStorageSync("userInfo", userInfo.value);
    }
  }
  function addFavorite(item) {
    const exists = favorites.value.some((fav) => fav.id === item.id);
    if (!exists) {
      favorites.value.unshift(item);
      common_vendor.index.setStorageSync("favorites", favorites.value);
    }
  }
  function removeFavorite(id) {
    favorites.value = favorites.value.filter((fav) => fav.id !== id);
    common_vendor.index.setStorageSync("favorites", favorites.value);
  }
  function addHistory(item) {
    const index = history.value.findIndex((h) => h.id === item.id);
    if (index !== -1)
      history.value.splice(index, 1);
    const historyItem = { ...item, viewTime: Date.now() };
    history.value.unshift(historyItem);
    if (history.value.length > 50)
      history.value = history.value.slice(0, 50);
    common_vendor.index.setStorageSync("history", history.value);
  }
  function clearHistory() {
    history.value = [];
    common_vendor.index.setStorageSync("history", []);
  }
  function addDownload(item) {
    const exists = downloads.value.some((d) => d.id === item.id);
    if (!exists) {
      downloads.value.unshift(item);
      common_vendor.index.setStorageSync("downloads", downloads.value);
    }
  }
  function setToken(data) {
    token.value = data;
    common_vendor.index.setStorageSync("token", data);
  }
  function logout() {
    token.value = "";
    common_vendor.index.removeStorageSync("token");
  }
  return {
    userInfo,
    favorites,
    history,
    downloads,
    token,
    initUserInfo,
    setUserInfo,
    updateAvatar,
    updateNickname,
    addFavorite,
    removeFavorite,
    addHistory,
    clearHistory,
    addDownload,
    setToken,
    logout
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
