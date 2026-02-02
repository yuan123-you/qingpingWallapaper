import * as mock from '../mockData.js'

// 缓存今日推荐列表，避免重复刷新
// 结构：{ date: 'YYYY-MM-DD', list: [] }
const CACHE_KEY_TODAY = 'lightscreen_today_cache';

// 模拟延迟
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

export async function userLogin(data) {
  await delay()
  return {
    token: 'mock-token-' + Date.now(),
    userInfo: {
      nickname: '梦游者',
      avatarUrl: '/static/default_avatar.png',
      id: 999
    }
  }
}

export async function getClassifyList() {
  await delay()
  return {
    classifyList: mock.categories
  }
}

export async function getBannerList() {
  await delay()
  return {
    bannerList: mock.banners
  }
}

export async function getNoticeList(type = '', pageNum = 1, pageSize = 10) {
  await delay()
  return {
    list: mock.notices
  }
}

export async function getWallpaperList(params = {}) {
  await delay()

  let list = [...mock.wallpapers]

  if (params.type === 'favorites') {
    // 从本地存储读取收藏数据 (Pinia 数据的基础)
    const saved = uni.getStorageSync('favorites') || []
    list = saved
  } else if (params.type === 'history') {
    const saved = uni.getStorageSync('history') || []
    list = saved
  } else if (params.type === 'downloads') {
    const saved = uni.getStorageSync('downloads') || []
    list = saved
  } else if (params.type === 'banner') {
    // 轮播图专题模式：提取轮播图中的图片作为数据集
    list = mock.banners.map(b => ({
      id: b.id,
      pic_url: b.pic_url,
      title: b.title,
      score: '9.9',
      description: '轮播精选壁纸'
    }))
  } else if (params.categoryId) {
    list = list.filter(item => item.category_id === Number(params.categoryId))
  }

  if (params.type === 'hot') {
    list = [...list].sort((a, b) => b.score - a.score)
  } else if (params.type === 'today') {
    // 今日精选：按北京时间0点刷新，一天只刷新一次，固定12张
    const todayStr = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const cachedData = uni.getStorageSync(CACHE_KEY_TODAY);

    if (cachedData && cachedData.date === todayStr && cachedData.list && cachedData.list.length > 0) {
      list = cachedData.list;
    } else {
      // 没有任何过滤，全随机
      const shuffled = [...mock.wallpapers].sort(() => Math.random() - 0.5);
      list = shuffled.slice(0, 12); // 只取12张
      uni.setStorageSync(CACHE_KEY_TODAY, {
        date: todayStr,
        list: list
      });
    }
  } else if (params.type === 'random') {
    list = [...list].sort(() => Math.random() - 0.5)
  }

  // 分页逻辑
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 12;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  const safeList = list.slice(Math.max(0, start), Math.min(list.length, end));

  return {
    list: safeList,
    total: list.length
  }
}

export async function getWallpaperDetail(id) {
  await delay(100)
  const detail = mock.wallpapers.find(item => item.id === Number(id))
  return detail || null
}

export async function submitWallpaperScore(data) {
  await delay()
  return { success: true, message: '评分成功' }
}

export async function getHotSearch() {
  await delay()
  return {
    list: mock.hotSearch
  }
}

export async function searchWallpaper(params) {
  await delay()
  const keyword = params.keyword ? params.keyword.toLowerCase() : ''
  const list = mock.wallpapers.filter(item =>
    item.title.toLowerCase().includes(keyword) ||
    item.tags.some(tag => tag.toLowerCase().includes(keyword))
  )
  return {
    list: list
  }
}
