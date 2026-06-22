import crypto from 'crypto';

export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(crypto.randomInt(0, 10))];
  }
  return otp;
}
