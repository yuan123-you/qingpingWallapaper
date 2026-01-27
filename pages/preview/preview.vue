<template>
  <view class="page-bg">
    <common-nav-bar title="壁纸预览" :show-back="true" />
    
    <view class="preview-container">
      <swiper class="preview-swiper" :current="currentIndex" @change="handleSwiperChange">
        <swiper-item v-for="(item, index) in wallpaperList" :key="index">
          <image 
            class="preview-image" 
            :src="item.pic_url" 
            mode="aspectFit"
            @longpress="handleLongPress(item)"
          ></image>
        </swiper-item>
      </swiper>

      <view class="preview-info">
        <text class="preview-title">{{ currentWallpaper.title || '壁纸' }}</text>
        <view class="preview-meta">
          <view class="preview-tags">
            <text 
              class="tag-item" 
              v-for="(tag, index) in currentWallpaper.tags" 
              :key="index"
            >
              {{ tag }}
            </text>
          </view>
          <view class="preview-stats">
            <text class="stat-item">下载 {{ formatNumber(currentWallpaper.download_count || 0) }}</text>
            <text class="stat-item">收藏 {{ formatNumber(currentWallpaper.favorite_count || 0) }}</text>
          </view>
        </view>
      </view>

      <view class="preview-actions">
        <button class="action-btn favorite-btn" @click="handleFavorite">
          <text :class="['icon', isFavorite ? 'active' : '']">{{ isFavorite ? '♥' : '♡' }}</text>
          <text>收藏</text>
        </button>
        <button class="action-btn download-btn" @click="handleDownload">
          <text class="icon">↓</text>
          <text>下载</text>
        </button>
        <button class="action-btn share-btn" open-type="share">
          <text class="icon">↗</text>
          <text>分享</text>
        </button>
      </view>

      <view class="preview-score">
        <text class="score-label">评分</text>
        <rating-star :score="userScore" @change="handleScoreChange" />
        <text class="score-value">{{ currentWallpaper.score || '0.0' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWallpaperDetail, submitWallpaperScore, addUserBehavior } from '@/api/user/index.js'
import { useUserStore } from '@/stores/user'
import { formatNumber } from '@/utils/format.js'
import common-nav-bar from '@/components/common-nav-bar/common-nav-bar.vue'
import rating-star from '@/components/rating-star/rating-star.vue'

const userStore = useUserStore()

const wallpaperId = ref('')
const currentIndex = ref(0)
const wallpaperList = ref([])
const userScore = ref(0)
const isFavorite = computed(() => {
  return userStore.favorites.some(item => item.id === currentWallpaper.value.id)
})

const currentWallpaper = computed(() => {
  return wallpaperList.value[currentIndex.value] || {}
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  wallpaperId.value = currentPage.options.id
  loadWallpaper()
})

async function loadWallpaper() {
  try {
    const res = await getWallpaperDetail(wallpaperId.value)
    if (res && res.wallpaper) {
      wallpaperList.value = [res.wallpaper]
      
      userStore.addHistory(res.wallpaper)
      
      await addUserBehavior({
        type: 'view',
        wall_id: wallpaperId.value
      })
    }
  } catch (error) {
    console.error('加载壁纸失败:', error)
  }
}

function handleSwiperChange(e) {
  currentIndex.value = e.detail.current
}

function handleLongPress(item) {
  uni.showActionSheet({
    itemList: ['保存到相册', '收藏'],
    success: (res) => {
      if (res.tapIndex === 0) {
        handleDownload()
      } else if (res.tapIndex === 1) {
        handleFavorite()
      }
    }
  })
}

async function handleFavorite() {
  if (isFavorite.value) {
    userStore.removeFavorite(currentWallpaper.value.id)
    uni.showToast({
      title: '已取消收藏',
      icon: 'success'
    })
  } else {
    userStore.addFavorite(currentWallpaper.value)
    uni.showToast({
      title: '收藏成功',
      icon: 'success'
    })
    
    await addUserBehavior({
      type: 'favorite',
      wall_id: currentWallpaper.value.id
    })
  }
}

async function handleDownload() {
  try {
    uni.showLoading({
      title: '下载中...'
    })
    
    const downloadTask = uni.downloadFile({
      url: currentWallpaper.value.pic_url,
      success: (res) => {
        if (res.statusCode === 200) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({
                title: '保存成功',
                icon: 'success'
              })
              
              addUserBehavior({
                type: 'download',
                wall_id: currentWallpaper.value.id
              })
            },
            fail: () => {
              uni.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      },
      fail: () => {
        uni.showToast({
          title: '下载失败',
          icon: 'none'
        })
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  } catch (error) {
    console.error('下载失败:', error)
    uni.hideLoading()
  }
}

async function handleScoreChange(score) {
  userScore.value = score
  
  try {
    await submitWallpaperScore({
      wall_id: currentWallpaper.value.id,
      score
    })
    
    uni.showToast({
      title: '评分成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('评分失败:', error)
  }
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

onShareAppMessage(() => {
  return {
    title: currentWallpaper.value.title || '精美壁纸',
    path: `/pages/preview/preview?id=${currentWallpaper.value.id}`,
    imageUrl: currentWallpaper.value.pic_url
  }
})
</script>

<style lang="scss" scoped>
.preview-container {
  min-height: 100vh;
}

.preview-swiper {
  width: 100%;
  height: calc(100vh - 400rpx);
}

.preview-image {
  width: 100%;
  height: 100%;
}

.preview-info {
  padding: 30rpx;
  background: #fff;
}

.preview-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 20rpx;
}

.preview-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 24rpx;
  color: $brand-primary;
  background: rgba(40, 179, 137, 0.1);
  padding: 8rpx 16rpx;
  border-radius: 4rpx;
}

.preview-stats {
  display: flex;
  gap: 30rpx;
}

.stat-item {
  font-size: 24rpx;
  color: $text-secondary;
}

.preview-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 28rpx;
  border: none;
}

.favorite-btn {
  background: #FFF0F0;
  color: #FF4757;
}

.favorite-btn .icon.active {
  color: #FF4757;
}

.download-btn {
  background: $brand-gradient;
  color: #fff;
}

.share-btn {
  background: #E8F5E9;
  color: $brand-primary;
}

.preview-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
}

.score-label {
  font-size: 28rpx;
  color: $text-secondary;
}

.score-value {
  font-size: 32rpx;
  font-weight: 600;
  color: $brand-primary;
}
</style>