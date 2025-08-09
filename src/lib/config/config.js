// src/lib/config/config.js
// const BASE_URL_8091 = 'http://localhost:8091';
const BASE_URL_8091 = 'http://120.27.130.190:8091';

const config = { 
  install(app) { 
    app.config.globalProperties.$BASE_URL_8091 = BASE_URL_8091;
  }
};

export default config;