var table, layer, form, INSERT_WINDOW, caseData = {
        acceptCases: '111',
        caseName: '111',
        undertakerDepartment: '111',
        undertaker: '111',
    },
    INSERT_WINDOW_DATA = [
        {documentType: '1', num: '0', description: '新案件全套材料'},
        {documentType: '2', num: '0', description: '重报案件全套材料'},
        {documentType: '3', num: '0', description: '法院退回案件全套材料'},
        {documentType: '4', num: '0', description: '判决书'},
        {documentType: '5', num: '0', description: '裁定书'},
        {documentType: '6', num: '0', description: '公安机关回执'},
        {documentType: '7', num: '0', description: '送达回证'},
        {documentType: '8', num: '0', description: '讯问笔录全套材料'},
        {documentType: '9', num: '0', description: '告知材料'},
        {documentType: '10', num: '0', description: '换押证'},
        {documentType: '11', num: '0', description: '认罪认罚材料'},
        {documentType: '12', num: '0', description: '辩护和代理材料'},
        {documentType: '13', num: '0', description: '其他材料'},
    ],
    cacheTableData = [
        {documentType: '1', num: '5', description: '新案件全套材料'},
        {documentType: '2', num: '5', description: '重报案件全套材料'},
        {documentType: '3', num: '5', description: '法院退回案件全套材料'},
        {documentType: '4', num: '5', description: '判决书'},
        {documentType: '5', num: '5', description: '裁定书'},
        {documentType: '6', num: '5', description: '公安机关回执'},
        {documentType: '7', num: '5', description: '送达回证'},
        {documentType: '8', num: '5', description: '讯问笔录全套材料'},
        {documentType: '9', num: '5', description: '告知材料'},
        {documentType: '10', num: '5', description: '换押证'},
        {documentType: '11', num: '5', description: '认罪认罚材料'},
        {documentType: '12', num: '5', description: '辩护和代理材料'},
        {documentType: '13', num: '5', description: '其他材料'},
    ];
layui.use(['form', 'layer', 'laydate', 'table'], function () {
    form = layui.form, layer = layui.layer, table = layui.table;

    table.render({
        id: 'infoTableId',
        elem: '#infoTable',
        data: [],
        height: '300',
        limit: 15,
        cols: [
            [
                {field: 'description', title: '案件类型', align: 'center', width: 220},
                {field: 'num', title: '数量', align: 'center', width: 230, templet: '#selectNum'}
            ]
        ]
    });

    table.on('row(infoTableFilter)', function(obj){
        var data = obj.data;
        getCodeNumber(data.code);
    });


    table.on('tool(infoTableFilter)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        var tr = obj.tr;
        if (layEvent == 'plus') {
            data.num++;
        } else {
            if (data.num) {
                data.num--;
            }
        }
        obj.update({
            num: data.num
        });
        cacheTableData[parseInt(data.documentType) - 1] = data;
    });

});


/**
 *@param  {}
 *@return {}
 * @desc 展示添加的弹出层
 */
function showWindow() {
    for (var i in INSERT_WINDOW_DATA) {
        INSERT_WINDOW_DATA[i].num = 0;
    }
    cacheTableData = INSERT_WINDOW_DATA;
    table.reload('infoTableId', {
        data: INSERT_WINDOW_DATA
    });
    INSERT_WINDOW = layer.open({
        id: 'showWindowId',
        type: 1,
        area: ['700px', '600px'],
        content: $('#showWindow'),
        success: function () {

        },
        end: function () {
        }
    });

}

/**
 *@param  {}
 *@return {}
 * @desc 保存
 */
function insert() {
    for (var i in cacheTableData) {
        cacheTableData[i].acceptCases = caseData.acceptCases;
        cacheTableData[i].caseName = caseData.caseName;
        cacheTableData[i].undertakerDepartment = caseData.undertakerDepartment;
        cacheTableData[i].undertaker = caseData.undertaker;
    }
    _m.postJson("dossier/insert", cacheTableData).then(function (res) {
        if (res.code == 0) {
            MSG.success("添加材料操作", "成功,即将调转到添加成功页面");
             turnInsertResult(caseData, cacheTableData);
            closeWindow();
        }
    });

}

// function turnInsertResult(caseData, cacheCaseData) {
//     setTimeout(function () {
//         window.location.href="/html/insertResult.html?caseData="+JSON.stringify(caseData)+"&cacheCaseData="+JSON.stringify(cacheCaseData);
//     }, 3000);
// }

//关闭弹窗
function closeWindow() {
    layer.close(INSERT_WINDOW);

}
/**
 * @Description: 初始化赋值案件信息
 * @author DJ Ya
 * @date 2019/7/16
 */

(function () {
    var bmsah = getQueryStringByName("bmsah");
    _m.post("/case/achieveData", {bmsah:bmsah}).then(function (res) {
        if (res.code == 0) {
            caseData= res.data ;
            $("#caseName").text(caseData.caseInfo.ajmc);
            $("#caseNumber").text(caseData.caseInfo.bmsah);
            $("#casePrisoner").text(caseData.name.join(","));
            $("#loader").text(caseData.caseInfo.cbr);
        }
    });
})();



function getCodeNumber(code) {
    _m.post("/print/achieveBarcode", {code:code}).then(function (res) {
        if (res.code == 0) {
            // caseData= res.data ;
            // $("#caseName").text(caseData.caseInfo.ajmc);
            // $("#caseNumber").text(caseData.caseInfo.bmsah);
            // $("#casePrisoner").text(caseData.name.join(","));
            // $("#loader").text(caseData.caseInfo.cbr);
        }
    });
}