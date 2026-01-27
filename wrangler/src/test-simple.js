export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname
    
    console.log('=== Request Started ===')
    console.log('Path:', path)
    console.log('Method:', request.method)
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
    
    if (request.method === 'OPTIONS') {
      console.log('OPTIONS request')
      return new Response(null, { headers: corsHeaders })
    }
    
    try {
      if (path === '/api/admin/login') {
        console.log('Handling login request...')
        
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
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          })
        }
        
        console.log('Checking database...')
        const admin = await env.DB.prepare('SELECT * FROM admin WHERE username = ?').bind(username).first()
        console.log('Admin found:', admin ? 'yes' : 'no')
        
        if (!admin) {
          console.log('Admin not found')
          return new Response(JSON.stringify({
            errCode: 401,
            errMsg: 'Invalid username or password'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          })
        }
        
        if (admin.password !== password) {
          console.log('Password mismatch')
          return new Response(JSON.stringify({
            errCode: 401,
            errMsg: 'Invalid username or password'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          })
        }
        
        console.log('Login successful')
        return new Response(JSON.stringify({
          errCode: 0,
          errMsg: 'success',
          token: 'test_token_' + Date.now()
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
      
      return new Response(JSON.stringify({
        errCode: 404,
        errMsg: 'Not Found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      console.error('=== Error ===')
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      return new Response(JSON.stringify({
        errCode: 500,
        errMsg: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
  }
}