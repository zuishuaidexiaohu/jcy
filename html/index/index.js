/**
 * @Description: 
 * @author DJ Ya
 * @date 2019/7/2 
*/

(function () {
    $("#username").text(userInfo.username);
    $("#role").text(userInfo.roleDescription?userInfo.roleDescription:'');

})();



var layer, form;
layui.use(['form', 'layer','element'], function () {
    form = layui.form, layer = layui.layer;

    var element = layui.element ;
    $("#showHomepage").click();
});


function setIframe( url) {

    $("#turnIframe").attr("src",url);
}

window.onload = function () {
    methods.checkLogin();

    if(userInfo.roleDescription == "管理员") {
        $("#personManage").removeClass("display_none");
    }
};

$('#userManage>a').on('click',function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#userManage').toggleClass('showForm')
});

$('.over-lay','#userManage').on('click',function () {
    $('#userManage').toggleClass('showForm',false)
});



function updatePassword() {
    var newPassword = $("input[name='newPassword']").val();
    var commitPassword = $("input[name='commitPassword']").val();

    if(newPassword != commitPassword){

        MSG.warning("修改密码","密码不一致");
    }else {
        _m.post("/users/updatePwd",{id:userInfo.id,oldPwd :$("input[name='oldPassword']").val()
        ,newPwd:commitPassword}).then(function (res) {
            if(res.code==0){
                MSG.success("修改密码","成功,3秒后即将重新登录");
                setTimeout(function () {
                    _m.logout();
                },3000);
            }

        })
    }
}