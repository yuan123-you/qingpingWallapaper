import request from './request.js'

export function adminLogin(data) {
  return request.post('/api/admin/login', data)
}

export function getWallpaperList(params) {
  return request.get('/api/admin/wallpaper/list', params)
}

export function addWallpaper(data) {
  return request.post('/api/admin/wallpaper/add', data)
}

export function updateWallpaper(data) {
  return request.post('/api/admin/wallpaper/update', data)
}

export function deleteWallpaper(id) {
  return request.post('/api/admin/wallpaper/delete', { id })
}

export function getClassifyList() {
  return request.get('/api/admin/classify/list')
}

export function addClassify(data) {
  return request.post('/api/admin/classify/add', data)
}

export function updateClassify(data) {
  return request.post('/api/admin/classify/update', data)
}

export function deleteClassify(id) {
  return request.post('/api/admin/classify/delete', { id })
}

export function getBannerList() {
  return request.get('/api/admin/banner/list')
}

export function addBanner(data) {
  return request.post('/api/admin/banner/add', data)
}

export function updateBanner(data) {
  return request.post('/api/admin/banner/update', data)
}

export function deleteBanner(id) {
  return request.post('/api/admin/banner/delete', { id })
}

export function getNoticeList(params) {
  return request.get('/api/admin/notice/list', params)
}

export function addNotice(data) {
  return request.post('/api/admin/notice/add', data)
}

export function updateNotice(data) {
  return request.post('/api/admin/notice/update', data)
}

export function deleteNotice(id) {
  return request.post('/api/admin/notice/delete', { id })
}

export function getStatistics() {
  return request.get('/api/admin/statistics')
}