<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onLaunch(() => {
  // 初始化用户信息
  userStore.initUserInfo()
})

onShow(() => {
})

onHide(() => {
})
</script>

<style lang="scss">
@import '@/uni.scss';

page {
  background-color: #F8F9FA;
  font-size: 28rpx;
  color: #333;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.page-bg {
  background: linear-gradient(to bottom, transparent, #f8f9fa 300rpx),
              linear-gradient(to right, #e8f5e9, #f5fafe);
  min-height: 100vh;
}

/* 适配小程序底部安全区域 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 适配小程序顶部安全区域 */
.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}
</style>
