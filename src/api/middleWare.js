import axios from 'axios';
import es6Promise from 'es6-promise';
import ajaxInterceptors from './ajaxInterceptors';

es6Promise.polyfill();
const instance = axios.create();
const interceptor = ajaxInterceptors();

instance.interceptors.request.use(
  interceptor.requestInterceptor,
  error => Promise.reject(error), // Do something with request error
);

instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    // 授权失败
    if (response.data.code === 405 && response.status === 200) {
      interceptor.responseInterceptor.checkUserPermission();
    }
    return response;
  },
  error => Promise.reject(error), // Do something with response error
);

export default instance;
