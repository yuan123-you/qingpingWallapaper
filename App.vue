<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onLaunch(() => {
  console.log('App Launch')
  userStore.initUserInfo()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/uni.scss';

page {
  background-color: $page-bg;
  font-size: 28rpx;
  color: $text-primary;
}

.page-bg {
  background: linear-gradient(to bottom, transparent, #f8f9fa 300rpx),
              linear-gradient(to right, #e8f5e9, #f5fafe);
  min-height: 100vh;
}
</style>