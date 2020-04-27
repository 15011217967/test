import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

// 创建axios实例
const service = axios.create({
  timeout: 15000, // 请求超时时间
})

// request拦截器  请求前  添加请求头在此添加
service.interceptors.request.use(config => {
    console.log(config)
    config.headers.accessToken = 'eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJ7XCJsb2dpbk5hbWVcIjpcImphc29uXCIsXCJ0ZW5hbnRJZFwiOlwiOTg4OWQ0ZWQtZGVhNC0xMWU5LWE4OTgtMDI0MmFjMTEwMDAyXCIsXCJkZXBhcnRJZFwiOlwiMGI5OTQyNmMtNjk3OS00MDM1LTgxYjMtNjIwMzQ2NGI5Yjg1XCIsXCJ1c2VyTmFtZVwiOlwiSmFzb24gRGF2aWVzXCIsXCJ0eXBlXCI6MCxcInVzZXJJZFwiOlwiNjViMDRmYTAtYWM3Ny00OTY2LWFiN2UtYjgxNDhmOGMwNDQxXCJ9IiwiZXhwIjoxNTg4NTgwNTQxfQ.W0ek01XCK-s18e04QdZASaZ9Bf-rHXs4KEJHbNjr8bObm3-4Zq7dagSnkA0JprKUOkOwLFnuvzMeCIL0umLyJNe_B5ENZYBPRMt3L_-Z6OjhYgWDb6uwMqNLWt1tUSH1gBv445YRS1rvOJODi90gxeEb0rNr0oQOVrH77hmF2I8'; // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Scope-Of-Use'] = 'platform/1.0 (Windows NT 10.0; Win64; x64)';
  return config;
});
Vue.prototype.$axios = service;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
