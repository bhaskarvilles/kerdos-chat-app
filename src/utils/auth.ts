// Simple hash function
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

const SECRET_KEY = 'GREENAI_CHAT_SECRET'; // In a real app, this should be securely stored and unique per user

export function generateOTP(): string {
  const timeSlice = Math.floor(Date.now() / 30000); // Changes every 30 seconds
  const hashInput = `${SECRET_KEY}${timeSlice}`;
  const hashValue = simpleHash(hashInput);
  return String(hashValue % 1000000).padStart(6, '0'); // 6-digit OTP
}

export function verifyOTP(token: string): boolean {
  return token === generateOTP();
}

export function getExpirationTime(): number {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.getTime();
}