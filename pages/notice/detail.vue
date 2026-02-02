<template>
  <view class="page-bg">
    <view class="notice-detail-container">
      <view class="notice-header">
        <text class="notice-title">{{ noticeDetail.title || '公告详情' }}</text>
        <text class="notice-time">{{ formatTime(noticeDetail.create_time) }}</text>
      </view>

      <view class="notice-content">
        <rich-text :nodes="noticeDetail.content || '暂无内容'"></rich-text>
      </view>

      <view class="notice-footer">
        <button class="back-btn" @click="goBack">返回</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import noticeData from '@/static/data/notice.json'

const noticeDetail = ref({})
const noticeId = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  noticeId.value = currentPage.options.id
  loadNoticeDetail()
})

function loadNoticeDetail() {
  try {
    const notice = noticeData.find(item => item.id === parseInt(noticeId.value))
    if (notice) {
      noticeDetail.value = notice
    } else {
      uni.showToast({
        title: '公告不存在',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载公告详情失败:', error)
  }
}

function formatTime(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.notice-detail-container {
  min-height: 100vh;
  padding: 30rpx;
  background: #fff;
}

.notice-header {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
  margin-bottom: 30rpx;
}

.notice-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.notice-time {
  font-size: 24rpx;
  color: #999;
}

.notice-content {
  padding: 30rpx 0;
  line-height: 1.8;
  color: #666;
  font-size: 28rpx;
  min-height: 60vh;
}

.notice-footer {
  padding: 30rpx 0;
  border-top: 1rpx solid #F5F5F5;
  margin-top: 30rpx;
}

.back-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #28b389, #40c79c);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
}
</style>
