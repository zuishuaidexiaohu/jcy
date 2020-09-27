var table, layer, form, cacheCaseData = {};
layui.use(['form', 'layer', 'table', 'laydate'], function () {
    form = layui.form, table = layui.table, layer = layui.layer;
    var yesterday = new Date();
    yesterday.setFullYear(yesterday.getFullYear() - 1);
    yesterday.setDate(yesterday.getDate() - 1);
    var laydate = layui.laydate;
    laydate.render({
        elem: '#searchDate',
        type: 'date',
        range: '~',
        // done: function (value, date, endDate) {
        //     if (!value) {
        //         $("#searchDate").val(yesterday.Format("yyyy-MM-dd") + " ~ " + new Date().Format("yyyy-MM-dd"));
        //     }
        // }
    });


    $("#searchDate").val(yesterday.Format("yyyy-MM-dd") + " ~ " + new Date().Format("yyyy-MM-dd"));
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
        height: 'full-150',
        limit: 10,
        cols: [
            [
                {field: 'bmsah', title: '受案号', align: 'center', sort: true},
                {field: 'slrq', title: '受理时间', align: 'center', sort: true},
                {field: 'ajmc', title: '案件名称', align: 'center', sort: true},
            ]
        ], done: function (res, curr, count) {
            if (res.data.length > 0) {
                $("div[lay-id='infoTableId']").find("tr[data-index='0']").click();
            } else {
                cacheCaseData = {};
            }
        },
        loading: true,
        text: {
            none: '暂无相关数据'
        }
    });
    table.on('row(infoTableFilter)', function (obj) {
        var data = cacheCaseData = obj.data;
        $("div[lay-id='infoTableId']").find("tr[data-index]").each(function () {
            $(this).removeClass("layui-table-click");
        });
        var tr = obj.tr;
        $(tr).addClass("layui-table-click");
    });
    search();
});

/**
 *@param  {}
 *@return {void}
 *
 */
function search() {
    // 获取受案号的值

    var searchDate = $("#searchDate").val().split("~");


    var data = {
        url: api + '/case/achieve',
        method: 'post',
        page: {
            curr: 1
        },
        where: {
            bmsah: $("input[name='bmsah']").val(),
            ajmc: $("input[name='bmsah']").val(),
            startDate: searchDate.length >= 2 ? ($.trim(searchDate[0]) + " 00:00:00") : "",
            endDate: searchDate.length >= 2 ? ($.trim(searchDate[1]) + " 00:00:00") : "",
        }
    };
    // if(isReset){
    //     data.page={};
    //     data.page.curr=1;
    // }
    table.reload('infoTableId', data);
}

function resetTable() {
    $("#reset").click();
    search();
}

/**
 *@param  {}
 *@return {}
 * @desc 跳转到录入页面
 */
function insert() {
    var caseData = JSON.stringify(cacheCaseData);
    if (caseData == '{}') {
        MSG.warning("卷宗录入操作", "请选择数据");
        return;
    }
    console.log(cacheCaseData.bmsah);
    window.location.href = "/html/insertResult.html?bmsah=" + cacheCaseData.bmsah;
}


