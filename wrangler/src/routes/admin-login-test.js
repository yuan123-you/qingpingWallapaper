import { verifyToken } from '../utils/auth.js'

export async function handleLogin(request, url, env, ctx) {
  try {
    console.log('=== Login Request Started ===')
    const { stmt } = await import('../db/index.js')
    const body = await request.json()
    const { username, password } = body
    
    console.log('Username:', username)
    console.log('Password provided:', password ? '***' : 'empty')
    
    if (!username || !password) {
      console.log('Missing username or password')
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: 'Missing username or password'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log('Step 1: Checking lock status...')
    const lockKey = `lock_${username}`
    const lockStatus = await env.CACHE.get(lockKey)
    console.log('Lock status:', lockStatus)
    
    if (lockStatus) {
      console.log('Account is locked')
      return new Response(JSON.stringify({
        errCode: 429,
        errMsg: 'Account locked, please try again later'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log('Step 2: Querying database...')
    const admin = await env.DB.prepare(stmt.getAdminByUsername).bind(username).first()
    console.log('Admin found:', admin ? 'yes' : 'no')
    
    if (!admin) {
      console.log('Admin not found in database')
      const failCount = parseInt(await env.CACHE.get(`fail_${username}`) || '0') + 1
      
      if (failCount >= 3) {
        await env.CACHE.put(lockKey, 'locked', { expirationTtl: 600 })
      } else {
        await env.CACHE.put(`fail_${username}`, failCount.toString(), { expirationTtl: 600 })
      }
      
      return new Response(JSON.stringify({
        errCode: 401,
        errMsg: 'Invalid username or password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log('Step 3: Checking password...')
    if (admin.password !== password) {
      console.log('Password mismatch')
      const failCount = parseInt(await env.CACHE.get(`fail_${username}`) || '0') + 1
      
      if (failCount >= 3) {
        await env.CACHE.put(lockKey, 'locked', { expirationTtl: 600 })
      } else {
        await env.CACHE.put(`fail_${username}`, failCount.toString(), { expirationTtl: 600 })
      }
      
      return new Response(JSON.stringify({
        errCode: 401,
        errMsg: 'Invalid username or password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log('Step 4: Login successful, generating token...')
    await env.CACHE.delete(`fail_${username}`)
    
    const token = await generateToken(admin.id, env)
    console.log('Token generated:', token.substring(0, 20) + '...')
    
    console.log('Step 5: Returning success response...')
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: 'success',
      token,
      expireTime: Date.now() + 604800000
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('=== Login Error ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function generateToken(adminId, env) {
  try {
    console.log('Generating token for admin ID:', adminId)
    const token = `admin_${adminId}_${Date.now()}_${Math.random().toString(36).substr(2)}`
    await env.CACHE.put(`token_${token}`, adminId.toString(), { expirationTtl: 604800 })
    console.log('Token saved to cache')
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw error
  }
}