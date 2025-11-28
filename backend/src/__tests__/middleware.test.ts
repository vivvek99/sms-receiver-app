import { createError } from '../middleware/errorHandler';

describe('Error Handler Middleware', () => {
  describe('createError', () => {
    it('should create an error with the correct message', () => {
      const error = createError('Test error', 400);
      expect(error.message).toBe('Test error');
    });

    it('should create an error with the correct status code', () => {
      const error = createError('Test error', 404);
      expect(error.statusCode).toBe(404);
    });

    it('should mark the error as operational', () => {
      const error = createError('Test error', 500);
      expect(error.isOperational).toBe(true);
    });

    it('should be an instance of Error', () => {
      const error = createError('Test error', 400);
      expect(error).toBeInstanceOf(Error);
    });
  });
});

describe('Config', () => {
  it('should have default port', async () => {
    const { default: config } = await import('../config');
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
  });

  it('should have cors configuration', async () => {
    const { default: config } = await import('../config');
    expect(config.cors).toBeDefined();
    expect(config.cors.origin).toBeDefined();
  });

  it('should have twilio configuration', async () => {
    const { default: config } = await import('../config');
    expect(config.twilio).toBeDefined();
  });
});
