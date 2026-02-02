<template>
  <view class="preview-page" @touchmove.stop.prevent="() => {}">
    <!-- 全屏 Swiper (左右滑动) -->
    <!-- 增加 vertical="false" 确保明确横向滑动 -->
    <!-- 增加 v-if 确保数据就绪后再渲染，防止初始闪烁 -->
    <swiper 
      v-if="isReady && list.length > 0"
      class="full-swiper" 
      :current="currentSwiperIndex" 
      @change="onSwiperChange"
      :duration="300"
      circular
      :vertical="false"
    >
      <swiper-item v-for="(item, index) in list" :key="item.id">
        <!-- 使用 scroll-view 包裹以防止图片显示不全，但要禁用滚动 -->
        <view class="wall-container">
          <!-- 只有在加载中才显示模糊占位图 -->
          <image 
            v-if="shouldRender(index) && imageLoading[index]"
            class="blur-placeholder" 
            :src="getSmallUrl(item.pic_url)" 
            mode="aspectFill"
          ></image>

          <!-- 高清主图 -->
          <image 
            v-if="shouldRender(index) && !imageError[index]"
            class="full-image" 
            :src="item.pic_url" 
            mode="aspectFill"
            @load="onImageLoad(index)"
            @error="onImageError(index)"
          ></image>

          <!-- 加载失败提示 -->
          <view 
            v-if="shouldRender(index) && imageError[index]" 
            class="error-placeholder"
            @click="retryLoadImage(index, item.pic_url)"
          >
            <view class="error-icon">
              <uni-icons type="image" size="60" color="#666"></uni-icons>
            </view>
            <text class="error-text">图片加载失败</text>
            <text class="retry-text">点击重试</text>
          </view>

          <!-- 唯一标识 - 仅在信息面板呼出时显示 -->
          <view class="wallpaper-id" v-show="showInfo">ID: {{ item.id }}</view>
          
          <view class="loading-state" v-if="shouldRender(index) && imageLoading[index]">
            <view class="spinner"></view>
          </view>

          <!-- 内容蒙层 -->
          <view class="content-overlay" @click="toggleInfo">
            <view class="top-gradient" v-show="showInfo"></view>
            <view class="bottom-gradient" v-show="showInfo"></view>
            
            <!-- 顶部导航 & 计数器 -->
            <view class="nav-bar" v-show="showInfo" :style="{ paddingTop: statusBarHeight + 'px' }">
              <view class="back-btn" @click.stop="goBack">
                <uni-icons type="left" size="24" color="#fff"></uni-icons>
              </view>
              
              <!-- 数量显示 -->
              <view class="counter-badge">
                <text class="curr">{{ currentSwiperIndex + 1 }}</text>
                <text class="divider">/</text>
                <text class="total">{{ totalCount }}</text>
              </view>
            </view>

            <!-- 侧边操作栏 -->
            <view class="side-actions" v-show="showInfo">
              <view class="action-item" @click.stop="handleFavorite(item)">
                <view class="icon-box" :class="{ active: isFavorite(item.id) }">
                  <uni-icons :type="isFavorite(item.id) ? 'heart-filled' : 'heart'" size="28" :color="isFavorite(item.id) ? '#ff4757' : '#fff'"></uni-icons>
                </view>
                <text>{{ isFavorite(item.id) ? '已收' : '收藏' }}</text>
              </view>
              <view class="action-item" @click.stop="handleDownload(item)">
                <view class="icon-box">
                  <uni-icons type="download" size="28" color="#fff"></uni-icons>
                </view>
                <text>下载</text>
              </view>
            </view>

            <!-- 底部详情面板 -->
            <view class="bottom-panel" v-show="showInfo">
              <view class="panel-header">
                <view class="left">
                  <text class="title">{{ item.title }}</text>
                  <view class="tags">
                    <text v-for="tag in item.tags" :key="tag">#{{ tag }}</text>
                  </view>
                </view>
                <view class="score-badge">⭐ {{ item.score }}</view>
              </view>
              
              <text class="desc">{{ item.description }}</text>
              <view class="swipe-tip">左右滑动发现更多</view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWallpaperList } from '@/api/user/index.js'
import { useUserStore } from '@/stores/user'
import { throttle } from '@/utils/common.js'

const userStore = useUserStore()
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 20)

const list = ref([])
const totalCount = ref(0)
const currentSwiperIndex = ref(0)
const imageLoading = ref({})
const imageError = ref({})
const isReady = ref(false)
const initImageLoading = (total) => {
  const loadingMap = {}
  const errorMap = {}
  for (let i = 0; i < total; i++) {
    loadingMap[i] = true
    errorMap[i] = false
  }
  imageLoading.value = loadingMap
  imageError.value = errorMap
}
const showInfo = ref(false)

// 分页状态
const pageNum = ref(1)
const pageSize = 10
const hasMore = ref(true)
const paramsRec = ref({}) // 记录请求参数

onMounted(() => {
  const pages = getCurrentPages()
  const options = pages[pages.length - 1].options
  
  paramsRec.value = {
    id: options.id,
    type: options.type,
    categoryId: options.categoryId
  }
  
  loadData(true)
})

async function loadData(firstLoad = false) {
  if (!hasMore.value && !firstLoad) return

  try {
    const res = await getWallpaperList({ 
      type: paramsRec.value.type, 
      categoryId: paramsRec.value.categoryId,
      pageNum: pageNum.value, 
      pageSize: pageSize 
    })
    
    if (firstLoad) {
      list.value = res.list
      totalCount.value = res.total
      initImageLoading(res.total)
      
      let targetIndex = -1
      
      if (paramsRec.value.id) {
        targetIndex = list.value.findIndex(item => item.id == paramsRec.value.id)
        
        while (targetIndex === -1 && hasMore.value) {
          pageNum.value++
          if (list.value.length >= res.total) {
            hasMore.value = false
            break
          }
          
          const nextRes = await getWallpaperList({ 
            type: paramsRec.value.type, 
            categoryId: paramsRec.value.categoryId,
            pageNum: pageNum.value, 
            pageSize: pageSize 
          })
          
          list.value = [...list.value, ...nextRes.list]
          targetIndex = list.value.findIndex(item => item.id == paramsRec.value.id)
          
          if (list.value.length >= nextRes.total || nextRes.list.length < pageSize) {
            hasMore.value = false
          }
        }
        
        if (targetIndex !== -1) {
          currentSwiperIndex.value = targetIndex
        }
      }
      
      isReady.value = true
    } else {
      const newList = [...list.value, ...res.list]
      list.value = newList
      // 补充新加载项的 loading 状态
      res.list.forEach((_, i) => {
        imageLoading.value[list.value.length - res.list.length + i] = true
        imageError.value[list.value.length - res.list.length + i] = false
      })
    }
    
    if (list.value.length >= res.total) {
      hasMore.value = false
    } else {
      pageNum.value++
    }
  } catch (e) {
    console.error(e)
  }
}

// 辅助函数：获取极小缩略图作为加载占位
function getSmallUrl(url) {
  if (url.includes('pexels.com')) {
    // Pexels 支持动态尺寸，请求 50px 宽的极小图配合模糊滤镜
    return url.split('?')[0] + '?auto=compress&cs=tinysrgb&w=50';
  }
  // 其他来源若不支持动态缩略图，则返回原图，利用其作为背景渲染
  return url;
}

function shouldRender(index) {
  // 兼顾性能与流畅度：前后各预留 2 张 (共预加载 5 张)
  return Math.abs(index - currentSwiperIndex.value) <= 2
}

function onSwiperChange(e) {
  const index = e.detail.current
  currentSwiperIndex.value = index
  
  // 记录历史
  if (list.value[index]) {
    userStore.addHistory(list.value[index])
  }
  
  // 预加载逻辑：当滑动到倒数第2张且还有更多数据时，加载下一页
  if (hasMore.value && index >= list.value.length - 2) {
    loadData(false)
  }
}

function onImageLoad(index) {
  // 使用 Vue reactive 特性，直接给对象属性赋值也能触发更新，
  // 为了万无一失，我们使用新对象触发全量检测
  imageLoading.value = { ...imageLoading.value, [index]: false }
}

function onImageError(index) {
  imageLoading.value = { ...imageLoading.value, [index]: false }
  imageError.value = { ...imageError.value, [index]: true }
  console.error(`图片 ${index} 加载失败`);
}

function retryLoadImage(index, url) {
  imageError.value = { ...imageError.value, [index]: false }
  imageLoading.value = { ...imageLoading.value, [index]: true }
  
  uni.downloadFile({
    url: url,
    success: (res) => {
      if (res.statusCode === 200) {
        onImageLoad(index)
      } else {
        onImageError(index)
      }
    },
    fail: () => {
      onImageError(index)
    }
  })
}

function toggleInfo() {
  showInfo.value = !showInfo.value
}

function goBack() {
  uni.navigateBack()
}

function isFavorite(id) {
  return userStore.favorites.some(f => f.id === id)
}

const handleFavorite = throttle((item) => {
  if (isFavorite(item.id)) {
    userStore.removeFavorite(item.id)
    uni.showToast({ title: '已取消', icon: 'none' })
  } else {
    userStore.addFavorite(item)
    uni.showToast({ title: '已收藏' })
  }
}, 500)

const handleDownload = throttle(async (item) => {
  // #ifdef H5
  uni.showToast({ title: '长按图片即可保存', icon: 'none' });
  return;
  // #endif

  // #ifdef MP-WEIXIN
  try {
    uni.showLoading({ title: '准备下载...', mask: true });

    await checkAndRequestAuth();

    uni.showLoading({ title: '下载中...', mask: true });

    const downloadRes = await uni.downloadFile({
      url: item.pic_url,
      timeout: 30000
    });

    if (downloadRes.statusCode === 200) {
      uni.hideLoading();

      const saveImage = () => {
        uni.saveImageToPhotosAlbum({
          filePath: downloadRes.tempFilePath,
          success: () => {
            uni.showModal({
              title: '保存成功',
              content: '壁纸已保存到系统相册，快去设置为壁纸吧~',
              showCancel: false
            });
            userStore.addDownload(item);
          },
          fail: (err) => {
            console.error('保存失败:', err);
            if (err.errMsg && (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied'))) {
              uni.showModal({
                title: '需要授权',
                content: '需要您授权保存相册权限才能下载壁纸',
                confirmText: '去授权',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.writePhotosAlbum']) {
                          saveImage();
                        } else {
                          uni.showToast({ title: '未授权，无法保存', icon: 'none' });
                        }
                      },
                      fail: () => {
                        uni.showToast({ title: '打开设置失败', icon: 'none' });
                      }
                    });
                  }
                }
              });
            } else {
              uni.showToast({ title: '保存失败: ' + (err.errMsg || '未知错误'), icon: 'none', duration: 3000 });
            }
          }
        });
      };

      saveImage();
    } else {
      throw new Error(`下载失败，状态码: ${downloadRes.statusCode}`);
    }
  } catch (err) {
    uni.hideLoading();
    console.error('下载错误:', err);
    
    if (err.message === '用户取消' || err.message === '未授权') {
      return;
    }
    
    let errorMsg = '下载失败';
    if (err.errMsg) {
      if (err.errMsg.includes('fail timeout')) {
        errorMsg = '下载超时，请检查网络';
      } else if (err.errMsg.includes('fail')) {
        errorMsg = '网络错误，请重试';
      } else if (err.errMsg.includes('url not in domain list')) {
        errorMsg = '图片域名未配置，请联系开发者';
      } else if (err.errMsg.includes('fail:download')) {
        errorMsg = '下载失败，请检查网络连接';
      } else {
        errorMsg = err.errMsg;
      }
    }
    
    uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 });
  }
  // #endif

  // #ifndef MP-WEIXIN
  uni.showLoading({ title: '下载中...', mask: true });
  
  try {
    const downloadRes = await uni.downloadFile({
      url: item.pic_url,
      timeout: 30000
    });
    
    if (downloadRes.statusCode === 200) {
      await uni.saveImageToPhotosAlbum({
        filePath: downloadRes.tempFilePath
      });
      
      uni.hideLoading();
      uni.showModal({
        title: '保存成功',
        content: '壁纸已保存到系统相册，快去设置为壁纸吧~',
        showCancel: false
      });
      userStore.addDownload(item);
    } else {
      throw new Error(`下载失败，状态码: ${downloadRes.statusCode}`);
    }
  } catch (err) {
    uni.hideLoading();
    console.error('下载错误:', err);
    
    let errorMsg = '下载失败';
    if (err.errMsg) {
      if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
        uni.showModal({
          title: '需要授权',
          content: '需要保存相册权限才能下载壁纸',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                fail: () => {
                  uni.showToast({ title: '打开设置失败', icon: 'none' });
                }
              });
            }
          }
        });
        return;
      } else if (err.errMsg.includes('fail timeout')) {
        errorMsg = '下载超时，请检查网络';
      } else if (err.errMsg.includes('fail')) {
        errorMsg = '网络错误，请重试';
      } else if (err.errMsg.includes('url not in domain list')) {
        errorMsg = '图片域名未配置，请联系开发者';
      } else {
        errorMsg = err.errMsg;
      }
    }
    
    uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 });
  }
  // #endif
}, 1000)

const checkAndRequestAuth = () => {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          resolve(true);
        } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
          uni.showModal({
            title: '需要授权',
            content: '需要您授权保存相册权限才能下载壁纸',
            confirmText: '去授权',
            success: (modalRes) => {
              if (modalRes.confirm) {
                uni.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.writePhotosAlbum']) {
                      resolve(true);
                    } else {
                      reject(new Error('未授权'));
                    }
                  },
                  fail: () => {
                    reject(new Error('打开设置失败'));
                  }
                });
              } else {
                reject(new Error('用户取消'));
              }
            }
          });
        } else {
          uni.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              resolve(true);
            },
            fail: () => {
              uni.showModal({
                title: '需要授权',
                content: '需要您授权保存相册权限才能下载壁纸',
                confirmText: '去授权',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    uni.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.writePhotosAlbum']) {
                          resolve(true);
                        } else {
                          reject(new Error('未授权'));
                        }
                      },
                      fail: () => {
                        reject(new Error('打开设置失败'));
                      }
                    });
                  } else {
                    reject(new Error('用户取消'));
                  }
                }
              });
            }
          });
        }
      },
      fail: () => {
        reject(new Error('获取设置失败'));
      }
    });
  });
}
</script>

<style lang="scss" scoped>
.preview-page { 
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw; 
  height: 100vh; 
  background: #050505; 
  overflow: hidden; // 禁止页面级滚动
  z-index: 999;
}
.full-swiper { width: 100%; height: 100%; }
.wall-container { 
  width: 100%; 
  height: 100%; 
  position: relative; 
  overflow: hidden; // 禁止内部容器滚动
}
.full-image { 
  width: 100%; 
  height: 100%; 
  display: block; 
  position: relative;
  z-index: 2;
  background: #1a1a1a;
}

.blur-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: blur(40px);
  transform: scale(1.1);
  z-index: 1;
  background: #1a1a1a;
  transition: opacity 0.5s ease;
}

.error-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  z-index: 2;
  gap: 20rpx;
  
  .error-icon {
    opacity: 0.5;
  }
  
  .error-text {
    font-size: 28rpx;
    color: #999;
  }
  
  .retry-text {
    font-size: 24rpx;
    color: $brand-color;
    margin-top: 10rpx;
  }
}

.loading-state { position: absolute; inset: 0; @include flex-center; .spinner { width: 60rpx; height: 60rpx; border: 4rpx solid rgba(255,255,255,0.05); border-top-color: $brand-color; border-radius: 50%; animation: spin 1s linear infinite; } }

.content-overlay { position: absolute; inset: 0; z-index: 10; }
.top-gradient { position: absolute; top: 0; left: 0; right: 0; height: 20vh; background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent); }
.bottom-gradient { position: absolute; bottom: 0; left: 0; right: 0; height: 40vh; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%); }

.nav-bar {
  position: relative; z-index: 20; display: flex; align-items: center; padding: 0 40rpx; height: 100rpx;
  .back-btn { width: 80rpx; height: 80rpx; border-radius: 50%; background: rgba(0,0,0,0.2); backdrop-filter: blur(20rpx); @include flex-center; }
  
  .counter-badge {
    position: absolute; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.3); backdrop-filter: blur(10rpx); padding: 6rpx 24rpx; border-radius: 30rpx; display: flex; align-items: center; gap: 4rpx;
    .curr { color: #fff; font-size: 32rpx; font-weight: 700; }
    .divider { color: rgba(255,255,255,0.4); font-size: 24rpx; margin: 0 4rpx; }
    .total { color: rgba(255,255,255,0.6); font-size: 24rpx; }
  }
}

.side-actions {
  position: absolute; right: 30rpx; bottom: 320rpx; z-index: 20; display: flex; flex-direction: column; gap: 30rpx;
  .action-item {
    display: flex; flex-direction: column; align-items: center; gap: 6rpx;
    .icon-box {
      width: 90rpx; height: 90rpx; background: rgba(255,255,255,0.1); backdrop-filter: blur(30rpx); border-radius: 50%; @include flex-center;
      &.active { background: rgba(255, 71, 87, 0.15); border: 2rpx solid rgba(255, 71, 87, 0.2); }
    }
    text { color: #fff; font-size: 20rpx; opacity: 0.9; }
  }
}

.bottom-panel {
  position: absolute; left: 0; right: 0; bottom: 0; padding: 40rpx 40rpx calc(40rpx + env(safe-area-inset-bottom)); z-index: 20;
  .panel-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24rpx;
    .title { font-size: 40rpx; font-weight: 900; color: #fff; margin-bottom: 8rpx; display: block; }
    .tags { display: flex; gap: 12rpx; text { font-size: 20rpx; color: $brand-color; font-weight: 700; background: rgba(40,179,137,0.15); padding: 4rpx 14rpx; border-radius: 6rpx; } }
    .score-badge { background: rgba(255,215,0,0.1); color: #ffd700; font-size: 32rpx; font-weight: 900; padding: 4rpx 16rpx; border-radius: 12rpx; }
  }
  .desc { font-size: 26rpx; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 30rpx; display: block; }
  .swipe-tip { text-align: center; color: rgba(255,255,255,0.3); font-size: 20rpx; letter-spacing: 4rpx; }
}

.wallpaper-id {
  position: absolute;
  right: 30rpx;
  bottom: calc(40rpx + env(safe-area-inset-bottom)); // 位于底部面板上方或边缘
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5); // 保持较清晰的可见度
  z-index: 30; // 提升层级，确保不被任何底层元素覆盖
  pointer-events: none;
  font-family: monospace;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3); // 阴影增强识别
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>