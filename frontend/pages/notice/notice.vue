<template>
  <view class="page-bg">
    <view class="notice-container">
      <scroll-view class="notice-scroll" scroll-y @scrolltolower="loadMore">
        <view class="notice-list">
          <view 
            class="notice-item" 
            v-for="(item, index) in noticeList" 
            :key="index"
            @click="goToNoticeDetail(item)"
          >
            <text class="notice-title">{{ item.title }}</text>
            <text class="notice-time">{{ formatTime(item.create_time) }}</text>
          </view>
        </view>
        
        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        
        <view class="no-more" v-if="!hasMore && noticeList.length > 0">
          <text>没有更多了</text>
        </view>
        
        <view class="empty" v-if="noticeList.length === 0 && !loading">
          <text>暂无公告</text>
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
  } else if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return `${Math.floor(diff / 2592000000)}个月前`
  }
}
</script>

<style lang="scss" scoped>
.notice-container {
  min-height: 100vh;
  background: #fff;
}

.notice-scroll {
  height: calc(100vh - 200rpx);
}

.notice-list {
  padding: 20rpx 30rpx;
}

.notice-item {
  padding: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.notice-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.notice-time {
  font-size: 24rpx;
  color: #999;
}

.loading-more,
.no-more,
.empty {
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
