import axios from './middleWare';

export const getGoodsIndex = params => axios.post('/plateno_mall/goods/index', { ...params });

export default {
  getGoodsIndex,
};
