<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px" class="layout-aside">
        <div class="logo">轻屏壁纸</div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/wallpaper">
            <el-icon><Picture /></el-icon>
            <span>壁纸管理</span>
          </el-menu-item>
          <el-menu-item index="/classify">
            <el-icon><Folder /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/banner">
            <el-icon><Picture-Rounded /></el-icon>
            <span>轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/notice">
            <el-icon><Bell /></el-icon>
            <span>公告管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="layout-header">
          <div class="header-left">
            <span class="page-title">{{ currentPageTitle }}</span>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-icon><User /></el-icon>
                {{ adminStore.userInfo?.username || '管理员' }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const activeMenu = computed(() => route.path)
const currentPageTitle = computed(() => route.meta?.title || '管理后台')

function handleCommand(command) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      adminStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
  }
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #f5f7fa;
}

:deep(.el-container) {
  height: 100%;
  overflow: hidden;
}

.layout-aside {
  background-color: #304156;
  color: #fff;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
  background-color: #304156;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep(.el-menu) {
  border-right: none;
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #304156;
}

:deep(.el-menu-item) {
  background-color: #304156;
  color: #bfcbd9;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
}

:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
  color: #fff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
  color: #fff !important;
}

:deep(.el-menu-item span) {
  color: inherit;
  font-size: 14px;
}

:deep(.el-menu-item .el-icon) {
  color: inherit;
  margin-right: 8px;
  font-size: 18px;
}

:deep(.el-menu-item .el-menu-item__icon) {
  color: inherit;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 200px;
  right: 0;
  z-index: 99;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.el-dropdown-link:hover {
  background-color: #f5f7fa;
}

.layout-main {
  background: #f5f7fa;
  padding: 20px;
  padding-top: 80px;
  padding-bottom: 100px;
  margin-left: 200px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

:deep(.el-container) {
  height: 100%;
}

:deep(.el-image-viewer__wrapper) {
  position: fixed !important;
  z-index: 99999 !important;
}

:deep(.el-image-viewer__mask) {
  position: absolute !important;
  z-index: 99999 !important;
}

:deep(.el-image-viewer__canvas) {
  position: relative !important;
  z-index: 99999 !important;
}

:deep(.el-image-viewer__btn) {
  z-index: 100000 !important;
}

:deep(.el-image-viewer__close) {
  z-index: 100000 !important;
}

:deep(.el-image-viewer__actions) {
  z-index: 100000 !important;
}

:deep(.el-image-viewer__prev) {
  z-index: 100000 !important;
}

:deep(.el-image-viewer__next) {
  z-index: 100000 !important;
}
</style>