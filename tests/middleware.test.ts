import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase SSR before importing middleware
const mockGetUser = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
  }),
}))

// Must import after mocks
const { middleware, config } = await import('@/middleware')

function createRequest(pathname: string) {
  const url = new URL(pathname, 'http://localhost:3000')
  // Add clone() method since middleware calls nextUrl.clone()
  ;(url as unknown as Record<string, unknown>).clone = () => new URL(url.href)
  const cookies = new Map<string, string>()
  return {
    nextUrl: url,
    cookies: {
      getAll: () => Array.from(cookies.entries()).map(([name, value]) => ({ name, value })),
      set: (name: string, value: string) => cookies.set(name, value),
    },
    headers: new Headers(),
  } as unknown as Parameters<typeof middleware>[0]
}

describe('middleware config', () => {
  it('matches dashboard routes', () => {
    expect(config.matcher).toContain('/dashboard/:path*')
  })

  it('matches billing routes', () => {
    expect(config.matcher).toContain('/billing/:path*')
  })

  it('matches settings routes', () => {
    expect(config.matcher).toContain('/settings/:path*')
  })

  it('matches login page', () => {
    expect(config.matcher).toContain('/login')
  })

  it('matches signup page', () => {
    expect(config.matcher).toContain('/signup')
  })
})

describe('middleware redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated user from /dashboard to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/dashboard')
    const res = await middleware(req)
    expect(res.headers.get('location')).toMatch(/\/login$/)
  })

  it('redirects unauthenticated user from /billing to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/billing')
    const res = await middleware(req)
    expect(res.headers.get('location')).toMatch(/\/login$/)
  })

  it('redirects unauthenticated user from /settings to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/settings')
    const res = await middleware(req)
    expect(res.headers.get('location')).toMatch(/\/login$/)
  })

  it('redirects authenticated user from /login to /dashboard', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@b.com' } } })
    const req = createRequest('/login')
    const res = await middleware(req)
    expect(res.headers.get('location')).toMatch(/\/dashboard$/)
  })

  it('redirects authenticated user from /signup to /dashboard', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@b.com' } } })
    const req = createRequest('/signup')
    const res = await middleware(req)
    expect(res.headers.get('location')).toMatch(/\/dashboard$/)
  })

  it('allows unauthenticated user on /login without redirect', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createRequest('/login')
    const res = await middleware(req)
    // Should not redirect — just pass through
    expect(res.headers.get('location')).toBeNull()
  })
})
