export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const isValidPhone = (phone: string): boolean => {
  // Basic validation: 10-15 digits, optional + prefix
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};
