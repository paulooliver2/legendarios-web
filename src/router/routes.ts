export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PERSONS: {
    LIST: '/persons',
    DETAIL: '/persons/:id',
    CREATE: '/persons/new',
  },
  EVENTS: {
    LIST: '/events',
    TOP: '/events/top',
    DETAIL: '/events/:id',
    CREATE: '/events/new',
  },
  MEMBERSHIPS: {
    LIST: '/memberships',
    REVIEW: '/events/:eventId/memberships',
  },
  PISTAS: {
    LIST: '/pistas',
    DETAIL: '/pistas/:id',
  },
  PROFILE: '/profile',
} as const
