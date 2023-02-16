const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function generateStrongPassword(length = 32): string {
  let password = '';

  for (let i = 0; i < length; i++) {
    let idx = Math.floor(Math.random() * chars.length);
    password += chars[idx];
  }

  return password;
}

