<template>
  <view class="page-bg">
    <view class="preview-mask"></view>
    <view class="preview-container">
      <view class="preview-header">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="24" color="#fff"></uni-icons>
        </view>
      </view>
      
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
        <button class="action-btn rating-btn" @click="handleRating">
          <text class="icon">★</text>
          <text>评分</text>
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
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWallpaperDetail, addUserBehavior, submitWallpaperScore } from '@/api/user/index.js'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const wallpaperId = ref('')
const currentIndex = ref(0)
const wallpaperList = ref([])

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
        wall_id: wallpaperId.value,
        openid: userStore.userInfo?.openid || ''
      })
    }
  } catch (error) {
    console.error('加载壁纸失败:', error)
  }
}

function handleSwiperChange(e) {
  currentIndex.value = e.detail.current
}

function goBack() {
  uni.navigateBack()
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
  if (!userStore.userInfo) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return
  }
  
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
      wall_id: currentWallpaper.value.id,
      openid: userStore.userInfo?.openid || ''
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
                wall_id: currentWallpaper.value.id,
                openid: userStore.userInfo?.openid || ''
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

async function handleRating() {
  if (!userStore.userInfo) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return
  }
  
  uni.showActionSheet({
    itemList: ['5分 - 非常好', '4分 - 很好', '3分 - 一般', '2分 - 较差', '1分 - 很差'],
    success: async (res) => {
      const score = 5 - res.tapIndex
      try {
        await submitWallpaperScore({
          wall_id: currentWallpaper.value.id,
          score: score
        })
        uni.showToast({
          title: '评分成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('评分失败:', error)
        uni.showToast({
          title: '评分失败',
          icon: 'none'
        })
      }
    }
  })
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
.preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9998;
  pointer-events: auto;
}

.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 9999;
  pointer-events: auto;
}

.preview-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: transparent;
  overflow: hidden;
  pointer-events: auto;
}

.preview-swiper {
  width: 100%;
  height: calc(100vh - 400rpx);
  position: relative;
  z-index: 10001;
  pointer-events: auto;
}

.preview-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10003;
  padding: 20rpx 30rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.back-btn {
  width: 70rpx;
  height: 70rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
}

.preview-image {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.preview-info {
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 10002;
  backdrop-filter: blur(10rpx);
}

.preview-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
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
  color: #28b389;
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
  color: #666;
}

.preview-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  margin-top: 20rpx;
  position: relative;
  z-index: 10003;
  backdrop-filter: blur(10rpx);
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

.rating-btn {
  background: #FFF8E1;
  color: #FFB300;
}

.download-btn {
  background: linear-gradient(135deg, #28b389, #40c79c);
  color: #fff;
}

.share-btn {
  background: #E8F5E9;
  color: #28b389;
}
</style>
