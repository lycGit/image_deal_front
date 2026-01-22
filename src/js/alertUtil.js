/**
 * 自定义弹窗工具类
 * 提供美观的弹窗替代原生alert
 */

// 弹窗容器元素
let alertContainer = null;

/**
 * 初始化弹窗容器
 * @private
 */
function initAlertContainer() {
  if (alertContainer) return;
  
  alertContainer = document.createElement('div');
  alertContainer.className = 'custom-alert-container';
  document.body.appendChild(alertContainer);
  
  // 添加弹窗样式
  const style = document.createElement('style');
  style.textContent = `
    /* 自定义弹窗样式 */
    .custom-alert-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .custom-alert {
      background-color: #1e1f22;
      border-radius: 8px;
      padding: 24px;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .alert-message {
      color: #ffffff;
      font-size: 16px;
      line-height: 1.4;
      text-align: center;
    }

    .alert-actions {
      display: flex;
      justify-content: center;
    }

    .alert-button {
      background-color: #4776e6;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 8px 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .alert-button:hover {
      background-color: #3a68d8;
    }

    .alert-button:active {
      background-color: #2d57c7;
    }
  `;
  document.head.appendChild(style);
}

/**
 * 显示自定义弹窗
 * @param {string} message - 弹窗消息内容
 * @returns {Promise} - 弹窗关闭时resolve的Promise
 */
export function showAlert(message) {
  return new Promise((resolve) => {
    initAlertContainer();
    
    // 创建弹窗DOM结构
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.onclick = () => {
      closeAlert(overlay, resolve);
    };
    
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.onclick = (e) => {
      e.stopPropagation();
    };
    
    const content = document.createElement('div');
    content.className = 'alert-content';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert-message';
    messageDiv.textContent = message;
    
    const actions = document.createElement('div');
    actions.className = 'alert-actions';
    
    const button = document.createElement('button');
    button.className = 'alert-button';
    button.textContent = '确定';
    button.onclick = () => {
      closeAlert(overlay, resolve);
    };
    
    actions.appendChild(button);
    content.appendChild(messageDiv);
    content.appendChild(actions);
    alertBox.appendChild(content);
    overlay.appendChild(alertBox);
    alertContainer.appendChild(overlay);
  });
}

/**
 * 关闭弹窗
 * @param {HTMLElement} overlay - 弹窗遮罩层元素
 * @param {Function} resolve - Promise的resolve函数
 * @private
 */
function closeAlert(overlay, resolve) {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  resolve();
}

/**
 * 显示带回调的弹窗
 * @param {string} message - 弹窗消息内容
 * @param {Function} callback - 弹窗关闭后的回调函数
 */
export function showAlertWithCallback(message, callback) {
  showAlert(message).then(() => {
    if (typeof callback === 'function') {
      callback();
    }
  });
}

// 导出默认实例
export default {
  show: showAlert,
  showWithCallback: showAlertWithCallback
};
