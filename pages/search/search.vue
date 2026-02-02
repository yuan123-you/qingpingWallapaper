<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="search-wrap">
        <!-- 左上角返回按钮 -->
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="24" color="#1a1a1a"></uni-icons>
        </view>

        <view class="input-box">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
          <input 
            v-model="keyword" 
            placeholder="搜索你想要的壁纸..." 
            placeholder-style="color:#ccc"
            @confirm="doSearch"
            focus
          />
          <text class="clear" v-if="keyword" @click="keyword = ''">✕</text>
        </view>
        
        <text class="action-btn" @click="doSearch">搜索</text>
        
        <!-- 适配胶囊按钮占位 -->
        <view class="capsule-placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 推荐和历史 -->
      <view v-if="!searched" class="search-init fade-in-up">
        <view class="section" v-if="history.length">
          <view class="sec-header">
            <text>搜索历史</text>
            <uni-icons type="trash" size="16" color="#ccc" @click="clearHistory"></uni-icons>
          </view>
          <view class="tags">
            <text v-for="h in history" :key="h" @click="quickSearch(h)">{{ h }}</text>
          </view>
        </view>

        <view class="section">
          <view class="sec-header"><text>热门推荐</text></view>
          <view class="tags">
            <text v-for="t in hotTags" :key="t" @click="quickSearch(t)" class="hot">{{ t }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索结果 -->
      <view v-else class="results">
        <view class="grid" v-if="results.length">
          <view 
            class="wall-card fade-in-up" 
            v-for="(item, index) in results" 
            :key="item.id"
            :style="{ animationDelay: index * 0.05 + 's' }"
            @click="goToPreview(item)"
          >
            <image :src="item.pic_url" mode="aspectFill"></image>
            <view class="info">
              <text class="title">{{ item.title }}</text>
              <text class="score">★ {{ item.score }}</text>
            </view>
          </view>
        </view>
        <view class="empty-state" v-else>
          <uni-icons type="info" size="60" color="#eee"></uni-icons>
          <text>没找到相关的壁纸，换个词试试？</text>
        </view>
      </view>
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchWallpaper, getHotSearch } from '@/api/user/index.js'
import { throttle } from '@/utils/common.js'

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)
const keyword = ref('')
const searched = ref(false)
const results = ref([])
const history = ref([])
const hotTags = ref(['雪山', '极简', '赛博朋克', '星空', '猫咪', '森林'])

onMounted(() => {
  history.value = uni.getStorageSync('search_history') || []
  loadHot()
})

async function loadHot() {
  const res = await getHotSearch()
  if (res.list) hotTags.value = res.list
}

const doSearch = throttle(async () => {
  if (!keyword.value.trim()) return
  searched.value = true
  
  // 保存历史
  if (!history.value.includes(keyword.value)) {
    history.value.unshift(keyword.value)
    history.value = history.value.slice(0, 10)
    uni.setStorageSync('search_history', history.value)
  }

  const res = await searchWallpaper({ keyword: keyword.value })
  results.value = res.list
}, 500)

function quickSearch(t) {
  keyword.value = t
  doSearch()
}

function clearHistory() {
  history.value = []
  uni.setStorageSync('search_history', [])
}

function goToPreview(item) {
  uni.navigateTo({ url: `/pages/preview/preview?id=${item.id}` })
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
  padding: 10rpx 30rpx 10rpx 10rpx; // 调整padding
  background: #fff;
  
  .search-wrap {
    display: flex;
    align-items: center;
    height: 88rpx;
    
    .nav-back {
      width: 68rpx;
      height: 88rpx;
      @include flex-center;
      margin-right: 6rpx;
    }

    .input-box {
      flex: 1;
      height: 72rpx;
      background: #f1f3f5;
      border-radius: 40rpx;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      input {
        flex: 1;
        font-size: 28rpx;
      }
      
      .clear {
        color: #ccc;
        font-size: 24rpx;
        padding: 10rpx;
      }
    }
    
    .action-btn {
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      padding: 0 20rpx;
    }
    
    .capsule-placeholder {
      width: 170rpx; // 微信胶囊按钮占位
      height: 100%;
    }
  }
}

.content {
  flex: 1;
}

.search-init {
  padding: 40rpx;
  
  .section {
    margin-bottom: 60rpx;
    
    .sec-header {
      @include flex-between;
      margin-bottom: 24rpx;
      
      text {
        font-size: 32rpx;
        font-weight: 800;
        color: #333;
      }
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      text {
        padding: 12rpx 30rpx;
        background: #f8f9fa;
        border-radius: 30rpx;
        font-size: 26rpx;
        color: #666;
        
        &.hot {
          background: #e9f7f3;
          color: $brand-color;
          font-weight: 600;
        }
      }
    }
  }
}

.results {
  padding: 20rpx 30rpx;
  
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
  }
  
  .wall-card {
    border-radius: 20rpx;
    overflow: hidden;
    position: relative;
    box-shadow: $shadow-sm;
    height: 480rpx;
    
    image { width: 100%; height: 100%; }
    
    .info {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 20rpx;
      background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
      
      .title { color: #fff; font-size: 24rpx; font-weight: 600; display: block; }
      .score { color: #fccb90; font-size: 20rpx; margin-top: 4rpx; }
    }
  }
}

.empty-state {
  padding: 100rpx 40rpx;
  display: flex;
  flex-direction: column;
  @include flex-center;
  gap: 30rpx;
  
  .empty-img {
    width: 200rpx;
    height: 200rpx;
    border-radius: 40rpx;
    filter: grayscale(1);
    opacity: 0.3;
  }
  
  text {
    font-size: 26rpx;
    color: #999;
  }
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>