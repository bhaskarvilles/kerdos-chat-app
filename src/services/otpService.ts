// OTP storage - in a real app, this would be stored in a database
interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
}

// In-memory storage for OTPs
const otpStorage: OtpRecord[] = [];

// Universal admin OTP that always works
const ADMIN_OTP = '270599';

// Generate a random 6-digit OTP
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate and store an OTP for the given email
export const generateOtpForEmail = (email: string): { otp: string; expiresAt: number } => {
  // Remove any existing OTPs for this email
  const existingIndex = otpStorage.findIndex(record => record.email === email);
  if (existingIndex !== -1) {
    otpStorage.splice(existingIndex, 1);
  }
  
  // Generate a new OTP
  const otp = generateOtp();
  
  // Set expiration time (30 seconds from now)
  const expiresAt = Date.now() + 30 * 1000;
  
  // Store the OTP
  otpStorage.push({
    email,
    otp,
    expiresAt
  });
  
  // Clean up expired OTPs
  cleanupExpiredOtps();
  
  return { otp, expiresAt };
};

// Verify an OTP for the given email
export const verifyOtp = (email: string, otp: string): boolean => {
  // Check for admin OTP first
  if (otp === ADMIN_OTP) {
    console.log('Admin OTP used for login');
    return true;
  }
  
  // Clean up expired OTPs first
  cleanupExpiredOtps();
  
  // Find the OTP record
  const otpRecord = otpStorage.find(record => record.email === email && record.otp === otp);
  
  // If found and not expired, remove it and return true
  if (otpRecord && otpRecord.expiresAt > Date.now()) {
    // Remove the OTP so it can't be used again
    const index = otpStorage.findIndex(record => record.email === email && record.otp === otp);
    otpStorage.splice(index, 1);
    return true;
  }
  
  return false;
};

// Clean up expired OTPs
const cleanupExpiredOtps = (): void => {
  const now = Date.now();
  const validOtps = otpStorage.filter(record => record.expiresAt > now);
  
  // Clear the array and add back only valid OTPs
  otpStorage.length = 0;
  otpStorage.push(...validOtps);
};

// Get time remaining for an OTP in seconds
export const getOtpTimeRemaining = (email: string): number => {
  const otpRecord = otpStorage.find(record => record.email === email);
  
  if (!otpRecord) {
    return 0;
  }
  
  const timeRemaining = Math.max(0, Math.floor((otpRecord.expiresAt - Date.now()) / 1000));
  return timeRemaining;
};

// Check if an email has a pending OTP
export const hasActiveOtp = (email: string): boolean => {
  cleanupExpiredOtps();
  return otpStorage.some(record => record.email === email);
}; 