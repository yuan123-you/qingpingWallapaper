<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner">
        <text class="title">发现分类</text>
        <view class="search-entry" @click="goToSearch">
          <uni-icons type="search" size="18" color="#666"></uni-icons>
          <text>搜索分类...</text>
        </view>
        <!-- 适配胶囊按钮 -->
        <view class="capsule-placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="main-content">
      <view class="grid">
        <view 
          class="cate-card fade-in-up" 
          v-for="(item, index) in classifyList" 
          :key="item.id"
          :style="{ animationDelay: index * 0.05 + 's' }"
          @click="goToWallpaperList(item)"
        >
          <image :src="item.cover_url" mode="aspectFill" class="cover"></image>
          <view class="mask">
            <view class="info">
              <text class="name">{{ item.name }}</text>
              <view class="details">
                <text class="count">{{ item.wall_count }}+ 壁纸</text>
                <view class="line"></view>
                <text class="go">探索</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getClassifyList } from '@/api/user/index.js'

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const classifyList = ref([])

onMounted(() => {
  loadData()
})

async function loadData() {
  const res = await getClassifyList()
  classifyList.value = res.classifyList
}

function goToWallpaperList(item) {
  uni.navigateTo({
    url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}`
  })
}

function goToSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  z-index: 10;
  
  .header-inner {
    height: 88rpx;
    padding: 0 30rpx;
    @include flex-between;
    gap: 20rpx;
    
    .title {
      font-size: 36rpx;
      font-weight: 900;
      color: #1a1a1a;
      letter-spacing: -1rpx;
      flex-shrink: 0;
    }
    
    // 修复搜索框样式，使其更像一个输入框
    .search-entry {
      flex: 1;
      height: 72rpx;
      border-radius: 36rpx;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      padding: 0 24rpx;
      
      text {
        font-size: 26rpx;
        color: #999;
        margin-left: 10rpx;
      }
    }

    .capsule-placeholder {
      width: 170rpx;
      flex-shrink: 0;
    }
  }
}

.main-content {
  flex: 1;
}

.grid {
  padding: 30rpx;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30rpx;
}

.cate-card {
  height: 260rpx;
  border-radius: 36rpx;
  overflow: hidden;
  position: relative;
  box-shadow: $shadow-md;
  
  &:active {
    transform: scale(0.98);
  }
  
  .cover {
    width: 100%;
    height: 100%;
  }
  
  .mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%);
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .info {
      .name {
        color: #fff;
        font-size: 40rpx;
        font-weight: 800;
        margin-bottom: 12rpx;
        display: block;
      }
      
      .details {
        display: flex;
        align-items: center;
        gap: 16rpx;
        
        .count {
          color: rgba(255,255,255,0.8);
          font-size: 22rpx;
        }
        
        .line {
          width: 2rpx;
          height: 16rpx;
          background: rgba(255,255,255,0.3);
        }
        
        .go {
          color: #fff;
          font-size: 22rpx;
          font-weight: 600;
        }
      }
    }
  }
}

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 20rpx);
}
</style>