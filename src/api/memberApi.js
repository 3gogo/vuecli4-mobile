import axios from './middleWare';

// 打开福袋
export const checkPlusOrderReleased = params => axios.post('/plateno_mall/common/proxy/plusAct-checkOrder', { ...params });

export default {
  checkPlusOrderReleased,
};
