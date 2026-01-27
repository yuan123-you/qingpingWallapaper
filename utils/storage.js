const STORAGE_PREFIX = 'qp_'

export default {
  set(key, value, isTemp = false) {
    const storageKey = isTemp ? `${STORAGE_PREFIX}temp_${key}` : `${STORAGE_PREFIX}${key}`
    uni.setStorageSync(storageKey, value)
  },
  
  get(key, isTemp = false) {
    const storageKey = isTemp ? `${STORAGE_PREFIX}temp_${key}` : `${STORAGE_PREFIX}${key}`
    return uni.getStorageSync(storageKey)
  },
  
  remove(key, isTemp = false) {
    const storageKey = isTemp ? `${STORAGE_PREFIX}temp_${key}` : `${STORAGE_PREFIX}${key}`
    uni.removeStorageSync(storageKey)
  },
  
  clear(isTemp = false) {
    const prefix = isTemp ? `${STORAGE_PREFIX}temp_` : STORAGE_PREFIX
    const keys = uni.getStorageInfoSync().keys
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        uni.removeStorageSync(key)
      }
    })
  },
  
  setWithExpire(key, value, expireTime) {
    const data = {
      value,
      expire: Date.now() + expireTime
    }
    this.set(key, data)
  },
  
  getWithExpire(key) {
    const data = this.get(key)
    if (!data) return null
    
    if (Date.now() > data.expire) {
      this.remove(key)
      return null
    }
    
    return data.value
  }
}