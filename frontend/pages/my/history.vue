<template>
  <view class="page-bg">
    <view class="history-container">
      <view class="history-header">
        <text class="history-title">浏览历史</text>
        <text class="history-clear" @click="handleClearHistory">清空</text>
      </view>

      <view v-if="historyList.length === 0" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无浏览记录</text>
      </view>

      <view v-else class="history-list">
        <view 
          class="history-item" 
          v-for="(item, index) in historyList" 
          :key="index"
          @click="goToPreview(item)"
        >
          <image class="history-image" :src="item.pic_url" mode="aspectFill"></image>
          <view class="history-info">
            <text class="history-name">{{ item.title || '壁纸' }}</text>
            <text class="history-time">{{ formatTime(item.viewTime) }}</text>
          </view>
          <view class="history-actions">
            <text class="action-btn favorite-btn" @click.stop="toggleFavorite(item)">
              {{ isFavorite(item.id) ? '♥' : '♡' }}
            </text>
          </view>
        </view>
      </view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const historyList = computed(() => userStore.history || [])

onMounted(() => {
  userStore.initUserInfo()
})

function goToPreview(item) {
  uni.navigateTo({
    url: `/pages/preview/preview?id=${item.id}`
  })
}

function handleClearHistory() {
  uni.showModal({
    title: '提示',
    content: '确定要清空所有浏览记录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.clearHistory()
        uni.showToast({
          title: '清空成功',
          icon: 'success'
        })
      }
    }
  })
}

function toggleFavorite(item) {
  if (isFavorite(item.id)) {
    userStore.removeFavorite(item.id)
    uni.showToast({
      title: '已取消收藏',
      icon: 'none'
    })
  } else {
    userStore.addFavorite(item)
    uni.showToast({
      title: '已收藏',
      icon: 'success'
    })
  }
}

function isFavorite(id) {
  return userStore.favorites.some(fav => fav.id === id)
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return `${date.getMonth() + 1}-${date.getDate()}`
  }
}
</script>

<style lang="scss" scoped>
.history-container {
  min-height: 100vh;
  padding: 30rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.history-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.history-clear {
  font-size: 28rpx;
  color: #28b389;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.history-image {
  width: 120rpx;
  height: 180rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.history-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300rpx;
}

.history-time {
  font-size: 24rpx;
  color: #999;
}

.history-actions {
  display: flex;
  gap: 10rpx;
}

.action-btn {
  font-size: 40rpx;
  padding: 10rpx;
}

.favorite-btn {
  color: #ff6b6b;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
