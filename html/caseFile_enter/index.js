var table, layer, form;
layui.use(['form', 'layer', 'table', 'laydate'], function () {
    form = layui.form, table = layui.table, layer = layui.layer;
    var laydate = layui.laydate;
    laydate.render({
        elem: '#saveTime',
        type: 'date',
        range: "~",
    });

    laydate.render({
        elem: '#takeTime',
        type: 'date',
        range: "~",
    });
    table.render({
        id: 'infoTableId',
        elem: '#infoTable',
        parseData: function (res) {
            return {
                "code": res.code,
                "msg": res.msg,
                "count": res.count,
                "data": res.data
            };
        },
        data: [],
        page: true,
        height: 'full-220',
        limit: 10,
        cols: [
            [
                {type: 'radio'},
                {type: 'numbers', title: '序号', align: 'center'},
                {field: 'acceptCases', title: '受案号', align: 'center', sort: true},
                {field: 'caseName', title: '案件名称', align: 'center', sort: true},
                {field: 'printLabelNumber', title: '文件编号', align: 'center', sort: true},
                {field: 'description', title: '文件类型', align: 'center', sort: true},
                {
                    field: 'state', title: '状态', align: 'center', sort: true, templet: function (data) {
                        if (data.state == 0) {
                            return "未存入";
                        } else if (data.state == 1) {
                            return "已存入";
                        } else if (data.state == 2) {
                            return "已取出";
                        }
                    }
                },
                {field: 'undertakerDepartment', title: '承办部门', align: 'center', sort: true},
                {field: 'undertaker', title: '承办人', align: 'center', sort: true},
                {field: 'loadTime', title: '存入时间', align: 'center', sort: true},
                {field: 'loader', title: '存入人', align: 'center', sort: true},
                {field: 'takeOutTime', title: '取出时间', align: 'center', sort: true},
                {field: 'takeOutPerson', title: '取出人', align: 'center', sort: true},

            ]
        ],
        loading: true,
        text: {
            none: '暂无相关数据'
        }
    });


    table.on('rowDouble(infoTableFilter)', function (obj) {
        var data = obj.data;
        //
        // if (data.num) {
        getCodeNumber(data.printLabelNumber);
        // }

    });

    init();
    search();



    if(userInfo.roleDescription == "管理员") {
        $("#del").removeClass("display_none");
    }
});

function search() {

    var loadDate = $("#saveTime").val().split("~");
    var takeDate = $("#takeTime").val().split("~");
    var data = {
        url: api + '/dossier/achieve',
        method: 'post',
        page: {
            curr: 1
        },
        where: {
            acceptCases: $("input[name='acceptCases']").val(),
            // caseName:$("input[name='caseName']").val(),
            documentType: $("select[name='documentType']").val(),
            undertakerDepartment: $("select[name='undertakerDepartment']").val(),
            undertaker: $("input[name='undertaker']").val(),
            loadStartDate: loadDate.length >= 2 ? ($.trim(loadDate[0]) + " 00:00:00") : "",
            loadEndDate: loadDate.length >= 2 ? ($.trim(loadDate[1]) + " 00:00:00") : "",
            loader: $("select[name='loader']").val(),
            takeStartDate: takeDate.length >= 2 ? ($.trim(takeDate[0]) + " 00:00:00") : "",
            takeEndDate: takeDate.length >= 2 ? ($.trim(takeDate[1]) + " 00:00:00") : "",
            takeOutPerson: $("select[name='takeOutPerson']").val(),
            state: $("select[name='state']").val(),
        }
    };
    table.reload('infoTableId', data);
}

function resetTable() {
    $("#reset").click();
    search(true);
}

//初始化下拉框
function init() {
    _m.getCode({value: 'code', label: 'description'}).then(function (res) {

        $("select[name='documentType']").append(res);
        form.render("select");
    });
    _m.post("/users/achieveSearchDropDown", {}).then(function (res) {
        initSelect($("select[name='loader']"), res.data.loaderNameList, "存入人");
        initSelect($("select[name='takeOutPerson']"), res.data.takerNameList, "取出人");
        initSelect($("select[name='undertakerDepartment']"), res.data.undertakerNameList, "承办部门");
        form.render("select");
    });
}

function initSelect(obj, arr, defaultVal) {
    obj.find("option").remove();
    var options = "<option value=''>请选择" + defaultVal + "</option>";
    for (var i in arr) {
        options += "<option value='" + arr[i] + "'>" + arr[i] + "</option>"
    }
    obj.append(options);
}

function getCodeNumber(code) {

    location.href = api + "/print/achieveBarcode?code=" + code;
    // _m.post("", {code: code}).then(function (res) {
    //     if (res.code == 0) {
    //         // caseData= res.data ;
    //         // $("#caseName").text(caseData.caseInfo.ajmc);
    //         // $("#caseNumber").text(caseData.caseInfo.bmsah);
    //         // $("#casePrisoner").text(caseData.name.join(","));
    //         // $("#loader").text(caseData.caseInfo.cbr);
    //     }
    // });
}


function getSelectedTableData() {
    var checkStatus = table.checkStatus('infoTableId');
    return checkStatus.data;
}

function deleteDossier() {
    var data = getSelectedTableData();
    if (data.length == 0) {
        MSG.warning("删除卷宗操作", "未选择数据");
        return;
    }

    _m.post("dossier/updateAndDel",{id:data[0].id}).then(function (res) {
        MSG.success("删除卷宗操作", res.msg);
        search();
    });

}