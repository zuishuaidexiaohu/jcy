var table, layer, form, INIT_DATA = [
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
        //2020/10/23新增5个选项
        {documentType: '51', num: '0', description: '出庭通知书'},
        {documentType: '52', num: '0', description: '上诉状'},
        {documentType: '53', num: '0', description: '函'},
        {documentType: '54', num: '0', description: '逮捕决定书'},
        {documentType: '55', num: '0', description: '取保候审决定书回执'},
        {documentType: '13', num: '0', description: '其他材料'},
    ], INSERT_WINDOW, caseData = {},
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
        //2020/10/23新增5个选项
        // {documentType: '13', num: '0', description: '其他材料'},
        {documentType: '51', num: '0', description: '出庭通知书'},
        {documentType: '52', num: '0', description: '上诉状'},
        {documentType: '53', num: '0', description: '函'},
        {documentType: '54', num: '0', description: '逮捕决定书'},
        {documentType: '55', num: '0', description: '取保候审决定书回执'},
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
        //2020/10/23新增5个选项
        {documentType: '51', num: '5', description: '出庭通知书'},
        {documentType: '52', num: '5', description: '上诉状'},
        {documentType: '53', num: '5', description: '函'},
        {documentType: '54', num: '5', description: '逮捕决定书'},
        {documentType: '55', num: '5', description: '取保候审决定书回执'},

        {documentType: '13', num: '5', description: '其他材料'},
    ];
layui.use(['form', 'layer', 'laydate', 'table'], function () {
    form = layui.form, layer = layui.layer, table = layui.table;
    table.render({
        id: 'infoTableId',
        elem: '#infoTable',
        data: [],
        height: '550',
        limit: 15,
        cols: [
            [
                {type:'numbers', title: '序号', align: 'center'},
                {field: 'description', title: '案件类型', align: 'center'},
                {field: 'num', title: '数量', align: 'center'}
            ]
        ]
    });


    table.on('row(infoTableFilter)', function (obj) {
        var data = obj.data;
        if (data.num) {
            getCodeNumber(data.printLabelNumber);
        }

    });


    table.render({
        id: 'infoInsertTableId',
        elem: '#infoInsertTable',
        data: [],
        height: '300',
        limit: 20,
        isLastEdit:true,
        cols: [
            [
                {field: 'description', title: '案件类型', align: 'center', width: 220,edit:'text'},
                {field: 'num', title: '数量', align: 'center', width: 230, templet: '#selectNum'}
            ]
        ]
    });



    table.on('edit(infoInsertTableFilter)', function(obj){

        $("#insert").prop("disabled","true");
        var val = obj.value;
        _m.post("code/insertOtherMaterials",{description:val}).then(function (res) {
            if (res.code == 0) {
                cacheTableData[12].documentType = res.data;
                $("#insert").removeAttr("disabled");
            }
        });
    });

    table.on('tool(infoInsertTableFilter)', function (obj) {
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
        if(parseInt(data.documentType)<13){
        cacheTableData[parseInt(data.documentType) - 1].num = data.num;

        cacheTableData[parseInt(data.documentType) - 1].description = data.description;
        }
        if(parseInt(data.documentType)===13){
            cacheTableData[18].num = data.num;
            cacheTableData[18].description = data.description;
        }
        if(parseInt(data.documentType)>13){
            cacheTableData[parseInt(data.documentType) - 39].num = data.num;
            cacheTableData[parseInt(data.documentType) - 39].description = data.description;
        }
        
        console.log(cacheTableData);
    });
});


function reloadInfoTable(data) {
    table.reload('infoTableId', {
        url: api + '/dossier/achieveInsertDossierData',
        method:'post',
        where:{
            ids:data,
        }
    })
}


/**
 *@param  {}
 *@return {}
 * @desc 展示添加的弹出层
 */
function showWindow() {
    for (var i in INSERT_WINDOW_DATA) {
        INSERT_WINDOW_DATA[i].num = 0;
    }
    // INSERT_WINDOW_DATA[12].documentType="13";
    // INSERT_WINDOW_DATA[12].description="其他材料";
    cacheTableData = INSERT_WINDOW_DATA;
    table.reload('infoInsertTableId', {
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

    var isCommit = false ;
    for (var i in cacheTableData) {
        if(cacheTableData[i].num) isCommit =true;
        cacheTableData[i].acceptCases =caseData.caseInfo.bmsah;
        cacheTableData[i].caseName = caseData.caseInfo.ajmc;
        cacheTableData[i].undertakerDepartment = caseData.caseInfo.cbbmMc;
        cacheTableData[i].undertaker = caseData.caseInfo.cbr;
    }

    if(isCommit){
        _m.postJson("dossier/insert", cacheTableData).then(function (res) {
            if (res.code == 0) {
                MSG.success("添加材料操作", "成功");
                reloadInfoTable(res.data);
                closeWindow();
            }
        });
    }else {
        MSG.warning("添加材料操作", "请选择文件数量");
    }


}

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

    var bmsah = decodeURIComponent(getQueryStringByName("bmsah"));
    _m.post("/case/achieveData", {bmsah: bmsah}).then(function (res) {
        if (res.code == 0) {
            caseData = res.data;
            $("#caseName").text(caseData.caseInfo.ajmc);
            $("#caseNumber").text(caseData.caseInfo.bmsah);
            $("#casePrisoner").text(caseData.name.join(","));
            $("#loader").text(caseData.caseInfo.cbr);
            //
            // $("#caseNumberP").text(caseData.caseInfo.bmsah);
            // $("#casePrisonerP").text(caseData.name.join(","));
            // $("#loaderP").text(caseData.caseInfo.cbr);
        }
    });
})();

function getCodeNumber(code) {

    location.href = api+"/print/achieveBarcode?code="+code;
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




