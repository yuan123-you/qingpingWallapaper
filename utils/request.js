const BASE_URL = 'https://qingping-wallpaper-api.1628973345.workers.dev'

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || '',
        ...options.header
      },
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.errCode === 0) {
            resolve(res.data)
          } else {
            uni.showToast({
              title: res.data.errMsg || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else {
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default {
  get(url, data = {}) {
    return request({
      url,
      method: 'GET',
      data
    })
  },
  
  post(url, data = {}) {
    return request({
      url,
      method: 'POST',
      data
    })
  },
  
  put(url, data = {}) {
    return request({
      url,
      method: 'PUT',
      data
    })
  },
  
  delete(url, data = {}) {
    return request({
      url,
      method: 'DELETE',
      data
    })
  }
}