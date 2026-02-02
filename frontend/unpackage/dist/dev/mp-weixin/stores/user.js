"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref(null);
  const favorites = common_vendor.ref([]);
  const history = common_vendor.ref([]);
  const token = common_vendor.ref("");
  function initUserInfo() {
    const savedUserInfo = common_vendor.index.getStorageSync("userInfo");
    if (savedUserInfo) {
      userInfo.value = savedUserInfo;
    }
    const savedFavorites = common_vendor.index.getStorageSync("favorites");
    if (savedFavorites) {
      favorites.value = savedFavorites;
    }
    const savedHistory = common_vendor.index.getStorageSync("history");
    if (savedHistory) {
      history.value = savedHistory;
    }
    const savedToken = common_vendor.index.getStorageSync("token");
    if (savedToken) {
      token.value = savedToken;
    }
  }
  function setUserInfo(data) {
    userInfo.value = data;
    common_vendor.index.setStorageSync("userInfo", data);
  }
  function updateAvatar(avatarUrl) {
    if (userInfo.value) {
      userInfo.value.avatarUrl = avatarUrl;
      common_vendor.index.setStorageSync("userInfo", userInfo.value);
    }
  }
  function setFavorites(data) {
    favorites.value = data;
    common_vendor.index.setStorageSync("favorites", data);
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
  function setHistory(data) {
    history.value = data;
    common_vendor.index.setStorageSync("history", data);
  }
  function addHistory(item) {
    const exists = history.value.some((h) => h.id === item.id);
    if (!exists) {
      const historyItem = {
        ...item,
        viewTime: Date.now()
      };
      history.value.unshift(historyItem);
      if (history.value.length > 50) {
        history.value = history.value.slice(0, 50);
      }
      common_vendor.index.setStorageSync("history", history.value);
    }
  }
  function clearHistory() {
    history.value = [];
    common_vendor.index.setStorageSync("history", []);
  }
  function setToken(data) {
    token.value = data;
    common_vendor.index.setStorageSync("token", data);
  }
  function clearToken() {
    token.value = "";
    common_vendor.index.removeStorageSync("token");
  }
  function logout() {
    userInfo.value = null;
    favorites.value = [];
    history.value = [];
    token.value = "";
    common_vendor.index.removeStorageSync("userInfo");
    common_vendor.index.removeStorageSync("favorites");
    common_vendor.index.removeStorageSync("history");
    common_vendor.index.removeStorageSync("token");
  }
  return {
    userInfo,
    favorites,
    history,
    token,
    initUserInfo,
    setUserInfo,
    updateAvatar,
    setFavorites,
    addFavorite,
    removeFavorite,
    setHistory,
    addHistory,
    clearHistory,
    setToken,
    clearToken,
    logout
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
