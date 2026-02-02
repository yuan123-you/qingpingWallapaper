"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const pageSize = 10;
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const showSuggestions = common_vendor.ref(false);
    const suggestions = common_vendor.ref([]);
    const hasSearched = common_vendor.ref(false);
    const searchResults = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const pageNum = common_vendor.ref(1);
    const hotSearchList = common_vendor.ref([]);
    const searchHistory = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      loadHotSearch();
      loadSearchHistory();
    });
    async function loadHotSearch() {
      try {
        const res = await api_user_index.getHotSearch();
        if (res && res.hotSearch) {
          hotSearchList.value = res.hotSearch;
        }
      } catch (error) {
        console.error("加载热门搜索失败:", error);
      }
    }
    function loadSearchHistory() {
      searchHistory.value = common_vendor.index.getStorageSync("searchHistory") || [];
    }
    function handleInput(e) {
      const value = e.detail.value;
      if (value.length > 0) {
        showSuggestions.value = true;
        suggestions.value = searchHistory.value.filter(
          (item) => item.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
      } else {
        showSuggestions.value = false;
        suggestions.value = [];
      }
    }
    function handleSearch() {
      if (!searchKeyword.value.trim())
        return;
      hasSearched.value = true;
      showSuggestions.value = false;
      saveSearchHistory(searchKeyword.value);
      loadSearchResults(true);
    }
    function selectSuggestion(item) {
      searchKeyword.value = item;
      handleSearch();
    }
    function selectHotSearch(item) {
      searchKeyword.value = item;
      handleSearch();
    }
    function selectHistory(item) {
      searchKeyword.value = item;
      handleSearch();
    }
    function saveSearchHistory(keyword) {
      const index = searchHistory.value.indexOf(keyword);
      if (index > -1) {
        searchHistory.value.splice(index, 1);
      }
      searchHistory.value.unshift(keyword);
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10);
      }
      common_vendor.index.setStorageSync("searchHistory", searchHistory.value);
    }
    function clearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清空搜索历史吗？",
        success: (res) => {
          if (res.confirm) {
            searchHistory.value = [];
            common_vendor.index.setStorageSync("searchHistory", []);
          }
        }
      });
    }
    async function loadSearchResults(refresh = false) {
      if (loading.value)
        return;
      loading.value = true;
      try {
        const res = await api_user_index.searchWallpaper({
          keyword: searchKeyword.value,
          pageNum: refresh ? 1 : pageNum.value,
          pageSize
        });
        if (res && res.list) {
          if (refresh) {
            searchResults.value = res.list;
            pageNum.value = 1;
          } else {
            searchResults.value = [...searchResults.value, ...res.list];
          }
          hasMore.value = res.list.length >= pageSize;
        }
      } catch (error) {
        console.error("搜索失败:", error);
      } finally {
        loading.value = false;
      }
    }
    function goToPreview(item) {
      common_vendor.index.navigateTo({
        url: `/pages/preview/preview?id=${item.id}`
      });
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function formatNumber(num) {
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "万";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "k";
      }
      return num.toString();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o([($event) => searchKeyword.value = $event.detail.value, handleInput], "61"),
        b: common_vendor.o(handleSearch, "51"),
        c: searchKeyword.value,
        d: common_vendor.o(goBack, "3c"),
        e: showSuggestions.value && suggestions.value.length > 0
      }, showSuggestions.value && suggestions.value.length > 0 ? {
        f: common_vendor.f(suggestions.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => selectSuggestion(item), index)
          };
        })
      } : {}, {
        g: !hasSearched.value && hotSearchList.value.length > 0
      }, !hasSearched.value && hotSearchList.value.length > 0 ? {
        h: common_vendor.f(hotSearchList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => selectHotSearch(item), index)
          };
        })
      } : {}, {
        i: !hasSearched.value && searchHistory.value.length > 0
      }, !hasSearched.value && searchHistory.value.length > 0 ? {
        j: common_vendor.o(clearHistory, "e9"),
        k: common_vendor.f(searchHistory.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => selectHistory(item), index)
          };
        })
      } : {}, {
        l: hasSearched.value
      }, hasSearched.value ? common_vendor.e({
        m: common_vendor.f(searchResults.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.t(item.title || "壁纸"),
            c: common_vendor.t(item.score || "0.0"),
            d: common_vendor.t(formatNumber(item.download_count || 0)),
            e: index,
            f: common_vendor.o(($event) => goToPreview(item), index)
          };
        }),
        n: loading.value
      }, loading.value ? {} : {}, {
        o: !hasMore.value && searchResults.value.length > 0
      }, !hasMore.value && searchResults.value.length > 0 ? {} : {}, {
        p: searchResults.value.length === 0 && !loading.value
      }, searchResults.value.length === 0 && !loading.value ? {} : {}) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cdfa925e"]]);
wx.createPage(MiniProgramPage);
