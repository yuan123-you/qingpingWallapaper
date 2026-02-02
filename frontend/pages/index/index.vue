<template>
  <view class="page-bg">
    <view class="index-container">
      <swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" circular>
        <swiper-item v-for="(item, index) in bannerList" :key="index" @click="handleBannerClick(item)">
          <image class="banner-image" :src="item.pic_url" mode="aspectFill"></image>
        </swiper-item>
      </swiper>

      <view class="notice-bar" v-if="noticeList.length > 0">
        <view class="notice-icon">📢</view>
        <swiper class="notice-swiper" :vertical="true" :autoplay="true" :interval="3000" :duration="500" circular>
          <swiper-item v-for="(item, index) in noticeList" :key="index" @click="goToNotice(item)">
            <text class="notice-text">{{ item.title }}</text>
          </swiper-item>
        </swiper>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">推荐壁纸</text>
          <text class="section-more" @click="goToWallpaperList">更多 ›</text>
        </view>
        <scroll-view class="recommend-scroll" scroll-x>
          <view class="recommend-list">
            <view 
              class="recommend-item" 
              v-for="(item, index) in recommendList" 
              :key="index"
              @click="goToPreview(item)"
            >
              <image class="recommend-image" :src="item.pic_url" mode="aspectFill"></image>
              <text class="recommend-title">{{ item.title || '壁纸' }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">热门分类</text>
          <text class="section-more" @click="goToClassify">更多 ›</text>
        </view>
        <view class="classify-grid">
          <view 
            class="classify-grid-item" 
            v-for="(item, index) in classifyList" 
            :key="index"
            @click="goToClassify(item)"
          >
            <image class="classify-grid-image" :src="item.cover_url" mode="aspectFill"></image>
            <text class="classify-grid-name">{{ item.name }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBannerList, getNoticeList, getWallpaperList, getClassifyList } from '@/api/user/index.js'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const bannerList = ref([])
const noticeList = ref([])
const recommendList = ref([])
const classifyList = ref([])

onMounted(() => {
  loadData()
})

async function loadData() {
  try {
    const [bannerRes, noticeRes] = await Promise.all([
      getBannerList(),
      getNoticeList()
    ])
    
    if (bannerRes && bannerRes.bannerList) {
      bannerList.value = bannerRes.bannerList
    }
    
    if (noticeRes && noticeRes.list) {
      noticeList.value = noticeRes.list
    }
    
    await loadRecommend()
    await loadClassify()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

async function loadRecommend() {
  try {
    const res = await getWallpaperList({
      pageNum: 1,
      pageSize: 10
    })
    
    if (res && res.list) {
      recommendList.value = res.list
    }
  } catch (error) {
    console.error('加载推荐失败:', error)
  }
}

async function loadClassify() {
  try {
    const res = await getClassifyList()
    
    if (res && res.classifyList) {
      classifyList.value = res.classifyList
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

function handleBannerClick(item) {
  goToPreview(item)
}

function goToPreview(item) {
  uni.navigateTo({
    url: `/pages/preview/preview?id=${item.id}`
  })
}

function goToClassify(item) {
  if (item && item.id) {
    uni.navigateTo({
      url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}`
    })
  } else {
    uni.switchTab({
      url: '/pages/classify/classify'
    })
  }
}

function goToWallpaperList() {
  uni.navigateTo({
    url: '/pages/wallpaper/list'
  })
}

function goToNotice(item) {
  uni.navigateTo({
    url: `/pages/notice/detail?id=${item.id}`
  })
}
</script>

<style lang="scss" scoped>
.page-bg {
  background: linear-gradient(to bottom, transparent, #f8f9fa 300rpx),
              linear-gradient(to right, #e8f5e9, #f5fafe);
  min-height: 100vh;
}

.index-container {
  padding: 20rpx;
}

.banner-swiper {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.notice-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.notice-icon {
  font-size: 32rpx;
  margin-right: 15rpx;
}

.notice-swiper {
  flex: 1;
  height: 40rpx;
}

.notice-text {
  font-size: 26rpx;
  color: #666;
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #28b389;
}

.recommend-scroll {
  white-space: nowrap;
}

.recommend-list {
  display: flex;
  gap: 20rpx;
}

.recommend-item {
  display: inline-block;
  width: 200rpx;
}

.recommend-image {
  width: 200rpx;
  height: 300rpx;
  border-radius: 12rpx;
  display: block;
  margin-bottom: 15rpx;
}

.recommend-title {
  font-size: 24rpx;
  color: #333;
  display: block;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.classify-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.classify-grid-item {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.classify-grid-image {
  width: 100%;
  height: 200rpx;
  display: block;
}

.classify-grid-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  text-align: center;
  padding: 15rpx;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
