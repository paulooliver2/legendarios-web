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
    DETAIL: '/events/:id',
    CREATE: '/events/new',
  },
  MEMBERSHIPS: {
    LIST: '/memberships',
    REVIEW: '/events/:eventId/memberships',
  },
  MANADAS: {
    LIST: '/manadas',
    DETAIL: '/manadas/:id',
  },
} as const
