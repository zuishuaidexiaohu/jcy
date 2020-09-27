var table, layer, form;

layui.use(['form', 'layer', 'table','laydate'], function () {
    form = layui.form, table = layui.table, layer = layui.layer;

    var laydate = layui.laydate;

    laydate.render({
        elem:'#startDate',
        type:'datetime',
        range:'~',
    });

    table.render({
        id: 'infoTableId',
        elem: '#infoTable',
        data:[],
        page: true,
        height:'full-200',
        limit:10,
        cols: [
            [
                {type:'numbers',title:'序号',sort:true},
                {field: 'acceptCases', title: '受案号',align:'center',sort:true},
                // {field: '', title: '文件编号', width: 160,align:'center',sort:true},
                {field: 'description', title: '文书类型',align:'center',sort:true},
                {field: 'num', title: '数量',align:'center',sort:true},
                // {field: 'undertakerDepartment', title: '部门',align:'center',sort:true},
                {field: 'operate', title: '状态',align:'center',sort:true},
                {field: 'person', title: '操作人',align:'center',sort:true},
                {field: 'timer', title: '操作时间',align:'center',sort:true},
            ]
        ],
        loading:true,
        text:{
            none: '暂无相关数据'
        }
    });
    search();

    init();
});

function search() {

    var dateStr = $("input[name='startDate']").val();

    var dateArr = dateStr.split("~");



    table.reload('infoTableId',{
        url:api+"/dossier/ahieveOperate",
        method:'post',
        where:{
            startDate:dateArr.length?dateArr[0]:'',
            endDate:dateArr.length?dateArr[1]:'',
            operatePerson:$("input[name='operatePerson']").val(),
            state:$("select[name='state']").val(),
        }
    })
}


function resetTable() {
    $("#reset").click();
    search();
}


function init() {
    _m.post("/dossier/achieveOperateUsernameDropDown").then(function (res) {

        var data = res.data;

        var options = "<option value=''>请输入操作人</option>";

        for (var i in data ){
            options +="<option value='"+data[i]+"'>"+data[i]+"</option>";
        }
        $("select[name ='operatePerson'] option").remove();
        $("select[name ='operatePerson']").append(options);

        form.render("select");
    });
}