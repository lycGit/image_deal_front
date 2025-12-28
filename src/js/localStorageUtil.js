/**
 * localStorage工具类，用于处理兑换码信息的存储和获取
 */

// 兑换码信息的localStorage键名
const EXCHANGE_CODE_INFO_KEY = 'exchangeCodeInfo';

/**
 * 获取兑换码信息中的特定字段值
 * @param {string} fieldName - 要获取的字段名
 * @returns {any} 字段值，如果字段不存在或数据无效则返回null
 */
export const getExchangeCodeField = (fieldName) => {
  try {
    const codeInfoStr = localStorage.getItem(EXCHANGE_CODE_INFO_KEY);
    if (!codeInfoStr) {
      console.log('兑换码信息不存在');
      return null;
    }
    
    const codeInfo = JSON.parse(codeInfoStr);
    
    // 检查字段是否存在
    if (fieldName in codeInfo) {
      return codeInfo[fieldName];
    } else {
      console.log(`兑换码信息中不存在字段: ${fieldName}`);
      return null;
    }
  } catch (error) {
    console.error('获取兑换码字段失败:', error);
    return null;
  }
};

/**
 * 获取兑换码
 * @returns {string|null} 兑换码
 */
export const getExchangeCode = () => {
  return getExchangeCodeField('code');
};

/**
 * 获取总点数
 * @returns {number|null} 总点数
 */
export const getTotalPoints = () => {
  return getExchangeCodeField('totalPoints');
};

/**
 * 获取剩余点数
 * @returns {number|null} 剩余点数
 */
export const getRemainingPoints = () => {
  return getExchangeCodeField('remainingPoints');
};

/**
 * 获取获取时间
 * @returns {string|null} 获取时间
 */
export const getObtainedTime = () => {
  return getExchangeCodeField('obtainedTime');
};

/**
 * 获取完整的兑换码信息
 * @returns {Object|null} 完整的兑换码信息对象
 */
export const getExchangeCodeInfo = () => {
  try {
    const codeInfoStr = localStorage.getItem(EXCHANGE_CODE_INFO_KEY);
    if (!codeInfoStr) {
      console.log('兑换码信息不存在');
      return null;
    }
    
    return JSON.parse(codeInfoStr);
  } catch (error) {
    console.error('获取兑换码信息失败:', error);
    return null;
  }
};

/**
 * 更新兑换码信息
 * @param {Object} newInfo - 新的兑换码信息
 */
export const updateExchangeCodeInfo = (newInfo) => {
  try {
    const currentInfo = getExchangeCodeInfo() || {};
    const updatedInfo = { ...currentInfo, ...newInfo };
    localStorage.setItem(EXCHANGE_CODE_INFO_KEY, JSON.stringify(updatedInfo));
  } catch (error) {
    console.error('更新兑换码信息失败:', error);
  }
};
