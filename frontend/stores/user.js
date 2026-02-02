import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const favorites = ref([])
  const history = ref([])
  const token = ref('')
  
  function initUserInfo() {
    const savedUserInfo = uni.getStorageSync('userInfo')
    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }
    
    const savedFavorites = uni.getStorageSync('favorites')
    if (savedFavorites) {
      favorites.value = savedFavorites
    }
    
    const savedHistory = uni.getStorageSync('history')
    if (savedHistory) {
      history.value = savedHistory
    }
    
    const savedToken = uni.getStorageSync('token')
    if (savedToken) {
      token.value = savedToken
    }
  }
  
  function setUserInfo(data) {
    userInfo.value = data
    uni.setStorageSync('userInfo', data)
  }
  
  function updateAvatar(avatarUrl) {
    if (userInfo.value) {
      userInfo.value.avatarUrl = avatarUrl
      uni.setStorageSync('userInfo', userInfo.value)
    }
  }
  
  function setFavorites(data) {
    favorites.value = data
    uni.setStorageSync('favorites', data)
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
  
  function setHistory(data) {
    history.value = data
    uni.setStorageSync('history', data)
  }
  
  function addHistory(item) {
    const exists = history.value.some(h => h.id === item.id)
    if (!exists) {
      const historyItem = {
        ...item,
        viewTime: Date.now()
      }
      history.value.unshift(historyItem)
      if (history.value.length > 50) {
        history.value = history.value.slice(0, 50)
      }
      uni.setStorageSync('history', history.value)
    }
  }
  
  function clearHistory() {
    history.value = []
    uni.setStorageSync('history', [])
  }
  
  function setToken(data) {
    token.value = data
    uni.setStorageSync('token', data)
  }
  
  function clearToken() {
    token.value = ''
    uni.removeStorageSync('token')
  }
  
  function logout() {
    userInfo.value = null
    favorites.value = []
    history.value = []
    token.value = ''
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('favorites')
    uni.removeStorageSync('history')
    uni.removeStorageSync('token')
  }
  
  return {
    userInfo,
    favorites,
    history,
    token,
    initUserInfo,
    setUserInfo,
    updateAvatar,
    setFavorites,
    addFavorite,
    removeFavorite,
    setHistory,
    addHistory,
    clearHistory,
    setToken,
    clearToken,
    logout
  }
})
