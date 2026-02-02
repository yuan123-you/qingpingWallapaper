"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "preview",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const wallpaperId = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const wallpaperList = common_vendor.ref([]);
    const isFavorite = common_vendor.computed(() => {
      return userStore.favorites.some((item) => item.id === currentWallpaper.value.id);
    });
    const currentWallpaper = common_vendor.computed(() => {
      return wallpaperList.value[currentIndex.value] || {};
    });
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      wallpaperId.value = currentPage.options.id;
      loadWallpaper();
    });
    async function loadWallpaper() {
      try {
        const res = await api_user_index.getWallpaperDetail(wallpaperId.value);
        if (res && res.wallpaper) {
          wallpaperList.value = [res.wallpaper];
          userStore.addHistory(res.wallpaper);
          await api_user_index.addUserBehavior({
            type: "view",
            wall_id: wallpaperId.value
          });
        }
      } catch (error) {
        console.error("加载壁纸失败:", error);
      }
    }
    function handleSwiperChange(e) {
      currentIndex.value = e.detail.current;
    }
    function handleLongPress(item) {
      common_vendor.index.showActionSheet({
        itemList: ["保存到相册", "收藏"],
        success: (res) => {
          if (res.tapIndex === 0) {
            handleDownload();
          } else if (res.tapIndex === 1) {
            handleFavorite();
          }
        }
      });
    }
    async function handleFavorite() {
      if (isFavorite.value) {
        userStore.removeFavorite(currentWallpaper.value.id);
        common_vendor.index.showToast({
          title: "已取消收藏",
          icon: "success"
        });
      } else {
        userStore.addFavorite(currentWallpaper.value);
        common_vendor.index.showToast({
          title: "收藏成功",
          icon: "success"
        });
        await api_user_index.addUserBehavior({
          type: "favorite",
          wall_id: currentWallpaper.value.id
        });
      }
    }
    async function handleDownload() {
      try {
        common_vendor.index.showLoading({
          title: "下载中..."
        });
        const downloadTask = common_vendor.index.downloadFile({
          url: currentWallpaper.value.pic_url,
          success: (res) => {
            if (res.statusCode === 200) {
              common_vendor.index.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  common_vendor.index.showToast({
                    title: "保存成功",
                    icon: "success"
                  });
                  api_user_index.addUserBehavior({
                    type: "download",
                    wall_id: currentWallpaper.value.id
                  });
                },
                fail: () => {
                  common_vendor.index.showToast({
                    title: "保存失败",
                    icon: "none"
                  });
                }
              });
            }
          },
          fail: () => {
            common_vendor.index.showToast({
              title: "下载失败",
              icon: "none"
            });
          },
          complete: () => {
            common_vendor.index.hideLoading();
          }
        });
      } catch (error) {
        console.error("下载失败:", error);
        common_vendor.index.hideLoading();
      }
    }
    function formatNumber(num) {
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "万";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "k";
      }
      return num.toString();
    }
    onShareAppMessage(() => {
      return {
        title: currentWallpaper.value.title || "精美壁纸",
        path: `/pages/preview/preview?id=${currentWallpaper.value.id}`,
        imageUrl: currentWallpaper.value.pic_url
      };
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(wallpaperList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.o(($event) => handleLongPress(), index),
            c: index
          };
        }),
        b: currentIndex.value,
        c: common_vendor.o(handleSwiperChange, "0f"),
        d: common_vendor.t(currentWallpaper.value.title || "壁纸"),
        e: common_vendor.f(currentWallpaper.value.tags, (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        f: common_vendor.t(formatNumber(currentWallpaper.value.download_count || 0)),
        g: common_vendor.t(formatNumber(currentWallpaper.value.favorite_count || 0)),
        h: common_vendor.t(isFavorite.value ? "♥" : "♡"),
        i: common_vendor.n(isFavorite.value ? "active" : ""),
        j: common_vendor.o(handleFavorite, "33"),
        k: common_vendor.o(handleDownload, "fc")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-adce02db"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
