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

      <scroll-view class="classify-scroll" scroll-y @scrolltolower="loadMore">
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
              <text class="classify-count">{{ item.wall_count }}张壁纸</text>
            </view>
          </view>
        </view>
        
        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        
        <view class="no-more" v-if="!hasMore && classifyList.length > 0">
          <text>没有更多了</text>
        </view>
        
        <view class="empty" v-if="classifyList.length === 0 && !loading">
          <text>暂无分类</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWallpaperList } from '@/api/user/index.js'

const classifyList = ref([])
const searchKeyword = ref('')
const loading = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = 10

onMounted(() => {
  loadClassify()
})

async function loadClassify(refresh = false) {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await getWallpaperList({
      pageNum: refresh ? 1 : pageNum.value,
      pageSize,
      groupBy: 'classify',
      keyword: searchKeyword.value
    })
    
    if (res && res.list) {
      if (refresh) {
        classifyList.value = res.list
        pageNum.value = 1
      } else {
        classifyList.value = [...classifyList.value, ...res.list]
      }
      
      hasMore.value = res.list.length >= pageSize
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  loadClassify(true)
}

function loadMore() {
  if (!hasMore.value || loading.value) return
  
  pageNum.value++
  loadClassify()
}

function goToWallpaperList(item) {
  uni.navigateTo({
    url: `/pages/classify/classify?id=${item.id}&name=${item.name}`
  })
}

onPullDownRefresh(() => {
  loadClassify(true).then(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style lang="scss" scoped>
.classify-container {
  min-height: 100vh;
}

.search-bar {
  padding: 20rpx 30rpx;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-input {
  width: 100%;
  height: 70rpx;
  background: #F5F5F5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.classify-scroll {
  height: calc(100vh - 110rpx);
}

.classify-list {
  padding: 20rpx 30rpx;
}

.classify-item {
  display: flex;
  background: #fff;
  border-radius: $border-radius-lg;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: $box-shadow-base;
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
  color: $text-primary;
  margin-bottom: 10rpx;
}

.classify-desc {
  font-size: 24rpx;
  color: $text-secondary;
  margin-bottom: 10rpx;
  @include text-ellipsis-multiline(2);
  display: block;
}

.classify-count {
  font-size: 24rpx;
  color: $text-tertiary;
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