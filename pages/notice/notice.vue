<template>
  <view class="page-bg">
    <view class="notice-container">
      <view class="notice-header">
        <text class="notice-title">公告</text>
      </view>

      <scroll-view class="notice-scroll" scroll-y>
        <view class="notice-list">
          <view 
            class="notice-item" 
            v-for="(item, index) in noticeList" 
            :key="index"
            @click="showNoticeDetail(item)"
          >
            <view class="notice-item-header">
              <view class="notice-type" :class="item.type">
                <text>{{ item.type === 'system' ? '系统' : '活动' }}</text>
              </view>
              <text class="notice-time">{{ formatRelativeTime(item.create_time) }}</text>
            </view>
            <text class="notice-item-title">{{ item.title }}</text>
            <text class="notice-item-desc">{{ item.content }}</text>
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
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNoticeList } from '@/api/user/index.js'
import { formatRelativeTime } from '@/utils/format.js'

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
    const res = await getNoticeList({
      pageNum: refresh ? 1 : pageNum.value,
      pageSize
    })
    
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

function showNoticeDetail(item) {
  uni.showModal({
    title: item.title,
    content: item.content,
    showCancel: false
  })
}

onPullDownRefresh(() => {
  loadNotice(true).then(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style lang="scss" scoped>
.notice-container {
  min-height: 100vh;
  background: #fff;
}

.notice-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.notice-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-primary;
}

.notice-scroll {
  height: calc(100vh - 120rpx);
}

.notice-list {
  padding: 20rpx 30rpx;
}

.notice-item {
  padding: 30rpx;
  background: #F8F9FA;
  border-radius: $border-radius-lg;
  margin-bottom: 20rpx;
}

.notice-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.notice-type {
  font-size: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 4rpx;
  color: #fff;
}

.notice-type.system {
  background: $brand-primary;
}

.notice-type.activity {
  background: #FF6B6B;
}

.notice-time {
  font-size: 24rpx;
  color: $text-tertiary;
}

.notice-item-title {
  font-size: 30rpx;
  font-weight: 500;
  color: $text-primary;
  display: block;
  margin-bottom: 10rpx;
}

.notice-item-desc {
  font-size: 26rpx;
  color: $text-secondary;
  @include text-ellipsis-multiline(2);
  display: block;
}

.loading-more,
.no-more,
.empty {
  text-align: center;
  padding: 30rpx;
  color: $text-tertiary;
  font-size: 24rpx;
}
</style>