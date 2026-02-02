import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const defaultUserInfo = {
    nickname: '光影拾荒者',
    avatarUrl: '/static/default_avatar.png',
    bio: '在这个视觉至上的时代，寻找那一抹属于自己的色彩。'
  }

  const userInfo = ref(null)
  const favorites = ref([])
  const history = ref([])
  const downloads = ref([])
  const token = ref('')

  function initUserInfo() {
    // 基础持久化加载
    const savedUserInfo = uni.getStorageSync('userInfo')
    if (savedUserInfo) {
      // 确保即使有缓存，如果缺失关键字段（如头像），也能用默认值补全
      userInfo.value = {
        ...defaultUserInfo,
        ...savedUserInfo
      }
      // 核心修复：强制清洗旧数据，如果头像包含 'unsplash' 或为空，立即重置为本地默认
      if (!userInfo.value.avatarUrl || userInfo.value.avatarUrl.includes('unsplash')) {
        userInfo.value.avatarUrl = defaultUserInfo.avatarUrl
      }
      // 同步回本地存储（修复旧数据）
      uni.setStorageSync('userInfo', userInfo.value)
    } else {
      // 首次进入：设置默认并保存
      userInfo.value = { ...defaultUserInfo }
      uni.setStorageSync('userInfo', userInfo.value)
    }

    // 加载其他数据
    const savedFavorites = uni.getStorageSync('favorites')
    if (savedFavorites) favorites.value = savedFavorites

    const savedHistory = uni.getStorageSync('history')
    if (savedHistory) history.value = savedHistory

    const savedDownloads = uni.getStorageSync('downloads')
    if (savedDownloads) downloads.value = savedDownloads

    const savedToken = uni.getStorageSync('token')
    if (savedToken) token.value = savedToken
  }

  function setUserInfo(data) {
    const newData = { ...(userInfo.value || defaultUserInfo), ...data }
    userInfo.value = newData
    uni.setStorageSync('userInfo', newData)
  }

  function updateAvatar(avatarUrl) {
    if (userInfo.value) {
      userInfo.value.avatarUrl = avatarUrl
      uni.setStorageSync('userInfo', userInfo.value)
    }
  }

  function updateNickname(nickname) {
    if (userInfo.value) {
      userInfo.value.nickname = nickname
      uni.setStorageSync('userInfo', userInfo.value)
    }
  }

  function addFavorite(item) {
    const exists = favorites.value.some(fav => fav.id === item.id)
    if (!exists) {
      favorites.value.unshift(item)
      uni.setStorageSync('favorites', favorites.value)
    }
  }

  function removeFavorite(id) {
    favorites.value = favorites.value.filter(fav => fav.id !== id)
    uni.setStorageSync('favorites', favorites.value)
  }

  function addHistory(item) {
    const index = history.value.findIndex(h => h.id === item.id)
    if (index !== -1) history.value.splice(index, 1)

    const historyItem = { ...item, viewTime: Date.now() }
    history.value.unshift(historyItem)
    if (history.value.length > 50) history.value = history.value.slice(0, 50)
    uni.setStorageSync('history', history.value)
  }

  function clearHistory() {
    history.value = []
    uni.setStorageSync('history', [])
  }

  function addDownload(item) {
    const exists = downloads.value.some(d => d.id === item.id)
    if (!exists) {
      downloads.value.unshift(item)
      uni.setStorageSync('downloads', downloads.value)
    }
  }

  function setToken(data) {
    token.value = data
    uni.setStorageSync('token', data)
  }

  function logout() {
    // 退出仅清除token，保留userInfo以满足“以后直接调用”的需求
    token.value = ''
    uni.removeStorageSync('token')
    // 如果需要彻底登出可以重置 userInfo 
  }

  return {
    userInfo,
    favorites,
    history,
    downloads,
    token,
    initUserInfo,
    setUserInfo,
    updateAvatar,
    updateNickname,
    addFavorite,
    removeFavorite,
    addHistory,
    clearHistory,
    addDownload,
    setToken,
    logout
  }
})
