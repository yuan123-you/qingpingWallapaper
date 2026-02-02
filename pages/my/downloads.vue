<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="24" color="#1a1a1a"></uni-icons>
        </view>
        <text class="title">下载记录</text>
        <text class="count" v-if="list.length">{{ list.length }}</text>
        <view class="capsule-placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="main">
      <view class="grid" v-if="list.length">
        <view 
          class="wall-card fade-in-up" 
          v-for="(item, index) in list" 
          :key="item.id"
          :style="{ animationDelay: index * 0.05 + 's' }"
          @click="goToPreview(item)"
        >
          <image :src="item.pic_url" mode="aspectFill"></image>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <view class="empty-icon-box">
          <uni-icons type="download-filled" size="100" color="#e0e0e0"></uni-icons>
        </view>
        <text class="t1">暂无下载记录</text>
        <text class="t2">喜欢的壁纸点击下载，即可保存到这里</text>
        <view class="go-btn" @click="goHome">发现有趣壁纸</view>
      </view>
      
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const list = computed(() => userStore.downloads)

function goBack() { uni.navigateBack() }
function goHome() { uni.switchTab({ url: '/pages/index/index' }) }
function goToPreview(item) { uni.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=downloads` }) }
</script>

<style lang="scss" scoped>
.container { height: 100vh; background: #fff; display: flex; flex-direction: column; }
.header {
  background: #fff; z-index: 10;
  .header-inner {
    height: 88rpx; padding: 0 30rpx; @include flex-between;
    .back-btn { width: 80rpx; @include flex-center; }
    .title { font-size: 34rpx; font-weight: 800; color: #1a1a1a; flex: 1; text-align: center; margin-left: 80rpx; }
    .count { font-size: 24rpx; color: $brand-color; font-weight: 700; margin-right: 20rpx; }
    .capsule-placeholder { width: 180rpx; }
  }
}
.main { flex: 1; }
.grid { padding: 30rpx; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15rpx; }
.wall-card {
  height: 320rpx; border-radius: 20rpx; overflow: hidden; position: relative; background: #f8f9fa;
  image { width: 100%; height: 100%; }
}
.empty-state {
  padding: 200rpx 60rpx; @include flex-center; flex-direction: column;
  .empty-icon-box { margin-bottom: 40rpx; animation: pulse 2s infinite ease-in-out; }
  .t1 { font-size: 32rpx; font-weight: 700; color: #333; }
  .t2 { font-size: 24rpx; color: #999; margin-top: 10rpx; margin-bottom: 60rpx; }
  .go-btn { padding: 20rpx 60rpx; background: $brand-gradient; color: #fff; border-radius: 40rpx; font-size: 28rpx; font-weight: 600; }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
</style>
