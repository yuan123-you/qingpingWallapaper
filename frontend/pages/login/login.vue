<template>
  <view class="page-bg">
    <view class="login-container">
      <view class="login-header">
        <image class="logo" src="/static/tabBar/home.png" mode="aspectFit"></image>
        <text class="app-name">轻屏壁纸</text>
        <text class="app-slogan">高清壁纸，一键下载</text>
      </view>

      <view class="login-content">
        <view class="login-tips">
          <text class="tip-text">登录后可以收藏壁纸、查看浏览历史</text>
        </view>

        <button class="login-btn" @click="handleLogin">
          <text class="btn-icon">📱</text>
          <text>微信一键登录</text>
        </button>

        <view class="agreement">
          <text class="agreement-text">登录即表示同意</text>
          <text class="agreement-link" @click="goToAgreement">《用户协议》</text>
          <text class="agreement-text">和</text>
          <text class="agreement-link" @click="goToPrivacy">《隐私政策》</text>
        </view>
      </view>

      <view class="login-footer">
        <text class="footer-text">版本 2.0.0</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { userLogin } from '@/api/user/index.js'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

async function handleLogin() {
  try {
    uni.showLoading({
      title: '登录中...'
    })

    const loginRes = await uni.login({
      provider: 'weixin'
    })

    if (loginRes.code) {
      const res = await userLogin({
        code: loginRes.code,
        userInfo: {}
      })

      if (res && res.token) {
        userStore.setToken(res.token)
        userStore.setUserInfo({
          openid: res.openid,
          nickName: '微信用户',
          avatarUrl: ''
        })

        uni.hideLoading()
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        uni.hideLoading()
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
    } else {
      uni.hideLoading()
      uni.showToast({
        title: '获取登录凭证失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('登录失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  }
}

function goToAgreement() {
  uni.showToast({
    title: '用户协议',
    icon: 'none'
  })
}

function goToPrivacy() {
  uni.showToast({
    title: '隐私政策',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;
  margin-top: 100rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(40, 179, 137, 0.2);
}

.app-name {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 15rpx;
}

.app-slogan {
  font-size: 28rpx;
  color: #999;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-tips {
  margin-bottom: 60rpx;
  text-align: center;
}

.tip-text {
  font-size: 28rpx;
  color: #666;
}

.login-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #28b389, #40c79c);
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(40, 179, 137, 0.3);
  margin-bottom: 40rpx;
}

.btn-icon {
  font-size: 40rpx;
}

.agreement {
  text-align: center;
  margin-top: 40rpx;
}

.agreement-text {
  font-size: 24rpx;
  color: #999;
}

.agreement-link {
  font-size: 24rpx;
  color: #28b389;
}

.login-footer {
  margin-top: auto;
  text-align: center;
  padding: 30rpx 0;
}

.footer-text {
  font-size: 24rpx;
  color: #ccc;
}
</style>
