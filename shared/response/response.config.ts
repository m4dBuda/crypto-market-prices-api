export const responseConfig = {
  success: {
    default: () => 'Operation completed successfully',
  },
  error: {
    default: () => 'An error occurred',
  },
  notFound: {
    default: () => 'Resource not found',
  },
  unauthorized: {
    default: () => 'Unauthorized',
  },
  created: {
    default: () => 'Resource created successfully',
  },
  badRequest: {
    default: () => 'Invalid request',
  },
  forbidden: {
    default: () => 'Forbbiden resource',
  },
};
