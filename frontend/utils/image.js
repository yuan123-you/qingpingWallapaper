const IMAGE_CACHE_PREFIX = 'img_cache_'
const IMAGE_CACHE_DURATION = 24 * 60 * 60 * 1000

function getImageCacheKey(url) {
  return `${IMAGE_CACHE_PREFIX}${btoa(url)}`
}

function getImageCache(url) {
  try {
    const cached = uni.getStorageSync(getImageCacheKey(url))
    if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_DURATION) {
      return cached.data
    }
    return null
  } catch (e) {
    return null
  }
}

function setImageCache(url, data) {
  try {
    uni.setStorageSync(getImageCacheKey(url), {
      data,
      timestamp: Date.now()
    })
  } catch (e) {
    console.warn('Image cache set failed:', e)
  }
}

function optimizeImageUrl(url) {
  if (!url) return url
  
  if (url.includes('picsum.photos')) {
    const match = url.match(/picsum\.photos\/(\d+)\/(\d+)/)
    if (match) {
      const width = Math.min(parseInt(match[1]), 800)
      const height = Math.min(parseInt(match[2]), 1200)
      return url.replace(/\/\d+\/\d+/, `/${width}/${height}`)
    }
  }
  
  return url
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const cached = getImageCache(url)
    if (cached) {
      resolve(cached)
      return
    }
    
    uni.downloadFile({
      url: optimizeImageUrl(url),
      success: (res) => {
        if (res.statusCode === 200) {
          setImageCache(url, res.tempFilePath)
          resolve(res.tempFilePath)
        } else {
          reject(new Error('Download failed'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

function batchPreloadImages(urls, maxConcurrent = 3) {
  return new Promise((resolve, reject) => {
    const results = []
    let currentIndex = 0
    let activeCount = 0
    let completedCount = 0
    
    const loadNext = () => {
      if (currentIndex >= urls.length) return
      
      const url = urls[currentIndex++]
      activeCount++
      
      preloadImage(url)
        .then((result) => {
          results[currentIndex - 1] = result
          activeCount--
          completedCount++
          
          if (completedCount === urls.length) {
            resolve(results)
          } else {
            loadNext()
          }
        })
        .catch((err) => {
          results[currentIndex - 1] = null
          activeCount--
          completedCount++
          
          if (completedCount === urls.length) {
            resolve(results)
          } else {
            loadNext()
          }
        })
    }
    
    for (let i = 0; i < Math.min(maxConcurrent, urls.length); i++) {
      loadNext()
    }
  })
}

function clearImageCache() {
  try {
    const res = uni.getStorageInfoSync()
    const keys = res.keys || []
    
    keys.forEach(key => {
      if (key.startsWith(IMAGE_CACHE_PREFIX)) {
        uni.removeStorageSync(key)
      }
    })
    
    return true
  } catch (e) {
    console.error('Clear image cache failed:', e)
    return false
  }
}

function getCacheSize() {
  try {
    const res = uni.getStorageInfoSync()
    const keys = res.keys || []
    let totalSize = 0
    
    keys.forEach(key => {
      if (key.startsWith(IMAGE_CACHE_PREFIX)) {
        const data = uni.getStorageSync(key)
        if (data && data.data) {
          totalSize += JSON.stringify(data).length
        }
      }
    })
    
    return (totalSize / 1024 / 1024).toFixed(2) + ' MB'
  } catch (e) {
    return '0 MB'
  }
}

export default {
  optimizeImageUrl,
  preloadImage,
  batchPreloadImages,
  clearImageCache,
  getCacheSize,
  getImageCache
}