import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const openid = ref('')
  const favorites = ref([])
  const history = ref([])

  function initUserInfo() {
    const storedUserInfo = uni.getStorageSync('userInfo')
    const storedOpenid = uni.getStorageSync('openid')
    const storedFavorites = uni.getStorageSync('favorites')
    const storedHistory = uni.getStorageSync('history')
    
    if (storedUserInfo) userInfo.value = storedUserInfo
    if (storedOpenid) openid.value = storedOpenid
    if (storedFavorites) favorites.value = storedFavorites
    if (storedHistory) history.value = storedHistory
  }

  function setUserInfo(info) {
    userInfo.value = info
    uni.setStorageSync('userInfo', info)
  }

  function setOpenid(id) {
    openid.value = id
    uni.setStorageSync('openid', id)
  }

  function addFavorite(wallpaper) {
    const exists = favorites.value.find(item => item.id === wallpaper.id)
    if (!exists) {
      favorites.value.unshift(wallpaper)
      uni.setStorageSync('favorites', favorites.value)
    }
  }

  function removeFavorite(id) {
    const index = favorites.value.findIndex(item => item.id === id)
    if (index > -1) {
      favorites.value.splice(index, 1)
      uni.setStorageSync('favorites', favorites.value)
    }
  }

  function addHistory(wallpaper) {
    const exists = history.value.find(item => item.id === wallpaper.id)
    if (exists) {
      const index = history.value.findIndex(item => item.id === wallpaper.id)
      history.value.splice(index, 1)
    }
    history.value.unshift(wallpaper)
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }
    uni.setStorageSync('history', history.value)
  }

  function clearHistory() {
    history.value = []
    uni.removeStorageSync('history')
  }

  return {
    userInfo,
    openid,
    favorites,
    history,
    initUserInfo,
    setUserInfo,
    setOpenid,
    addFavorite,
    removeFavorite,
    addHistory,
    clearHistory
  }
})