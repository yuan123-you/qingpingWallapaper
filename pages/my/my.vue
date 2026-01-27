<template>
  <view class="page-bg">
    <view class="my-container">
      <view class="user-info">
        <image class="user-avatar" :src="userInfo.avatarUrl || '/static/images/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-detail">
          <text class="user-name">{{ userInfo.nickName || '未登录' }}</text>
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
        <view class="menu-item" @click="contactService">
          <view class="menu-item-left">
            <text class="menu-icon">💬</text>
            <text class="menu-title">联系客服</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="showAdminEntry">
          <view class="menu-item-left">
            <text class="menu-icon">⚙️</text>
            <text class="menu-title">设置</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <view class="version-info">
        <text>版本 2.0.0</text>
      </view>
    </view>
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
    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        userStore.setUserInfo(res.userInfo)
      },
      fail: () => {
        console.log('获取用户信息失败')
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

function contactService() {
  uni.showModal({
    title: '联系客服',
    content: '客服微信：qingping_service',
    showCancel: false
  })
}

function showAdminEntry() {
  uni.showModal({
    title: '管理员入口',
    content: '请输入管理员密码',
    editable: true,
    placeholderText: '请输入密码',
    success: (res) => {
      if (res.confirm && res.content) {
        if (res.content === 'admin123') {
          uni.navigateTo({
            url: '/pages/admin/login'
          })
        } else {
          uni.showToast({
            title: '密码错误',
            icon: 'none'
          })
        }
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
  border-radius: $border-radius-lg;
  margin-bottom: 30rpx;
  box-shadow: $box-shadow-base;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 24rpx;
  color: $text-secondary;
}

.my-stats {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-item {
  flex: 1;
  background: #fff;
  border-radius: $border-radius-lg;
  padding: 30rpx;
  text-align: center;
  box-shadow: $box-shadow-base;
}

.stat-value {
  font-size: 48rpx;
  font-weight: 600;
  color: $brand-primary;
  display: block;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: $text-secondary;
}

.my-menu {
  background: #fff;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $box-shadow-base;
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
  color: $text-primary;
}

.menu-arrow {
  font-size: 40rpx;
  color: $text-tertiary;
}

.version-info {
  text-align: center;
  padding: 30rpx;
  color: $text-tertiary;
  font-size: 24rpx;
}
</style>