<template>
  <view class="page-bg">
    <view class="search-container">
      <view class="search-header">
        <view class="search-bar">
          <text class="search-icon">🔍</text>
          <input 
            class="search-input" 
            placeholder="搜索壁纸" 
            v-model="searchKeyword"
            @input="handleInput"
            @confirm="handleSearch"
            focus
          />
        </view>
        <text class="search-cancel" @click="goBack">取消</text>
      </view>

      <view class="search-suggestions" v-if="showSuggestions && suggestions.length > 0">
        <view 
          class="suggestion-item" 
          v-for="(item, index) in suggestions" 
          :key="index"
          @click="selectSuggestion(item)"
        >
          <text class="suggestion-text">{{ item }}</text>
        </view>
      </view>

      <view class="hot-search" v-if="!hasSearched && hotSearchList.length > 0">
        <text class="section-title">热门搜索</text>
        <view class="hot-tags">
          <text 
            class="hot-tag" 
            v-for="(item, index) in hotSearchList" 
            :key="index"
            @click="selectHotSearch(item)"
          >
            {{ item }}
          </text>
        </view>
      </view>

      <view class="search-history" v-if="!hasSearched && searchHistory.length > 0">
        <view class="history-header">
          <text class="section-title">搜索历史</text>
          <text class="history-clear" @click="clearHistory">清空</text>
        </view>
        <view class="history-tags">
          <text 
            class="history-tag" 
            v-for="(item, index) in searchHistory" 
            :key="index"
            @click="selectHistory(item)"
          >
            {{ item }}
          </text>
        </view>
      </view>

      <scroll-view class="search-results" scroll-y v-if="hasSearched">
        <view class="result-list">
          <view 
            class="result-item" 
            v-for="(item, index) in searchResults" 
            :key="index"
            @click="goToPreview(item)"
          >
            <image class="result-image" :src="item.pic_url" mode="aspectFill"></image>
            <view class="result-info">
              <text class="result-title">{{ item.title || '壁纸' }}</text>
              <view class="result-meta">
                <text class="result-score">★ {{ item.score || '0.0' }}</text>
                <text class="result-download">↓ {{ formatNumber(item.download_count || 0) }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>
        
        <view class="no-more" v-if="!hasMore && searchResults.length > 0">
          <text>没有更多了</text>
        </view>
        
        <view class="empty" v-if="searchResults.length === 0 && !loading">
          <text>未找到相关壁纸</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHotSearch, searchWallpaper } from '@/api/user/index.js'
import { formatNumber } from '@/utils/format.js'
import storage from '@/utils/storage.js'

const searchKeyword = ref('')
const showSuggestions = ref(false)
const suggestions = ref([])
const hasSearched = ref(false)
const searchResults = ref([])
const loading = ref(false)
const hasMore = ref(true)
const pageNum = ref(1)
const pageSize = 10
const hotSearchList = ref([])
const searchHistory = ref([])

onMounted(() => {
  loadHotSearch()
  loadSearchHistory()
})

async function loadHotSearch() {
  try {
    const res = await getHotSearch()
    if (res && res.hotSearch) {
      hotSearchList.value = res.hotSearch
    }
  } catch (error) {
    console.error('加载热门搜索失败:', error)
  }
}

function loadSearchHistory() {
  searchHistory.value = storage.get('searchHistory') || []
}

function handleInput(e) {
  const value = e.detail.value
  if (value.length > 0) {
    showSuggestions.value = true
    suggestions.value = searchHistory.value.filter(item => 
      item.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5)
  } else {
    showSuggestions.value = false
    suggestions.value = []
  }
}

function handleSearch() {
  if (!searchKeyword.value.trim()) return
  
  hasSearched.value = true
  showSuggestions.value = false
  
  saveSearchHistory(searchKeyword.value)
  loadSearchResults(true)
}

function selectSuggestion(item) {
  searchKeyword.value = item
  handleSearch()
}

function selectHotSearch(item) {
  searchKeyword.value = item
  handleSearch()
}

function selectHistory(item) {
  searchKeyword.value = item
  handleSearch()
}

function saveSearchHistory(keyword) {
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(keyword)
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  storage.set('searchHistory', searchHistory.value)
}

function clearHistory() {
  uni.showModal({
    title: '提示',
    content: '确定要清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = []
        storage.remove('searchHistory')
      }
    }
  })
}

async function loadSearchResults(refresh = false) {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await searchWallpaper({
      keyword: searchKeyword.value,
      pageNum: refresh ? 1 : pageNum.value,
      pageSize
    })
    
    if (res && res.list) {
      if (refresh) {
        searchResults.value = res.list
        pageNum.value = 1
      } else {
        searchResults.value = [...searchResults.value, ...res.list]
      }
      
      hasMore.value = res.list.length >= pageSize
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

function goToPreview(item) {
  uni.navigateTo({
    url: `/pages/preview/preview?id=${item.id}`
  })
}

function goBack() {
  uni.navigateBack()
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
.search-container {
  min-height: 100vh;
  background: #fff;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 30rpx;
  padding: 0 20rpx;
  height: 60rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
}

.search-cancel {
  font-size: 28rpx;
  color: $text-secondary;
  margin-left: 20rpx;
}

.search-suggestions {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.suggestion-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.suggestion-text {
  font-size: 28rpx;
  color: $text-primary;
}

.hot-search,
.search-history {
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 20rpx;
}

.hot-tags,
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.hot-tag,
.history-tag {
  font-size: 24rpx;
  color: $text-secondary;
  background: #F5F5F5;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.history-clear {
  font-size: 24rpx;
  color: $brand-primary;
}

.search-results {
  height: calc(100vh - 200rpx);
}

.result-list {
  padding: 20rpx 30rpx;
}

.result-item {
  display: flex;
  background: #fff;
  border-radius: $border-radius-base;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: $box-shadow-base;
}

.result-image {
  width: 160rpx;
  height: 160rpx;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.result-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
  @include text-ellipsis;
  display: block;
  margin-bottom: 10rpx;
}

.result-meta {
  display: flex;
  gap: 20rpx;
}

.result-score,
.result-download {
  font-size: 24rpx;
  color: $text-secondary;
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