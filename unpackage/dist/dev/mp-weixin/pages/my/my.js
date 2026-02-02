"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const statusBarHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().statusBarHeight || 20);
    const editPopup = common_vendor.ref(null);
    const cacheSize = common_vendor.ref("");
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const favorites = common_vendor.computed(() => userStore.favorites);
    const history = common_vendor.computed(() => userStore.history);
    const downloads = common_vendor.computed(() => userStore.downloads);
    const isLoggedIn = common_vendor.computed(() => !!userStore.token);
    common_vendor.onMounted(() => {
      userStore.initUserInfo();
    });
    common_vendor.onShow(() => {
      if (!userStore.userInfo || !userStore.userInfo.avatarUrl) {
        const defaultData = {
          nickname: "光影拾荒者",
          avatarUrl: "/static/default_avatar.png",
          bio: "在这个视觉至上的时代，寻找那一抹属于自己的色彩。"
        };
        userStore.setUserInfo({
          ...defaultData,
          ...userStore.userInfo || {}
        });
      }
      updateCacheSize();
    });
    function updateCacheSize() {
      try {
        const res = common_vendor.index.getStorageInfoSync();
        const size = res.currentSize;
        if (size < 1024) {
          cacheSize.value = size + "KB";
        } else {
          cacheSize.value = (size / 1024).toFixed(2) + "MB";
        }
      } catch (e) {
        cacheSize.value = "0KB";
      }
    }
    function goTo(path) {
      common_vendor.index.navigateTo({ url: `/pages/my/${path}` });
    }
    function handleAvatarClick() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          userStore.updateAvatar(tempFilePath);
          common_vendor.index.showToast({ title: "头像更新成功" });
        },
        fail: (err) => {
          if (err.errMsg && !err.errMsg.includes("cancel")) {
            common_vendor.index.showToast({ title: "选择图片失败", icon: "none" });
          }
        }
      });
    }
    function showEditName() {
      editPopup.value.open();
    }
    function confirmName(val) {
      if (!val.trim())
        return;
      userStore.updateNickname(val.trim());
      common_vendor.index.showToast({ title: "昵称修改成功" });
    }
    function randomName() {
      const names = [
        "光影拾荒者",
        "极简主义者",
        "星辰守望人",
        "色彩捕手",
        "梦之边缘",
        "轻屏雅趣",
        "墨上花开",
        "云端漫步者",
        "时光笔录",
        "青衫烟雨",
        "月下独酌",
        "山河入梦",
        "听风吟",
        "半岛铁盒",
        "橘子汽水",
        "白茶清欢",
        "北巷南猫",
        "浅夏微凉",
        "此间少年",
        "暮色微光",
        "纸短情长"
      ];
      const newName = names[Math.floor(Math.random() * names.length)];
      userStore.updateNickname(newName);
      common_vendor.index.showToast({ title: `为您匹配：${newName}`, icon: "none" });
    }
    function clearLocalCache() {
      common_vendor.index.showModal({
        title: "清理缓存",
        content: "此操作将清理本地占用的历史记录、浏览足迹等。您的账号登录状态及收藏内容将不受影响，确定清理吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "正在清理缓存..." });
            setTimeout(() => {
              const token = common_vendor.index.getStorageSync("token");
              const userInfo2 = common_vendor.index.getStorageSync("userInfo");
              common_vendor.index.clearStorageSync();
              if (token)
                common_vendor.index.setStorageSync("token", token);
              if (userInfo2)
                common_vendor.index.setStorageSync("userInfo", userInfo2);
              userStore.initUserInfo();
              updateCacheSize();
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "清理完成", icon: "success" });
            }, 800);
          }
        }
      });
    }
    function handleWechatLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "确定要退出当前账号并恢复默认设置吗？",
        success: (res) => {
          if (res.confirm) {
            const defaultData = {
              nickname: "光影拾荒者",
              avatarUrl: "/static/default_avatar.png",
              bio: "在这个视觉至上的时代，寻找那一抹属于自己的色彩。"
            };
            userStore.setUserInfo(defaultData);
            userStore.setToken("");
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.showToast({ title: "已退出" });
          }
        }
      });
    }
    function showAbout() {
      common_vendor.index.showModal({
        title: "产品服务说明",
        content: "1. 免责声明：本应用所有壁纸资源均来自公开网络，素材版权归原作者所有。若侵犯您的权益，请联系邮箱：1628973345@qq.com 进行删除（请务必提供图片右下角的 ID，以便我们准确快速定位）。\n2. 关于壁纸：我们致力于挑选高质量视觉作品，覆盖简约、自然、艺术等多种风格。\n3. 壁纸下载：在详情页点击下载即可保存至手机相册，建议在网络环境良好时进行操作。",
        showCancel: false,
        confirmText: "我知道了"
      });
    }
    function showPrivacy() {
      common_vendor.index.showModal({
        title: "隐私政策概要",
        content: "本应用非常重视您的隐私。我们仅在本地存储您的收藏偏后和浏览记录，不会上传您的个人数据到任何第三方服务器。您可以随时通过“清理缓存”功能删除所有本地数据。",
        showCancel: false,
        confirmText: "我已阅读"
      });
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: (_a = userInfo.value) == null ? void 0 : _a.avatarUrl,
        b: common_vendor.p({
          type: "camera-filled",
          size: "12",
          color: "#fff"
        }),
        c: common_vendor.o(handleAvatarClick),
        d: common_vendor.t((_b = userInfo.value) == null ? void 0 : _b.nickname),
        e: common_vendor.p({
          type: "compose",
          size: "16",
          color: "#fff"
        }),
        f: common_vendor.t(isLoggedIn.value ? "SVIP" : "GUEST"),
        g: common_vendor.o(showEditName),
        h: common_vendor.t((_c = userInfo.value) == null ? void 0 : _c.bio),
        i: statusBarHeight.value + 10 + "px",
        j: common_vendor.t(favorites.value.length),
        k: common_vendor.o(($event) => goTo("favorites")),
        l: common_vendor.t(history.value.length),
        m: common_vendor.o(($event) => goTo("history")),
        n: common_vendor.t(((_d = downloads.value) == null ? void 0 : _d.length) || 0),
        o: common_vendor.o(($event) => goTo("downloads")),
        p: common_vendor.p({
          type: "loop",
          size: "20",
          color: "#fff"
        }),
        q: common_vendor.p({
          type: "right",
          size: "14",
          color: "#eee"
        }),
        r: common_vendor.o(randomName),
        s: common_vendor.p({
          type: "info-filled",
          size: "20",
          color: "#fff"
        }),
        t: common_vendor.p({
          type: "right",
          size: "14",
          color: "#eee"
        }),
        v: common_vendor.o(showAbout),
        w: common_vendor.p({
          type: "auth-filled",
          size: "20",
          color: "#fff"
        }),
        x: common_vendor.p({
          type: "right",
          size: "14",
          color: "#eee"
        }),
        y: common_vendor.o(showPrivacy),
        z: common_vendor.p({
          type: "trash-filled",
          size: "20",
          color: "#fff"
        }),
        A: common_vendor.t(cacheSize.value || "计算中..."),
        B: common_vendor.p({
          type: "right",
          size: "14",
          color: "#eee"
        }),
        C: common_vendor.o(clearLocalCache),
        D: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        E: common_vendor.p({
          type: "weixin",
          size: "22",
          color: "#fff"
        }),
        F: common_vendor.p({
          type: "right",
          size: "14",
          color: "#eee"
        }),
        G: common_vendor.o(handleWechatLogin)
      } : {
        H: common_vendor.p({
          type: "refresh-filled",
          size: "20",
          color: "#fff"
        }),
        I: common_vendor.p({
          type: "right",
          size: "14",
          color: "#eee"
        }),
        J: common_vendor.o(handleLogout)
      }, {
        K: common_vendor.o(confirmName),
        L: common_vendor.p({
          mode: "input",
          title: "编辑昵称",
          value: (_e = userInfo.value) == null ? void 0 : _e.nickname,
          placeholder: "请输入新昵称"
        }),
        M: common_vendor.sr(editPopup, "2f1ef635-14", {
          "k": "editPopup"
        }),
        N: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
