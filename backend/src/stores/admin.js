import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const token = ref(localStorage.getItem('adminToken') || '')
  const userInfo = ref(null)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('adminToken', newToken)
  }

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('adminUserInfo', JSON.stringify(info))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUserInfo')
  }

  function initUserInfo() {
    const storedUserInfo = localStorage.getItem('adminUserInfo')
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo)
    }
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout,
    initUserInfo
  }
})