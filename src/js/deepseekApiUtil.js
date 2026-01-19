/**
 * DeepSeek API工具类，用于封装DeepSeek聊天API的调用
 */

// DeepSeek API配置
const DEEPSEEK_CONFIG = {
  BASE_URL: 'https://api.deepseek.com/chat/completions',
  DEFAULT_MODEL: 'deepseek-chat',
  DEFAULT_MAX_TOKENS: 500,
  DEFAULT_TEMPERATURE: 0.7
};

/**
 * DeepSeek API工具类
 */
export class DeepSeekApi {
  /**
   * 构造函数
   * @param {string} apiKey - DeepSeek API密钥
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('DeepSeek API密钥不能为空');
    }
    this.apiKey = apiKey;
    this.baseUrl = DEEPSEEK_CONFIG.BASE_URL;
  }

  /**
   * 发送聊天请求
   * @param {string} message - 用户消息内容
   * @param {Object} options - 请求选项
   * @param {string} options.model - 模型名称
   * @param {number} options.maxTokens - 最大生成token数
   * @param {number} options.temperature - 温度参数
   * @returns {Promise<string>} 模型回复内容
   */
  async chat(message, options = {}) {
    if (!message) {
      throw new Error('消息内容不能为空');
    }

    // 合并默认选项和用户选项
    const requestOptions = {
      model: options.model || DEEPSEEK_CONFIG.DEFAULT_MODEL,
      max_tokens: options.maxTokens || DEEPSEEK_CONFIG.DEFAULT_MAX_TOKENS,
      temperature: options.temperature || DEEPSEEK_CONFIG.DEFAULT_TEMPERATURE
    };

    // 构造请求数据
    const data = {
      model: requestOptions.model,
      messages: [
        { role: 'user', content: message }
      ],
      max_tokens: requestOptions.max_tokens,
      temperature: requestOptions.temperature
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.status === 200 && result.choices && result.choices.length > 0) {
        return result.choices[0].message.content;
      } else {
        throw new Error(
          `请求失败: ${response.status} - ${result.error?.message || '未知错误'}`
        );
      }
    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      throw error;
    }
  }

  /**
   * 批量发送聊天请求
   * @param {Array<string>} messages - 用户消息内容数组
   * @param {Object} options - 请求选项
   * @returns {Promise<Array<string>>} 模型回复内容数组
   */
  async batchChat(messages, options = {}) {
    if (!Array.isArray(messages)) {
      throw new Error('消息必须是数组格式');
    }

    // 批量处理消息
    const results = [];
    for (const message of messages) {
      try {
        const response = await this.chat(message, options);
        results.push({
          message: message,
          response: response,
          success: true
        });
      } catch (error) {
        results.push({
          message: message,
          response: null,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }
}

/**
 * 创建DeepSeek API实例的工厂函数
 * @param {string} apiKey - DeepSeek API密钥
 * @returns {DeepSeekApi} DeepSeek API实例
 */
export const createDeepSeekApi = (apiKey) => {
  return new DeepSeekApi(apiKey);
};
