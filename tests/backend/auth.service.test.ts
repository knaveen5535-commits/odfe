import { hashPassword, comparePassword } from '../../backend/src/utils/password';
import { generateAccessToken, verifyToken } from '../../backend/src/utils/jwt';

describe('AuthService', () => {
  it('should hash password correctly', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should generate and verify JWT tokens', () => {
    const payload = { userId: '123', email: 'test@test.com', role: 'ADMIN' };
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    const decoded = verifyToken(token);
    expect(decoded.email).toBe('test@test.com');
  });
});
