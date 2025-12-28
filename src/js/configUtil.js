/**
 * 配置工具类，用于获取和管理应用配置
 */

// 配置信息的localStorage键名
const APP_CONFIG_KEY = 'appConfig';

/**
 * 获取所有配置信息
 * @returns {Promise<Object>} 配置信息对象
 */
export const getAllConfigs = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8091/api/config/get-all');
    if (!response.ok) {
      throw new Error('获取配置信息失败');
    }
    const result = await response.json();
    
    if (result.success && result.configs) {
      // 处理配置数据，提取key和value
      const processedConfigs = {};
      for (const [key, config] of Object.entries(result.configs)) {
        processedConfigs[key] = config.value;
      }
      
      // 存储到本地
      localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(processedConfigs));
      return processedConfigs;
    } else {
      throw new Error('获取配置信息失败：' + (result.message || '未知错误'));
    }
  } catch (error) {
    console.error('获取配置信息失败:', error);
    return {};
  }
};

/**
 * 获取本地存储的配置信息
 * @returns {Object} 配置信息对象
 */
export const getLocalConfig = () => {
  try {
    const configStr = localStorage.getItem(APP_CONFIG_KEY);
    return configStr ? JSON.parse(configStr) : {};
  } catch (error) {
    console.error('获取本地配置信息失败:', error);
    return {};
  }
};

/**
 * 获取特定配置项的值
 * @param {string} key - 配置项的key
 * @param {any} defaultValue - 默认值，当配置项不存在时返回
 * @returns {any} 配置项的值
 */
export const getConfigValue = (key, defaultValue = null) => {
  const config = getLocalConfig();
  return config[key] !== undefined ? config[key] : defaultValue;
};

/**
 * 更新本地存储的配置信息
 * @param {Object} newConfig - 新的配置信息
 */
export const updateLocalConfig = (newConfig) => {
  try {
    const currentConfig = getLocalConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(updatedConfig));
  } catch (error) {
    console.error('更新本地配置信息失败:', error);
  }
};
