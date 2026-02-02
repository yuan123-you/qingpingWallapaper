import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getWallpaperList(params) {
  return request({
    url: '/api/admin/wallpaper/list',
    method: 'get',
    params
  })
}

export function addWallpaper(data) {
  return request({
    url: '/api/admin/wallpaper/add',
    method: 'post',
    data
  })
}

export function updateWallpaper(data) {
  return request({
    url: '/api/admin/wallpaper/update',
    method: 'post',
    data
  })
}

export function deleteWallpaper(id) {
  return request({
    url: '/api/admin/wallpaper/delete',
    method: 'post',
    data: { id }
  })
}

export function getClassifyList() {
  return request({
    url: '/api/admin/classify/list',
    method: 'get'
  })
}

export function addClassify(data) {
  return request({
    url: '/api/admin/classify/add',
    method: 'post',
    data
  })
}

export function updateClassify(data) {
  return request({
    url: '/api/admin/classify/update',
    method: 'post',
    data
  })
}

export function deleteClassify(id) {
  return request({
    url: '/api/admin/classify/delete',
    method: 'post',
    data: { id }
  })
}

export function getBannerList() {
  return request({
    url: '/api/admin/banner/list',
    method: 'get'
  })
}

export function addBanner(data) {
  return request({
    url: '/api/admin/banner/add',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/api/admin/banner/update',
    method: 'post',
    data
  })
}

export function deleteBanner(id) {
  return request({
    url: '/api/admin/banner/delete',
    method: 'post',
    data: { id }
  })
}

export function getNoticeList(params) {
  return request({
    url: '/api/admin/notice/list',
    method: 'get',
    params
  })
}

export function addNotice(data) {
  return request({
    url: '/api/admin/notice/add',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/api/admin/notice/update',
    method: 'post',
    data
  })
}

export function deleteNotice(id) {
  return request({
    url: '/api/admin/notice/delete',
    method: 'post',
    data: { id }
  })
}

export function getStatistics() {
  return request({
    url: '/api/admin/statistics',
    method: 'get'
  })
}