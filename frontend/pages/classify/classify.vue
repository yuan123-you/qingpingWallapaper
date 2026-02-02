<template>
  <view class="page-bg">
    <view class="classify-container">
      <view class="search-bar">
        <input 
          class="search-input" 
          placeholder="搜索分类" 
          v-model="searchKeyword"
          @confirm="handleSearch"
        />
      </view>

      <scroll-view class="classify-scroll" scroll-y>
        <view class="classify-list">
          <view 
            class="classify-item" 
            v-for="(item, index) in classifyList" 
            :key="index"
            @click="goToWallpaperList(item)"
          >
            <image class="classify-cover" :src="item.cover_url" mode="aspectFill"></image>
            <view class="classify-info">
              <text class="classify-name">{{ item.name }}</text>
              <text class="classify-desc">{{ item.desc || '' }}</text>
              <text class="classify-count">{{ item.wall_count || 0 }}张壁纸</text>
            </view>
          </view>
        </view>
        
        <view class="empty" v-if="classifyList.length === 0">
          <text>暂无分类</text>
        </view>
      </scroll-view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getClassifyList } from '@/api/user/index.js'

const classifyList = ref([])
const searchKeyword = ref('')

onMounted(() => {
  loadClassify()
})

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

function handleSearch() {
  if (!searchKeyword.value.trim()) {
    loadClassify()
    return
  }
  
  classifyList.value = classifyList.value.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
}

function goToWallpaperList(item) {
  uni.navigateTo({
    url: `/pages/wallpaper/list?id=${item.id}&name=${item.name}`
  })
}
</script>

<style lang="scss" scoped>
.classify-container {
  min-height: 100vh;
  background: #fff;
}

.search-bar {
  padding: 20rpx 30rpx;
  background: #f5f5f5;
}

.search-input {
  width: 100%;
  height: 70rpx;
  background: #fff;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.classify-scroll {
  height: calc(100vh - 200rpx);
}

.classify-list {
  padding: 20rpx 30rpx;
}

.classify-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.classify-cover {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.classify-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.classify-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.classify-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.classify-count {
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
