export default {
  async fetch(request, env, ctx) {
    console.log('=== Worker Started ===')
    console.log('URL:', request.url)
    console.log('Method:', request.method)
    
    try {
      if (request.url.includes('/test-simple')) {
        console.log('Handling test-simple request...')
        return new Response(JSON.stringify({
          message: 'Worker is running',
          timestamp: Date.now()
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (request.url.includes('/api/admin/login')) {
        console.log('Handling login request...')
        
        const body = await request.json()
        const { username, password } = body
        
        console.log('Username:', username)
        console.log('Password provided:', password ? '***' : 'empty')
        
        return new Response(JSON.stringify({
          errCode: 0,
          errMsg: 'success',
          message: 'Login endpoint received',
          data: { username, hasPassword: !!password }
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify({
        errCode: 404,
        errMsg: 'Not Found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('=== Worker Error ===')
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
}