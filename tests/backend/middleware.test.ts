import { authenticate, authorize } from '../../backend/src/middleware/auth.middleware';

describe('Middleware', () => {
  it('should reject request without auth header', () => {
    const req = { headers: {} } as any;
    expect(() => authenticate(req, {} as any, jest.fn())).toThrow();
  });

  it('should validate role authorization', () => {
    const req = { user: { role: 'CASHIER' } } as any;
    const middleware = authorize('ADMIN');
    expect(() => middleware(req, {} as any, jest.fn())).toThrow();
  });
});
