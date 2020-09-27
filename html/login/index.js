/**
 * 加载动画
 * @param isLoading
 */
$.fn.loading = function (isLoading) {
    var LOADING_CLASS = '__loading__';
    var $target = $(this);

    $target.toggleClass(LOADING_CLASS, isLoading);
};

$(function () {
    var api = __.get('API');
    layui.use('layer', function () {
        var layer = layui.layer;
        var $username = $('#username');
        var $password = $('#password');
        var $submitBtn = $('#submit');
        $('#login-form').on('submit', function (e) {
            // e.preventDefault();
            // $submitBtn.loading();
            if (!$username.val()) {
                layer.msg('您未输入用户名');
                $username.focus();
                // $submitBtn.loading(false);
                return false
            }
            if (!$password.val()) {
                layer.msg('您未输入用户名');
                $password.focus();
                // $submitBtn.loading(false);
                return false
            }
            $.ajax({type: "POST", url: api + "users/login", data: {username: $username.val(), password: $password.val()}})
                .always(function () {
                    // $submitBtn.loading(false)
                })
                .then(
                    function (msg) {
                        if (msg.code === 0) {
                            var token = msg.data.token;
                            var  userInfo= JSON.stringify(msg.data);
                            sessionStorage.setItem("userInfo", userInfo);
                            window.location.href = "index.html";
                        } else {
                            layer.msg(msg.msg);
                        }
                    }
                );
            return false
        });


    });

})