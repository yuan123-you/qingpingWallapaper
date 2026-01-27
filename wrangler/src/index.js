export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }
    
    try {
      console.log('=== Request Started ===')
      console.log('Method:', request.method)
      console.log('Path:', path)
      
      let response
      
      if (path.startsWith('/api/user/')) {
        console.log('Routing to user handler...')
        const { handleUserRequest } = await import('./routes/user.js')
        response = await handleUserRequest(request, url, env, ctx)
      } else if (path.startsWith('/api/admin/')) {
        console.log('Routing to admin handler...')
        const { handleAdminRequest } = await import('./routes/admin.js')
        response = await handleAdminRequest(request, url, env, ctx)
      } else {
        console.log('Path not found, returning 404')
        response = new Response(JSON.stringify({
          errCode: 404,
          errMsg: 'Not Found'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
      
      console.log('Response status:', response.status)
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    } catch (error) {
      console.error('=== Main Error ===')
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      return new Response(JSON.stringify({
        errCode: 500,
        errMsg: error.message || 'Internal Server Error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
  }
}