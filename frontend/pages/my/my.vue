<template>
  <view class="page-bg">
    <view class="my-container">
      <view class="user-info">
        <view class="user-avatar" @click="handleAvatarClick">
          <image v-if="userInfo.avatarUrl" class="avatar-image" :src="userInfo.avatarUrl" mode="aspectFill"></image>
          <text v-else class="avatar-placeholder">👤</text>
        </view>
        <view class="user-detail">
          <text class="user-name">{{ userInfo.nickName || '点击登录' }}</text>
          <text class="user-id">ID: {{ userInfo.openid || '---' }}</text>
        </view>
      </view>

      <view class="my-stats">
        <view class="stat-item" @click="goToFavorites">
          <text class="stat-value">{{ favorites.length }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item" @click="goToHistory">
          <text class="stat-value">{{ history.length }}</text>
          <text class="stat-label">浏览</text>
        </view>
      </view>

      <view class="my-menu">
        <view class="menu-item" @click="goToFavorites">
          <view class="menu-item-left">
            <text class="menu-icon">♥</text>
            <text class="menu-title">我的收藏</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToHistory">
          <view class="menu-item-left">
            <text class="menu-icon">🕐</text>
            <text class="menu-title">浏览历史</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="clearHistory">
          <view class="menu-item-left">
            <text class="menu-icon">🗑️</text>
            <text class="menu-title">清除缓存</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="handleLogout" v-if="userInfo.openid">
          <view class="menu-item-left">
            <text class="menu-icon">🚪</text>
            <text class="menu-title">退出登录</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <button class="menu-item" open-type="contact">
          <view class="menu-item-left">
            <text class="menu-icon">💬</text>
            <text class="menu-title">联系客服</text>
          </view>
          <text class="menu-arrow">›</text>
        </button>
      </view>

      <view class="version-info">
        <text>版本 2.0.0</text>
      </view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo || {})
const favorites = computed(() => userStore.favorites || [])
const history = computed(() => userStore.history || [])

onMounted(() => {
  loadUserInfo()
})

function loadUserInfo() {
  if (!userStore.userInfo) {
    userStore.initUserInfo()
  }
}

function handleAvatarClick() {
  if (!userStore.userInfo || !userStore.userInfo.openid) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  } else {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        userStore.updateAvatar(tempFilePath)
        uni.showToast({
          title: '头像更新成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('选择图片失败', err)
      }
    })
  }
}

function goToFavorites() {
  uni.navigateTo({
    url: '/pages/my/favorites'
  })
}

function goToHistory() {
  uni.navigateTo({
    url: '/pages/my/history'
  })
}

function clearHistory() {
  uni.showModal({
    title: '提示',
    content: '确定要清除所有缓存吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.clearHistory()
        uni.showToast({
          title: '清除成功',
          icon: 'success'
        })
      }
    }
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.my-container {
  min-height: 100vh;
  padding: 30rpx;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
  position: relative;
  background: #f0f0f0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-placeholder {
  font-size: 60rpx;
  color: #999;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 24rpx;
  color: #666;
}

.my-stats {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-item {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 48rpx;
  font-weight: 600;
  color: #28b389;
  display: block;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.my-menu {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.menu-icon {
  font-size: 40rpx;
}

.menu-title {
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 40rpx;
  color: #999;
}

.version-info {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
