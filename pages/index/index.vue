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
          <text class="section-title">每日推荐</text>
          <text class="section-more" @click="refreshRecommend">换一批</text>
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
          <text class="section-title">专题精选</text>
        </view>
        <view class="classify-grid">
          <view 
            class="classify-item" 
            v-for="(item, index) in classifyList" 
            :key="index"
            @click="goToClassify(item)"
          >
            <image class="classify-cover" :src="item.cover_url" mode="aspectFill"></image>
            <view class="classify-info">
              <text class="classify-name">{{ item.name }}</text>
              <text class="classify-count">{{ item.wall_count }}张</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBannerList, getNoticeList, getWallpaperList } from '@/api/user/index.js'
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
    
    if (noticeRes && noticeRes.noticeList) {
      noticeList.value = noticeRes.noticeList
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
      pageSize: 6,
      sortBy: 'recommend'
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
    const res = await getWallpaperList({
      pageNum: 1,
      pageSize: 4,
      groupBy: 'classify'
    })
    if (res && res.list) {
      classifyList.value = res.list
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

function refreshRecommend() {
  loadRecommend()
}

function handleBannerClick(item) {
  if (item.jump_url) {
    uni.navigateTo({
      url: item.jump_url
    })
  }
}

function goToNotice(item) {
  uni.navigateTo({
    url: `/pages/notice/notice?id=${item.id}`
  })
}

function goToPreview(item) {
  uni.navigateTo({
    url: `/pages/preview/preview?id=${item.id}`
  })
}

function goToClassify(item) {
  uni.navigateTo({
    url: `/pages/classify/classify?id=${item.id}`
  })
}

onPullDownRefresh(() => {
  loadData().then(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  padding-bottom: 20rpx;
}

.banner-swiper {
  width: 100%;
  height: 360rpx;
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
  margin: 0 30rpx 20rpx;
  padding: 20rpx;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-base;
}

.notice-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.notice-swiper {
  flex: 1;
  height: 40rpx;
}

.notice-text {
  font-size: 28rpx;
  color: $text-secondary;
  @include text-ellipsis;
  display: block;
}

.section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-primary;
}

.section-more {
  font-size: 24rpx;
  color: $brand-primary;
}

.recommend-scroll {
  white-space: nowrap;
}

.recommend-list {
  display: inline-flex;
  padding: 0 30rpx;
  gap: 20rpx;
}

.recommend-item {
  display: inline-block;
  width: 200rpx;
}

.recommend-image {
  width: 200rpx;
  height: 360rpx;
  border-radius: $border-radius-base;
  display: block;
  margin-bottom: 12rpx;
}

.recommend-title {
  font-size: 24rpx;
  color: $text-primary;
  @include text-ellipsis;
  display: block;
}

.classify-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 30rpx;
}

.classify-item {
  position: relative;
  border-radius: $border-radius-lg;
  overflow: hidden;
  aspect-ratio: 1;
}

.classify-cover {
  width: 100%;
  height: 100%;
}

.classify-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.classify-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

.classify-count {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>