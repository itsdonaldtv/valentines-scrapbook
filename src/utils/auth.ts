import SHA256 from 'crypto-js/sha256';

// Proper password hashing using SHA256
export interface AuthConfig {
  username: string;
  passwordHash: string;
}

const hashPassword = (password: string): string => {
  return SHA256(password).toString();
};

export const initializeAuth = (): AuthConfig => {
  // Always use defaults for now - clear any old data
  localStorage.removeItem('authConfig');
  
  const defaultConfig: AuthConfig = {
    username: 'valentine',
    passwordHash: hashPassword('ValentinesDay2025!'),
  };

  localStorage.setItem('authConfig', JSON.stringify(defaultConfig));
  return defaultConfig;
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const updateAuth = (username: string, password: string): void => {
  const config: AuthConfig = {
    username,
    passwordHash: hashPassword(password),
  };
  localStorage.setItem('authConfig', JSON.stringify(config));
};
