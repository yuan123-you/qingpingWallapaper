"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
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
      var _a;
      try {
        const res = await api_user_index.getWallpaperDetail(wallpaperId.value);
        if (res && res.wallpaper) {
          wallpaperList.value = [res.wallpaper];
          userStore.addHistory(res.wallpaper);
          await api_user_index.addUserBehavior({
            type: "view",
            wall_id: wallpaperId.value,
            openid: ((_a = userStore.userInfo) == null ? void 0 : _a.openid) || ""
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/preview/preview.vue:104", "加载壁纸失败:", error);
      }
    }
    function handleSwiperChange(e) {
      currentIndex.value = e.detail.current;
    }
    function goBack() {
      common_vendor.index.navigateBack();
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
      var _a;
      if (!userStore.userInfo) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return;
      }
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
          wall_id: currentWallpaper.value.id,
          openid: ((_a = userStore.userInfo) == null ? void 0 : _a.openid) || ""
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
                  var _a;
                  common_vendor.index.showToast({
                    title: "保存成功",
                    icon: "success"
                  });
                  api_user_index.addUserBehavior({
                    type: "download",
                    wall_id: currentWallpaper.value.id,
                    openid: ((_a = userStore.userInfo) == null ? void 0 : _a.openid) || ""
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
        common_vendor.index.__f__("error", "at pages/preview/preview.vue:211", "下载失败:", error);
        common_vendor.index.hideLoading();
      }
    }
    async function handleRating() {
      if (!userStore.userInfo) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return;
      }
      common_vendor.index.showActionSheet({
        itemList: ["5分 - 非常好", "4分 - 很好", "3分 - 一般", "2分 - 较差", "1分 - 很差"],
        success: async (res) => {
          const score = 5 - res.tapIndex;
          try {
            await api_user_index.submitWallpaperScore({
              wall_id: currentWallpaper.value.id,
              score
            });
            common_vendor.index.showToast({
              title: "评分成功",
              icon: "success"
            });
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/preview/preview.vue:247", "评分失败:", error);
            common_vendor.index.showToast({
              title: "评分失败",
              icon: "none"
            });
          }
        }
      });
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
      return {
        a: common_vendor.p({
          type: "left",
          size: "24",
          color: "#fff"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.f(wallpaperList.value, (item, index, i0) => {
          return {
            a: item.pic_url,
            b: common_vendor.o(($event) => handleLongPress(), index),
            c: index
          };
        }),
        d: currentIndex.value,
        e: common_vendor.o(handleSwiperChange),
        f: common_vendor.t(currentWallpaper.value.title || "壁纸"),
        g: common_vendor.f(currentWallpaper.value.tags, (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        h: common_vendor.t(formatNumber(currentWallpaper.value.download_count || 0)),
        i: common_vendor.t(formatNumber(currentWallpaper.value.favorite_count || 0)),
        j: common_vendor.t(isFavorite.value ? "♥" : "♡"),
        k: common_vendor.n(isFavorite.value ? "active" : ""),
        l: common_vendor.o(handleFavorite),
        m: common_vendor.o(handleRating),
        n: common_vendor.o(handleDownload)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2dad6c07"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/preview/preview.js.map
