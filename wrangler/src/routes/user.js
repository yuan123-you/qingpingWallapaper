import { stmt } from '../db/index.js'

export async function handleBannerList(request, url, env, ctx) {
  try {
    const cacheKey = 'banner_list'
    const cached = await env.CACHE.get(cacheKey, 'json')
    
    if (cached) {
      return new Response(JSON.stringify({
        errCode: 0,
        errMsg: 'success',
        bannerList: cached
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const result = await env.DB.prepare(stmt.getBannerList).all()
    
    await env.CACHE.put(cacheKey, JSON.stringify(result.results || []), {
      expirationTtl: 86400
    })
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      bannerList: result.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleBannerList:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleNoticeList(request, url, env, ctx) {
  try {
    const type = url.searchParams.get('type') || ''
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const offset = (pageNum - 1) * pageSize
    
    let query = stmt.getNoticeList
    let params = [pageSize, offset]
    
    if (type) {
      query = stmt.getNoticeListByType
      params = [type, pageSize, offset]
    }
    
    const result = await env.DB.prepare(query).bind(...params).all()
    
    const countResult = await env.DB.prepare(stmt.getNoticeCount).all()
    const total = countResult.results[0]?.count || 0
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      list: result.results || [],
      total
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleNoticeList:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleWallpaperList(request, url, env, ctx) {
  try {
    const classId = url.searchParams.get('class_id') || ''
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const offset = (pageNum - 1) * pageSize
    
    let query = stmt.getWallpaperList
    let params = [pageSize, offset]
    
    if (classId) {
      query = stmt.getWallpaperListByClassId
      params = [classId, pageSize, offset]
    }
    
    const result = await env.DB.prepare(query).bind(...params).all()
    
    const countResult = await env.DB.prepare(stmt.getWallpaperCount).all()
    const total = countResult.results[0]?.count || 0
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      list: result.results || [],
      total
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleWallpaperList:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleWallpaperDetail(request, url, env, ctx) {
  try {
    const id = url.searchParams.get('id')
    
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: 'Missing id'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const result = await env.DB.prepare(stmt.getWallpaperDetail).bind(id).first()
    
    if (!result) {
      return new Response(JSON.stringify({
        errCode: 404,
        errMsg: 'Wallpaper not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      wallpaper: result
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleWallpaperDetail:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleWallpaperScore(request, url, env, ctx) {
  try {
    const body = await request.json()
    const { wall_id, score } = body
    
    if (!wall_id || !score) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const wallpaper = await env.DB.prepare(stmt.getWallpaperDetail).bind(wall_id).first()
    
    if (!wallpaper) {
      return new Response(JSON.stringify({
        errCode: 404,
        errMsg: 'Wallpaper not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const currentScore = wallpaper.score || 0
    const currentCount = wallpaper.score_count || 0
    const newScore = ((currentScore * currentCount) + score) / (currentCount + 1)
    
    await env.DB.prepare(stmt.updateWallpaperScore).bind(newScore, currentCount + 1, wall_id).run()
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleWallpaperScore:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleBehaviorAdd(request, url, env, ctx) {
  try {
    const body = await request.json()
    const { type, wall_id, openid } = body
    
    if (!type || !wall_id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    await env.DB.prepare(stmt.addUserBehavior).bind(openid || '', wall_id, type, Date.now()).run()
    
    if (type === 'download') {
      await env.DB.prepare(stmt.incrementWallpaperDownload).bind(wall_id).run()
    }
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleBehaviorAdd:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleBehaviorCheck(request, url, env, ctx) {
  try {
    const type = url.searchParams.get('type')
    const wallId = url.searchParams.get('wall_id')
    const openid = url.searchParams.get('openid') || ''
    
    if (!type || !wallId) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const result = await env.DB.prepare(stmt.checkUserBehavior).bind(openid, wallId, type).first()
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      exists: !!result
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleBehaviorCheck:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleSearch(request, url, env, ctx) {
  try {
    const keyword = url.searchParams.get('keyword') || ''
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const offset = (pageNum - 1) * pageSize
    
    if (!keyword) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: 'Missing keyword'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const result = await env.DB.prepare(stmt.searchWallpaper).bind(`%${keyword}%`, `%${keyword}%`, pageSize, offset).all()
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      list: result.results || []
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleSearch:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function handleHotSearch(request, url, env, ctx) {
  try {
    const cacheKey = 'hot_search'
    const cached = await env.CACHE.get(cacheKey, 'json')
    
    if (cached) {
      return new Response(JSON.stringify({
        errCode: 0,
        errMsg: 'success',
        hotSearch: cached
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const hotSearch = ['风景', '美女', '动漫', '游戏', '星空', '城市', '自然', '动物', '汽车', '科技']
    
    await env.CACHE.put(cacheKey, JSON.stringify(hotSearch), {
      expirationTtl: 43200
    })
    
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      hotSearch
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in handleHotSearch:', error)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}