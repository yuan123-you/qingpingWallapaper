import wallpaperData from '@/static/data/wallpaper.json'
import classifyData from '@/static/data/classify.json'
import bannerData from '@/static/data/banner.json'
import noticeData from '@/static/data/notice.json'

const mockData = {
  wallpaper: wallpaperData,
  classify: classifyData,
  banner: bannerData,
  notice: noticeData
}

const getStorage = (key) => {
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    return null
  }
}

const setStorage = (key, value) => {
  try {
    uni.setStorageSync(key, value)
  } catch (e) {
    console.error('存储失败:', e)
  }
}

const mockRequest = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let result = { errCode: 0, errMsg: 'success' }

        if (url.includes('/api/user/login')) {
          result.data = {
            token: 'mock_token_' + Date.now(),
            userInfo: {
              id: 1,
              nickname: '游客',
              avatar: ''
            }
          }
        } else if (url.includes('/api/user/classify/list')) {
          result.classifyList = mockData.classify
        } else if (url.includes('/api/user/banner/list')) {
          result.bannerList = mockData.banner
        } else if (url.includes('/api/user/notice/list')) {
          const type = data.type || ''
          let list = mockData.notice
          if (type) {
            list = list.filter(item => item.type === type)
          }
          result.list = list
        } else if (url.includes('/api/user/wallpaper/list')) {
          let list = [...mockData.wallpaper]
          const classId = data.classId
          const keyword = data.keyword
          
          if (classId) {
            list = list.filter(item => item.class_id === classId)
          }
          if (keyword) {
            list = list.filter(item => 
              item.title.includes(keyword) || 
              item.tags.includes(keyword)
            )
          }
          
          const pageNum = data.pageNum || 1
          const pageSize = data.pageSize || 10
          const start = (pageNum - 1) * pageSize
          const end = start + pageSize
          
          result.list = list.slice(start, end)
          result.total = list.length
        } else if (url.includes('/api/user/wallpaper/detail')) {
          const id = data.id
          const wallpaper = mockData.wallpaper.find(item => item.id === id)
          result.wallpaper = wallpaper
        } else if (url.includes('/api/user/wallpaper/score')) {
          const id = data.wallId
          const score = data.score
          const wallpaper = mockData.wallpaper.find(item => item.id === id)
          if (wallpaper) {
            const totalScore = wallpaper.score * wallpaper.score_count + score
            wallpaper.score_count += 1
            wallpaper.score = (totalScore / wallpaper.score_count).toFixed(1)
          }
          result.data = { success: true }
        } else if (url.includes('/api/user/behavior/check')) {
          const type = data.type
          const wallId = data.wallId
          const key = `behavior_${type}_${wallId}`
          const exists = getStorage(key)
          result.data = { exists: !!exists }
        } else if (url.includes('/api/user/behavior/add')) {
          const type = data.type
          const wallId = data.wallId
          const key = `behavior_${type}_${wallId}`
          setStorage(key, Date.now())
          result.data = { success: true }
        } else if (url.includes('/api/user/search/hot')) {
          result.hotSearch = ['风景', '动漫', '星空', '简约', '抽象']
        } else if (url.includes('/api/user/search')) {
          const keyword = data.keyword
          let list = mockData.wallpaper.filter(item => 
            item.title.includes(keyword) || 
            item.tags.includes(keyword) ||
            item.desc.includes(keyword)
          )
          
          const pageNum = data.pageNum || 1
          const pageSize = data.pageSize || 10
          const start = (pageNum - 1) * pageSize
          const end = start + pageSize
          
          result.list = list.slice(start, end)
          result.total = list.length
        }

        resolve(result)
      } catch (error) {
        reject({ errCode: -1, errMsg: '请求失败' })
      }
    }, 100)
  })
}

const request = (options) => {
  return new Promise((resolve, reject) => {
    mockRequest(options.url, options.method, options.data)
      .then(res => {
        if (res.errCode === 0) {
          resolve(res)
        } else {
          uni.showToast({
            title: res.errMsg || '请求失败',
            icon: 'none'
          })
          reject(res)
        }
      })
      .catch(err => {
        uni.showToast({
          title: '请求失败',
          icon: 'none'
        })
        reject(err)
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