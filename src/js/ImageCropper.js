import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

/**
 * 图片裁剪类
 * 支持点击上传、拖拽上传、图片裁剪和保存到本地功能
 */
export class ImageCropper {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {string|HTMLElement} options.container - 容器元素或选择器
   * @param {Object} options.cropperOptions - cropperjs配置选项
   */
  constructor(options = {}) {
    const {
      container,
      cropperOptions = {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        cropBoxMovable: true,
        cropBoxResizable: true,
        background: false,
        guides: false,
        center: true
      }
    } = options;

    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.cropperOptions = cropperOptions;
    this.cropper = null;
    this.fileInput = null;
    this.image = null;
    this.uploadArea = null;
    this.modal = null;
    this.modalImage = null;
    this.saveBtn = null;
    this.cancelBtn = null;

    if (!this.container) {
      throw new Error('Container element is required');
    }

    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.createElements();
    this.bindEvents();
  }

  /**
   * 创建DOM元素
   */
  createElements() {
    // 创建上传区域
    this.uploadArea = document.createElement('div');
    this.uploadArea.className = 'image-upload-area';
    this.uploadArea.innerHTML = `
      <div class="upload-content">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>点击或拖拽图片到此处</p>
        <input type="file" class="file-input" accept="image/*" style="display: none;">
      </div>
    `;
    this.container.appendChild(this.uploadArea);

    // 获取文件输入元素
    this.fileInput = this.uploadArea.querySelector('.file-input');

    // 创建裁剪模态框
    this.modal = document.createElement('div');
    this.modal.className = 'cropper-modal-custom';
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    this.modal.innerHTML = `
      <div style="position: relative; max-width: 80%; max-height: 80%; width: 100%; height: 100%;">
        <div class="modal-header" style="position: absolute; top: -40px; left: 0; right: 0; color: white; display: flex; justify-content: space-between; align-items: center;">
          <h3>裁剪图片</h3>
        </div>
        <div class="modal-content" style="position: relative; width: 100%; height: 100%; overflow: hidden; display: flex; justify-content: center; align-items: center;">
          <img src="" alt="" class="cropper-image" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block;">
          <button class="cancel-btn" style="position: absolute; top: 10px; right: 10px; background: rgba(0, 0, 0, 0.5); border: 1px solid white; color: white; padding: 5px 10px; cursor: pointer; z-index: 10;">关闭</button>
          <button class="save-btn" style="position: absolute; bottom: 10px; right: 10px; background: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer; z-index: 10;">保存</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);

    // 获取模态框中的元素
    this.modalImage = this.modal.querySelector('.cropper-image');
    this.saveBtn = this.modal.querySelector('.save-btn');
    this.cancelBtn = this.modal.querySelector('.cancel-btn');
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 点击上传区域
    this.uploadArea.addEventListener('click', () => {
      this.fileInput.click();
    });

    // 文件输入变化
    this.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFile(file);
      }
    });

    // 拖拽事件
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadArea.classList.add('dragover');
    });

    this.uploadArea.addEventListener('dragleave', () => {
      this.uploadArea.classList.remove('dragover');
    });

    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.handleFile(file);
      }
    });

    // 保存按钮点击
    this.saveBtn.addEventListener('click', () => {
      this.saveImage();
    });

    // 取消按钮点击
    this.cancelBtn.addEventListener('click', () => {
      this.closeModal();
    });

    // 点击模态框背景关闭
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  /**
   * 处理上传的文件
   * @param {File} file - 上传的文件
   */
  handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.openModal(e.target.result);
    };
    reader.readAsDataURL(file);
    // 重置文件输入框的值，确保下次选择相同文件时change事件会触发
    this.fileInput.value = '';
  }

  /**
   * 打开裁剪模态框
   * @param {string} imageUrl - 图片URL
   */
  openModal(imageUrl) {
    // 先设置display为flex，确保模态框可见
    this.modal.style.display = 'flex';
    
    // 重置图片的onload事件，确保每次都会执行
    this.modalImage.onload = null;
    
    // 设置图片src
    this.modalImage.src = imageUrl;
    
    // 等待图片加载完成后初始化cropper
    this.modalImage.onload = () => {
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
      this.cropper = new Cropper(this.modalImage, this.cropperOptions);
    };
    
    // 立即检查图片是否已经加载完成（可能来自缓存）
    if (this.modalImage.complete && this.modalImage.naturalWidth > 0) {
      // 如果图片已经加载完成，手动触发onload事件
      if (this.modalImage.onload) {
        this.modalImage.onload();
      }
    }
  }

  /**
   * 关闭裁剪模态框
   */
  closeModal() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.modal.style.display = 'none';
  }

  /**
   * 保存裁剪后的图片到本地
   */
  saveImage() {
    if (!this.cropper) return;

    // 获取裁剪后的图片数据URL
    const canvas = this.cropper.getCroppedCanvas();
    const dataURL = canvas.toDataURL('image/png');

    // 创建下载链接
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `cropped-${Date.now()}.png`;
    link.click();

    // 关闭模态框
    this.closeModal();
  }

  /**
   * 销毁实例
   */
  destroy() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    if (this.uploadArea) {
      this.uploadArea.remove();
    }
    if (this.modal) {
      this.modal.remove();
    }
  }
}

/**
 * 创建图片裁剪实例的工厂函数
 * @param {Object} options - 配置选项
 * @returns {ImageCropper} 图片裁剪实例
 */
export function createImageCropper(options) {
  return new ImageCropper(options);
}
