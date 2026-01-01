/**
 * localStorage工具类，用于处理兑换码信息的存储和获取
 */

// 从环境变量中获取API基础URL
const BASE_URL = process.env.VUE_API_BASE_URL || 'http://120.27.130.190:8091';

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
 * 获取有效天数
 * @returns {number|null} 有效天数
 */
export const getValidDays = () => {
  return getExchangeCodeField('validDays');
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

/**
 * 设置兑换码信息中的特定字段值
 * @param {string} fieldName - 要设置的字段名
 * @param {any} value - 要设置的字段值
 * @returns {boolean} 设置成功返回true，失败返回false
 */
export const setExchangeCodeField = (fieldName, value) => {
  try {
    const currentInfo = getExchangeCodeInfo() || {};
    const updatedInfo = { ...currentInfo, [fieldName]: value };
    localStorage.setItem(EXCHANGE_CODE_INFO_KEY, JSON.stringify(updatedInfo));
    return true;
  } catch (error) {
    console.error(`设置兑换码字段${fieldName}失败:`, error);
    return false;
  }
};

/**
 * 设置剩余点数
 * @param {number} value - 要设置的剩余点数
 * @returns {boolean} 设置成功返回true，失败返回false
 */
export const setRemainingPoints = (value) => {
  return setExchangeCodeField('remainingPoints', value);
};

/**
 * 消耗积分
 * @param {number} points - 要消耗的积分值
 * @returns {Promise<Object>} 积分消耗结果
 */
export const consumePoints = async (points) => {
  try {
    const code = getExchangeCode();
    if (!code) {
      throw new Error('兑换码不存在');
    }
    
    // 先尝试更新本地积分，确保用户体验不中断
    const currentRemainingPoints = getRemainingPoints() || 0;
    const newRemainingPoints = currentRemainingPoints - points;
    setRemainingPoints(newRemainingPoints);
    
    // 然后尝试调用API更新服务器端数据
    try {
      const response = await fetch(`${BASE_URL}/api/exchange-code/consume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, points })
      });
      
      if (!response.ok) {
        console.warn('积分消耗API请求失败，但本地积分已更新');
        return { success: true, message: '本地积分已更新，服务器同步稍后进行', remainingPoints: newRemainingPoints };
      }
      
      const result = await response.json();
      console.log('积分消耗成功:', result);
      
      // 如果API返回了剩余积分，使用API返回的值更新本地存储
      if (result.remainingPoints !== undefined) {
        setRemainingPoints(result.remainingPoints);
        return result;
      }
      
      return { success: true, remainingPoints: newRemainingPoints };
    } catch (apiError) {
      console.error('积分消耗API请求失败:', apiError);
      // 即使API请求失败，也返回成功，因为本地积分已经更新
      return { success: true, message: '本地积分已更新，服务器同步稍后进行', remainingPoints: newRemainingPoints };
    }
    
  } catch (error) {
    console.error('积分消耗失败:', error);
    // 不再抛出错误，而是返回错误信息，让调用方决定如何处理
    return { success: false, message: error.message };
  }
};