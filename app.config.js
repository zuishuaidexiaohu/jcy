"use strict";
/**
 * 9000 端口 用 test
 * 8082 端口 用 prod
 * @type {'prod'|'test'|'dev'} */
// var ENVIRONMENT = 'test';
var ENVIRONMENT = 'prod';

var APIS = {
  test: {
    API: '/openApi/',
  },

  prod: {
    // API: 'http://192.168.3.34:8089/',//杰哥
    API: 'http://141.73.172.6:8089/', //检察院线上真实环境 2020/10/23
    // API: 'http://192.168.3.30:8089/',
    
  },

  dev: {
    API: 'http://192.168.3.134:8087/',
  }

}[ENVIRONMENT];

/**
 * 设置快照
 * 1、此配置仅用在登录时读取预设使用，其它地方使用或者修改，请使用 __.get('API')  or  __.set('API','/api')
 * 2、配置为跨 iframe 同域下全局通用。
 * @private
 */
var CONFIG = {
  API: APIS.API,
  LOGIN_PAGE: '/login.html',
  HOME: '/index.html',
  // 错误消息
  'ERROR_500': '服务器返回错误，无法访问主机，请联系管理员',
  'ERROR_403': '登录状态失效，请重新登录',


};

/**
 * CONFIG 状态机
 * @type {{init, set, get}}
 */
window.config = window.__ = function (conf) {

  var keys = [];
  var flag = 'WH_CONFIG_FLAG';

  // 如果当前没有缓存标志则初始化
  if (!sessionStorage.getItem(flag)) {
    init()
  }

  /**
   * 初始化
   */
  function init() {
    sessionStorage.setItem(flag, new Date().getTime() + '');

    for (var key in conf) {
      if (conf.hasOwnProperty(key)) {
        var val = conf[key];

        keys.push(key);
        sessionStorage.setItem(key, val)
      }
    }
  }

  /**
   * 获取 config
   * @param [key] {string}
   * @return {string || Object}
   */
  function get(key) {
    var obj = {};
    if (key) {
      return sessionStorage.getItem(key)
    } else {
      keys.map(function (k) {
        obj[k] = sessionStorage.getItem(k)
      })
    }

    return obj
  }

  /**
   * 设置 config
   * @param key {string | Object}
   * @param [val] {string}
   */
  function set(key, val) {
    if (typeof key === "object") {
      for (var k in key) {
        set(k, key[k])
      }
    } else {
      sessionStorage.setItem(key, val)
    }
  }

  return {
    init: init,
    get: get,
    set: set
  }
}(CONFIG);
