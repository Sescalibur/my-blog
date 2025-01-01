import { Router } from 'express'
import { POST as createPost, GET as getPosts } from '../app/api/posts/route'

export function createRouter() {
  const router = Router()
  
  router.post('/posts', async (req, res) => {
    try {
      const request = new Request('http://localhost/api/posts', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: req.headers as HeadersInit
      })
      
      const result = await createPost(request)
      const data = await result.json().catch(() => result)
      res.status(result.status).json(data)
    } catch (error) {
      console.error('Error in POST /posts:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  router.get('/posts', async (req, res) => {
    try {
      const result = await getPosts()
      const data = await result.json().catch(() => result)
      res.status(result.status).json(data)
    } catch (error) {
      console.error('Error in GET /posts:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  router.get('/posts/:id', async (req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  return router
} 