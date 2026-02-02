<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="24" color="#1a1a1a"></uni-icons>
        </view>
        <text class="title">浏览历史</text>
        <text class="clear-btn" v-if="history.length" @click="doClear">清空</text>
        <view class="capsule-placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="main">
      <view class="timeline" v-if="history.length">
        <view 
          class="history-card fade-in-up" 
          v-for="(item, index) in history" 
          :key="item.id + index"
          :style="{ animationDelay: index * 0.05 + 's' }"
          @click="goToPreview(item)"
        >
          <view class="time-dot"></view>
          <image :src="item.pic_url" mode="aspectFill" class="thumb"></image>
          <view class="info">
            <text class="name">{{ item.title }}</text>
            <text class="time">{{ formatTime(item.viewTime) }}</text>
          </view>
          <uni-icons type="right" size="14" color="#ccc"></uni-icons>
        </view>
      </view>

      <view class="empty-state" v-else>
        <view class="empty-icon-box">
          <uni-icons type="calendar" size="100" color="#e0e0e0"></uni-icons>
        </view>
        <text class="t1">记忆是空白的</text>
        <text class="t2">你浏览过的壁纸都会出现在这里</text>
        <view class="go-btn" @click="goHome">去逛逛</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const history = computed(() => userStore.history)

function goBack() { uni.navigateBack() }
function goHome() { uni.switchTab({ url: '/pages/index/index' }) }
function goToPreview(item) { uni.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=history` }) }

function doClear() {
  uni.showModal({
    title: '清空历史',
    content: '确定要删除所有浏览记录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.clearHistory()
      }
    }
  })
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}
</script>

<style lang="scss" scoped>
.container { height: 100vh; background: #fff; display: flex; flex-direction: column; }
.header {
  background: #fff; z-index: 10;
  .header-inner {
    height: 88rpx; padding: 0 30rpx; @include flex-between;
    .back-btn { width: 80rpx; @include flex-center; }
    .title { font-size: 34rpx; font-weight: 800; color: #1a1a1a; flex: 1; text-align: center; margin-left: 80rpx; }
    .clear-btn { font-size: 26rpx; color: #999; margin-right: 20rpx; width: 80rpx; text-align: center; }
    .capsule-placeholder { width: 180rpx; }
  }
}
.main { flex: 1; }
.timeline {
  padding: 40rpx; position: relative;
  &::before { content: ''; position: absolute; left: 54rpx; top: 60rpx; bottom: 40rpx; width: 2rpx; background: #eee; }
}
.history-card {
  display: flex; align-items: center; gap: 30rpx; margin-bottom: 40rpx; position: relative;
  background: #fff; padding: 20rpx; border-radius: 24rpx; box-shadow: $shadow-sm;
  .time-dot {
    position: absolute; left: -20rpx; top: 50%; transform: translateY(-50%);
    width: 14rpx; height: 14rpx; background: $brand-color; border-radius: 50%; border: 4rpx solid #fff; z-index: 2;
  }
  .thumb { width: 100rpx; height: 140rpx; border-radius: 12rpx; background: #f8f9fa; }
  .info { flex: 1; .name { font-size: 28rpx; font-weight: 700; color: #333; display: block; margin-bottom: 8rpx; } .time { font-size: 22rpx; color: #999; } }
}
.empty-state {
  padding: 200rpx 60rpx; @include flex-center; flex-direction: column;
  .empty-icon-box { margin-bottom: 40rpx; opacity: 0.8; }
  .t1 { font-size: 32rpx; font-weight: 700; color: #333; }
  .t2 { font-size: 24rpx; color: #999; margin-top: 10rpx; margin-bottom: 60rpx; }
  .go-btn { padding: 20rpx 60rpx; background: $brand-gradient; color: #fff; border-radius: 40rpx; font-size: 28rpx; font-weight: 600; }
}
</style>
