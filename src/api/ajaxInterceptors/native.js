import cookie from 'cookie_js';
import { getToken, login } from '@utils/user';
import { CHANNEL } from '@config';
// import { getBaseClientInfo } from 'util/dataCollect'

// 返回接口的前置入参
const interfaceBaseParams = () => ({
  authority: Object.assign({}, {
    uniType: CHANNEL,
  }, getToken()),
  clientInfo: {},
});

// 请求拦截器
export const requestInterceptor = (config) => {
  // Do something before request is sent
  const { authority, clientInfo } = interfaceBaseParams();
  config.headers = Object.assign({}, authority, config.headers);
  config.data = Object.assign({}, { clientInfo }, config.data); // token传空后端兼容小程序登录

  return new Promise(((resolve) => {
    resolve(config);
  }));
};


// 响应拦截器
export const responseInterceptor = {
  checkUserPermission() {
    if (cookie.get('setLogin')) {
      return false;
    }
    // 记录一次登录行为,处理多个拦截监听并行触发
    cookie.set({ setLogin: 1 }, {
      // setLogin记录有效期为3s
      expires: 3 / (24 * 60 * 60),
    });
    localStorage.removeItem('token');
    // 当授权失败，直接去登录
    // login()()
    return login()();
  },
};

export default {
  requestInterceptor,
  responseInterceptor,
};
