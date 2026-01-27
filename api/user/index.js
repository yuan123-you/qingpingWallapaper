import request from './request.js'

export function getBannerList() {
  return request.get('/api/user/banner/list')
}

export function getNoticeList(type = '') {
  return request.get('/api/user/notice/list', { type })
}

export function getWallpaperList(params) {
  return request.get('/api/user/wallpaper/list', params)
}

export function getWallpaperDetail(id) {
  return request.get('/api/user/wallpaper/detail', { id })
}

export function submitWallpaperScore(data) {
  return request.post('/api/user/wallpaper/score', data)
}

export function getUserBehavior(type, wallId) {
  return request.get('/api/user/behavior/check', { type, wallId })
}

export function addUserBehavior(data) {
  return request.post('/api/user/behavior/add', data)
}

export function getHotSearch() {
  return request.get('/api/user/search/hot')
}

export function searchWallpaper(params) {
  return request.get('/api/user/search', params)
}