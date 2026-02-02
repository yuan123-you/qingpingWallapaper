"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user_index = require("../../api/user/index.js");
const stores_user = require("../../stores/user.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const pageSize = 10;
const _sfc_main = {
  __name: "preview",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const list = common_vendor.ref([]);
    const totalCount = common_vendor.ref(0);
    const currentSwiperIndex = common_vendor.ref(0);
    const imageLoading = common_vendor.ref({});
    const imageError = common_vendor.ref({});
    const isReady = common_vendor.ref(false);
    const initImageLoading = (total) => {
      const loadingMap = {};
      const errorMap = {};
      for (let i = 0; i < total; i++) {
        loadingMap[i] = true;
        errorMap[i] = false;
      }
      imageLoading.value = loadingMap;
      imageError.value = errorMap;
    };
    const showInfo = common_vendor.ref(false);
    const pageNum = common_vendor.ref(1);
    const hasMore = common_vendor.ref(true);
    const paramsRec = common_vendor.ref({});
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const options = pages[pages.length - 1].options;
      paramsRec.value = {
        id: options.id,
        type: options.type,
        categoryId: options.categoryId
      };
      loadData(true);
    });
    async function loadData(firstLoad = false) {
      if (!hasMore.value && !firstLoad)
        return;
      try {
        const res = await api_user_index.getWallpaperList({
          type: paramsRec.value.type,
          categoryId: paramsRec.value.categoryId,
          pageNum: pageNum.value,
          pageSize
        });
        if (firstLoad) {
          list.value = res.list;
          totalCount.value = res.total;
          initImageLoading(res.total);
          let targetIndex = -1;
          if (paramsRec.value.id) {
            targetIndex = list.value.findIndex((item) => item.id == paramsRec.value.id);
            while (targetIndex === -1 && hasMore.value) {
              pageNum.value++;
              if (list.value.length >= res.total) {
                hasMore.value = false;
                break;
              }
              const nextRes = await api_user_index.getWallpaperList({
                type: paramsRec.value.type,
                categoryId: paramsRec.value.categoryId,
                pageNum: pageNum.value,
                pageSize
              });
              list.value = [...list.value, ...nextRes.list];
              targetIndex = list.value.findIndex((item) => item.id == paramsRec.value.id);
              if (list.value.length >= nextRes.total || nextRes.list.length < pageSize) {
                hasMore.value = false;
              }
            }
            if (targetIndex !== -1) {
              currentSwiperIndex.value = targetIndex;
            }
          }
          isReady.value = true;
        } else {
          const newList = [...list.value, ...res.list];
          list.value = newList;
          res.list.forEach((_, i) => {
            imageLoading.value[list.value.length - res.list.length + i] = true;
            imageError.value[list.value.length - res.list.length + i] = false;
          });
        }
        if (list.value.length >= res.total) {
          hasMore.value = false;
        } else {
          pageNum.value++;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/preview/preview.vue:224", e);
      }
    }
    function getSmallUrl(url) {
      if (url.includes("pexels.com")) {
        return url.split("?")[0] + "?auto=compress&cs=tinysrgb&w=50";
      }
      return url;
    }
    function shouldRender(index) {
      return Math.abs(index - currentSwiperIndex.value) <= 2;
    }
    function onSwiperChange(e) {
      const index = e.detail.current;
      currentSwiperIndex.value = index;
      if (list.value[index]) {
        userStore.addHistory(list.value[index]);
      }
      if (hasMore.value && index >= list.value.length - 2) {
        loadData(false);
      }
    }
    function onImageLoad(index) {
      imageLoading.value = { ...imageLoading.value, [index]: false };
    }
    function onImageError(index) {
      imageLoading.value = { ...imageLoading.value, [index]: false };
      imageError.value = { ...imageError.value, [index]: true };
      common_vendor.index.__f__("error", "at pages/preview/preview.vue:267", `图片 ${index} 加载失败`);
    }
    function retryLoadImage(index, url) {
      imageError.value = { ...imageError.value, [index]: false };
      imageLoading.value = { ...imageLoading.value, [index]: true };
      common_vendor.index.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            onImageLoad(index);
          } else {
            onImageError(index);
          }
        },
        fail: () => {
          onImageError(index);
        }
      });
    }
    function toggleInfo() {
      showInfo.value = !showInfo.value;
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function isFavorite(id) {
      return userStore.favorites.some((f) => f.id === id);
    }
    const handleFavorite = utils_common.throttle((item) => {
      if (isFavorite(item.id)) {
        userStore.removeFavorite(item.id);
        common_vendor.index.showToast({ title: "已取消", icon: "none" });
      } else {
        userStore.addFavorite(item);
        common_vendor.index.showToast({ title: "已收藏" });
      }
    }, 500);
    const handleDownload = utils_common.throttle(async (item) => {
      try {
        common_vendor.index.showLoading({ title: "准备下载...", mask: true });
        await checkAndRequestAuth();
        common_vendor.index.showLoading({ title: "下载中...", mask: true });
        const downloadRes = await common_vendor.index.downloadFile({
          url: item.pic_url,
          timeout: 3e4
        });
        if (downloadRes.statusCode === 200) {
          common_vendor.index.hideLoading();
          const saveImage = () => {
            common_vendor.index.saveImageToPhotosAlbum({
              filePath: downloadRes.tempFilePath,
              success: () => {
                common_vendor.index.showModal({
                  title: "保存成功",
                  content: "壁纸已保存到系统相册，快去设置为壁纸吧~",
                  showCancel: false
                });
                userStore.addDownload(item);
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/preview/preview.vue:345", "保存失败:", err);
                if (err.errMsg && (err.errMsg.includes("auth deny") || err.errMsg.includes("auth denied"))) {
                  common_vendor.index.showModal({
                    title: "需要授权",
                    content: "需要您授权保存相册权限才能下载壁纸",
                    confirmText: "去授权",
                    success: (res) => {
                      if (res.confirm) {
                        common_vendor.index.openSetting({
                          success: (settingRes) => {
                            if (settingRes.authSetting["scope.writePhotosAlbum"]) {
                              saveImage();
                            } else {
                              common_vendor.index.showToast({ title: "未授权，无法保存", icon: "none" });
                            }
                          },
                          fail: () => {
                            common_vendor.index.showToast({ title: "打开设置失败", icon: "none" });
                          }
                        });
                      }
                    }
                  });
                } else {
                  common_vendor.index.showToast({ title: "保存失败: " + (err.errMsg || "未知错误"), icon: "none", duration: 3e3 });
                }
              }
            });
          };
          saveImage();
        } else {
          throw new Error(`下载失败，状态码: ${downloadRes.statusCode}`);
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/preview/preview.vue:381", "下载错误:", err);
        if (err.message === "用户取消" || err.message === "未授权") {
          return;
        }
        let errorMsg = "下载失败";
        if (err.errMsg) {
          if (err.errMsg.includes("fail timeout")) {
            errorMsg = "下载超时，请检查网络";
          } else if (err.errMsg.includes("fail")) {
            errorMsg = "网络错误，请重试";
          } else if (err.errMsg.includes("url not in domain list")) {
            errorMsg = "图片域名未配置，请联系开发者";
          } else if (err.errMsg.includes("fail:download")) {
            errorMsg = "下载失败，请检查网络连接";
          } else {
            errorMsg = err.errMsg;
          }
        }
        common_vendor.index.showToast({ title: errorMsg, icon: "none", duration: 3e3 });
      }
    }, 1e3);
    const checkAndRequestAuth = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getSetting({
          success: (res) => {
            if (res.authSetting["scope.writePhotosAlbum"]) {
              resolve(true);
            } else if (res.authSetting["scope.writePhotosAlbum"] === false) {
              common_vendor.index.showModal({
                title: "需要授权",
                content: "需要您授权保存相册权限才能下载壁纸",
                confirmText: "去授权",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    common_vendor.index.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting["scope.writePhotosAlbum"]) {
                          resolve(true);
                        } else {
                          reject(new Error("未授权"));
                        }
                      },
                      fail: () => {
                        reject(new Error("打开设置失败"));
                      }
                    });
                  } else {
                    reject(new Error("用户取消"));
                  }
                }
              });
            } else {
              common_vendor.index.authorize({
                scope: "scope.writePhotosAlbum",
                success: () => {
                  resolve(true);
                },
                fail: () => {
                  common_vendor.index.showModal({
                    title: "需要授权",
                    content: "需要您授权保存相册权限才能下载壁纸",
                    confirmText: "去授权",
                    success: (modalRes) => {
                      if (modalRes.confirm) {
                        common_vendor.index.openSetting({
                          success: (settingRes) => {
                            if (settingRes.authSetting["scope.writePhotosAlbum"]) {
                              resolve(true);
                            } else {
                              reject(new Error("未授权"));
                            }
                          },
                          fail: () => {
                            reject(new Error("打开设置失败"));
                          }
                        });
                      } else {
                        reject(new Error("用户取消"));
                      }
                    }
                  });
                }
              });
            }
          },
          fail: () => {
            reject(new Error("获取设置失败"));
          }
        });
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isReady.value && list.value.length > 0
      }, isReady.value && list.value.length > 0 ? {
        b: common_vendor.f(list.value, (item, index, i0) => {
          return common_vendor.e({
            a: shouldRender(index) && imageLoading.value[index]
          }, shouldRender(index) && imageLoading.value[index] ? {
            b: getSmallUrl(item.pic_url)
          } : {}, {
            c: shouldRender(index) && !imageError.value[index]
          }, shouldRender(index) && !imageError.value[index] ? {
            d: item.pic_url,
            e: common_vendor.o(($event) => onImageLoad(index), item.id),
            f: common_vendor.o(($event) => onImageError(index), item.id)
          } : {}, {
            g: shouldRender(index) && imageError.value[index]
          }, shouldRender(index) && imageError.value[index] ? {
            h: "2dad6c07-0-" + i0,
            i: common_vendor.p({
              type: "image",
              size: "60",
              color: "#666"
            }),
            j: common_vendor.o(($event) => retryLoadImage(index, item.pic_url), item.id)
          } : {}, {
            k: common_vendor.t(item.id),
            l: shouldRender(index) && imageLoading.value[index]
          }, shouldRender(index) && imageLoading.value[index] ? {} : {}, {
            m: "2dad6c07-1-" + i0,
            n: common_vendor.o(goBack, item.id),
            o: "2dad6c07-2-" + i0,
            p: common_vendor.p({
              type: isFavorite(item.id) ? "heart-filled" : "heart",
              size: "28",
              color: isFavorite(item.id) ? "#ff4757" : "#fff"
            }),
            q: isFavorite(item.id) ? 1 : "",
            r: common_vendor.t(isFavorite(item.id) ? "已收" : "收藏"),
            s: common_vendor.o(($event) => common_vendor.unref(handleFavorite)(item), item.id),
            t: "2dad6c07-3-" + i0,
            v: common_vendor.o(($event) => common_vendor.unref(handleDownload)(item), item.id),
            w: common_vendor.t(item.title),
            x: common_vendor.f(item.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            y: common_vendor.t(item.score),
            z: common_vendor.t(item.description),
            A: common_vendor.o(toggleInfo, item.id),
            B: item.id
          });
        }),
        c: showInfo.value,
        d: showInfo.value,
        e: showInfo.value,
        f: common_vendor.p({
          type: "left",
          size: "24",
          color: "#fff"
        }),
        g: common_vendor.t(currentSwiperIndex.value + 1),
        h: common_vendor.t(totalCount.value),
        i: showInfo.value,
        j: statusBarHeight.value + "px",
        k: common_vendor.p({
          type: "download",
          size: "28",
          color: "#fff"
        }),
        l: showInfo.value,
        m: showInfo.value,
        n: currentSwiperIndex.value,
        o: common_vendor.o(onSwiperChange)
      } : {}, {
        p: common_vendor.o(() => {
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2dad6c07"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/preview/preview.js.map
