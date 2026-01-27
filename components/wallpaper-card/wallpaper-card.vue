<template>
  <view class="wallpaper-card" @click="handleClick">
    <image 
      class="wallpaper-card__cover" 
      :src="wallpaper.pic_url" 
      mode="aspectFill"
      :lazy-load="true"
      @load="handleImageLoad"
    ></image>
    <view class="wallpaper-card__info">
      <text class="wallpaper-card__title">{{ wallpaper.title || '壁纸' }}</text>
      <view class="wallpaper-card__meta">
        <view class="wallpaper-card__score">
          <text class="icon-star">★</text>
          <text>{{ wallpaper.score || '0.0' }}</text>
        </view>
        <view class="wallpaper-card__download">
          <text class="icon-download">↓</text>
          <text>{{ formatNumber(wallpaper.download_count || 0) }}</text>
        </view>
      </view>
    </view>
    <view class="wallpaper-card__favorite" @click.stop="handleFavorite">
      <text :class="['icon-heart', isFavorite ? 'active' : '']">{{ isFavorite ? '♥' : '♡' }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { formatNumber } from '@/utils/format.js'

const props = defineProps({
  wallpaper: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'favorite'])

const userStore = useUserStore()

const isFavorite = computed(() => {
  return userStore.favorites.some(item => item.id === props.wallpaper.id)
})

function handleClick() {
  emit('click', props.wallpaper)
}

function handleFavorite() {
  if (isFavorite.value) {
    userStore.removeFavorite(props.wallpaper.id)
  } else {
    userStore.addFavorite(props.wallpaper)
  }
  emit('favorite', props.wallpaper, !isFavorite.value)
}

function handleImageLoad() {
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
.wallpaper-card {
  position: relative;
  background: $card-bg;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $box-shadow-base;
}

.wallpaper-card__cover {
  width: 100%;
  height: 400rpx;
  display: block;
}

.wallpaper-card__info {
  padding: 20rpx;
}

.wallpaper-card__title {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
  @include text-ellipsis;
  display: block;
  margin-bottom: 16rpx;
}

.wallpaper-card__meta {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.wallpaper-card__score,
.wallpaper-card__download {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.icon-star {
  color: #FFB800;
}

.wallpaper-card__favorite {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-heart {
  font-size: 36rpx;
  color: #fff;
  transition: all 0.3s;
}

.icon-heart.active {
  color: #FF4757;
}
</style>