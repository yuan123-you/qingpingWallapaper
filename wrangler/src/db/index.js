export const stmt = {
  getBannerList: 'SELECT * FROM banner WHERE status = 1 ORDER BY sort ASC, id DESC',
  
  getNoticeList: 'SELECT * FROM notice WHERE status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?',
  getNoticeListByType: 'SELECT * FROM notice WHERE type = ? AND status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?',
  getNoticeCount: 'SELECT COUNT(*) as count FROM notice WHERE status = 1',
  
  getWallpaperList: 'SELECT * FROM wallpaper WHERE status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?',
  getWallpaperListByClassId: 'SELECT * FROM wallpaper WHERE class_id = ? AND status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?',
  getWallpaperListRecommend: 'SELECT * FROM wallpaper WHERE status = 1 ORDER BY score DESC, download_count DESC LIMIT ? OFFSET ?',
  getWallpaperDetail: 'SELECT * FROM wallpaper WHERE id = ?',
  getWallpaperCount: 'SELECT COUNT(*) as count FROM wallpaper WHERE status = 1',
  
  updateWallpaperScore: 'UPDATE wallpaper SET score = ?, score_count = ? WHERE id = ?',
  incrementWallpaperDownload: 'UPDATE wallpaper SET download_count = download_count + 1 WHERE id = ?',
  
  addUserBehavior: 'INSERT INTO user_behavior (openid, wall_id, type, create_time) VALUES (?, ?, ?, ?)',
  checkUserBehavior: 'SELECT * FROM user_behavior WHERE openid = ? AND wall_id = ? AND type = ?',
  
  searchWallpaper: 'SELECT * FROM wallpaper WHERE (title LIKE ? OR tags LIKE ?) AND status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?',
  
  getClassifyList: 'SELECT * FROM classify ORDER BY sort ASC, id DESC',
  
  getAdminByUsername: 'SELECT * FROM admin WHERE username = ?',
  
  addWallpaper: 'INSERT INTO wallpaper (class_id, pic_url, title, tags, desc, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  updateWallpaper: 'UPDATE wallpaper SET title = ?, class_id = ?, pic_url = ?, tags = ?, desc = ?, status = ?, update_time = ? WHERE id = ?',
  deleteWallpaper: 'DELETE FROM wallpaper WHERE id = ?',
  
  addClassify: 'INSERT INTO classify (name, cover_url, desc, sort, wall_count, update_time) VALUES (?, ?, ?, ?, ?, ?)',
  updateClassify: 'UPDATE classify SET name = ?, cover_url = ?, desc = ?, sort = ?, update_time = ? WHERE id = ?',
  deleteClassify: 'DELETE FROM classify WHERE id = ?',
  
  addBanner: 'INSERT INTO banner (pic_url, jump_url, sort, status, create_time) VALUES (?, ?, ?, ?, ?)',
  updateBanner: 'UPDATE banner SET pic_url = ?, jump_url = ?, sort = ?, status = ? WHERE id = ?',
  deleteBanner: 'DELETE FROM banner WHERE id = ?',
  
  addNotice: 'INSERT INTO notice (title, type, content, status, create_time) VALUES (?, ?, ?, ?, ?)',
  updateNotice: 'UPDATE notice SET title = ?, type = ?, content = ?, status = ? WHERE id = ?',
  deleteNotice: 'DELETE FROM notice WHERE id = ?',
  
  getClassifyCount: 'SELECT COUNT(*) as count FROM classify',
  getTotalDownloads: 'SELECT SUM(download_count) as count FROM wallpaper',
  getUserBehaviorCount: 'SELECT COUNT(*) as count FROM user_behavior'
}