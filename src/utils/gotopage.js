import util from 'util';

const urlObj = util.parseURL(window.location.href);

function parseQuery(params) {
  if (Object.keys(params).length === 0) {
    return '';
  }
  let result = '';
  const keys = Object.keys(params);
  keys.forEach((key) => {
    result += `${key}=${params[key]}&`;
  });
  return result;
}

function getUri(page, params, module) {
  let queryString = window.location.search;
  queryString = queryString === '' ? '' : `?${queryString.replace('?', '').replace(/^&*/, '')}`;
  const url = `${window.location.protocol}//${window.location.host}/${module}.html${queryString}#/${page}?${parseQuery(params)}`;
  return url;
}

function getUpdatedSearchUrl(url) {
  const tmpUrl = util.parseURL(url);
  let search = '';
  try {
    const keys = Object.keys(tmpUrl.params);
    keys.forEach((key) => {
      if (key !== 'timestamp') {
        search += `${key}=${tmpUrl.params[key]}&`;
      }
    });
  } catch (e) {
    console.log(e);
  }
  search += `timestamp=${+new Date()}`;
  return `${window.location.protocol}//${tmpUrl.host}:${tmpUrl.port}${tmpUrl.path}?${search}#${tmpUrl.hash}`;
}
/**
 * 过滤 null/undefined/空串
 *
 * @param {Object} query - url带参集合
 * */
function filterNoValue(query) {
  const map = query;
  const keys = Object.keys(map);
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      const element = map[key];
      if (!element && element !== 0 && element !== '0') {
        delete map[key];
      }
    }
  });
  return map;
}

/**
 * 保留一些参数
 *
 * @param {Object} params - 参数集
 * @param {Object} vm - vue实例
 * @return {Object} params - 参数集
 * */
function paramMaintain(params, vm) {
  let tmpParams = params;
  if (vm) {
    // sid默认传递
    const { sid } = vm.$route.query;
    tmpParams = sid ? Object.assign(tmpParams, { sid }) : tmpParams;
  }
  return tmpParams;
}

export const goToPage = (page, params, module, vm, reload) => {
  let tmpParams = params;
  tmpParams = filterNoValue(tmpParams || {});
  tmpParams = paramMaintain(tmpParams, vm);
  if (reload) {
    // 改变url search的时间戳强制刷新页面(商品详情页打开推荐商品在用)
    window.location.href = getUpdatedSearchUrl(getUri(page, tmpParams, module));
    // 判断是否在当前module
  } else if (window.ocation.href.indexOf(`${module}.html`) > -1 || (urlObj.file === '' && module === 'goods')) {
    vm.$router.push({
      path: `/${page}`,
      query: tmpParams,
    });
  } else {
    window.location.href = getUri(page, tmpParams, module);
  }
};
/**
 * replace方法替换当前url 修改search强制浏览器刷新
 * */
export const replacePageReload = (page, params, module, vm) => {
  let tmpParams = params;
  // 判断是否在当前module
  tmpParams = filterNoValue(tmpParams || {});
  tmpParams = paramMaintain(tmpParams, vm);
  window.location.replace(getUpdatedSearchUrl(getUri(page, tmpParams, module)));
};
export const openCurrentWebview = (page, params, module, vm) => {
  let tmpParams = params;
  tmpParams = tmpParams || {};
  tmpParams = filterNoValue(tmpParams);
  tmpParams = paramMaintain(tmpParams, vm);
  if (window.location.href.indexOf(`${module}.html`) > -1 || (urlObj.file === '' && module === 'goods')) {
    vm.$router.push({
      path: `/${page}`,
      query: tmpParams,
    });
  } else {
    window.location.href = getUri(page, tmpParams, module);
  }
};
/**
 * replace的跳转方法
 */
export const replaceCurrentWebview = (page, params, module, vm) => {
  let tmpParams = params;
  tmpParams = filterNoValue(tmpParams || {});
  tmpParams = paramMaintain(tmpParams, vm);
  // Object.assign(tmpParams,{hide:true,showTitle:false,suspension:true,transparent:true})
  if (window.location.href.indexOf(`${module}.html`) > -1 || (urlObj.file === '' && module === 'goods')) {
    vm.$router.replace({
      path: `/${page}`,
      query: tmpParams,
    });
  } else {
    window.location.href = getUri(page, tmpParams, module);
  }
};
export const openUrl = (url) => {
  let returnUrl = url;
  if (!url) {
    return;
  }
  if (!/http(s)*:\/\//.test(url)) {
    returnUrl = `http://${url}`;
  }
  window.location.href = returnUrl;
};
