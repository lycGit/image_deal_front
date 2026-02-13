<template>
  <div class="introduce-page">
    <div class="container">
      <header class="page-header">
        <h1 class="main-title">证件照生成系统使用指南</h1>
        <p class="subtitle">智能证件照生成工具 · 快速上手指南</p>
      </header>

      <main class="content">
        <!-- 一、功能概述 -->
        <section class="section">
          <h2 class="section-title">
            <span class="title-icon">📋</span>
            一、功能概述
          </h2>
          <div class="section-content">
            <p class="description">
              本系统是一款智能证件照生成工具,通过选择头像模板、上传参考图片,自动生成符合您需求的证件照。支持多种背景颜色、多种证件照尺寸,并提供图片裁剪和下载功能。
            </p>
          </div>
        </section>

        <!-- 二、积分管理 -->
        <section class="section">
          <h2 class="section-title">
            <span class="title-icon">💰</span>
            二、积分管理
          </h2>
          <div class="section-content">
            <img src="/images/introduce/introduce-1.png" alt="积分管理界面" />
            <div class="subsection">
              <h3 class="subsection-title">兑换积分</h3>
              <p class="description">如果积分不足,可以通过兑换码充值:</p>
              <ul class="feature-list">
                <li>点击右上角"输入兑换码"按钮</li>
                <li>输入有效的兑换码</li>
              </ul>
            </div>
            <div class="subsection">
              <h3 class="subsection-title">积分消耗</h3>
              <ul class="feature-list">
                <li>每次生成图片会消耗一定数量的积分</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 三、使用步骤 -->
        <section class="section">
          <h2 class="section-title">
            <span class="title-icon">🚀</span>
            三、使用步骤
          </h2>
          <div class="section-content">
            <img src="/images/introduce/introduce-2.png" alt="选择头像模板" />
            <div class="step-card">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="step-title">选择头像模板</h3>
                <p class="step-description">在对应区域点击您喜欢的头像模板</p>
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="step-title">选择证件照背景颜色</h3>
                <p class="step-description">系统提供三种标准证件照背景色</p>
              </div>
            </div>
            <img src="/images/introduce/introduce-3.png" alt="上传参考图片" />
            <div class="step-card">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="step-title">上传参考图片</h3>
                <div class="step-details">
                  <p class="step-label"><strong>要求:</strong></p>
                  <ul class="feature-list">
                    <li>支持jpg、png等常见图片格式</li>
                  </ul>
                  <p class="step-label"><strong>操作方法:</strong></p>
                  <ul class="feature-list">
                    <li><strong>方法1:</strong>点击上传区域,从电脑中选择图片</li>
                    <li><strong>方法2:</strong>直接拖拽图片到上传区域</li>
                    <li><strong>提示:</strong>如果您的照片是多人群像,点击"非单人照?点此裁剪"按钮,跳转到专门的裁剪页面进行单人提取</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3 class="step-title">开始生成</h3>
                <div class="step-details">
                  <p class="step-label"><strong>操作方法:</strong></p>
                  <ul class="feature-list">
                    <li>点击"开始生成"按钮</li>
                    <li>等待约30秒,系统会自动生成证件照</li>
                    <li>生成过程中按钮显示"生成中..."状态</li>
                  </ul>
                </div>
              </div>
            </div>
            <img src="/images/introduce/introduce-4.png" alt="查看和下载生成结果" />
            <div class="step-card">
              <div class="step-number">5</div>
              <div class="step-content">
                <h3 class="step-title">查看和下载生成结果</h3>
                <p class="step-description">生成完成后,图片会显示在右侧展示区域:</p>
                <div class="step-details">
                  <p class="step-label"><strong>图片操作:</strong></p>
                  <ul class="feature-list">
                    <li><strong>裁剪按钮</strong>(剪刀图标):点击后打开裁剪模态框,可对图片进行精细裁剪</li>
                    <li><strong>下载按钮</strong>(下载图标):点击后直接下载图片到本地</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 四、图片裁剪功能 -->
        <section class="section">
          <h2 class="section-title">
            <span class="title-icon">✂️</span>
            四、图片裁剪功能
          </h2>
          <div class="section-content">
            <img src="/images/introduce/introduce-5.png" alt="图片裁剪功能" />
            <div class="subsection">
              <h3 class="subsection-title">裁剪尺寸选择</h3>
              <p class="description">系统提供7种标准证件照尺寸:</p>
              <div class="size-grid">
                <div class="size-item">
                  <div class="size-name">自定义</div>
                  <div class="size-desc">自由裁剪,不限制比例</div>
                </div>
                <div class="size-item">
                  <div class="size-name">小一寸</div>
                  <div class="size-desc">260×378px</div>
                </div>
                <div class="size-item">
                  <div class="size-name">一寸照</div>
                  <div class="size-desc">295×413px</div>
                </div>
                <div class="size-item">
                  <div class="size-name">大一寸</div>
                  <div class="size-desc">390×567px</div>
                </div>
                <div class="size-item">
                  <div class="size-name">小二寸</div>
                  <div class="size-desc">413×531px</div>
                </div>
                <div class="size-item">
                  <div class="size-name">二寸照</div>
                  <div class="size-desc">413×579px</div>
                </div>
                <div class="size-item">
                  <div class="size-name">大二寸</div>
                  <div class="size-desc">413×625px</div>
                </div>
              </div>
            </div>

            <div class="subsection">
              <h3 class="subsection-title">裁剪操作</h3>
              <div class="step-details">
                <p class="step-label"><strong>图片调整:</strong></p>
                <ul class="feature-list">
                  <li><strong>放大/缩小:</strong>使用"+"和"-"按钮调整图片大小</li>
                  <li><strong>移动图片:</strong>使用上下箭头按钮移动图片位置</li>
                  <li><strong>鼠标操作:</strong>直接拖拽裁剪框调整位置和大小</li>
                </ul>
                <p class="step-label"><strong>完成裁剪:</strong></p>
                <ul class="feature-list">
                  <li>点击"确认裁剪"保存裁剪结果</li>
                  <li>点击"取消"放弃当前裁剪操作</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- 五、常见问题 -->
        <section class="section">
          <h2 class="section-title">
            <span class="title-icon">❓</span>
            五、常见问题
          </h2>
          <div class="section-content">
            <div class="faq-item">
              <div class="faq-question">
                <span class="faq-icon">Q:</span>
                <span>生成失败怎么办?</span>
              </div>
              <div class="faq-answer">
                <span class="faq-icon">A:</span>
                <span>请检查网络连接,确认积分充足,然后重新尝试生成。</span>
              </div>
            </div>

            <div class="faq-item">
              <div class="faq-question">
                <span class="faq-icon">Q:</span>
                <span>如何更换头像模板?</span>
              </div>
              <div class="faq-answer">
                <span class="faq-icon">A:</span>
                <span>直接点击其他头像模板即可,系统会自动更新选择。</span>
              </div>
            </div>

            <div class="faq-item">
              <div class="faq-question">
                <span class="faq-icon">Q:</span>
                <span>可以同时生成多张图片吗?</span>
              </div>
              <div class="faq-answer">
                <span class="faq-icon">A:</span>
                <span>不可以,需要等当前图片生成完成后才能生成下一张。</span>
              </div>
            </div>

            <div class="faq-item">
              <div class="faq-question">
                <span class="faq-icon">Q:</span>
                <span>如何裁剪多人照片中的单人?</span>
              </div>
              <div class="faq-answer">
                <span class="faq-icon">A:</span>
                <span>点击"非单人照?点此裁剪"按钮,跳转到专门的裁剪页面进行单人提取。</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 页脚 -->
        <footer class="page-footer">
          <p class="footer-text">
            希望这份使用指南能帮助您快速上手使用本系统!如有其他问题,请随时联系技术支持。
          </p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'IntroducePage'
})
// 页面组件，无需额外逻辑
</script>

<style scoped>
.introduce-page {
  min-height: 100vh;
  height: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  padding-bottom: 60px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  color: white;
}

.main-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.content {
  background: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.section {
  margin-bottom: 50px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.section-content {
  padding-left: 44px;
}

.subsection {
  margin-bottom: 30px;
}

.subsection:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 20px;
  font-weight: 600;
  color: #555;
  margin: 0 0 15px 0;
}

.description {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin: 0 0 15px 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  padding-left: 25px;
  position: relative;
  margin-bottom: 8px;
}

.feature-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.step-card {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.step-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.step-number {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.step-description {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin: 0 0 15px 0;
}

.step-details {
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.step-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.size-item {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.size-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.size-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.size-desc {
  font-size: 14px;
  color: #666;
}

.faq-item {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.faq-question {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.faq-answer {
  font-size: 15px;
  line-height: 1.8;
  color: #666;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.faq-icon {
  flex-shrink: 0;
  font-weight: 700;
  color: #667eea;
}

/* 图片样式 */
.section-content img {
  display: block;
  max-width: 85%;
  margin: 0 auto 30px auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.page-footer {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
  text-align: center;
}

.footer-text {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .introduce-page {
    padding: 20px 10px;
  }

  .main-title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 16px;
  }

  .content {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 22px;
  }

  .step-card {
    flex-direction: column;
  }

  .step-number {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .size-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>