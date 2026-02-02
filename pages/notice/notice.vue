<template>
  <view class="page-bg">
    <view class="notice-container">
      <view class="notice-header">
        <text class="notice-title">📢 公告</text>
      </view>

      <scroll-view class="notice-scroll" scroll-y @scrolltolower="loadMore" :show-scrollbar="false">
        <view class="notice-list">
          <view 
            class="notice-item" 
            v-for="(item, index) in noticeList" 
            :key="item.id"
            @click="goToNoticeDetail(item)"
          >
            <view class="notice-icon-wrapper">
              <text class="notice-type-icon">{{ getTypeIcon(item.type) }}</text>
            </view>
            <view class="notice-content">
              <text class="notice-title">{{ item.title }}</text>
              <text class="notice-time">{{ formatTime(item.create_time) }}</text>
            </view>
          </view>
        </view>
        
        <view class="loading-more" v-if="loading">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>
        
        <view class="no-more" v-if="!hasMore && noticeList.length > 0">
          <text>没有更多了</text>
        </view>
        
        <view class="empty" v-if="noticeList.length === 0 && !loading">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无公告</text>
        </view>
      </scroll-view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNoticeList } from '@/api/user/index.js'

const noticeList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = 10

onMounted(() => {
  loadNotice()
})

async function loadNotice(refresh = false) {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const currentPageNum = refresh ? 1 : pageNum.value
    const res = await getNoticeList('', currentPageNum, pageSize)
    
    if (res && res.list) {
      if (refresh) {
        noticeList.value = res.list
        pageNum.value = 1
      } else {
        noticeList.value = [...noticeList.value, ...res.list]
      }
      
      hasMore.value = res.list.length >= pageSize
    }
  } catch (error) {
    console.error('加载公告失败:', error)
  } finally {
    loading.value = false
  }
}

function goToNoticeDetail(item) {
  uni.navigateTo({
    url: `/pages/notice/detail?id=${item.id}`
  })
}

function loadMore() {
  if (!hasMore.value || loading.value) return
  pageNum.value++
  loadNotice()
}

function getTypeIcon(type) {
  const icons = {
    system: '📢',
    update: '📢',
    activity: '🎉'
  }
  return icons[type] || '📢'
}

function formatTime(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  } else if (diff < 2592000000) {
    return Math.floor(diff / 86400000) + '天前'
  } else {
    return Math.floor(diff / 2592000000) + '月前'
  }
}
</script>

<style lang="scss" scoped>
.page-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  min-height: 100vh;
}

.notice-container {
  min-height: 100vh;
  background: transparent;
}

.notice-header {
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  text-align: center;
}

.notice-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.notice-scroll {
  height: calc(100vh - 200rpx);
}

.notice-list {
  padding: 20rpx 30rpx;
}

.notice-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: translateY(-4rpx);
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
  }
}

.notice-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-type-icon {
  font-size: 40rpx;
}

.notice-content {
  flex: 1;
  padding-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.notice-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.notice-time {
  font-size: 24rpx;
  color: #999;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  gap: 16rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-more,
.empty {
  text-align: center;
  padding: 60rpx 30rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  display: block;
}

.no-more text,
.loading-more text,
.empty text {
  color: #999;
  font-size: 24rpx;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>