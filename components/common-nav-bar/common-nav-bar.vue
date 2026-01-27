<template>
  <view class="common-nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-bar-content">
      <view class="nav-bar-left" @click="handleBack" v-if="showBack">
        <text class="icon-back">‹</text>
      </view>
      <view class="nav-bar-title">{{ title }}</view>
      <view class="nav-bar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  }
})

const statusBarHeight = ref(0)

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

function handleBack() {
  uni.navigateBack({
    delta: 1
  })
}
</script>

<style lang="scss" scoped>
.common-nav-bar {
  width: 100%;
  background-color: v-bind(backgroundColor);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.nav-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
}

.nav-bar-left {
  width: 60rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.icon-back {
  font-size: 60rpx;
  font-weight: 300;
  color: #333;
}

.nav-bar-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.nav-bar-right {
  width: 60rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>