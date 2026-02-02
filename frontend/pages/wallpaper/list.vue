<template>
  <view class="page-bg">
    <view class="wallpaper-list-container">
      <view class="list-header">
        <text class="list-title">{{ classifyName || '壁纸列表' }}</text>
        <text class="list-count">{{ wallpaperList.length }}张</text>
      </view>

      <scroll-view class="wallpaper-scroll" scroll-y @scrolltolower="loadMore">
        <view class="wallpaper-grid">
          <view 
            class="wallpaper-item" 
            v-for="(item, index) in wallpaperList" 
            :key="index"
            @click="goToPreview(item)"
          >
            <image class="wallpaper-image" :src="item.pic_url" mode="aspectFill"></image>
            <view class="wallpaper-info">
              <text class="wallpaper-title">{{ item.title || '壁纸' }}</text>
              <view class="wallpaper-meta">
                <text class="meta-item">★ {{ item.score || '0.0' }}</text>
                <text class="meta-item">↓ {{ formatNumber(item.download_count || 0) }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        
        <view class="no-more" v-if="!hasMore && wallpaperList.length > 0">
          <text>没有更多了</text>
        </view>
        
        <view class="empty" v-if="wallpaperList.length === 0 && !loading">
          <text>暂无壁纸</text>
        </view>
      </scroll-view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWallpaperList } from '@/api/user/index.js'

const classifyId = ref('')
const classifyName = ref('')
const wallpaperList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = 20

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  classifyId.value = currentPage.options.id || ''
  classifyName.value = currentPage.options.name || ''
  loadWallpaperList()
})

async function loadWallpaperList(refresh = false) {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const params = {
      pageNum: refresh ? 1 : pageNum.value,
      pageSize
    }
    
    if (classifyId.value) {
      params.class_id = classifyId.value
    }
    
    const res = await getWallpaperList(params)
    
    if (res && res.list) {
      if (refresh) {
        wallpaperList.value = res.list
        pageNum.value = 1
      } else {
        wallpaperList.value = [...wallpaperList.value, ...res.list]
      }
      
      hasMore.value = res.list.length >= pageSize
    }
  } catch (error) {
    console.error('加载壁纸列表失败:', error)
  } finally {
    loading.value = false
  }
}

function goToPreview(item) {
  uni.navigateTo({
    url: `/pages/preview/preview?id=${item.id}`
  })
}

function loadMore() {
  if (!hasMore.value || loading.value) return
  pageNum.value++
  loadWallpaperList()
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style lang="scss" scoped>
.wallpaper-list-container {
  min-height: 100vh;
  background: #fff;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.list-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.list-count {
  font-size: 24rpx;
  color: #999;
}

.wallpaper-scroll {
  height: calc(100vh - 200rpx);
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx 30rpx;
}

.wallpaper-item {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.wallpaper-image {
  width: 100%;
  height: 400rpx;
  display: block;
}

.wallpaper-info {
  padding: 20rpx;
}

.wallpaper-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallpaper-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 22rpx;
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
