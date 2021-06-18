import axios from 'axios';

const request = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
    timeout: 5000,
});

// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log('request',config);
    //通过axios请求拦截器添加token，保证拥有获取数据的权限
    config.headers.Authorization=window.sessionStorage.getItem('token');
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
  export default request