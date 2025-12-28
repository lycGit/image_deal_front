/**
 * localStorage工具类使用示例
 * 展示如何使用localStorageUtil.js中的方法获取兑换码信息
 */

// 导入所需的方法
import { 
  getExchangeCode, 
  getTotalPoints, 
  getRemainingPoints, 
  getObtainedTime, 
  getExchangeCodeInfo,
  updateExchangeCodeInfo
} from './localStorageUtil';

// 示例1: 获取单个字段
export const example1 = () => {
  // 获取兑换码
  const code = getExchangeCode();
  console.log('兑换码:', code);
  
  // 获取总点数
  const totalPoints = getTotalPoints();
  console.log('总点数:', totalPoints);
  
  // 获取剩余点数
  const remainingPoints = getRemainingPoints();
  console.log('剩余点数:', remainingPoints);
  
  // 获取获取时间
  const obtainedTime = getObtainedTime();
  console.log('获取时间:', obtainedTime);
};

// 示例2: 获取完整信息
export const example2 = () => {
  const codeInfo = getExchangeCodeInfo();
  if (codeInfo) {
    console.log('完整兑换码信息:', codeInfo);
  } else {
    console.log('兑换码信息不存在');
  }
};

// 示例3: 更新信息
export const example3 = () => {
  // 更新剩余点数
  updateExchangeCodeInfo({ remainingPoints: 90 });
  
  // 验证更新结果
  const remainingPoints = getRemainingPoints();
  console.log('更新后的剩余点数:', remainingPoints);
};

// 在组件中使用的示例（模拟）
export const componentUsageExample = {
  setup() {
    // 在组件挂载时获取数据
    const code = getExchangeCode();
    const totalPoints = getTotalPoints();
    const remainingPoints = getRemainingPoints();
    const obtainedTime = getObtainedTime();
    
    // 可以将这些数据用于组件模板或逻辑
    return {
      code,
      totalPoints,
      remainingPoints,
      obtainedTime
    };
  }
};

// 运行示例
console.log('=== localStorage工具类使用示例 ===');
example1();
example2();
// example3(); // 取消注释可测试更新功能
