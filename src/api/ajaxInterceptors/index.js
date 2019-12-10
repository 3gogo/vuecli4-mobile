/**
 * 网关登录参考
 * http://wiki.bestwehotel.com/pages/viewpage.action?pageId=13534021
 *
 * */
import {
  CHANNEL,
} from '@config';

import web from './web';
import native from './native';

const interceptor = () => {
  if (CHANNEL === 'app') {
    return native;
  }
  return web;
};

export default interceptor;
