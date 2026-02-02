<template>
  <view class="container">
    <!-- 沉浸式顶部 -->
    <view class="profile-header">
      <view class="header-inner" :style="{ paddingTop: (statusBarHeight + 10) + 'px' }">
        <view class="user-main">
          <view class="avatar-wrap" @click="handleAvatarClick">
            <!-- 直接使用 userInfo 的属性，因为现在保证了数据层有值 -->
            <image :src="userInfo?.avatarUrl" mode="aspectFill" class="avatar"></image>
            <view class="edit-badge">
              <uni-icons type="camera-filled" size="12" color="#fff"></uni-icons>
            </view>
          </view>
          <view class="info">
            <view class="name-row" @click="showEditName">
              <text class="name">{{ userInfo?.nickname }}</text>
              <uni-icons type="compose" size="16" color="#fff"></uni-icons>
              <view class="level-tag">{{ isLoggedIn ? 'SVIP' : 'GUEST' }}</view>
            </view>
            <text class="bio">{{ userInfo?.bio }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="main-body">
      <!-- 快捷数据 -->
      <view class="data-card">
        <view class="item" @click="goTo('favorites')">
          <text class="num">{{ favorites.length }}</text>
          <text class="label">我的收藏</text>
        </view>
        <view class="line"></view>
        <view class="item" @click="goTo('history')">
          <text class="num">{{ history.length }}</text>
          <text class="label">历史足迹</text>
        </view>
        <view class="line"></view>
        <view class="item" @click="goTo('downloads')">
          <text class="num">{{ downloads?.length || 0 }}</text>
          <text class="label">下载作品</text>
        </view>
      </view>

      <!-- 核心功能栏 -->
      <view class="menu-box">
        <view class="menu-item" @click="randomName">
          <view class="left">
            <view class="m-icon icon-skin"><uni-icons type="loop" size="20" color="#fff"></uni-icons></view>
            <text>随机换个昵称</text>
          </view>
          <uni-icons type="right" size="14" color="#eee"></uni-icons>
        </view>
        


        <view class="menu-item" @click="showAbout">
          <view class="left">
            <view class="m-icon icon-about"><uni-icons type="info-filled" size="20" color="#fff"></uni-icons></view>
            <text>产品服务说明</text>
          </view>
          <uni-icons type="right" size="14" color="#eee"></uni-icons>
        </view>

        <view class="menu-item" @click="showPrivacy">
          <view class="left">
            <view class="m-icon icon-privacy"><uni-icons type="auth-filled" size="20" color="#fff"></uni-icons></view>
            <text>隐私协议</text>
          </view>
          <uni-icons type="right" size="14" color="#eee"></uni-icons>
        </view>
      </view>

      <!-- 系统管理栏 (放在下方) -->
      <view class="menu-box secondary-menu">


        <view class="menu-item" @click="clearLocalCache">
          <view class="left">
            <view class="m-icon icon-clear"><uni-icons type="trash-filled" size="20" color="#fff"></uni-icons></view>
            <text>清理缓存</text>
          </view>
          <view class="right-info">
            <text class="v-tag">{{ cacheSize || '计算中...' }}</text>
            <uni-icons type="right" size="14" color="#eee"></uni-icons>
          </view>
        </view>
        
        <view class="menu-item" v-if="!isLoggedIn" @click="handleWechatLogin">
          <view class="left">
            <view class="m-icon icon-wechat"><uni-icons type="weixin" size="22" color="#fff"></uni-icons></view>
            <text>微信一键登录</text>
          </view>
          <uni-icons type="right" size="14" color="#eee"></uni-icons>
        </view>

        <view class="menu-item" v-else @click="handleLogout">
          <view class="left">
            <view class="m-icon icon-logout"><uni-icons type="refresh-filled" size="20" color="#fff"></uni-icons></view>
            <text style="color: #ff4757;">退出登录</text>
          </view>
          <uni-icons type="right" size="14" color="#eee"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 昵称编辑弹窗 -->
    <uni-popup ref="editPopup" type="dialog">
      <uni-popup-dialog 
        mode="input" 
        title="编辑昵称" 
        :value="userInfo?.nickname"
        placeholder="请输入新昵称" 
        @confirm="confirmName"
      ></uni-popup-dialog>
    </uni-popup>

    <view class="footer-info">
      <text>LightScreen Premium · 视觉探索版</text>
      <text>发现灵感 · 让屏幕更有张力</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const editPopup = ref(null)
const cacheSize = ref('')

const userInfo = computed(() => userStore.userInfo)
const favorites = computed(() => userStore.favorites)
const history = computed(() => userStore.history)
const downloads = computed(() => userStore.downloads)
// 根据 token 判断是否已登录
const isLoggedIn = computed(() => !!userStore.token)

onMounted(() => {
  // 基础初始化
  userStore.initUserInfo()
})

onShow(() => {
  // 核心修复：每次页面显示时，检查并强制写入默认数据到 Storage
  // 如果 store 是空的，或者头像/昵称缺失，立即修复并持久化
  if (!userStore.userInfo || !userStore.userInfo.avatarUrl) {
    const defaultData = {
      nickname: '光影拾荒者',
      avatarUrl: '/static/default_avatar.png',
      bio: '在这个视觉至上的时代，寻找那一抹属于自己的色彩。'
    }
    // 合并现有数据（如果有部分）
    userStore.setUserInfo({
      ...defaultData,
      ...(userStore.userInfo || {})
    })
  }
  updateCacheSize()
})

function updateCacheSize() {
  try {
    const res = uni.getStorageInfoSync()
    const size = res.currentSize // 单位是 KB
    if (size < 1024) {
      cacheSize.value = size + 'KB'
    } else {
      cacheSize.value = (size / 1024).toFixed(2) + 'MB'
    }
  } catch (e) {
    cacheSize.value = '0KB'
  }
}

function goTo(path) {
  uni.navigateTo({ url: `/pages/my/${path}` })
}

function handleAvatarClick() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      userStore.updateAvatar(tempFilePath);
      uni.showToast({ title: '头像更新成功' });
    },
    fail: (err) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '选择图片失败', icon: 'none' });
      }
    }
  });
}

function showEditName() {
  editPopup.value.open()
}

function confirmName(val) {
  if (!val.trim()) return
  userStore.updateNickname(val.trim())
  uni.showToast({ title: '昵称修改成功' })
}

function randomName() {
  const names = [
    '光影拾荒者', '极简主义者', '星辰守望人', '色彩捕手', '梦之边缘', 
    '轻屏雅趣', '墨上花开', '云端漫步者', '时光笔录', '青衫烟雨', 
    '月下独酌', '山河入梦', '听风吟', '半岛铁盒', '橘子汽水', 
    '白茶清欢', '北巷南猫', '浅夏微凉', '此间少年', '暮色微光', '纸短情长'
  ];
  const newName = names[Math.floor(Math.random() * names.length)];
  userStore.updateNickname(newName);
  uni.showToast({ title: `为您匹配：${newName}`, icon: 'none' })
}

function clearLocalCache() {
  uni.showModal({
    title: '清理缓存',
    content: '此操作将清理本地占用的历史记录、浏览足迹等。您的账号登录状态及收藏内容将不受影响，确定清理吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '正在清理缓存...' })
        
        // 模拟清理过程
        setTimeout(() => {
          // 实际操作：清除相关本地存储
          // 为了不让用户掉线，我们保留 token 和 userInfo，只清理其他数据
          const token = uni.getStorageSync('token')
          const userInfo = uni.getStorageSync('userInfo')
          
          uni.clearStorageSync()
          
          // 恢复关键数据
          if (token) uni.setStorageSync('token', token)
          if (userInfo) uni.setStorageSync('userInfo', userInfo)
          
          // 重新初始化 store 状态
          userStore.initUserInfo()
          
          updateCacheSize()
          uni.hideLoading()
          uni.showToast({ title: '清理完成', icon: 'success' })
        }, 800)
      }
    }
  })
}

function handleWechatLogin() {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

function handleLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号并恢复默认设置吗？',
    success: (res) => {
      if (res.confirm) {
        // 重置为默认数据
        const defaultData = {
          nickname: '光影拾荒者',
          avatarUrl: '/static/default_avatar.png',
          bio: '在这个视觉至上的时代，寻找那一抹属于自己的色彩。'
        }
        userStore.setUserInfo(defaultData)
        
        // 核心修复：必须调用 store 方法更新响应式 token，否则 computed 不会刷新
        userStore.setToken('') 
        uni.removeStorageSync('token') // 双重保险
        
        uni.showToast({ title: '已退出' })
      }
    }
  })
}

function showAbout() {
  uni.showModal({
    title: '产品服务说明',
    content: '1. 免责声明：本应用所有壁纸资源均来自公开网络，素材版权归原作者所有。若侵犯您的权益，请联系邮箱：1628973345@qq.com 进行删除（请务必提供图片右下角的 ID，以便我们准确快速定位）。\n2. 关于壁纸：我们致力于挑选高质量视觉作品，覆盖简约、自然、艺术等多种风格。\n3. 壁纸下载：在详情页点击下载即可保存至手机相册，建议在网络环境良好时进行操作。',
    showCancel: false,
    confirmText: '我知道了'
  })
}

function showPrivacy() {
  uni.showModal({
    title: '隐私政策概要',
    content: '本应用非常重视您的隐私。我们仅在本地存储您的收藏偏后和浏览记录，不会上传您的个人数据到任何第三方服务器。您可以随时通过“清理缓存”功能删除所有本地数据。',
    showCancel: false,
    confirmText: '我已阅读'
  })
}
</script>

<style lang="scss" scoped>
.container { min-height: 100vh; background-color: #f8f9fa; }
.profile-header {
  height: 480rpx; background: linear-gradient(135deg, #121212 0%, #2a2a2a 100%); position: relative;
  .header-inner { padding: 30rpx 40rpx;
    .user-main { display: flex; align-items: center; gap: 30rpx; margin-top: 50rpx;
      .avatar-wrap { width: 160rpx; height: 160rpx; position: relative;
        .avatar { width: 100%; height: 100%; border-radius: 50%; border: 6rpx solid rgba(255,255,255,0.15); }
        .edit-badge { position: absolute; right: 4rpx; bottom: 4rpx; width: 40rpx; height: 40rpx; background: $brand-color; border-radius: 50%; @include flex-center; border: 3rpx solid #121212; }
      }
      .info { flex: 1;
        .name-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 16rpx;
          .name { color: #fff; font-size: 44rpx; font-weight: 800; max-width: 300rpx; @include text-ellipsis; }
          .level-tag { font-size: 20rpx; color: #ffd700; background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.4); padding: 0 16rpx; border-radius: 20rpx; font-weight: 900; }
        }
        .bio { color: rgba(255,255,255,0.4); font-size: 24rpx; @include text-ellipsis-2; width: 420rpx; }
      }
    }
  }
}
.main-body { margin-top: -80rpx; padding: 0 30rpx; position: relative; z-index: 10; }
.data-card { background: #fff; border-radius: 40rpx; height: 200rpx; @include flex-center; box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.05); margin-bottom: 30rpx;
  .item { flex: 1; @include flex-center; flex-direction: column; gap: 12rpx;
    .num { font-size: 44rpx; font-weight: 900; color: #1a1a1a; }
    .label { font-size: 24rpx; color: #999; font-weight: 500; }
  }
  .line { width: 2rpx; height: 60rpx; background: #f5f5f5; }
}
.menu-box { background: #fff; border-radius: 40rpx; overflow: hidden; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
  .menu-item { @include flex-between; padding: 40rpx 36rpx; background: #fff; border-bottom: 1rpx solid #f9f9f9; width: 100%; transition: all 0.2s;
    &:active { background: #fdfdfd; transform: scale(0.995); }
    .left { display: flex; align-items: center; gap: 28rpx; text { font-size: 30rpx; color: #333; font-weight: 700; } }
    .m-icon { width: 72rpx; height: 72rpx; border-radius: 24rpx; @include flex-center;
      &.icon-skin { background: #667eea; }
      &.icon-clear { background: #95a5a6; }
      &.icon-about { background: #f39c12; }
      &.icon-share { background: #2ecc71; }
      &.icon-wechat { background: #07c160; }
      &.icon-logout { background: #e74c3c; }
      &.icon-privacy { background: #34495e; }
      &.icon-update { background: #3498db; }
    }
    .right-info { display: flex; align-items: center; gap: 10rpx; }
    .v-tag { font-size: 24rpx; color: #bbb; font-weight: 600; margin-right: 4rpx; }
  }
}
.secondary-menu { margin-top: 30rpx; }
// 移除不再需要的 share-btn 样式

.action-buttons {
  margin-top: 50rpx; display: flex; flex-direction: column; gap: 30rpx;
  
  button {
    height: 110rpx; 
    border-radius: 40rpx; 
    font-size: 30rpx; 
    font-weight: 800; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    border: none;
    &::after { display: none; }
    &:active { transform: scale(0.99); opacity: 0.9; }
  }

  .btn-wechat {
    background: #07c160;
    color: #fff;
    gap: 12rpx;
    box-shadow: 0 10rpx 30rpx rgba(7, 193, 96, 0.25);
  }

  .btn-logout {
    background: #fff;
    color: #ff4757;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03);
  }
}

.footer-info { text-align: center; padding: 100rpx 0; display: flex; flex-direction: column; gap: 12rpx; text { font-size: 22rpx; color: #eee; letter-spacing: 4rpx; font-weight: 800; text-transform: uppercase; } }
</style>