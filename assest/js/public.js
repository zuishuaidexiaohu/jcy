"use strict";

var win = window;

var hint = console;
var api = __.get('API');


var JS_CACHE = {};
var CSS_CACHE = {};

var userInfo = {};
userInfo = sessionStorage.getItem("userInfo");

try {
    userInfo = JSON.parse(userInfo) || {}
} catch (e) {
    userInfo = {};
    console.error(e)
}

/**
 * 获取 query 字段
 * @param name {string}
 * @returns {string}
 */
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    return result == null || result.length < 1
        ? ""
        : result[1];
}


window._m = window.methods = {

    /**
     * LOAD CSS
     * @param fileName {string}
     * @param [callback] {Function}
     */
    loadCSS: function (fileName, callback) {
        var def = $.Deferred();

        if (!CSS_CACHE[fileName]) {
            var promise = jQuery.Deferred();

            // adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0],
                link = document.createElement('link');
            link.rel = "stylesheet";
            link.href = fileName;

            // then bind the event to the callback function
            // there are several events for cross browser compatibility
            link.onload = function () {
                promise.resolve = promise.resolve || $.noop;
                promise.resolve();
            };

            // fire the loading
            head.appendChild(link);

            // clear DOM reference
            head = null;
            link = null;

            CSS_CACHE[fileName] = promise.promise();

        } else if (__.get('debugState'))
            root.root.console.log("This script was already loaded %c: " + fileName, __.get('debug_warning'));

        CSS_CACHE[fileName].then(function () {
            def.resolve();
            if (typeof callback === 'function')
                callback();
        });
        return def
    },
    loadScript: function (scriptName, callback) {
        var def = $.Deferred();

        if (!JS_CACHE[scriptName]) {
            var promise = jQuery.Deferred();

            // adding the script tag to the head as suggested before
            var body = document.getElementsByTagName('body')[0],
                script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scriptName;

            // then bind the event to the callback function
            // there are several events for cross browser compatibility
            script.onload = function () {
                promise.resolve = promise.resolve || $.noop;
                promise.resolve();
            };

            // fire the loading
            body.appendChild(script);

            // clear DOM reference
            body = null;
            script = null;

            JS_CACHE[scriptName] = promise.promise();

        } else if (__.get('debugState'))
            root.root.console.log("This script was already loaded %c: " + scriptName, __.get('debug_warning'));

        JS_CACHE[scriptName].then(function () {
            def.resolve();
            if (typeof callback === 'function')
                callback();
        });
        return def
    },

    // 注销登录
    logout: function () {
        if (window.parent !== window) {
            window.parent._m.logout()
        } else {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userInfo');
            window.location.pathname = __.get('LOGIN_PAGE')
        }
    },
    log: function () {
        console.log.apply(null, arguments)
    },
    checkLogin: function () {


        if (JSON.stringify(userInfo) != "{}") {
            return true
        } else {
            methods.logout();
            return false
        }
    },
    alert: function (msg) {
        var title = '';
        var content = [];
        if (arguments.length <= 1) {
            title = '提示';
            content = msg
        } else {
            title = arguments[0] + '';
            content = arguments[1] + ''
        }

        MSG.alert(title, content || '');
    },
    /**
     * 获取数据公共方法
     * @param api {string|Object}
     * @param [data] {Object}
     * @param [quiet] {boolean}
     * @returns {*|jQuery|{getAllResponseHeaders, abort, setRequestHeader, readyState, getResponseHeader, overrideMimeType, statusCode}|*}
     */
    post: function (api, data, quiet) {
        var options;

        // 兼容古老的 ajax ！
        if (typeof api === "object") {
            options = api || {};
            api = undefined;
            quiet = data;
        }
        data = $.extend({}, {}, data);

        options = $.extend({}, {
            type: 'POST',
            url: __.get('API') + api,
            data: data
        }, options);

        return $.ajax(options)
            .pipe(function (res) {
                if (res.code === 0) {
                }
                return res
            })
            .pipe(
                function (res) {
                    // 调用父窗口的方法
                    var pWin = window.parent;
                    // 检查错误码 并判断是否继续
                    if (!_m.checkStateCode(res.code)) {
                        return false
                    }
                    if (res.code !== 0 && !quiet) {
                        // 弹出错误消息（节流以防止频繁弹出）
                        pWin.eWarningAlert = pWin.eWarningAlert || new _m.Throttle(500);
                        pWin.eWarningAlert.emit(function () {
                            pWin.MSG.warning('提示', res.msg || __.get('ERROR_' + res.code) || '未知错误')
                        });
                    }
                    return res
                },
                function (error) {
                    // 调用父窗口的方法
                    var pWin = window.parent;
                    // 检查错误码 并是否继续
                    if (!_m.checkStateCode(error.status)) {
                        return false
                    }
                    console.error(error);
                    return error
                }
            )
    },
    toggleAside: function (isHidden) {
        $('body').toggleClass('mini-side')
    },


    postJson: function (api, data, quiet) {
        var options;

        // 兼容古老的 ajax ！
        if (typeof api === "object") {
            options = api || {};
            api = undefined;
            quiet = data;
        }
        options = $.extend({}, {
            type: 'POST',
            url: __.get('API') + api,
            data: JSON.stringify(data),
            contentType: 'application/json;charset=utf-8'
        }, options);

        return $.ajax(options)
            .pipe(function (res) {
                if (res.code === 0) {
                }
                return res
            })
            .pipe(
                function (res) {
                    // 调用父窗口的方法
                    var pWin = window.parent;
                    // 检查错误码 并判断是否继续
                    if (!_m.checkStateCode(res.code)) {
                        return false
                    }
                    if (res.code !== 0 && !quiet) {
                        // 弹出错误消息（节流以防止频繁弹出）
                        pWin.eWarningAlert = pWin.eWarningAlert || new _m.Throttle(500);
                        pWin.eWarningAlert.emit(function () {
                            pWin.MSG.warning('提示', res.msg || __.get('ERROR_' + res.code) || '未知错误')
                        });
                    }
                    return res
                },
                function (error) {
                    // 调用父窗口的方法
                    var pWin = window.parent;
                    // 检查错误码 并是否继续
                    if (!_m.checkStateCode(error.status)) {
                        return false
                    }
                    console.error(error);
                    return error
                }
            )
    },




    /**
     * 获取字典项
     * 一级风险 * 二级风险 * 三级风险 * 一般安全风险 *
     * V_BADW 办案单位
     * V_BQ 病情名称列表
     * V_JJSYTS 戒具使用提示
     * V_LSYY 留所原因
     * V_EMSYJTLY 耳目使用原因
     * V_JJSYJTYY 戒具使用原因
     * V_CashPayWay 支出方式
     * V_LayerDept 律师单位
     * V_LSCSYY 出所原因
     * V_SSJD 诉讼阶段
     * V_ZASD 作案手段
     * @param dmst {'V_EMSYJTLY'|'V_JJSYJTYY'|'V_CashPayWay'|'V_BADW'|'V_LSYY'|'一级风险'|'二级风险'|'三级风险'|'一般安全风险'|'V_JJSYTS'|'V_XB'|'V_BQ'|'V_LayerDept'|'V_ZASD'|'V_LSCSYY'|'V_SSJD'}
     * @param [config]
     * @param [config.json] {boolean}
     * @param [config.value] {string}
     * @param [config.label] {string}
     * @return {*|jQuery|{}}
     */
    getCode: function (config) {
        config = config || {};

        var options = ['<option value="">请选择文书类型</option>'];
        var json = config.json || false;
        var value = config.value || 'hz';
        var label = config.label || 'hz';

        return _m.post('code/achieveDropDown', {})
            .pipe(function (res) {
                if (json) {
                    return res.data
                } else {
                    $.each(res.data, function (i, item) {
                        options.push('<option value="' + item[value] + '">' + item[label] + '</option>')
                    });
                    var el = options.join('');
                    return el
                }
            });
    },




    /** @private */
    _ACTIONS: {
        event: [/** @param event {Event} */function (event) {
            console.log(event)
        }]
    },

    /**
     * @param eventName
     * @return {{subscribe: (function(number): number), unSubscribe: unSubscribe}}
     */
    action: function (eventName) {
        return {
            subscribe: function (fun) {
                var event = _m._ACTIONS[eventName] = _m._ACTIONS[eventName] || [];
                return event.push(fun)
            },
            unSubscribe: function (index) {
                delete _m._ACTIONS[index]
            }
        }
    },

    /**
     * @param eventName {string}
     * @param [event] {Event}
     */
    doAction: function (eventName, event) {
        var actionFuns = _m._ACTIONS[eventName];
        $.each(actionFuns || [], function (index, fun) {
            if (typeof fun === 'function') {
                fun(event)
            }
        })
    },


    checkStateCode: function (stateCode) {
        switch (stateCode) {
            case 500:
                return _m.checkLogin();
            case 404:
                break;
            case 403:
                setTimeout(function () {
                    _m.logout();
                }, 3000);
                break;
            default:
                return true
        }
    },

    /**
     * 函数节流
     * @constructor
     * @param wait {number}
     * @param [options]
     * @param options.leading {boolean} false 表示禁用第一次执行
     * @param options.trailing {boolean}  false 表示禁用停止触发的回调
     * @example
     * ```
     * var t = new _m.Throttle(300)
     * t.emit(function(){console.log(1)})
     * ```
     */
    Throttle: function (wait, options) {
        var _this = this;

        this.timeout = null;
        this.context = null;
        this.function = null;
        this.previous = 0;
        this.options = options || {};

        this.later = function () {
            _this.previous = options.leading === false ? 0 : new Date().getTime();
            _this.timeout = null;
            _this.function.apply(_this.context);

            if (!this.timeout) {
                _this.context = null;
                _this.args = null;
            }
        };

        this.emit = function (fun) {
            _this.function = fun || _this.function;

            var now = new Date().getTime();
            if (!_this.previous && _this.options.leading === false) _this.previous = now;
            var remaining = wait - (now - _this.previous);
            _this.context = this;
            if (remaining <= 0 || remaining > wait) {
                if (_this.timeout) {
                    clearTimeout(_this.timeout);
                    _this.timeout = null;
                }
                _this.previous = now;
                if (typeof _this.function === "function") {
                    _this.function.apply(_this.context);
                }
                if (!_this.timeout) _this.context = null;
            } else if (!_this.timeout && this.options.trailing !== false) {
                _this.timeout = setTimeout(_this.next, remaining);
            }
        };

        this.cancel = function () {
            clearTimeout(_this.timeout);
            _this.previous = 0;
            _this.timeout = null;
        };
        return this;
    },

    /**
     * 防抖函数
     * @param func {Function}
     * @param wait {number}
     * @return {Function}
     */
    debounce: function (func, wait) {
        var timeout = '';
        return function (v) {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                func(v);
            }, wait);
        }
    },

    /**
     * 补全位数
     * @param source
     * @param [length] {number}
     * @param [t] {string}
     * @return {string}
     */
    prefix: function (source, length, t) {
        length = length || 2;
        t = t || '0';

        return (Array(length).join(t) + source).slice(-length);
    },

    /**
     * 手动触发 Element Event
     * @param el {Element}
     * @param eventName {string}
     * @param [data] {*}
     * @return {Element}
     */
    dispatchEvent: function (el, eventName, data) {
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent(eventName, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        event.data = data;
        el.dispatchEvent(event);
        return el;
    },

    /**
     * 限制数字输入，并只保留两位小数
     * @param obj {HTMLInputElement | {value}}
     */
    clearNoNum: function (obj) {
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value) + '';
        }
        return obj
    },

    /**
     * 限制数字 且 不能超过 n 位
     * @param obj {HTMLInputElement}
     * @param n {number}
     */
    astrictNum: function (obj, n) {
        obj.value = obj.value.replace(/[^\d]/g, "");  //清除“数字”以外的字符
        if (obj.value.indexOf(".") < 0 && obj.value !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = obj.value.slice(0, n);
        }
    },


    /** 获取监所列表 */
    getJsList: function (jsbh) {
        return _m.post('ryjbxx/getJsList.do', {jsbh: jsbh})
            .pipe(function (res) {
                return res.code === 0
                    ? res.data
                    : []
            })
    },

    isTop: function () {
        return window === window.parent
    }
};

$.fn.loading = function (isLoading) {
    var LOADING_CLASS = '__loading__';
    var $target = $(this);

    $target.toggleClass(LOADING_CLASS, isLoading);
};

// 加载 ben-notification
_m.loadCSS('/lib/ben-notification/style/animation.css');
_m.loadCSS('/lib/ben-notification/style/ionicons.min.css');
_m.loadCSS('/lib/ben-notification/style/msg-style.css');
_m.loadScript('/lib/ben-notification/index.js')
    .then(function () {
        MSG.set({"sound_path": "/lib/ben-notification/sound/"})
    });



/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt {string}
 * @return {string | void}
 * @constructor
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Math.money = function (t) {
    return (+t).toFixed(2)
    // return Math.floor(t * 100) / 100
};



