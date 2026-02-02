<template>
  <view class="container">
    <view class="login-box">
      <view class="logo-area">
        <view class="logo-icon">LS</view>
        <text class="title">LightScreen</text>
        <text class="subtitle">让屏幕重焕光彩的力量</text>
      </view>

      <view class="btn-group">
        <button class="wechat-btn" @click="handleWechatLogin" :loading="wechatLoading">
          <uni-icons type="weixin" size="24" color="#fff" style="margin-right: 12rpx;"></uni-icons>
          微信一键登录
        </button>
        <text class="agreement">登录即代表同意《用户协议》与《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const wechatLoading = ref(false)

async function handleWechatLogin() {
  if (wechatLoading.value) return
  
  wechatLoading.value = true
  
  try {
    uni.showLoading({ title: '安全登录中...' })
    
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })
    
    uni.hideLoading()
    
    const code = loginRes.code
    // 模拟微信登录逻辑，实际环境中应发送 code 到服务器换取 token
    
    userStore.setUserInfo({
      nickname: '微信用户',
      avatarUrl: '/static/default_avatar.png'
    })
    userStore.setToken('wechat_token_' + code)
    
    uni.showToast({ title: '欢迎回来', icon: 'success' })
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (err) {
    uni.hideLoading()
    console.error(err)
    uni.showToast({ title: '登录服务异常', icon: 'none' })
  } finally {
    wechatLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  @include flex-center;
  padding: 60rpx;
}

.login-box {
  width: 100%;
  animation: fadeIn 0.8s ease-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 60vh; 
}

.logo-area {
  @include flex-center;
  flex-direction: column;
  margin-top: 60rpx;
  
  .logo-icon {
    width: 160rpx;
    height: 160rpx;
    background: $brand-gradient;
    border-radius: 46rpx;
    @include flex-center;
    color: #fff;
    font-size: 70rpx;
    font-weight: 900;
    box-shadow: 0 30rpx 60rpx rgba(40, 179, 137, 0.25);
    margin-bottom: 40rpx;
  }
  
  .title {
    font-size: 60rpx;
    font-weight: 900;
    color: #1a1a1a;
    letter-spacing: -2rpx;
    margin-bottom: 16rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #999;
    letter-spacing: 2rpx;
  }
}

.btn-group {
  width: 100%;
  .wechat-btn {
    width: 100%;
    height: 110rpx;
    background: #07c160;
    border-radius: 55rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    @include flex-center;
    border: none;
    box-shadow: 0 20rpx 40rpx rgba(7, 193, 96, 0.2);
    margin-bottom: 30rpx;
    
    &::after { display: none; }
    &:active { transform: scale(0.98); opacity: 0.9; }
  }
  
  .agreement {
    font-size: 22rpx;
    color: #ccc;
    text-align: center;
    display: block;
  }
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>