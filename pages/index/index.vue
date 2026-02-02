<template>
  <view class="container">
    <!-- 自定义导航栏 (适配胶囊按钮) -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="logo">LightScreen</text>
        <view class="search-entry" @click="goToSearch">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
          <text>发现精彩...</text>
        </view>
        <!-- 预留右侧空间给胶囊按钮 -->
        <view class="capsule-placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="main-scroll" @scrolltolower="onReachBottom">
      <!-- 轮播图 -->
      <view class="banner-section">
        <swiper 
          class="banner-swiper" 
          circular 
          autoplay 
          interval="5000" 
          duration="800"
          previous-margin="40rpx"
          next-margin="40rpx"
          @change="onBannerChange"
        >
          <swiper-item v-for="(item, index) in bannerList" :key="item.id">
            <view class="banner-card" :class="{ active: currentBanner === index }" @click="handleAction('banner', item)">
              <image :src="item.pic_url" mode="aspectFill" class="banner-image" lazy-load></image>
              <view class="banner-info">
                <text class="banner-title">{{ item.title }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
      
      <!-- 公告栏 -->
      <view class="notice-section" v-if="noticeList.length > 0">
        <view class="notice-bar">
          <uni-icons type="notification-filled" size="18" color="#28b389"></uni-icons>
          <swiper class="notice-swiper" vertical autoplay circular interval="3000" duration="500">
            <swiper-item v-for="item in noticeList" :key="item.id">
              <view class="notice-item" @click="showNoticeDetail(item)">
                <text class="notice-tag" :class="item.type">{{ getNoticeTag(item.type) }}</text>
                <text class="notice-content">{{ item.content }}</text>
              </view>
            </swiper-item>
          </swiper>
          <uni-icons type="right" size="14" color="#ccc"></uni-icons>
        </view>
      </view>

      <!-- 快捷功能 -->
      <view class="quick-actions">
        <view class="action-item" @click="handleAction('random')">
          <view class="action-icon random">
            <uni-icons type="refresh" size="24" color="#fff"></uni-icons>
          </view>
          <text>随机抽取</text>
        </view>
        <view class="action-item" @click="handleAction('hot')">
          <view class="action-icon hot">
            <uni-icons type="fire" size="24" color="#fff"></uni-icons>
          </view>
          <text>人气TOP</text>
        </view>
        <view class="action-item" @click="handleAction('classify')">
          <view class="action-icon cate">
            <uni-icons type="list" size="24" color="#fff"></uni-icons>
          </view>
          <text>全部分类</text>
        </view>
      </view>

      <!-- 推荐板块 (今日精选) -->
      <view class="section">
        <view class="section-header">
          <view class="title-area">
            <text class="title">今日精选</text>
            <view class="dot"></view>
          </view>
          <text class="more" @click="handleAction('today_more')">更多</text>
        </view>
        <view class="wall-grid">
          <view 
            class="wall-item fade-in-up" 
            v-for="(item, index) in recommendList" 
            :key="item.id"
            :style="{ animationDelay: index * 0.05 + 's' }"
            @click="goToPreview(item)"
          >
            <image :src="item.pic_url" mode="aspectFill" class="wall-thumb" lazy-load></image>
            <view class="wall-mask">
              <text class="wall-name">{{ item.title }}</text>
              <view class="wall-bottom">
                <text class="score">⭐{{ item.score }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 热门分类 -->
      <view class="section">
        <view class="section-header">
          <view class="title-area">
            <text class="title">热门分类</text>
            <view class="dot"></view>
          </view>
        </view>
        <view class="category-grid">
          <view 
            class="category-item" 
            v-for="(item, index) in classifyList" 
            :key="item.id"
            @click="goToClassifyItem(item)"
          >
            <image :src="item.cover_url" mode="aspectFill" class="cate-image" lazy-load></image>
            <view class="cate-mask">
              <text class="cate-name">{{ item.name }}</text>
              <text class="cate-count">{{ item.wall_count }}P</text>
            </view>
          </view>
        </view>
      </view>

      <view class="footer-tip">- 灵感触手可及 -</view>
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBannerList, getWallpaperList, getClassifyList, getNoticeList } from '@/api/user/index.js'
import { throttle } from '@/utils/common.js'

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const bannerList = ref([])
const recommendList = ref([])
const classifyList = ref([])
const noticeList = ref([])
const currentBanner = ref(0)

onMounted(() => {
  loadData()
})

async function loadData() {
  try {
    const [banners, walls, categories, notices] = await Promise.all([
      getBannerList(),
      getWallpaperList({ type: 'today', pageSize: 12 }),
      getClassifyList(),
      getNoticeList()
    ])
    
    bannerList.value = banners.bannerList
    recommendList.value = walls.list
    classifyList.value = categories.classifyList
    noticeList.value = notices.list
  } catch (error) {
    console.error('Data load failed:', error)
  }
}

function onBannerChange(e) {
  currentBanner.value = e.detail.current
}

function getNoticeTag(type) {
  const map = {
    'system': '系统',
    'update': '更新',
    'activity': '活动'
  }
  return map[type] || '公告'
}

function showNoticeDetail(item) {
  uni.showModal({
    title: item.title,
    content: item.content,
    showCancel: false,
    confirmText: '我知道了'
  })
}

const handleAction = throttle((type, data) => {
  switch(type) {
    case 'banner':
      uni.navigateTo({ url: data.jump_url });
      break;
    case 'random':
      uni.navigateTo({ url: `/pages/preview/preview?type=random` });
      break;
    case 'hot':
      uni.navigateTo({ url: `/pages/wallpaper/list?type=hot` });
      break;
    case 'classify':
      uni.switchTab({ url: '/pages/classify/classify' });
      break;
    case 'today_more':
      uni.navigateTo({ url: `/pages/wallpaper/list?type=today` });
      break;
  }
}, 800)

function goToPreview(item) {
  uni.navigateTo({ url: `/pages/preview/preview?id=${item.id}&type=today` })
}

function goToSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

function goToClassifyItem(item) {
  uni.navigateTo({ url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}` })
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  min-height: 100vh;
}

.custom-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 0 30rpx 10rpx;
  
  .nav-content {
    display: flex;
    align-items: center;
    height: 88rpx;
  }
  
  .logo {
    font-size: 36rpx;
    font-weight: 900;
    color: #1a1a1a;
    letter-spacing: -2rpx;
    margin-right: 20rpx;
  }
  
  .search-entry {
    flex: 1;
    height: 72rpx;
    background: #f5f7f9;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    font-size: 26rpx;
    color: #999;
    
    text { margin-left: 10rpx; }
  }
  
  .capsule-placeholder {
    width: 200rpx;
  }
}

.main-scroll {
  height: calc(100vh - 100rpx);
}

.banner-section {
  padding: 20rpx 0 10rpx;
  .banner-swiper { height: 380rpx; }
  .banner-card {
    height: 360rpx;
    margin: 0 10rpx;
    border-radius: 32rpx;
    overflow: hidden;
    position: relative;
    transition: transform 0.4s ease;
    transform: scale(0.9);
    background: #f8f9fa;
    box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
    
    &.active { transform: scale(1); }
    .banner-image { width: 100%; height: 100%; }
    .banner-info {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 30rpx;
      background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
      .banner-title { color: #fff; font-size: 28rpx; font-weight: 700; }
    }
  }
}

.notice-section {
  padding: 0 40rpx;
  margin-bottom: 20rpx;
  .notice-bar {
    background: #fdfdfd;
    border-radius: 20rpx;
    height: 72rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
    border: 1px solid #f9f9f9;
    
    .notice-swiper {
      flex: 1;
      height: 100%;
      .notice-item {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 12rpx;
        
        .notice-tag {
          font-size: 18rpx;
          padding: 2rpx 10rpx;
          border-radius: 6rpx;
          font-weight: 800;
          flex-shrink: 0;
          &.system { background: rgba(40,179,137,0.1); color: #28b389; }
          &.update { background: rgba(52,152,219,0.1); color: #3498db; }
          &.activity { background: rgba(243,156,18,0.1); color: #f39c12; }
        }
        
        .notice-content {
          font-size: 24rpx;
          color: #666;
          @include text-ellipsis;
          font-weight: 500;
        }
      }
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    
    .action-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 36rpx;
      @include flex-center;
      box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.06);
      
      &.random { background: $brand-gradient; }
      &.hot { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
      &.cate { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
    }
    
    text { font-size: 24rpx; color: #1a1a1a; font-weight: 700; }
  }
}

.section {
  margin-bottom: 50rpx;
  .section-header {
    padding: 0 40rpx;
    @include flex-between;
    margin-bottom: 30rpx;
    .title-area {
      display: flex;
      align-items: center;
      gap: 12rpx;
      .title { font-size: 38rpx; font-weight: 900; color: #1a1a1a; }
      .dot { width: 10rpx; height: 10rpx; background: $brand-color; border-radius: 50%; }
    }
    .more { font-size: 24rpx; color: #ccc; }
  }
}

.wall-grid {
  padding: 0 30rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
  
  .wall-item {
    height: 380rpx;
    border-radius: 20rpx;
    overflow: hidden;
    position: relative;
    background: #f8f9fa;
    
    .wall-thumb { width: 100%; height: 100%; }
    .wall-mask {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
      padding: 15rpx;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      
      .wall-name { color: #fff; font-size: 20rpx; @include text-ellipsis; font-weight: 600; }
      .wall-bottom {
        @include flex-between;
        margin-top: 4rpx;
        .score { color: #ffd700; font-size: 18rpx; font-weight: 800; }
      }
    }
  }
}

.category-grid {
  padding: 0 30rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  
  .category-item {
    height: 180rpx;
    border-radius: 24rpx;
    overflow: hidden;
    position: relative;
    box-shadow: $shadow-sm;
    
    .cate-image { width: 100%; height: 100%; }
    .cate-mask {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.2);
      @include flex-center;
      flex-direction: column;
      gap: 4rpx;
      
      .cate-name { color: #fff; font-size: 30rpx; font-weight: 800; }
      .cate-count { color: rgba(255,255,255,0.8); font-size: 18rpx; font-weight: 600; }
    }
  }
}

.footer-tip { text-align: center; font-size: 24rpx; color: #eee; padding: 60rpx 0; }
.safe-area-bottom { height: env(safe-area-inset-bottom); }
</style>