// import {
//   wxTicketExchangeToken
// } from 'util/wx'
// import {
//   wapCheckUrlToken
// } from 'util/wap'

// 通过sessionStorage记录历史状态
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

const beforeEachHandle = {
  wap(vue, to, from, next) {
    const toIndex = history.getItem(to.path);
    const fromIndex = history.getItem(from.path);
    if (toIndex) {
      if (toIndex > fromIndex || !fromIndex) {
        vue.prototype.$DataStore.direction = 'forward';
      } else {
        vue.prototype.$DataStore.direction = 'reverse';
        historyCount -= 1;
        history.setItem('count', historyCount);
        history.removeItem(from.path);
      }
    } else {
      historyCount += 1;
      history.setItem('count', historyCount);
      if (to.path !== '/') history.setItem(to.path, historyCount);
      vue.prototype.$DataStore.direction = 'forward';
    }
    next();
    // wapCheckUrlToken().then(() => {
    //   if (!window.router._rendered) {
    //     next()
    //   } else {
    //     setTimeout(next, 50)
    //   }
    // })
  },
  wx(vue, to, from, next) {
    const toIndex = history.getItem(to.path);
    const fromIndex = history.getItem(from.path);
    if (toIndex) {
      if (toIndex > fromIndex || !fromIndex) {
        // commit('UPDATE_DIRECTION', 'forward')
        vue.prototype.$DataStore.direction = 'forward';
      } else {
        // commit('UPDATE_DIRECTION', 'reverse')
        vue.prototype.$DataStore.direction = 'reverse';
        historyCount -= 1;
        history.setItem('count', historyCount);
        history.removeItem(from.path);
      }
    } else {
      historyCount += 1;
      history.setItem('count', historyCount);
      if (to.path !== '/') history.setItem(to.path, historyCount);
      vue.prototype.$DataStore.direction = 'forward';
    }
    next();
    // wxTicketExchangeToken().then(() => {
    //   if (!router._rendered) {
    //     next()
    //   } else {
    //     setTimeout(next, 50)
    //   }
    // })
  },
};

export default beforeEachHandle;
