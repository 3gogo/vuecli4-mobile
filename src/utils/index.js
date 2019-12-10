// import FastClick from 'fastclick';
import { PLATFORM } from '@config';

const Vconsole = require('vconsole');

const UTIL = {};
// 开发模式下，开启调试控制面板
if (process.env.NODE_ENV === 'development') {
  const vConsole = new Vconsole();
  console.log(typeof vConsole);
}
// 根据ua获取系统基本信息
const ua = navigator.userAgent;

/* eslint-disable camelcase */
const brower = {
  isMobile: !!ua.match(/AppleWebKit.*Mobile.*/) || !!ua.match(/AppleWebKit/),
  isIos: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  isIPad: !!ua.match(/iPad/i),
  isAndroid: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
  isWx: ua.toLowerCase().indexOf('micromessenger') > -1,
  isApp: PLATFORM === 'app',
  isMini: function isMini() {
    // 是否小程序
    const { __wxjs_environment } = window;
    return __wxjs_environment === 'miniprogram';
  },
};
/* eslint-enable camelcase */

UTIL.OS = brower;

/**
 * 添加fastClick
 */
// FastClick.attach(document.body);
/**
    日期格式化函数
    @param  {DateString}  timestamp default: 当前时间
    @param  {formatString} fmt  default: yyyy-mm-dd  y:年 m:月 d:日 w:星期 h:小时 M:分钟 s:秒
    * */
UTIL.dateFormat = (timestamp, fmt) => {
  const D = new Date();
  const week = '日一二三四五六';
  let formator = fmt;
  if (timestamp) {
    D.setTime(timestamp);
  } else {
    return undefined;
  }
  formator = formator || 'yyyy-mm-dd';
  const d = {
    'm+': D.getMonth() + 1,
    'd+': D.getDate(),
    'w+': week.charAt(D.getDay()),
    'h+': D.getHours(),
    'M+': D.getMinutes(),
    's+': D.getSeconds(),
  };
  if (/(y+)/.test(formator)) {
    formator = formator.replace(RegExp.$1, (`${D.getFullYear()}`).slice(-RegExp.$1.length));
  }
  Object.keys(d).forEach((key) => {
    if (new RegExp(`(${key})`).test(formator)) {
      formator = formator.replace(RegExp.$1, RegExp.$1.length === 1 ? d[key] : `00${d[key]}`.slice((`${d[key]}`).length));
    }
  });
  return formator;
};

/**
 * 解析url
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
UTIL.parseURL = (url) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (() => {
      const ret = {};
      const seg = a.search.replace(/^\?/, '').split('&');
      const len = seg.length;
      let i = 0;

      for (; i < len; i += 1) {
        if (seg[i]) {
          const index = seg[i].indexOf('=');
          const key = seg[i].substring(0, index);
          const val = seg[i].substring(index + 1);
          ret[key] = val;
        }
      }
      return ret;
    })(),
    queryObj: (() => {
      const ret = {};
      let seg = a.hash.split('?');
      let len = 0;
      let i = 0;
      seg = (seg[1] && seg[1].split('&')) || [];
      len = seg.length;
      for (; i < len; i += 1) {
        if (seg[i]) {
          const index = seg[i].indexOf('=');
          const key = seg[i].substring(0, index);
          const val = seg[i].substring(index + 1);
          ret[key] = val;
        }
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || [undefined, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || [undefined, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
};

UTIL.moneyParse = val => val / 100;

UTIL.parents = (node, className) => {
  if (this.hasClass(node, className)) {
    return node;
  }
  return UTIL.parents(node.parentNode, className);
};
UTIL.hasClass = (elem, cls) => {
  const data = cls || '';
  if (data.replace(/\s/g, '').length === 0) return false;
  return new RegExp(` ${data} `).test(` ${elem.className} `);
};

// 计算rem
const rootHml = document.getElementsByTagName('html')[0];
const rootFont = Number.parseInt(rootHml.style.fontSize, 10);
// 入参为单位为rem
UTIL.remToPx = val => val * rootFont;

// 检查是否支持 0.5px border
UTIL.checkHairline = () => {
  if (window.devicePixelRatio && devicePixelRatio >= 2) {
    const testElem = document.createElement('div');
    testElem.style.border = '.5px solid transparent';
    document.body.appendChild(testElem);
    if (testElem.offsetHeight === 1) {
      document.querySelector('html').classList.add('hairline');
    }
    document.body.removeChild(testElem);
  }
};

// 检查是否Android 若是则加上一个css标识
UTIL.checkAndroid = () => {
  if (/android/i.test(window.navigator.userAgent)) {
    document.querySelector('html').classList.add('android');
  }
};

/**
 * 两个时间戳间做倒计时
 *
 * @param {Number} start - 开始倒计时时间戳
 * @param {Number} end - 结束倒计时时间戳
 * @param {Function} cb - 每半秒的回调
 * */
UTIL.countDown = (start, end, cb, interval) => {
  let timer; let now; const
    cur = Date.now();
  timer = setTimeout(function thistick() {
    now = start + (Date.now() - cur);
    if (now >= end) {
      clearTimeout(timer);
    } else {
      if (cb) cb(now, timer);
      timer = setTimeout(thistick, interval || 500);
    }
  }, interval || 500);
};

// {a:1, b:1, c:null, d:undefined, e:'null', f:0} ===> ?a=1&b=1&f=0
UTIL.json2query = (obj) => {
  let queryStr = ''; let
    keys;
  if (obj && typeof obj === 'object') {
    keys = Object.keys(obj);
    if (keys.length > 0) {
      queryStr = keys.map((key) => {
        if (!key || key === 'null' || key === 'undefined') {
          return '';
        }
        if (obj[key] !== 'null' && obj[key] !== 'undefined') {
          if (obj[key] || obj[key] === 0) {
            return `${key}=${obj[key]}`;
          }
        }
        return '';
      }).join('&');
    }
    queryStr = queryStr.replace(/[&]+/g, ' ').trim();
    queryStr = queryStr.replace(/[ ]+/g, '&');
    queryStr = (queryStr.length > 0 ? '?' : '') + queryStr;
  }
  return queryStr;
};

// 站内链接作为外链 按业务需求格式化
UTIL.outLinkParse = (link) => {
  if (typeof link !== 'string') {
    return '';
  }
  const aElem = document.createElement('a');
  aElem.href = link;

  // 添加业务参数
  let addParams = {
    // newWx: newWx? 1: null // 是否为新铂涛微信公众号
  };
  const parseUrlObj = UTIL.parseURL(link);
  addParams = Object.assign({}, parseUrlObj.params, addParams);
  aElem.search = UTIL.json2query(addParams);

  let url = aElem.toString();

  // 清除多余参数
  const ticketRule = new RegExp('&?ticket=[\\w-%]+', 'gi');
  url = url.replace(ticketRule, '');
  return url;
};
export const util = UTIL;
export default util;
