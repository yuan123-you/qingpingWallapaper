<template>
  <view class="page-bg">
    <view class="favorites-container">
      <view class="favorites-header">
        <text class="favorites-title">我的收藏</text>
        <text class="favorites-count">{{ favoritesList.length }}张</text>
      </view>

      <view v-if="favoritesList.length === 0" class="empty-state">
        <text class="empty-icon">♥</text>
        <text class="empty-text">暂无收藏</text>
        <text class="empty-tip">去首页浏览壁纸吧</text>
      </view>

      <view v-else class="favorites-grid">
        <view 
          class="favorites-item" 
          v-for="(item, index) in favoritesList" 
          :key="index"
          @click="goToPreview(item)"
        >
          <image class="favorites-image" :src="item.pic_url" mode="aspectFill"></image>
          <view class="favorites-overlay">
            <text class="favorites-title">{{ item.title || '壁纸' }}</text>
            <view class="favorites-actions">
              <text class="action-btn remove-btn" @click.stop="removeFavorite(item)">✕</text>
            </view>
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

const favoritesList = computed(() => userStore.favorites || [])

onMounted(() => {
  userStore.initUserInfo()
})

function goToPreview(item) {
  uni.navigateTo({
    url: `/pages/preview/preview?id=${item.id}`
  })
}

function removeFavorite(item) {
  uni.showModal({
    title: '提示',
    content: '确定要取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.removeFavorite(item.id)
        uni.showToast({
          title: '已取消收藏',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.favorites-container {
  min-height: 100vh;
  padding: 30rpx;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.favorites-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.favorites-count {
  font-size: 28rpx;
  color: #999;
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
  margin-bottom: 15rpx;
}

.empty-tip {
  font-size: 24rpx;
  color: #ccc;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.favorites-item {
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.favorites-image {
  width: 100%;
  height: 400rpx;
  display: block;
}

.favorites-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.favorites-title {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200rpx;
}

.favorites-actions {
  display: flex;
  gap: 10rpx;
}

.action-btn {
  font-size: 32rpx;
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn {
  color: #ff6b6b;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
