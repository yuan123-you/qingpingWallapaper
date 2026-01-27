export async function verifyToken(request, env) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return {
        valid: false,
        response: new Response(JSON.stringify({
          errCode: 401,
          errMsg: 'Missing authorization header'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    
    const token = authHeader.replace('Bearer ', '')
    const adminId = await env.CACHE.get(`token_${token}`)
    
    if (!adminId) {
      return {
        valid: false,
        response: new Response(JSON.stringify({
          errCode: 401,
          errMsg: 'Invalid or expired token'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    
    return { valid: true, adminId }
  } catch (error) {
    console.error('Error in verifyToken:', error)
    return {
      valid: false,
      response: new Response(JSON.stringify({
        errCode: 500,
        errMsg: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}