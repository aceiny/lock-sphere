export const ThrottlerConfig = [
  {
    name: 'strict',    // For sensitive endpoints (auth, password reset, etc)
    ttl: 60000,       // 1 minute
    limit: 5,         // 5 requests per minute
  },
  {
    name: 'standard', // For regular API endpoints
    ttl: 60000,      // 1 minute
    limit: 30,       // 30 requests per minute
  },
  {
    name: 'generous', // For public/read-only endpoints
    ttl: 60000,      // 1 minute
    limit: 60,       // 60 requests per minute
  }
];