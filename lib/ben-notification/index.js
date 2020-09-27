
!function(global,factory){
  var registeredInModuleLoader = false;
  if (typeof define === 'function' && define.amd) {
    define(['jquery'],factory);
    registeredInModuleLoader = true;
  }
  if (typeof exports === 'object') {
    module.exports = factory($);
    registeredInModuleLoader = true;
  }
  if (!registeredInModuleLoader) {
    var OldMSG = window.MSG;
    if(jQuery){
      global.MSG = factory(jQuery);
    }else {
      console.error('not jQuery found')
    }
  }
}(this,function ($) {
  var
    ROOT = 'body',

    config = {
      title:'',
      content:'',
      colors:'',
      icon: false,
      sound: true,
      sound_path: "/libs/ben-notification/sound/",
      sound_file: "smallbox",
      iconSmall: true,
      timeout: 3000,

      color: {
        red: '#f44336',
        orange: '#ff9800',
        yellow: '#ffeb3b',
        green: '#4caf50',
        blue: '#398bf7',
        error: '#f44336',
        alarm: '#ff9800',
        success: '#4caf50'
      }
    };


  $(function () {
    $(ROOT).append("<div id='divSmallBoxes'></div>");
  });

  var SmallBoxes = 0, SmallBoxesAnchos = 0;
  function msgBox(setting, b) {var c;var $smallBoxes = $('#divSmallBoxes');setting = $.extend(
    {
      "title": "",
      "content": "",
      "icon": null,
      "iconSmall": null,
      "sound": config.sound,
      "sound_file": "smallbox",
      "color": null,
      "timeout": config.timeout,
      "colortime": 1500,
      "colors": null
    }, setting);if(setting.sound && 0 === isIE8orlower()) {var d = document.createElement("audio");navigator.userAgent.match("Firefox/")? d.setAttribute("src", config.sound_path + setting.sound_file + ".ogg"): d.setAttribute("src", config.sound_path + setting.sound_file + ".mp3"), d.addEventListener("load", function () {d.play();}, !0), d.pause(), d.play();}SmallBoxes += 1, c = "";var e = "", f = "smallbox" + SmallBoxes;if(e = void 0 == setting.iconSmall ? "<div class='miniIcono'></div>" : "<div class='miniIcono'><i class='miniPic " + setting.iconSmall + "'></i></div>", c = void 0 == setting.icon ? "<div id='smallbox" + SmallBoxes + "' class='SmallBox animated fadeInRight fast'><div class='textoFull'><span>" + setting.title + "</span><p>" + setting.content + "</p></div>" + e + "</div>" : "<div id='smallbox" + SmallBoxes + "' class='SmallBox animated fadeInRight fast'><div class='foto'><i class='" + setting.icon + "'></i></div><div class='textoFoto'><span>" + setting.title + "</span><p>" + setting.content + "</p></div>" + e + "</div>", 1 == SmallBoxes) $smallBoxes.append(c), SmallBoxesAnchos = $("#smallbox" + SmallBoxes).height() + 40;else {var g = $(".SmallBox").length;0 == g ? ($smallBoxes.append(c), SmallBoxesAnchos = $("#smallbox" + SmallBoxes).height() + 40) : ($smallBoxes.append(c), $("#smallbox" + SmallBoxes).css("top", SmallBoxesAnchos), SmallBoxesAnchos = SmallBoxesAnchos + $("#smallbox" + SmallBoxes).height() + 20, $(".SmallBox").each(function (a) {0 == a ? ($(this).css("top", 20), heightPrev = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).css("top", heightPrev), heightPrev = heightPrev + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20);}));}var h = $("#smallbox" + SmallBoxes);void 0 == setting.color ? h.css("background-color", config.color.blue) : h.css("background-color", setting.color);var i;void 0 != setting.colors && setting.colors.length > 0 && (h.attr("colorcount", "0"), i = setInterval(function () {var b = h.attr("colorcount");h.animate({"backgroundColor": setting.colors[b].color}), b < setting.colors.length - 1 ? h.attr("colorcount", 1 * b + 1) : h.attr("colorcount", 0);}, setting.colortime)), void 0 != setting.timeout && setTimeout(function () {clearInterval(i);var a = $(this).height() + 20;$("#" + f).css("top");0 != $("#" + f + ":hover").length ? $("#" + f).on("mouseleave", function () {SmallBoxesAnchos -= a, $("#" + f).remove(), "function" == typeof b && b && b();var c = 0;$(".SmallBox").each(function (a) {0 == a ? ($(this).animate({"top": 20}, 300), c = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).animate({"top": c}, 350), c = c + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20);});}) : (clearInterval(i), SmallBoxesAnchos -= a, "function" == typeof b && b && b(), $("#" + f).removeClass() .addClass("SmallBox") .animate({"opacity": 0}, 300, function () { $(this) .remove(); var a = 0; $(".SmallBox") .each(function (b) { 0 == b ? ($(this) .animate({"top": 20}, 300), a = $(this) .height() + 40, SmallBoxesAnchos = $(this) .height() + 40) : ($(this) .animate({"top": a}), a = a + $(this) .height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this) .height() + 20); }); }));}, setting.timeout), $("#smallbox" + SmallBoxes).bind("click", function () {clearInterval(i), "function" == typeof b && b && b();var a = $(this).height() + 20;$(this).attr("id"), $(this).css("top");SmallBoxesAnchos -= a, $(this).removeClass().addClass("SmallBox").animate({"opacity": 0}, 300, function () {$(this).remove();var a = 0;$(".SmallBox").each(function (b) {0 == b ? ($(this).animate({"top": 20}, 300), a = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).animate({"top": a}, 350), a = a + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20);});});});function getInternetExplorerVersion() {var a = -1;if("Microsoft Internet Explorer" === navigator.appName) {var b = navigator.userAgent, c = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");null !== c.exec(b) && (a = parseFloat(RegExp.$1));}return a;}function isIE8orlower() {var a = "0", b = getInternetExplorerVersion();return +(b > -1 && (a = b >= 9 ? 0 : 1), a);}}

  /**
   * @param setting
   * @param setting.title {string}
   * @param setting.content {string}
   * @param setting.icon {string}
   * @param setting.iconSmall {string}
   * @param setting.sound {string}
   * @param setting.sound_file {string}
   * @param setting.color {string}
   * @param setting.timeout {number}
   * @param setting.colortime {number}
   * @param setting.colors {string}
   * @param callback
   * @constructor
   */
  function Message(setting,callback) {
    this.setting = $.extend(setting, {
      "color": config.color[setting.color] || setting.color || config.color.blue
    });

    this.show(setting,callback);
  }

  Message.prototype.show = function(callback){
    typeof callback !== 'function' && (callback = $.noop);
    msgBox(this.setting, callback);
  };

  return {
    /**
     * @name 配置消息配置
     * @param setting
     * @public
     */
    set : function (setting) {
      if(typeof setting === 'object'){
        $.extend(config,setting);
        return config;
      }
    },
    /**
     * @name 成功
     * @param [title] {string}
     * @param [content] {string}
     */

    success: function (title, content) {
      return new Message({
        icon: 'ion-checkmark-circled',
        color: 'green',
        title: title,
        content: content
      });
    },
    /**
     * @name 错误
     * @param [title] {string}
     * @param [content] {string}
     * @return {Message}
     */
    error: function (title, content) {
      return new Message({
        icon: 'ion-close-circled',
        color: 'red',
        sound_file:'voice_off',
        title: title,
        content: content
      });
    },
    /**
     * @name 提示
     * @param [title] {string}
     * @param [content] {string}
     * @return {Message}
     */
    alert: function (title, content) {
      return new Message({
        icon: 'ion-ios-bell',
        color: 'blue',
        title: title,
        content: content
      });
    },
    /**
     * @name 警告
     * @param [title] {string}
     * @param [content] {string}
     * @return {Message}
     */
    warning: function (title, content) {
      return new Message({
        icon: 'ion-alert-circled',
        color: 'orange',
        title: title,
        content: content
      });
    },
    /**
     * 自定义消息
     * @param setting {Object}
     * @param [setting.title] {string}
     * @param [setting.content] {string}
     * @param [setting.icon] {string}
     * @param [setting.iconSmall] {string}
     * @param [setting.sound] {string}
     * @param [setting.sound_file] {string}
     * @param [setting.color] {string}
     * @param [setting.timeout] {number}
     * @param [setting.colortime] {string}
     * @param [setting.colors] {string}
     * @param [callback] {function}
     * @return {Message}
     */
    msg: function (setting, callback) {
      return new Message(setting, callback);
    }
  }
});
