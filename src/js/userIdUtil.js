/**
 * 用户ID工具类，用于生成和管理随机用户ID
 */

// 生成随机用户ID
export const generateRandomUserId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let userId = '';
  for (let i = 0; i < 8; i++) {
    userId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return userId;
};

// 生成并存储用户ID到localStorage
export const initUserId = () => {
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    userId = generateRandomUserId();
    localStorage.setItem('userId', userId);
  }
  
  return userId;
};

// 获取当前用户ID
export const getUserId = () => {
  return localStorage.getItem('userId');
};