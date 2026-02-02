<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="24" color="#1a1a1a"></uni-icons>
        </view>
        <text class="title">{{ classifyName || (type === 'hot' ? '热门排行' : '发现壁纸') }}</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <scroll-view 
      scroll-y 
      class="main-list" 
      @scrolltolower="loadMore"
      lower-threshold="50"
    >
      <view class="grid">
        <view 
          class="wall-card fade-in-up" 
          v-for="(item, index) in list" 
          :key="item.id"
          :style="{ animationDelay: (index % 10) * 0.05 + 's' }" 
          @click="goToPreview(item)"
        >
          <image :src="item.pic_url" mode="aspectFill" lazy-load></image>
          <view class="overlay">
            <view class="info">
              <text class="name">{{ item.title }}</text>
              <text class="score">⭐{{ item.score }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载提示 -->
      <view class="loading-status" v-if="loading">
        <view class="dot-loading"></view>
      </view>
      
      <!-- 到底提示 -->
      <view class="no-more" v-if="!hasMore && list.length > 0">
        <text>MEET THE END</text>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="!loading && list.length === 0">
        <text>暂时没有更多壁纸</text>
      </view>
      
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWallpaperList } from '@/api/user/index.js'

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const classifyId = ref('')
const classifyName = ref('')
const type = ref('')
const list = ref([])
const loading = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = 10

onMounted(() => {
  const pages = getCurrentPages()
  const options = pages[pages.length - 1].options
  classifyId.value = options.id || ''
  classifyName.value = options.name || ''
  type.value = options.type || ''
  loadData(true)
})

async function loadData(reload = false) {
  if (loading.value) return
  
  if (reload) {
    pageNum.value = 1
    hasMore.value = true
    list.value = []
  }

  if (!hasMore.value) return

  loading.value = true
  
  try {
    const res = await getWallpaperList({ 
      categoryId: classifyId.value,
      type: type.value,
      pageNum: pageNum.value,
      pageSize: pageSize
    })
    
    // 如果是第一页，直接覆盖；否则追加
    if (pageNum.value === 1) {
      list.value = res.list
    } else {
      list.value = [...list.value, ...res.list]
    }
    
    // 判断是否加载完毕
    if (list.value.length >= res.total || res.list.length < pageSize) {
      hasMore.value = false
    } else {
      pageNum.value++
    }
  } catch (e) {
    console.error('Loader error:', e)
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!loading.value && hasMore.value) {
    loadData()
  }
}

function goToPreview(item) {
  uni.navigateTo({ 
    url: `/pages/preview/preview?id=${item.id}&type=${type.value}&categoryId=${classifyId.value}` 
  })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  z-index: 10;
  
  .header-inner {
    height: 88rpx;
    padding: 0 20rpx;
    @include flex-between;
    
    .back-btn, .placeholder { width: 80rpx; @include flex-center; }
    
    .title {
      font-size: 34rpx;
      font-weight: 800;
      color: #1a1a1a;
      letter-spacing: -1rpx;
    }
  }
}

.main-list { flex: 1; height: 0; }

.grid {
  padding: 30rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.wall-card {
  height: 580rpx;
  background: #f8f9fa;
  border-radius: 32rpx;
  overflow: hidden;
  position: relative;
  box-shadow: $shadow-sm;
  
  image { width: 100%; height: 100%; }
  
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%);
    padding: 20rpx;
    display: flex;
    align-items: flex-end;
    
    .info {
      flex: 1;
      @include flex-between;
      .name { color: #fff; font-size: 24rpx; font-weight: 600; @include text-ellipsis; flex: 1; }
      .score { color: #ffd700; font-size: 22rpx; font-weight: 800; margin-left: 10rpx; }
    }
  }
}

.loading-status, .no-more, .empty-state {
  text-align: center;
  padding: 40rpx;
  color: #ccc;
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
}

.dot-loading {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f1f3f5;
  border-top-color: $brand-color;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.safe-bottom { height: env(safe-area-inset-bottom); }
</style>